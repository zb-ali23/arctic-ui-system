import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Wrench, 
  Settings as SettingsIcon,
  CreditCard,
  Star,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: ('super_admin' | 'manager' | 'technician')[];
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: CalendarDays,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Technicians',
    href: '/admin/technicians',
    icon: Wrench,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Package,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Reviews',
    href: '/admin/reviews',
    icon: Star,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Content',
    href: '/admin/content',
    icon: FileText,
    roles: ['super_admin', 'manager'],
    children: [
      { title: 'Blog Posts', href: '/admin/content/blog' },
      { title: 'FAQs', href: '/admin/content/faqs' },
      { title: 'Testimonials', href: '/admin/content/testimonials' },
    ],
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['super_admin', 'manager'],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: SettingsIcon,
    roles: ['super_admin'],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user?.roles.some(r => item.roles?.includes(r as 'super_admin' | 'manager' | 'technician'));
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AC</span>
              </div>
              <span className="font-semibold text-foreground">Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapse(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.children?.some(c => location.pathname === c.href));
              const isExpanded = expandedItems.includes(item.title);
              const Icon = item.icon;

              return (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.title)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          collapsed && 'justify-center'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronRight 
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isExpanded && 'rotate-90'
                              )} 
                            />
                          </>
                        )}
                      </button>
                      {!collapsed && isExpanded && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={cn(
                                'block rounded-lg px-3 py-2 text-sm transition-colors',
                                location.pathname === child.href
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        collapsed && 'justify-center'
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 shrink-0"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
