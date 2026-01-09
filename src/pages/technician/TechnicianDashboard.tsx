import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export default function TechnicianDashboard() {
  const [stats, setStats] = useState({
    todayJobs: 0,
    pendingJobs: 0,
    completedThisWeek: 0,
    earnings: 0,
    rating: 5.0,
  });
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get technician data
    const { data: techData } = await supabase
      .from('technicians')
      .select('id, rating, completed_jobs')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!techData) return;

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch stats in parallel
    const [todayJobsRes, pendingRes, completedRes, upcomingRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('technician_id', techData.id)
        .eq('scheduled_date', today),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('technician_id', techData.id)
        .in('status', ['assigned', 'confirmed', 'en_route', 'in_progress']),
      supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('technician_id', techData.id)
        .eq('status', 'completed')
        .gte('completed_at', weekAgo),
      supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          scheduled_date,
          time_slot_label,
          status,
          priority,
          problem_description,
          customer:customers(first_name, last_name, phone),
          service:services(name, icon),
          address:customer_addresses(street, city, zip)
        `)
        .eq('technician_id', techData.id)
        .in('status', ['assigned', 'confirmed', 'en_route', 'in_progress'])
        .order('scheduled_date', { ascending: true })
        .order('time_slot_label', { ascending: true })
        .limit(5),
    ]);

    // Get earnings from completed bookings this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const { data: earningsData } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('technician_id', techData.id)
      .eq('status', 'completed')
      .gte('completed_at', startOfMonth);

    const totalEarnings = earningsData?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0;

    setStats({
      todayJobs: todayJobsRes.count || 0,
      pendingJobs: pendingRes.count || 0,
      completedThisWeek: completedRes.count || 0,
      earnings: totalEarnings * 0.4, // Assuming 40% commission
      rating: techData.rating || 5.0,
    });

    setUpcomingJobs(upcomingRes.data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      en_route: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      emergency: 'bg-red-100 text-red-800',
      urgent: 'bg-orange-100 text-orange-800',
      normal: 'bg-gray-100 text-gray-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayJobs}</p>
                <p className="text-xs text-muted-foreground">Today's Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingJobs}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedThisWeek}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.earnings.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Upcoming Jobs
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/technician/jobs">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming jobs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/technician/jobs/${job.id}`}
                  className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{job.booking_number}</span>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                        {job.priority !== 'normal' && (
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="font-medium">{job.service?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.customer?.first_name} {job.customer?.last_name}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        {format(new Date(job.scheduled_date), 'MMM d')}
                      </p>
                      <p className="text-muted-foreground">{job.time_slot_label}</p>
                    </div>
                  </div>
                  {job.address && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {job.address.street}, {job.address.city}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
