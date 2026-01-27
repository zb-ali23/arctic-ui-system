import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2,
  MapPin,
  Bell,
  Shield,
  Save,
  RefreshCw
} from 'lucide-react';

interface BusinessSettings {
  business_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  operating_hours: string;
  tax_rate: number;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  granted_at: string;
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: 'CoolFix Pro',
    email: 'support@coolfixpro.com',
    phone: '(555) 123-4567',
    whatsapp: '15551234567',
    address_street: '123 Main Street',
    address_city: 'Miami',
    address_state: 'FL',
    address_zip: '33101',
    operating_hours: 'Mon-Sat: 8AM-6PM, Sun: 10AM-4PM',
    tax_rate: 7.5,
  });
  const [notifications, setNotifications] = useState({
    email_booking_confirmation: true,
    email_status_updates: true,
    email_review_requests: true,
    sms_reminders: false,
    admin_alerts: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');
      
      if (error) throw error;
      
      // Parse settings
      data?.forEach(setting => {
        if (setting.key === 'business_info') {
          setBusinessSettings(prev => ({ ...prev, ...(setting.value as object) }));
        } else if (setting.key === 'notifications') {
          setNotifications(prev => ({ ...prev, ...(setting.value as object) }));
        } else if (setting.key === 'business_phone') {
          setBusinessSettings(prev => ({ ...prev, phone: setting.value as string }));
        } else if (setting.key === 'business_email') {
          setBusinessSettings(prev => ({ ...prev, email: setting.value as string }));
        } else if (setting.key === 'whatsapp_number') {
          setBusinessSettings(prev => ({ ...prev, whatsapp: setting.value as string }));
        } else if (setting.key === 'business_address') {
          const addr = setting.value as { street: string; city: string; state: string; zip: string };
          setBusinessSettings(prev => ({ 
            ...prev, 
            address_street: addr.street,
            address_city: addr.city,
            address_state: addr.state,
            address_zip: addr.zip,
          }));
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('granted_at', { ascending: false });
      
      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleSaveBusinessSettings = async () => {
    setLoading(true);
    try {
      // Save individual settings for use across the app
      const settingsToSave = [
        { key: 'business_phone', value: JSON.stringify(businessSettings.phone) },
        { key: 'business_email', value: JSON.stringify(businessSettings.email) },
        { key: 'whatsapp_number', value: JSON.stringify(businessSettings.whatsapp) },
        { 
          key: 'business_address', 
          value: JSON.stringify({
            street: businessSettings.address_street,
            city: businessSettings.address_city,
            state: businessSettings.address_state,
            zip: businessSettings.address_zip,
          })
        },
        { key: 'business_name', value: JSON.stringify(businessSettings.business_name) },
        { key: 'business_hours', value: JSON.stringify(businessSettings.operating_hours) },
        { key: 'tax_rate', value: JSON.stringify(businessSettings.tax_rate) },
      ];

      for (const setting of settingsToSave) {
        const { data: existing } = await supabase
          .from('system_settings')
          .select('id')
          .eq('key', setting.key)
          .maybeSingle();

        const jsonValue = JSON.parse(setting.value) as Json;

        if (existing) {
          await supabase
            .from('system_settings')
            .update({ value: jsonValue, updated_at: new Date().toISOString() })
            .eq('key', setting.key);
        } else {
          await supabase
            .from('system_settings')
            .insert([{ key: setting.key, value: jsonValue }]);
        }
      }

      toast({ title: 'Success', description: 'Business settings saved' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'notifications')
        .maybeSingle();

      const jsonValue = JSON.parse(JSON.stringify(notifications)) as Json;

      if (existing) {
        await supabase
          .from('system_settings')
          .update({ value: jsonValue, updated_at: new Date().toISOString() })
          .eq('key', 'notifications');
      } else {
        await supabase
          .from('system_settings')
          .insert([{ key: 'notifications', value: jsonValue }]);
      }

      toast({ title: 'Success', description: 'Notification settings saved' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'manager': return 'default';
      case 'technician': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="business">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">
            <Building2 className="mr-2 h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="service-areas">
            <MapPin className="mr-2 h-4 w-4" />
            Service Areas
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>General business details shown to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <Input
                    value={businessSettings.business_name}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, business_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>WhatsApp Number (with country code)</Label>
                  <Input
                    value={businessSettings.whatsapp}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, whatsapp: e.target.value })}
                    placeholder="15551234567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={businessSettings.address_street}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, address_street: e.target.value })}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={businessSettings.address_city}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, address_city: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>State</Label>
                    <Input
                      value={businessSettings.address_state}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, address_state: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>ZIP</Label>
                    <Input
                      value={businessSettings.address_zip}
                      onChange={(e) => setBusinessSettings({ ...businessSettings, address_zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Operating Hours</Label>
                  <Input
                    value={businessSettings.operating_hours}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, operating_hours: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={businessSettings.tax_rate}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, tax_rate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveBusinessSettings} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure automated email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Confirmation</p>
                  <p className="text-sm text-muted-foreground">Send confirmation email when booking is created</p>
                </div>
                <Switch
                  checked={notifications.email_booking_confirmation}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_booking_confirmation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status Updates</p>
                  <p className="text-sm text-muted-foreground">Notify customers when booking status changes</p>
                </div>
                <Switch
                  checked={notifications.email_status_updates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_status_updates: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Review Requests</p>
                  <p className="text-sm text-muted-foreground">Ask for reviews after service completion</p>
                </div>
                <Switch
                  checked={notifications.email_review_requests}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_review_requests: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>Configure SMS reminders and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Send SMS reminder before scheduled appointments</p>
                </div>
                <Switch
                  checked={notifications.sms_reminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms_reminders: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Alerts</CardTitle>
              <CardDescription>Notifications for administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Booking Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert admins when new bookings are created</p>
                </div>
                <Switch
                  checked={notifications.admin_alerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, admin_alerts: checked })}
                />
              </div>
              <Button onClick={handleSaveNotifications} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Areas */}
        <TabsContent value="service-areas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
              <CardDescription>Define the areas where you provide services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {['Miami', 'Miami Beach', 'Coral Gables', 'Hialeah', 'Doral', 'Kendall'].map((area) => (
                  <div key={area} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{area}</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Service Areas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Roles</CardTitle>
                  <CardDescription>Manage user access and permissions</CardDescription>
                </div>
                <Button variant="outline" onClick={fetchUserRoles}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Granted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No roles assigned yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    userRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-mono text-sm">
                          {role.user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(role.role)}>
                            {role.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(role.granted_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Overview of permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">Super Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full access to all features including system settings, user management, and all data.
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">Manager</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Access to bookings, customers, technicians, services, payments, reviews, content, and reports.
                    Cannot manage system settings or user roles.
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Technician</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Limited access to view and update their assigned bookings only.
                    Can update job status and add notes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
