import { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Shield, 
  Key,
  Users,
  Settings,
  FileText,
  CreditCard,
  BarChart3,
  Wrench,
  CalendarDays,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface RolePermission {
  role: AppRole;
  permissions: string[];
}

const PERMISSIONS = [
  { key: 'view_dashboard', label: 'View Dashboard', icon: BarChart3, category: 'General' },
  { key: 'manage_bookings', label: 'Manage Bookings', icon: CalendarDays, category: 'Operations' },
  { key: 'view_customers', label: 'View Customers', icon: Users, category: 'Customers' },
  { key: 'manage_customers', label: 'Manage Customers', icon: Users, category: 'Customers' },
  { key: 'view_technicians', label: 'View Technicians', icon: Wrench, category: 'Staff' },
  { key: 'manage_technicians', label: 'Manage Technicians', icon: Wrench, category: 'Staff' },
  { key: 'manage_services', label: 'Manage Services', icon: Settings, category: 'Services' },
  { key: 'view_payments', label: 'View Payments', icon: CreditCard, category: 'Finance' },
  { key: 'manage_payments', label: 'Manage Payments', icon: CreditCard, category: 'Finance' },
  { key: 'view_reviews', label: 'View Reviews', icon: Star, category: 'Content' },
  { key: 'manage_reviews', label: 'Manage Reviews', icon: Star, category: 'Content' },
  { key: 'manage_content', label: 'Manage CMS Content', icon: FileText, category: 'Content' },
  { key: 'view_reports', label: 'View Reports', icon: BarChart3, category: 'Analytics' },
  { key: 'manage_settings', label: 'System Settings', icon: Settings, category: 'System' },
  { key: 'manage_admins', label: 'Manage Admins', icon: Shield, category: 'System' },
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: PERMISSIONS.map(p => p.key),
  manager: [
    'view_dashboard',
    'manage_bookings',
    'view_customers',
    'manage_customers',
    'view_technicians',
    'manage_technicians',
    'manage_services',
    'view_payments',
    'manage_payments',
    'view_reviews',
    'manage_reviews',
    'manage_content',
    'view_reports',
  ],
  technician: [
    'view_dashboard',
    'manage_bookings',
  ],
  customer: [
    'view_dashboard',
  ],
};

export default function RolesPermissions() {
  const { user } = useAuth();
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [loading, setLoading] = useState(false);

  const handlePermissionToggle = (role: string, permission: string) => {
    // Super admin permissions cannot be changed
    if (role === 'super_admin') {
      toast.error('Super Admin permissions cannot be modified');
      return;
    }

    setRolePermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission];
      return { ...prev, [role]: updated };
    });

    toast.success(`Permission ${rolePermissions[role]?.includes(permission) ? 'removed' : 'granted'}`);
  };

  const categories = [...new Set(PERMISSIONS.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Key className="h-6 w-6" />
          Roles & Permissions
        </h1>
        <p className="text-muted-foreground">
          Configure access levels and permissions for each role
        </p>
      </div>

      {/* Role Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(['super_admin', 'manager', 'technician', 'customer'] as AppRole[]).map((role) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {role.replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rolePermissions[role]?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">permissions granted</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Configure which permissions are available for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Permission</TableHead>
                  <TableHead className="text-center">Super Admin</TableHead>
                  <TableHead className="text-center">Manager</TableHead>
                  <TableHead className="text-center">Technician</TableHead>
                  <TableHead className="text-center">Customer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <>
                    <TableRow key={category} className="bg-muted/50">
                      <TableCell colSpan={5} className="font-semibold">
                        {category}
                      </TableCell>
                    </TableRow>
                    {PERMISSIONS.filter(p => p.category === category).map((permission) => {
                      const Icon = permission.icon;
                      return (
                        <TableRow key={permission.key}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span>{permission.label}</span>
                            </div>
                          </TableCell>
                          {(['super_admin', 'manager', 'technician', 'customer'] as AppRole[]).map((role) => {
                            const hasPermission = rolePermissions[role]?.includes(permission.key);
                            const isLocked = role === 'super_admin';
                            
                            return (
                              <TableCell key={role} className="text-center">
                                {isLocked ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                  <Switch
                                    checked={hasPermission}
                                    onCheckedChange={() => handlePermissionToggle(role, permission.key)}
                                  />
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Always Granted (Super Admin)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-primary rounded-full" />
              <span>Permission Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-muted rounded-full" />
              <span>Permission Disabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
