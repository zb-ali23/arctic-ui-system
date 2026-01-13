import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Search, 
  RefreshCw,
  DollarSign,
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  Download,
  Plus,
  Loader2
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  processed_at: string | null;
  customers: { first_name: string; last_name: string } | null;
  bookings: { booking_number: string } | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  subtotal: number;
  tax_amount: number | null;
  discount_amount: number | null;
  total_amount: number;
  amount_paid: number | null;
  issue_date: string | null;
  due_date: string | null;
  created_at: string;
  customers: { first_name: string; last_name: string } | null;
  bookings: { booking_number: string } | null;
}

interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  final_price: number | null;
  estimated_price: number | null;
  customers: { first_name: string; last_name: string } | null;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // New payment dialog
  const [newPaymentDialogOpen, setNewPaymentDialogOpen] = useState(false);
  const [newPaymentLoading, setNewPaymentLoading] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState({
    booking_id: '',
    amount: 0,
    payment_method: 'cash',
    notes: '',
  });
  
  // New invoice dialog
  const [newInvoiceDialogOpen, setNewInvoiceDialogOpen] = useState(false);
  const [newInvoiceLoading, setNewInvoiceLoading] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    booking_id: '',
    subtotal: 0,
    tax_rate: 0,
    discount: 0,
    notes: '',
    due_days: 30,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
    fetchBookings();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          status,
          payment_method,
          transaction_id,
          created_at,
          processed_at,
          customers (first_name, last_name),
          bookings (booking_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments((data || []) as Payment[]);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({ title: 'Error', description: 'Failed to fetch payments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          status,
          subtotal,
          tax_amount,
          discount_amount,
          total_amount,
          amount_paid,
          issue_date,
          due_date,
          created_at,
          customers (first_name, last_name),
          bookings (booking_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as Invoice[]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_number,
          customer_id,
          final_price,
          estimated_price,
          customers (first_name, last_name)
        `)
        .in('status', ['completed', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBookings((data || []) as Booking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCreatePayment = async () => {
    if (!newPaymentForm.booking_id || newPaymentForm.amount <= 0) {
      toast({ title: 'Error', description: 'Please select a booking and enter an amount', variant: 'destructive' });
      return;
    }

    setNewPaymentLoading(true);
    try {
      const selectedBooking = bookings.find(b => b.id === newPaymentForm.booking_id);
      if (!selectedBooking) throw new Error('Booking not found');

      // First create or get an invoice for this booking
      let invoiceId: string;
      const { data: existingInvoice } = await supabase
        .from('invoices')
        .select('id')
        .eq('booking_id', newPaymentForm.booking_id)
        .single();

      if (existingInvoice) {
        invoiceId = existingInvoice.id;
      } else {
        // Create a simple invoice
        const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            invoice_number: invoiceNumber,
            booking_id: newPaymentForm.booking_id,
            customer_id: selectedBooking.customer_id,
            subtotal: newPaymentForm.amount,
            total_amount: newPaymentForm.amount,
            status: 'paid',
            issue_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;
        invoiceId = newInvoice.id;
      }

      // Create the payment
      const { error } = await supabase
        .from('payments')
        .insert({
          booking_id: newPaymentForm.booking_id,
          customer_id: selectedBooking.customer_id,
          invoice_id: invoiceId,
          amount: newPaymentForm.amount,
          payment_method: newPaymentForm.payment_method,
          status: 'paid',
          processed_at: new Date().toISOString(),
          notes: newPaymentForm.notes || null,
        });

      if (error) throw error;

      toast({ title: 'Success', description: 'Payment recorded successfully' });
      setNewPaymentDialogOpen(false);
      setNewPaymentForm({ booking_id: '', amount: 0, payment_method: 'cash', notes: '' });
      fetchPayments();
      fetchInvoices();
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({ title: 'Error', description: error.message || 'Failed to create payment', variant: 'destructive' });
    } finally {
      setNewPaymentLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoiceForm.booking_id || newInvoiceForm.subtotal <= 0) {
      toast({ title: 'Error', description: 'Please select a booking and enter a subtotal', variant: 'destructive' });
      return;
    }

    setNewInvoiceLoading(true);
    try {
      const selectedBooking = bookings.find(b => b.id === newInvoiceForm.booking_id);
      if (!selectedBooking) throw new Error('Booking not found');

      const taxAmount = (newInvoiceForm.subtotal * newInvoiceForm.tax_rate) / 100;
      const totalAmount = newInvoiceForm.subtotal + taxAmount - newInvoiceForm.discount;
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + newInvoiceForm.due_days);

      const { error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          booking_id: newInvoiceForm.booking_id,
          customer_id: selectedBooking.customer_id,
          subtotal: newInvoiceForm.subtotal,
          tax_amount: taxAmount,
          discount_amount: newInvoiceForm.discount,
          total_amount: totalAmount,
          status: 'pending',
          issue_date: new Date().toISOString(),
          due_date: dueDate.toISOString(),
          notes: newInvoiceForm.notes || null,
        });

      if (error) throw error;

      toast({ title: 'Success', description: `Invoice ${invoiceNumber} created successfully` });
      setNewInvoiceDialogOpen(false);
      setNewInvoiceForm({ booking_id: '', subtotal: 0, tax_rate: 0, discount: 0, notes: '', due_days: 30 });
      fetchInvoices();
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({ title: 'Error', description: error.message || 'Failed to create invoice', variant: 'destructive' });
    } finally {
      setNewInvoiceLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedPayment) return;
    
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'paid',
          payment_method: paymentMethod,
          processed_at: new Date().toISOString(),
        })
        .eq('id', selectedPayment.id);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Payment marked as paid' });
      setMarkPaidDialogOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({ title: 'Error', description: 'Failed to update payment', variant: 'destructive' });
    }
  };

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'paid')
      .reduce((acc, p) => acc + p.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((acc, p) => acc + p.amount, 0);
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      payment.bookings?.booking_number.toLowerCase().includes(query) ||
      payment.customers?.first_name.toLowerCase().includes(query) ||
      payment.customers?.last_name.toLowerCase().includes(query)
    );
  });

  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== 'all' && invoice.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoice_number.toLowerCase().includes(query) ||
      invoice.bookings?.booking_number.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments & Invoices</h1>
          <p className="text-muted-foreground">Track payments and manage invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNewInvoiceDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          <Button onClick={() => setNewPaymentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${getTotalRevenue().toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">${getPendingAmount().toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payments</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invoices</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPayments}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Payments Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.bookings?.booking_number || '-'}
                      </TableCell>
                      <TableCell>
                        {payment.customers?.first_name} {payment.customers?.last_name}
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount}</TableCell>
                      <TableCell className="capitalize">{payment.payment_method || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>{format(new Date(payment.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setMarkPaidDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {/* Invoices Table */}
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>
                        {invoice.customers?.first_name} {invoice.customers?.last_name}
                      </TableCell>
                      <TableCell>{invoice.bookings?.booking_number || '-'}</TableCell>
                      <TableCell className="font-medium">${invoice.total_amount}</TableCell>
                      <TableCell>${invoice.amount_paid || 0}</TableCell>
                      <TableCell>
                        <StatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell>
                        {invoice.due_date 
                          ? format(new Date(invoice.due_date), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mark Paid Dialog */}
      <Dialog open={markPaidDialogOpen} onOpenChange={setMarkPaidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Payment as Paid</DialogTitle>
            <DialogDescription>
              Confirm payment of ${selectedPayment?.amount} for booking {selectedPayment?.bookings?.booking_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkPaidDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleMarkPaid}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Payment Dialog */}
      <Dialog open={newPaymentDialogOpen} onOpenChange={setNewPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record a payment for a completed or in-progress booking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Booking *</Label>
              <Select
                value={newPaymentForm.booking_id}
                onValueChange={(value) => {
                  const booking = bookings.find(b => b.id === value);
                  setNewPaymentForm({ 
                    ...newPaymentForm, 
                    booking_id: value,
                    amount: booking?.final_price || booking?.estimated_price || 0
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.length === 0 ? (
                    <SelectItem value="_empty" disabled>No bookings available</SelectItem>
                  ) : (
                    bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        {booking.booking_number} - {booking.customers?.first_name} {booking.customers?.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount ($) *</Label>
              <Input
                type="number"
                step="0.01"
                value={newPaymentForm.amount}
                onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amount: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={newPaymentForm.payment_method}
                onValueChange={(value) => setNewPaymentForm({ ...newPaymentForm, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={newPaymentForm.notes}
                onChange={(e) => setNewPaymentForm({ ...newPaymentForm, notes: e.target.value })}
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePayment} disabled={newPaymentLoading}>
              {newPaymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Invoice Dialog */}
      <Dialog open={newInvoiceDialogOpen} onOpenChange={setNewInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Create a new invoice for a booking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Booking *</Label>
              <Select
                value={newInvoiceForm.booking_id}
                onValueChange={(value) => {
                  const booking = bookings.find(b => b.id === value);
                  setNewInvoiceForm({ 
                    ...newInvoiceForm, 
                    booking_id: value,
                    subtotal: booking?.final_price || booking?.estimated_price || 0
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.length === 0 ? (
                    <SelectItem value="_empty" disabled>No bookings available</SelectItem>
                  ) : (
                    bookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id}>
                        {booking.booking_number} - {booking.customers?.first_name} {booking.customers?.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Subtotal ($) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newInvoiceForm.subtotal}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, subtotal: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newInvoiceForm.tax_rate}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, tax_rate: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Discount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newInvoiceForm.discount}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, discount: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Due in (days)</Label>
                <Input
                  type="number"
                  value={newInvoiceForm.due_days}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, due_days: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={newInvoiceForm.notes}
                onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, notes: e.target.value })}
                placeholder="Invoice notes..."
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${newInvoiceForm.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({newInvoiceForm.tax_rate}%):</span>
                <span>${((newInvoiceForm.subtotal * newInvoiceForm.tax_rate) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-${newInvoiceForm.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>
                  ${(newInvoiceForm.subtotal + (newInvoiceForm.subtotal * newInvoiceForm.tax_rate / 100) - newInvoiceForm.discount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewInvoiceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateInvoice} disabled={newInvoiceLoading}>
              {newInvoiceLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
