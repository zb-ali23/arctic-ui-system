import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge, PriorityBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter, 
  Calendar,
  RefreshCw,
  Eye,
  UserPlus,
  XCircle,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';

interface Booking {
  id: string;
  booking_number: string;
  status: BookingStatus;
  priority: string;
  scheduled_date: string;
  time_slot_label: string | null;
  created_at: string;
  customer_notes: string | null;
  admin_notes: string | null;
  customers: { id: string; first_name: string; last_name: string; phone: string } | null;
  services: { id: string; name: string } | null;
  technicians: { id: string; user_id: string } | null;
}

interface Technician {
  id: string;
  user_id: string;
  is_available: boolean;
  profiles?: { first_name: string; last_name: string } | null;
}

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [newStatus, setNewStatus] = useState<BookingStatus>('pending');
  const [adminNote, setAdminNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchTechnicians();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let query = supabase
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
          customers (id, first_name, last_name, phone),
          services (id, name),
          technicians (id, user_id)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as BookingStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings((data || []) as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({ title: 'Error', description: 'Failed to fetch bookings', variant: 'destructive' });
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
      setTechnicians((data || []) as Technician[]);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedBooking || !selectedTechnician) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          technician_id: selectedTechnician,
          status: 'assigned',
          assigned_at: new Date().toISOString()
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Technician assigned successfully' });
      setAssignDialogOpen(false);
      setSelectedTechnician('');
      fetchBookings();
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast({ title: 'Error', description: 'Failed to assign technician', variant: 'destructive' });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedBooking) return;
    
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      } else if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Status updated successfully' });
      setStatusDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ admin_notes: adminNote })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Notes saved successfully' });
      setNotesDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({ title: 'Error', description: 'Failed to save notes', variant: 'destructive' });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.booking_number.toLowerCase().includes(query) ||
      booking.customers?.first_name.toLowerCase().includes(query) ||
      booking.customers?.last_name.toLowerCase().includes(query) ||
      booking.services?.name.toLowerCase().includes(query)
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'assigned': return <UserPlus className="h-4 w-4" />;
      case 'en_route': return <Truck className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage all service bookings</p>
        </div>
        <Button asChild>
          <Link to="/admin/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchBookings}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.booking_number}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.customers?.first_name} {booking.customers?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{booking.customers?.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.services?.name}</TableCell>
                  <TableCell>
                    <div>
                      <p>{format(new Date(booking.scheduled_date), 'MMM d, yyyy')}</p>
                      <p className="text-sm text-muted-foreground">{booking.time_slot_label || 'TBD'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={booking.priority as 'low' | 'normal' | 'high' | 'urgent'} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedBooking(booking);
                          setSelectedTechnician(booking.technicians?.id || '');
                          setAssignDialogOpen(true);
                        }}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Technician
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedBooking(booking);
                          setNewStatus(booking.status);
                          setStatusDialogOpen(true);
                        }}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedBooking(booking);
                          setAdminNote(booking.admin_notes || '');
                          setNotesDialogOpen(true);
                        }}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Add Notes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Technician Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Select a technician to assign to booking {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTechnician} disabled={!selectedTechnician}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Change the status for booking {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          <Select value={newStatus} onValueChange={(v) => setNewStatus(v as BookingStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Add internal notes for booking {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Enter notes..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
