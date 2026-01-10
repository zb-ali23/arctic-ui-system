import { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { isSuperAdminEmail } from '@/lib/super-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit,
  Search,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: AppRole[];
  created_at: string;
  is_active: boolean;
}

export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>('manager');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      // Fetch all users with admin or manager roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role, granted_at')
        .in('role', ['super_admin', 'manager']);

      if (!roles || roles.length === 0) {
        setAdmins([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(roles.map(r => r.user_id))];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      const adminUsers: AdminUser[] = (profiles || []).map(profile => {
        const userRoles = roles
          .filter(r => r.user_id === profile.id)
          .map(r => r.role as AppRole);

        return {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          roles: userRoles,
          created_at: profile.created_at,
          is_active: profile.is_active ?? true,
        };
      });

      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: AppRole) => {
    const targetUser = admins.find(a => a.id === userId);
    
    // Prevent modifying super admin email
    if (targetUser && isSuperAdminEmail(targetUser.email)) {
      toast.error('Cannot modify Super Admin permissions');
      return;
    }

    try {
      // Remove existing admin roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .in('role', ['super_admin', 'manager']);

      // Add new role
      await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
          granted_by: user?.id,
        });

      toast.success('Role updated successfully');
      fetchAdmins();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    const targetUser = admins.find(a => a.id === userId);
    
    // Prevent removing super admin
    if (targetUser && isSuperAdminEmail(targetUser.email)) {
      toast.error('Cannot remove Super Admin');
      return;
    }

    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .in('role', ['super_admin', 'manager']);

      toast.success('Admin access removed');
      fetchAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin access');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(search.toLowerCase()) ||
    admin.first_name.toLowerCase().includes(search.toLowerCase()) ||
    admin.last_name.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (roles: AppRole[], email: string) => {
    if (isSuperAdminEmail(email)) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Crown className="h-3 w-3" />
          Super Admin
        </Badge>
      );
    }
    if (roles.includes('super_admin')) {
      return <Badge variant="destructive">Super Admin</Badge>;
    }
    if (roles.includes('manager')) {
      return <Badge variant="default">Manager</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Admin Management
          </h1>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Admin Table */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Accounts</CardTitle>
          <CardDescription>
            View and manage all users with administrative access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="font-medium">
                        {admin.first_name} {admin.last_name}
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.roles, admin.email)}</TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(admin.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isSuperAdminEmail(admin.email) && (
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            defaultValue={admin.roles[0]}
                            onValueChange={(value) => handleUpdateRole(admin.id, value as AppRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {isSuperAdminEmail(admin.email) && (
                        <span className="text-sm text-muted-foreground">Protected</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Shield className="h-5 w-5" />
            Permission Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
          <p>• The permanent Super Admin account cannot be modified or removed.</p>
          <p>• Super Admins have full unrestricted access to all system features.</p>
          <p>• Managers have access to most features except system settings and admin management.</p>
          <p>• All role changes are logged for security purposes.</p>
        </CardContent>
      </Card>
    </div>
  );
}
