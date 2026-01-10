import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  base_price: number;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface TimeSlot {
  id: string;
  label: string;
}

export default function NewBooking() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    scheduled_date: '',
    time_slot_id: '',
    priority: 'normal',
    customer_notes: '',
    admin_notes: '',
    // New customer fields
    new_customer: false,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, customersRes, timeSlotsRes] = await Promise.all([
        supabase.from('services').select('id, name, base_price').eq('is_active', true),
        supabase.from('customers').select('id, first_name, last_name, email, phone').order('created_at', { ascending: false }),
        supabase.from('time_slots').select('id, label').eq('is_active', true).order('display_order'),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      if (timeSlotsRes.data) setTimeSlots(timeSlotsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customerId = formData.customer_id;
      let addressId = '';

      // If creating new customer
      if (formData.new_customer) {
        // Create customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = customerData.id;

        // Create address
        const { data: addressData, error: addressError } = await supabase
          .from('customer_addresses')
          .insert({
            customer_id: customerId,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            is_default: true,
          })
          .select()
          .single();

        if (addressError) throw addressError;
        addressId = addressData.id;
      } else {
        // Get customer's default address or create one
        const { data: existingAddress } = await supabase
          .from('customer_addresses')
          .select('id')
          .eq('customer_id', customerId)
          .eq('is_default', true)
          .single();

        if (existingAddress) {
          addressId = existingAddress.id;
        } else {
          // Create a placeholder address
          const { data: newAddress, error: addressError } = await supabase
            .from('customer_addresses')
            .insert({
              customer_id: customerId,
              street: 'Address pending',
              city: 'City',
              state: 'ST',
              zip: '00000',
              is_default: true,
            })
            .select()
            .single();

          if (addressError) throw addressError;
          addressId = newAddress.id;
        }
      }

      // Get time slot label
      const selectedTimeSlot = timeSlots.find(ts => ts.id === formData.time_slot_id);

      // Generate booking number
      const bookingNumber = `BK${Date.now().toString(36).toUpperCase()}`;

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_number: bookingNumber,
          customer_id: customerId,
          service_id: formData.service_id,
          address_id: addressId,
          scheduled_date: formData.scheduled_date,
          time_slot_id: formData.time_slot_id,
          time_slot_label: selectedTimeSlot?.label,
          priority: formData.priority as 'normal' | 'urgent' | 'emergency',
          customer_notes: formData.customer_notes || null,
          admin_notes: formData.admin_notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({ title: 'Success', description: `Booking ${bookingNumber} created successfully` });
      navigate('/admin/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({ title: 'Error', description: 'Failed to create booking', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Booking</h1>
          <p className="text-muted-foreground">Create a new service booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Select an existing customer or create a new one</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={!formData.new_customer ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, new_customer: false })}
              >
                Existing Customer
              </Button>
              <Button
                type="button"
                variant={formData.new_customer ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, new_customer: true })}
              >
                New Customer
              </Button>
            </div>

            {!formData.new_customer ? (
              <div>
                <Label>Select Customer</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} - {customer.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    required={formData.new_customer}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Service</Label>
              <Select
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.base_price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label>Time Slot</Label>
                <Select
                  value={formData.time_slot_id}
                  onValueChange={(value) => setFormData({ ...formData, time_slot_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
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
              <Label>Customer Notes</Label>
              <Textarea
                value={formData.customer_notes}
                onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                placeholder="Notes from the customer..."
              />
            </div>

            <div>
              <Label>Admin Notes</Label>
              <Textarea
                value={formData.admin_notes}
                onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                placeholder="Internal notes..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/bookings')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Booking
          </Button>
        </div>
      </form>
    </div>
  );
}
