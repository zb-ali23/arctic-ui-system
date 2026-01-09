import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  CalendarDays,
  Clock,
  User,
  Settings,
  LogOut,
  Home,
  FileText,
  Star,
  Menu,
  X,
  ChevronRight,
  Snowflake
} from 'lucide-react';

interface CustomerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const navItems = [
  { title: 'Dashboard', href: '/portal', icon: Home },
  { title: 'My Bookings', href: '/portal/bookings', icon: CalendarDays },
  { title: 'Service History', href: '/portal/history', icon: Clock },
  { title: 'Invoices', href: '/portal/invoices', icon: FileText },
  { title: 'My Reviews', href: '/portal/reviews', icon: Star },
  { title: 'Account', href: '/portal/account', icon: User },
];

export function CustomerPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<CustomerUser | null>(null);

  // Simplified user handling - in real app would use auth context
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out', description: 'You have been signed out successfully' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/portal" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Snowflake className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold hidden sm:block">My Account</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/book">
                <CalendarDays className="mr-2 h-4 w-4" />
                Book Service
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">Customer Account</p>
                  <p className="text-xs text-muted-foreground">Manage your account</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/portal/account">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="container py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Need help? Call us at <a href="tel:+15551234567" className="text-primary hover:underline">(555) 123-4567</a></p>
        </div>
      </footer>
    </div>
  );
}

export default CustomerPortalLayout;
