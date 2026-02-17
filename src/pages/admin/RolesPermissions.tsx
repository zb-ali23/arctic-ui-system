import { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
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
  XCircle,
  Plus,
  Trash2,
  Crown,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SUPER_ADMIN_EMAIL } from '@/lib/super-admin';

// --- Permission Matrix Config ---
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
    'view_dashboard', 'manage_bookings', 'view_customers', 'manage_customers',
    'view_technicians', 'manage_technicians', 'manage_services', 'view_payments',
    'manage_payments', 'view_reviews', 'manage_reviews', 'manage_content', 'view_reports',
  ],
  technician: ['view_dashboard', 'manage_bookings'],
  customer: ['view_dashboard'],
};

// --- Super Admin Management ---
interface SuperAdminUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  granted_at: string;
  isPermanent: boolean;
}

function SuperAdminManagement() {
  const { user } = useAuth();
  const [superAdmins, setSuperAdmins] = useState<SuperAdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchSuperAdmins = async () => {
    setLoading(true);
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('user_id, role, granted_at')
        .eq('role', 'super_admin');

      if (error) throw error;

      const admins: SuperAdminUser[] = [];
      for (const role of roles || []) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', role.user_id)
          .single();

        admins.push({
          user_id: role.user_id,
          email: profile?.email || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          granted_at: role.granted_at,
          isPermanent: (profile?.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase(),
        });
      }

      // Add permanent super admin if not in roles table
      const hasPermanent = admins.some(a => a.isPermanent);
      if (!hasPermanent) {
        admins.unshift({
          user_id: '',
          email: SUPER_ADMIN_EMAIL,
          first_name: 'Permanent',
          last_name: 'Super Admin',
          granted_at: '',
          isPermanent: true,
        });
      }

      setSuperAdmins(admins);
    } catch (err) {
      console.error('Error fetching super admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuperAdmins(); }, []);

  const handleAddSuperAdmin = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setAdding(true);
    try {
      // Find user by email in profiles
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', newEmail.trim().toLowerCase())
        .single();

      if (profileErr || !profile) {
        toast.error('No user found with that email. They must sign up first.');
        setAdding(false);
        return;
      }

      // Check if already super_admin
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', profile.id)
        .eq('role', 'super_admin');

      if (existing && existing.length > 0) {
        toast.error('This user is already a Super Admin');
        setAdding(false);
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: profile.id,
          role: 'super_admin' as any,
          granted_by: user?.id,
        });

      if (error) throw error;

      toast.success(`${profile.first_name} ${profile.last_name} is now a Super Admin`);
      setNewEmail('');
      fetchSuperAdmins();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add Super Admin');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveSuperAdmin = async (admin: SuperAdminUser) => {
    if (admin.isPermanent) {
      toast.error('Cannot remove the permanent Super Admin');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', admin.user_id)
        .eq('role', 'super_admin');

      if (error) throw error;

      toast.success(`Removed Super Admin role from ${admin.first_name} ${admin.last_name}`);
      fetchSuperAdmins();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove Super Admin');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Super Admin Management
        </CardTitle>
        <CardDescription>
          Add or remove users with full system access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new super admin */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter user email to grant Super Admin..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSuperAdmin()}
            className="flex-1"
          />
          <Button onClick={handleAddSuperAdmin} disabled={adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add
          </Button>
        </div>

        {/* Super admins list */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-lg border divide-y">
            {superAdmins.map((admin) => (
              <div
                key={admin.user_id || admin.email}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {admin.first_name} {admin.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                  {admin.isPermanent && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">
                      Permanent
                    </Badge>
                  )}
                </div>
                {!admin.isPermanent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveSuperAdmin(admin)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {superAdmins.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No super admins found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function RolesPermissions() {
  const { user } = useAuth();
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);

  const handlePermissionToggle = (role: string, permission: string) => {
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

      {/* Super Admin Management */}
      <SuperAdminManagement />

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
                      <TableCell colSpan={5} className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-2">
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
                              <span className="text-sm">{permission.label}</span>
                            </div>
                          </TableCell>
                          {(['super_admin', 'manager', 'technician', 'customer'] as AppRole[]).map((role) => {
                            const hasPermission = rolePermissions[role]?.includes(permission.key);
                            const isLocked = role === 'super_admin';
                            
                            return (
                              <TableCell key={role} className="text-center">
                                {isLocked ? (
                                  <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500/10 mx-auto">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </div>
                                ) : hasPermission ? (
                                  <button
                                    onClick={() => handlePermissionToggle(role, permission.key)}
                                    className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 mx-auto hover:bg-primary/20 transition-colors cursor-pointer"
                                  >
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handlePermissionToggle(role, permission.key)}
                                    className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted mx-auto hover:bg-muted-foreground/10 transition-colors cursor-pointer"
                                  >
                                    <XCircle className="h-4 w-4 text-muted-foreground/40" />
                                  </button>
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
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <span>Always Granted (Super Admin)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <span>Permission Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted">
                <XCircle className="h-4 w-4 text-muted-foreground/40" />
              </div>
              <span>Permission Disabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
