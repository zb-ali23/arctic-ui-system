import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Edit,
  Save,
  X
} from 'lucide-react';

interface CustomerDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  total_bookings: number | null;
  loyalty_points: number | null;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
}

interface CustomerAddress {
  id: string;
  street: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  is_default: boolean | null;
}

interface CustomerBooking {
  id: string;
  booking_number: string;
  status: string;
  scheduled_date: string;
  services: { name: string } | null;
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      // Fetch customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);
      setFormData({
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        notes: customerData.notes || '',
      });

      // Fetch addresses
      const { data: addressData } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', id)
        .order('is_default', { ascending: false });

      setAddresses(addressData || []);

      // Fetch bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id, booking_number, status, scheduled_date, services(name)')
        .eq('customer_id', id)
        .order('scheduled_date', { ascending: false })
        .limit(10);

      setBookings((bookingData || []) as CustomerBooking[]);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({ title: 'Error', description: 'Failed to fetch customer details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!customer) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes || null,
        })
        .eq('id', customer.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Customer updated successfully' });
      setEditing(false);
      fetchCustomer();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({ title: 'Error', description: 'Failed to update customer', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async () => {
    if (!customer || !newTag.trim()) return;
    
    const updatedTags = [...(customer.tags || []), newTag.trim()];
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ tags: updatedTags })
        .eq('id', customer.id);

      if (error) throw error;
      
      setNewTag('');
      toast({ title: 'Success', description: 'Tag added' });
      fetchCustomer();
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({ title: 'Error', description: 'Failed to add tag', variant: 'destructive' });
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!customer) return;
    
    const updatedTags = (customer.tags || []).filter(t => t !== tagToRemove);
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ tags: updatedTags })
        .eq('id', customer.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Tag removed' });
      fetchCustomer();
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({ title: 'Error', description: 'Failed to remove tag', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Button className="mt-4" onClick={() => navigate('/admin/customers')}>
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-muted-foreground">
              Customer since {format(new Date(customer.created_at), 'MMMM yyyy')}
            </p>
          </div>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold text-primary">{customer.total_bookings || 0}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-primary">
                  <Star className="h-6 w-6" />
                  {customer.loyalty_points || 0}
                </div>
                <div className="text-sm text-muted-foreground">Loyalty Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Organize customers with tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(customer.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {(customer.tags?.length || 0) === 0 && (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Internal notes about this customer</CardDescription>
          </CardHeader>
          <CardContent>
            {editing ? (
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes..."
                rows={4}
              />
            ) : (
              <p className="text-muted-foreground">
                {customer.notes || 'No notes yet'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <p className="text-muted-foreground">No addresses on file</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="p-3 bg-muted rounded-lg">
                    {address.is_default && (
                      <Badge variant="outline" className="mb-2">Default</Badge>
                    )}
                    <p>{address.street}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>{address.city}, {address.state} {address.zip}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.booking_number}</TableCell>
                      <TableCell>{booking.services?.name || '-'}</TableCell>
                      <TableCell>{format(new Date(booking.scheduled_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
