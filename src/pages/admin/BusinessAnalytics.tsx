import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  monthlyBookings: number;
  bookingGrowth: number;
  totalCustomers: number;
  newCustomers: number;
  customerGrowth: number;
  avgRating: number;
  completionRate: number;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [bookingData, setBookingData] = useState<ChartData[]>([]);
  const [serviceData, setServiceData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subDays(monthStart, 1));
      const lastMonthEnd = endOfMonth(subDays(monthStart, 1));

      // Fetch all data in parallel
      const [
        { data: payments },
        { data: lastMonthPayments },
        { count: totalBookings },
        { count: monthlyBookings },
        { count: lastMonthBookings },
        { count: totalCustomers },
        { count: newCustomers },
        { count: lastMonthCustomers },
        { data: reviews },
        { data: bookings },
        { data: services },
      ] = await Promise.all([
        supabase.from('payments').select('amount, created_at').eq('status', 'paid').gte('created_at', monthStart.toISOString()),
        supabase.from('payments').select('amount').eq('status', 'paid').gte('created_at', lastMonthStart.toISOString()).lt('created_at', monthStart.toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart.toISOString()).lt('created_at', monthStart.toISOString()),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
        supabase.from('customers').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStart.toISOString()).lt('created_at', monthStart.toISOString()),
        supabase.from('reviews').select('rating'),
        supabase.from('bookings').select('status, service_id, created_at'),
        supabase.from('services').select('id, name'),
      ]);

      // Calculate metrics
      const monthlyRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const lastMonthRevenue = lastMonthPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const revenueGrowth = lastMonthRevenue ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      const bookingGrowth = lastMonthBookings ? (((monthlyBookings || 0) - lastMonthBookings) / lastMonthBookings) * 100 : 0;
      const customerGrowth = lastMonthCustomers ? (((newCustomers || 0) - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

      const avgRating = reviews?.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
      const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
      const completionRate = bookings?.length ? (completedBookings / bookings.length) * 100 : 0;

      setAnalytics({
        totalRevenue: monthlyRevenue * 12, // Estimate annual
        monthlyRevenue,
        revenueGrowth,
        totalBookings: totalBookings || 0,
        monthlyBookings: monthlyBookings || 0,
        bookingGrowth,
        totalCustomers: totalCustomers || 0,
        newCustomers: newCustomers || 0,
        customerGrowth,
        avgRating,
        completionRate,
      });

      // Generate chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        const dayRevenue = payments?.filter(p => 
          format(new Date(p.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        return {
          name: format(date, 'EEE'),
          value: dayRevenue,
        };
      });
      setRevenueData(last7Days);

      // Booking status distribution
      const statusCounts = bookings?.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setBookingData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

      // Service popularity
      const serviceCounts = bookings?.reduce((acc, b) => {
        acc[b.service_id] = (acc[b.service_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const serviceMap = new Map(services?.map(s => [s.id, s.name]) || []);
      setServiceData(
        Object.entries(serviceCounts)
          .map(([id, value]) => ({
            name: serviceMap.get(id) || 'Unknown',
            value,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
      );

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    prefix = '' 
  }: { 
    title: string; 
    value: number | string; 
    change?: number; 
    icon: typeof BarChart3; 
    prefix?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Business Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive business performance metrics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={analytics?.monthlyRevenue || 0}
          change={analytics?.revenueGrowth}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Monthly Bookings"
          value={analytics?.monthlyBookings || 0}
          change={analytics?.bookingGrowth}
          icon={Calendar}
        />
        <StatCard
          title="New Customers"
          value={analytics?.newCustomers || 0}
          change={analytics?.customerGrowth}
          icon={Users}
        />
        <StatCard
          title="Avg. Rating"
          value={analytics?.avgRating.toFixed(1) || '0.0'}
          icon={Star}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 7 Days)</CardTitle>
              <CardDescription>Daily revenue from completed payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>Breakdown of bookings by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
              <CardDescription>Most popular services by booking count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics?.completionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">of bookings completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalCustomers.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">registered customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics?.totalBookings.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">all time bookings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
