import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

export default function TechnicianEarnings() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    jobCount: 0,
    avgPerJob: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [technicianId, setTechnicianId] = useState<string | null>(null);

  useEffect(() => {
    getTechnicianId();
  }, []);

  useEffect(() => {
    if (technicianId) {
      fetchEarnings();
    }
  }, [technicianId, period, currentDate]);

  const getTechnicianId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: techData } = await supabase
      .from('technicians')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (techData) {
      setTechnicianId(techData.id);
    }
  };

  const getDateRange = () => {
    if (period === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    };
  };

  const fetchEarnings = async () => {
    if (!technicianId) return;
    setLoading(true);

    const { start, end } = getDateRange();

    const { data: completedJobs } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_number,
        scheduled_date,
        completed_at,
        final_price,
        service:services(name)
      `)
      .eq('technician_id', technicianId)
      .eq('status', 'completed')
      .gte('completed_at', start.toISOString())
      .lte('completed_at', end.toISOString())
      .order('completed_at', { ascending: false });

    const { data: pendingPayments } = await supabase
      .from('bookings')
      .select('final_price')
      .eq('technician_id', technicianId)
      .eq('status', 'completed')
      .is('final_price', null);

    const jobs = completedJobs || [];
    const commissionRate = 0.4; // 40% commission
    
    const earningsWithCommission = jobs.map((job) => ({
      ...job,
      commission: (job.final_price || 0) * commissionRate,
    }));

    const total = earningsWithCommission.reduce((sum, job) => sum + job.commission, 0);
    const pendingTotal = (pendingPayments || []).reduce((sum, p) => sum + ((p.final_price || 0) * commissionRate), 0);

    setEarnings(earningsWithCommission);
    setStats({
      total,
      jobCount: jobs.length,
      avgPerJob: jobs.length > 0 ? total / jobs.length : 0,
      pending: pendingTotal,
    });
    setLoading(false);
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (period === 'week') {
      setCurrentDate((prev) =>
        direction === 'prev'
          ? new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000)
          : new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    } else {
      setCurrentDate((prev) =>
        direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
      );
    }
  };

  const { start, end } = getDateRange();
  const periodLabel =
    period === 'week'
      ? `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      : format(currentDate, 'MMMM yyyy');

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="text-muted-foreground">Track your income and commissions</p>
      </div>

      {/* Period Navigation */}
      <div className="flex items-center justify-between">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="week">Weekly</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigatePeriod('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[150px] text-center">
            {periodLabel}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigatePeriod('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.jobCount}</p>
                <p className="text-xs text-muted-foreground">Jobs Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.avgPerJob.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Avg per Job</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.pending.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Completed Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : earnings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No completed jobs in this period</p>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{job.service?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      #{job.booking_number} • {format(new Date(job.completed_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      +${job.commission.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${job.final_price} × 40%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Commission Rate: 40%</p>
              <p className="text-sm text-muted-foreground">
                You earn 40% of the final job price. Payments are processed weekly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
