import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge, PriorityBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  Wrench,
  DollarSign
} from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

interface BookingDetails {
  id: string;
  booking_number: string;
  status: BookingStatus;
  priority: string;
  scheduled_date: string;
  time_slot_label: string | null;
  created_at: string;
  customer_notes: string | null;
  admin_notes: string | null;
  technician_notes: string | null;
  estimated_price: number | null;
  final_price: number | null;
  customers: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  services: {
    id: string;
    name: string;
    base_price: number;
  } | null;
  customer_addresses: {
    street: string;
    apartment: string | null;
    city: string;
    state: string;
    zip: string;
  } | null;
  technicians: {
    id: string;
    user_id: string;
  } | null;
}

interface Technician {
  id: string;
  user_id: string;
  is_available: boolean;
}

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled'];

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  const [formData, setFormData] = useState({
    status: 'pending' as BookingStatus,
    priority: 'normal',
    scheduled_date: '',
    admin_notes: '',
    technician_id: '',
    estimated_price: '',
    final_price: '',
  });

  useEffect(() => {
    if (id) {
      fetchBooking();
      fetchTechnicians();
    }
  }, [id]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          status,
          priority,
          scheduled_date,
          time_slot_label,
          created_at,
          customer_notes,
          admin_notes,
          technician_notes,
          estimated_price,
          final_price,
          customers (id, first_name, last_name, email, phone),
          services (id, name, base_price),
          customer_addresses (street, apartment, city, state, zip),
          technicians (id, user_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const bookingData = data as BookingDetails;
      setBooking(bookingData);
      setFormData({
        status: bookingData.status,
        priority: bookingData.priority,
        scheduled_date: bookingData.scheduled_date,
        admin_notes: bookingData.admin_notes || '',
        technician_id: bookingData.technicians?.id || '',
        estimated_price: bookingData.estimated_price?.toString() || '',
        final_price: bookingData.final_price?.toString() || '',
      });
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({ title: 'Error', description: 'Failed to fetch booking details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('id, user_id, is_available')
        .eq('is_active', true);
      
      if (error) throw error;
      setTechnicians(data || []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);

    try {
      const updateData: Record<string, unknown> = {
        status: formData.status,
        priority: formData.priority,
        scheduled_date: formData.scheduled_date,
        admin_notes: formData.admin_notes || null,
        estimated_price: formData.estimated_price ? Number(formData.estimated_price) : null,
        final_price: formData.final_price ? Number(formData.final_price) : null,
      };

      if (formData.technician_id) {
        updateData.technician_id = formData.technician_id;
        if (booking.status === 'pending' || booking.status === 'confirmed') {
          updateData.status = 'assigned';
          updateData.assigned_at = new Date().toISOString();
        }
      }

      if (formData.status === 'completed' && booking.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
      if (formData.status === 'cancelled' && booking.status !== 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
      if (formData.status === 'confirmed' && booking.status !== 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData as never)
        .eq('id', booking.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Booking updated successfully' });
      fetchBooking();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({ title: 'Error', description: 'Failed to update booking', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Booking not found</p>
        <Button className="mt-4" onClick={() => navigate('/admin/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/bookings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{booking.booking_number}</h1>
              <StatusBadge status={booking.status} />
              <PriorityBadge priority={booking.priority as 'normal' | 'urgent'} />
            </div>
            <p className="text-muted-foreground">
              Created {format(new Date(booking.created_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">
                {booking.customers?.first_name} {booking.customers?.last_name}
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {booking.customers?.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {booking.customers?.phone}
            </div>
            {booking.customer_addresses && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  <p>{booking.customer_addresses.street}</p>
                  {booking.customer_addresses.apartment && (
                    <p>{booking.customer_addresses.apartment}</p>
                  )}
                  <p>
                    {booking.customer_addresses.city}, {booking.customer_addresses.state} {booking.customer_addresses.zip}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">{booking.services?.name}</p>
              <p className="text-muted-foreground">Base Price: ${booking.services?.base_price}</p>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(booking.scheduled_date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {booking.time_slot_label || 'Time not set'}
            </div>
            {booking.customer_notes && (
              <div>
                <p className="text-sm font-medium mb-1">Customer Notes:</p>
                <p className="text-sm text-muted-foreground">{booking.customer_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Booking */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Update Booking</CardTitle>
            <CardDescription>Modify booking status, assignment, and pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as BookingStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData({ ...formData, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned Technician</Label>
                <Select
                  value={formData.technician_id}
                  onValueChange={(v) => setFormData({ ...formData, technician_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        <div className="flex items-center gap-2">
                          <span>Technician #{tech.id.slice(0, 8)}</span>
                          {tech.is_available ? (
                            <span className="text-xs text-green-600">Available</span>
                          ) : (
                            <span className="text-xs text-yellow-600">Busy</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Estimated Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.estimated_price}
                    onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
                    className="pl-9"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label>Final Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={formData.final_price}
                    onChange={(e) => setFormData({ ...formData, final_price: e.target.value })}
                    className="pl-9"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Admin Notes</Label>
              <Textarea
                value={formData.admin_notes}
                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                placeholder="Internal notes about this booking..."
                rows={3}
              />
            </div>

            {booking.technician_notes && (
              <div>
                <Label>Technician Notes</Label>
                <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {booking.technician_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
