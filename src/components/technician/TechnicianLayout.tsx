import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  User,
  LogOut,
  Menu,
  X,
  Wrench,
  Bell,
} from 'lucide-react';

const navItems = [
  { to: '/technician', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/technician/jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/technician/earnings', icon: DollarSign, label: 'Earnings' },
  { to: '/technician/profile', icon: User, label: 'Profile' },
];

export default function TechnicianLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [technicianData, setTechnicianData] = useState<any>(null);
  const [pendingJobsCount, setPendingJobsCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchTechnicianData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/technician/auth');
      return;
    }

    const { data: techData } = await supabase
      .from('technicians')
      .select('id, is_active')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (!techData || !techData.is_active) {
      await supabase.auth.signOut();
      navigate('/technician/auth');
    }
  };

  const fetchTechnicianData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: techData } = await supabase
      .from('technicians')
      .select(`
        id,
        rating,
        completed_jobs,
        total_jobs
      `)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (techData) {
      setTechnicianData(techData);
      
      // Get pending jobs count
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('technician_id', techData.id)
        .in('status', ['assigned', 'confirmed']);

      setPendingJobsCount(count || 0);
    }

    // Fetch profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileData) {
      setTechnicianData((prev: any) => ({ ...prev, ...profileData }));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
    navigate('/technician/auth');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-background border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Tech Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {pendingJobsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingJobsCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-64 bg-background transform transition-transform duration-300 md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <Avatar>
              <AvatarFallback>
                {technicianData?.first_name?.[0] || 'T'}
                {technicianData?.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {technicianData?.first_name} {technicianData?.last_name}
              </p>
              <p className="text-sm text-muted-foreground">Technician</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.label === 'My Jobs' && pendingJobsCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {pendingJobsCount}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col bg-background border-r">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Tech Portal</span>
              <p className="text-xs text-muted-foreground">Service Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 p-3 bg-muted rounded-lg">
            <Avatar>
              <AvatarFallback>
                {technicianData?.first_name?.[0] || 'T'}
                {technicianData?.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {technicianData?.first_name} {technicianData?.last_name}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>⭐ {technicianData?.rating?.toFixed(1) || '5.0'}</span>
                <span>•</span>
                <span>{technicianData?.completed_jobs || 0} jobs</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.label === 'My Jobs' && pendingJobsCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {pendingJobsCount}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <Outlet context={{ technicianData, refreshData: fetchTechnicianData }} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
                {item.label === 'My Jobs' && pendingJobsCount > 0 && (
                  <Badge className="absolute -top-1 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    {pendingJobsCount}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
