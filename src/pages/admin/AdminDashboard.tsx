import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StatCard, DataTableCard } from '@/components/admin/StatCard';
import { StatusBadge, PriorityBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarDays, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  ArrowRight,
  Plus,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface DashboardStats {
  todayBookings: number;
  pendingJobs: number;
  monthlyRevenue: number;
  totalCustomers: number;
  completedToday: number;
  activeTechnicians: number;
}

interface RecentBooking {
  id: string;
  booking_number: string;
  status: string;
  priority: string;
  scheduled_date: string;
  time_slot_label: string | null;
  customers: { first_name: string; last_name: string } | null;
  services: { name: string } | null;
}

interface TechnicianStatus {
  id: string;
  is_available: boolean;
  profiles: { first_name: string; last_name: string } | null;
  activeJobs: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    pendingJobs: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    completedToday: 0,
    activeTechnicians: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      // Fetch stats in parallel
      const [
        todayBookingsRes,
        pendingJobsRes,
        customersRes,
        completedTodayRes,
        recentBookingsRes,
        techniciansRes,
      ] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' }).eq('scheduled_date', today),
        supabase.from('bookings').select('id', { count: 'exact' }).in('status', ['pending', 'confirmed', 'assigned']),
        supabase.from('customers').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'completed').eq('scheduled_date', today),
        supabase.from('bookings').select(`
          id,
          booking_number,
          status,
          priority,
          scheduled_date,
          time_slot_label,
          customers (first_name, last_name),
          services (name)
        `).order('created_at', { ascending: false }).limit(5),
        supabase.from('technicians').select(`
          id,
          is_available
        `).eq('is_active', true),
      ]);

      setStats({
        todayBookings: todayBookingsRes.count || 0,
        pendingJobs: pendingJobsRes.count || 0,
        monthlyRevenue: 24580,
        totalCustomers: customersRes.count || 0,
        completedToday: completedTodayRes.count || 0,
        activeTechnicians: techniciansRes.data?.filter(t => t.is_available).length || 0,
      });

      setRecentBookings((recentBookingsRes.data || []) as RecentBooking[]);
      setTechnicians((techniciansRes.data || []).map(t => ({
        id: t.id,
        is_available: t.is_available,
        profiles: { first_name: 'Tech', last_name: t.id.slice(0, 4) },
        activeJobs: 0,
      })) as TechnicianStatus[]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting()}, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          change={`${stats.completedToday} completed`}
          changeType="positive"
          icon={CalendarDays}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Pending Jobs"
          value={stats.pendingJobs}
          description="awaiting action"
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change="+8 this week"
          changeType="positive"
          icon={Users}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.activeTechnicians}</p>
            <p className="text-sm text-muted-foreground">Active Technicians</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Urgent Bookings</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">4.8</p>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <DataTableCard
          title="Recent Bookings"
          description="Latest booking activity"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/bookings">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No bookings yet</p>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.booking_number}</span>
                        <StatusBadge status={booking.status} />
                        {booking.priority !== 'normal' && (
                          <PriorityBadge priority={booking.priority as 'low' | 'normal' | 'high' | 'urgent'} />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.customers?.first_name} {booking.customers?.last_name} • {booking.services?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <p>{format(new Date(booking.scheduled_date), 'MMM d')}</p>
                      <p className="text-muted-foreground">{booking.time_slot_label || 'TBD'}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </DataTableCard>

        {/* Technician Status */}
        <DataTableCard
          title="Technician Status"
          description="Current availability"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/technicians">
                Manage <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {technicians.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No technicians</p>
            ) : (
              technicians.map((tech) => (
                <div
                  key={tech.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {tech.profiles?.first_name?.[0]}{tech.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {tech.profiles?.first_name} {tech.profiles?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tech.activeJobs} active jobs
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={tech.is_available ? 'available' : 'busy'} />
                </div>
              ))
            )}
          </div>
        </DataTableCard>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link
          to="/admin/bookings/new"
          className="rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">New Booking</p>
            <p className="text-sm text-muted-foreground">Create a booking</p>
          </div>
        </Link>
        <Link
          to="/admin/customers/new"
          className="rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium">Add Customer</p>
            <p className="text-sm text-muted-foreground">Register new customer</p>
          </div>
        </Link>
        <Link
          to="/admin/payments"
          className="rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium">Record Payment</p>
            <p className="text-sm text-muted-foreground">Mark payment received</p>
          </div>
        </Link>
        <Link
          to="/admin/reports"
          className="rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">View Reports</p>
            <p className="text-sm text-muted-foreground">Analytics & insights</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
