import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Shield,
  Award
} from 'lucide-react';

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  loyalty_points: number | null;
  total_bookings: number | null;
}

interface Address {
  id: string;
  label: string | null;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  is_default: boolean | null;
}

export default function CustomerPortalAccount() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    is_default: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (customer) {
        setProfile(customer as CustomerProfile);
        setEditForm({
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
        });

        // Fetch addresses
        const { data: addressData } = await supabase
          .from('customer_addresses')
          .select('*')
          .eq('customer_id', customer.id)
          .order('is_default', { ascending: false });

        setAddresses((addressData || []) as Address[]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Profile updated successfully' });
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!profile) return;

    try {
      if (selectedAddress) {
        const { error } = await supabase
          .from('customer_addresses')
          .update(addressForm)
          .eq('id', selectedAddress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customer_addresses')
          .insert([{ ...addressForm, customer_id: profile.id }]);
        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Address saved successfully' });
      setAddressDialogOpen(false);
      resetAddressForm();
      fetchProfile();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({ title: 'Error', description: 'Failed to save address', variant: 'destructive' });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Address deleted' });
      fetchProfile();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({ title: 'Error', description: 'Failed to delete address', variant: 'destructive' });
    }
  };

  const resetAddressForm = () => {
    setSelectedAddress(null);
    setAddressForm({
      label: 'Home',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      is_default: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Loyalty & Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Loyalty Points</CardTitle>
              <CardDescription>Earn points with every service</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile?.loyalty_points || 0}</p>
            <p className="text-sm text-muted-foreground">points earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Customer Since</CardTitle>
              <CardDescription>Total services completed</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile?.total_bookings || 0}</p>
            <p className="text-sm text-muted-foreground">services booked</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>First Name</Label>
              <Input
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input value={profile?.email || ''} disabled className="bg-muted" />
              <Badge variant="secondary">Verified</Badge>
            </div>
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </CardTitle>
              <CardDescription>Manage your service addresses</CardDescription>
            </div>
            <Button onClick={() => { resetAddressForm(); setAddressDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Addresses Saved</h3>
              <p className="text-sm text-muted-foreground">
                Add an address for faster booking
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.label || 'Address'}</span>
                        {address.is_default && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.street}
                        {address.apartment && `, ${address.apartment}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedAddress(address);
                        setAddressForm({
                          label: address.label || 'Home',
                          street: address.street,
                          apartment: address.apartment || '',
                          city: address.city,
                          state: address.state,
                          zip: address.zip,
                          is_default: address.is_default || false,
                        });
                        setAddressDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
            <DialogDescription>
              {selectedAddress ? 'Update your address details' : 'Add a new service address'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <Input
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                placeholder="e.g., Home, Office"
              />
            </div>
            <div>
              <Label>Street Address</Label>
              <Input
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
              />
            </div>
            <div>
              <Label>Apartment/Suite (optional)</Label>
              <Input
                value={addressForm.apartment}
                onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
              </div>
              <div>
                <Label>ZIP</Label>
                <Input
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAddress}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
