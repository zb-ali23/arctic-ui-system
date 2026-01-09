import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Wrench,
  RefreshCw,
  XCircle,
  Eye,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface Booking {
  id: string;
  booking_number: string;
  status: string;
  priority: string;
  scheduled_date: string;
  time_slot_label: string | null;
  problem_description: string | null;
  customer_notes: string | null;
  created_at: string;
  services: { name: string; short_description: string | null } | null;
  customer_addresses: { street: string; city: string; state: string; zip: string } | null;
}

export default function CustomerPortalBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!customer) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          status,
          priority,
          scheduled_date,
          time_slot_label,
          problem_description,
          customer_notes,
          created_at,
          services (name, short_description),
          customer_addresses (street, city, state, zip)
        `)
        .eq('customer_id', customer.id)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      setBookings((data || []) as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({ title: 'Error', description: 'Failed to load bookings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: cancelReason,
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;

      toast({ title: 'Booking Cancelled', description: 'Your booking has been cancelled' });
      setCancelDialogOpen(false);
      setCancelReason('');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({ title: 'Error', description: 'Failed to cancel booking', variant: 'destructive' });
    }
  };

  const activeBookings = bookings.filter(b => 
    ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress'].includes(b.status)
  );
  const pastBookings = bookings.filter(b => 
    ['completed', 'cancelled'].includes(b.status)
  );

  const canCancel = (status: string) => ['pending', 'confirmed'].includes(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">Track and manage your service appointments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBookings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/book">Book New Service</Link>
          </Button>
        </div>
      </div>

      {/* Active Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Active Bookings
          </CardTitle>
          <CardDescription>Your upcoming and in-progress services</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading...
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Active Bookings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any upcoming appointments
              </p>
              <Button asChild>
                <Link to="/book">Book a Service</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Wrench className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{booking.booking_number}</span>
                          <StatusBadge status={booking.status} />
                          {booking.priority !== 'normal' && (
                            <Badge variant="destructive" className="text-xs">
                              {booking.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{booking.services?.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {format(new Date(booking.scheduled_date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.time_slot_label || 'TBD'}
                          </span>
                        </div>
                        {booking.customer_addresses && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.customer_addresses.street}, {booking.customer_addresses.city}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      {canCancel(booking.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCancelDialogOpen(true);
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Past Bookings
            </CardTitle>
            <CardDescription>Your completed and cancelled services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setDetailsOpen(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <div>
                      <span className="font-medium">{booking.booking_number}</span>
                      <p className="text-sm text-muted-foreground">{booking.services?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{format(new Date(booking.scheduled_date), 'MMM d, yyyy')}</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
            {pastBookings.length > 5 && (
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link to="/portal/history">View All History</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedBooking.status} />
                {selectedBooking.priority !== 'normal' && (
                  <Badge variant="destructive">{selectedBooking.priority}</Badge>
                )}
              </div>
              
              <div className="grid gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{selectedBooking.services?.name}</p>
                  {selectedBooking.services?.short_description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedBooking.services.short_description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedBooking.scheduled_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedBooking.time_slot_label || 'To be confirmed'}</p>
                  </div>
                </div>
                
                {selectedBooking.customer_addresses && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {selectedBooking.customer_addresses.street}<br />
                      {selectedBooking.customer_addresses.city}, {selectedBooking.customer_addresses.state} {selectedBooking.customer_addresses.zip}
                    </p>
                  </div>
                )}
                
                {selectedBooking.problem_description && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Problem Description</p>
                    <p>{selectedBooking.problem_description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
                <div>
                  <p className="text-sm">Need help?</p>
                  <a href="tel:+15551234567" className="font-medium hover:underline">
                    Call (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cancel Booking
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel booking {selectedBooking?.booking_number}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reason for cancellation (optional)</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let us know why you're cancelling..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
