import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  Phone,
  Mail,
  Star,
  Briefcase,
  Award,
  Loader2,
  Save,
  Settings,
} from 'lucide-react';

export default function TechnicianProfile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [technician, setTechnician] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    is_available: true,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const [profileRes, techRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle(),
      supabase
        .from('technicians')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle(),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setFormData((prev) => ({
        ...prev,
        first_name: profileRes.data.first_name || '',
        last_name: profileRes.data.last_name || '',
        phone: profileRes.data.phone || '',
      }));
    }

    if (techRes.data) {
      setTechnician(techRes.data);
      setFormData((prev) => ({
        ...prev,
        is_available: techRes.data.is_available ?? true,
      }));
    }

    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // Update technician availability
      if (technician) {
        const { error: techError } = await supabase
          .from('technicians')
          .update({
            is_available: formData.is_available,
            updated_at: new Date().toISOString(),
          })
          .eq('id', technician.id);

        if (techError) throw techError;
      }

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved.',
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {formData.first_name[0] || 'T'}
                {formData.last_name[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                {formData.first_name} {formData.last_name}
              </h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{technician?.rating?.toFixed(1) || '5.0'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{technician?.completed_jobs || 0} jobs</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, first_name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, last_name: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input id="email" value={profile?.email || ''} disabled className="bg-muted" />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Work Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Availability Status</Label>
              <p className="text-sm text-muted-foreground">
                Toggle off when you're not available for new jobs
              </p>
            </div>
            <Switch
              checked={formData.is_available}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_available: checked }))
              }
            />
          </div>

          {technician?.employee_id && (
            <div>
              <Label>Employee ID</Label>
              <p className="text-muted-foreground">{technician.employee_id}</p>
            </div>
          )}

          {technician?.hourly_rate && (
            <div>
              <Label>Hourly Rate</Label>
              <p className="text-muted-foreground">${technician.hourly_rate}/hour</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specializations & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Skills & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Specializations</Label>
            <div className="flex flex-wrap gap-2">
              {technician?.specializations?.length > 0 ? (
                technician.specializations.map((spec: string, i: number) => (
                  <Badge key={i} variant="secondary" className="capitalize">
                    {spec}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specializations listed</p>
              )}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Certifications</Label>
            <div className="flex flex-wrap gap-2">
              {technician?.certifications?.length > 0 ? (
                technician.certifications.map((cert: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {cert}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No certifications listed</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t md:relative md:bottom-0 md:p-0 md:border-0 md:bg-transparent">
        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
