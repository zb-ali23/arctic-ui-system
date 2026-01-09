import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  Briefcase,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

type BookingStatus = 'assigned' | 'confirmed' | 'en_route' | 'in_progress' | 'completed';

export default function TechnicianJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: techData } = await supabase
      .from('technicians')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!techData) return;

    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_number,
        scheduled_date,
        time_slot_label,
        status,
        priority,
        problem_description,
        final_price,
        customer:customers(first_name, last_name, phone, email),
        service:services(name, icon, base_price),
        address:customer_addresses(street, apartment, city, state, zip)
      `)
      .eq('technician_id', techData.id);

    if (activeTab === 'active') {
      query = query.in('status', ['assigned', 'confirmed', 'en_route', 'in_progress']);
    } else if (activeTab === 'completed') {
      query = query.eq('status', 'completed');
    } else if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = query
        .eq('scheduled_date', today)
        .in('status', ['assigned', 'confirmed', 'en_route', 'in_progress']);
    }

    query = query.order('scheduled_date', { ascending: activeTab !== 'completed' });

    const { data } = await query;
    setJobs(data || []);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      assigned: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      en_route: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-orange-100 text-orange-800',
      completed: 'bg-emerald-100 text-emerald-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      emergency: 'bg-red-500 text-white',
      urgent: 'bg-orange-500 text-white',
      normal: 'bg-gray-100 text-gray-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getDateLabel = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    if (isPast(dateObj)) return 'Overdue';
    return format(dateObj, 'EEE, MMM d');
  };

  const groupJobsByDate = (jobs: any[]) => {
    const grouped: Record<string, any[]> = {};
    jobs.forEach((job) => {
      const date = job.scheduled_date;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(job);
    });
    return grouped;
  };

  const groupedJobs = groupJobsByDate(jobs);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground">Manage your assigned service calls</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="today" className="flex-1 md:flex-none">Today</TabsTrigger>
          <TabsTrigger value="active" className="flex-1 md:flex-none">Active</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 md:flex-none">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  {activeTab === 'today'
                    ? "No jobs scheduled for today"
                    : activeTab === 'active'
                    ? "No active jobs"
                    : "No completed jobs yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedJobs).map(([date, dateJobs]) => (
                <div key={date}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getDateLabel(date)}
                    <Badge variant="outline" className="ml-2">
                      {dateJobs.length} job{dateJobs.length > 1 ? 's' : ''}
                    </Badge>
                  </h3>
                  <div className="space-y-3">
                    {dateJobs.map((job) => (
                      <Link key={job.id} to={`/technician/jobs/${job.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span className="font-mono text-sm text-muted-foreground">
                                    #{job.booking_number}
                                  </span>
                                  <Badge className={getStatusColor(job.status)}>
                                    {job.status.replace('_', ' ')}
                                  </Badge>
                                  {job.priority !== 'normal' && (
                                    <Badge className={getPriorityColor(job.priority)}>
                                      {job.priority}
                                    </Badge>
                                  )}
                                </div>
                                
                                <h4 className="font-semibold mb-1">{job.service?.name}</h4>
                                
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>
                                    {job.customer?.first_name} {job.customer?.last_name}
                                  </p>
                                  {job.address && (
                                    <div className="flex items-start gap-1">
                                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                      <span>
                                        {job.address.street}
                                        {job.address.apartment && `, ${job.address.apartment}`}
                                        , {job.address.city}, {job.address.state} {job.address.zip}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3.5 w-3.5" />
                                    <a
                                      href={`tel:${job.customer?.phone}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:underline"
                                    >
                                      {job.customer?.phone}
                                    </a>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right shrink-0">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {job.time_slot_label}
                                </p>
                                {job.final_price && (
                                  <p className="font-semibold text-lg">
                                    ${job.final_price}
                                  </p>
                                )}
                                <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto mt-2" />
                              </div>
                            </div>
                            
                            {job.problem_description && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {job.problem_description}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
