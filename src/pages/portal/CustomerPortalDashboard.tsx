import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { format } from 'date-fns';
import {
  CalendarDays,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  FileText,
  Plus,
  Wrench
} from 'lucide-react';

interface Booking {
  id: string;
  booking_number: string;
  status: string;
  scheduled_date: string;
  time_slot_label: string | null;
  services: { name: string } | null;
}

interface DashboardStats {
  activeBookings: number;
  completedServices: number;
  pendingInvoices: number;
  reviewsGiven: number;
}

export default function CustomerPortalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeBookings: 0,
    completedServices: 0,
    pendingInvoices: 0,
    reviewsGiven: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get customer ID from current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!customer) return;

      // Fetch stats
      const [activeRes, completedRes, invoicesRes, reviewsRes, upcomingRes] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' })
          .eq('customer_id', customer.id)
          .in('status', ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress']),
        supabase.from('bookings').select('id', { count: 'exact' })
          .eq('customer_id', customer.id)
          .eq('status', 'completed'),
        supabase.from('invoices').select('id', { count: 'exact' })
          .eq('customer_id', customer.id)
          .eq('status', 'pending'),
        supabase.from('reviews').select('id', { count: 'exact' })
          .eq('customer_id', customer.id),
        supabase.from('bookings')
          .select('id, booking_number, status, scheduled_date, time_slot_label, services(name)')
          .eq('customer_id', customer.id)
          .in('status', ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress'])
          .order('scheduled_date', { ascending: true })
          .limit(3),
      ]);

      setStats({
        activeBookings: activeRes.count || 0,
        completedServices: completedRes.count || 0,
        pendingInvoices: invoicesRes.count || 0,
        reviewsGiven: reviewsRes.count || 0,
      });

      setUpcomingBookings((upcomingRes.data || []) as Booking[]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-muted-foreground">Manage your bookings and service history</p>
        </div>
        <Button asChild>
          <Link to="/book">
            <Plus className="mr-2 h-4 w-4" />
            Book New Service
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedServices}</div>
            <p className="text-xs text-muted-foreground">Total services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewsGiven}</div>
            <p className="text-xs text-muted-foreground">Your feedback</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled services</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/portal/bookings">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-5 w-5 animate-spin mr-2" />
              Loading...
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Upcoming Bookings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Book a service to keep your AC running smoothly
              </p>
              <Button asChild>
                <Link to="/book">Book a Service</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{booking.booking_number}</span>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.services?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{format(new Date(booking.scheduled_date), 'MMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">{booking.time_slot_label || 'TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/portal/bookings"
          className="rounded-xl border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Manage Bookings</h3>
              <p className="text-sm text-muted-foreground">View and track your bookings</p>
            </div>
          </div>
        </Link>
        <Link
          to="/portal/history"
          className="rounded-xl border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold">Service History</h3>
              <p className="text-sm text-muted-foreground">View past services</p>
            </div>
          </div>
        </Link>
        <Link
          to="/portal/account"
          className="rounded-xl border bg-card p-6 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">Leave a Review</h3>
              <p className="text-sm text-muted-foreground">Share your experience</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
