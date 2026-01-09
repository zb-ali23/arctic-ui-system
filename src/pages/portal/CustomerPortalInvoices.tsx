import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import {
  FileText,
  RefreshCw,
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  amount_paid: number | null;
  issue_date: string | null;
  due_date: string | null;
  bookings: { booking_number: string; services: { name: string } | null } | null;
}

export default function CustomerPortalInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
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
        .from('invoices')
        .select(`
          id,
          invoice_number,
          status,
          total_amount,
          amount_paid,
          issue_date,
          due_date,
          bookings (booking_number, services (name))
        `)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices((data || []) as Invoice[]);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingInvoices = invoices.filter(i => i.status === 'pending');
  const paidInvoices = invoices.filter(i => i.status === 'paid');
  const totalPending = pendingInvoices.reduce((acc, i) => acc + i.total_amount - (i.amount_paid || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Invoices</h1>
        <p className="text-muted-foreground">View and pay your service invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pendingInvoices.length} invoice(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidInvoices.length}</div>
            <p className="text-xs text-muted-foreground">Invoices paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices Alert */}
      {pendingInvoices.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
          <CardContent className="flex items-center gap-4 pt-6">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
            <div className="flex-1">
              <h3 className="font-semibold">You have pending invoices</h3>
              <p className="text-sm text-muted-foreground">
                Total amount due: ${totalPending.toLocaleString()}
              </p>
            </div>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>Your billing history</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchInvoices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Loading...
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No Invoices</h3>
              <p className="text-sm text-muted-foreground">
                Your invoices will appear here after services
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      <div>
                        <p>{invoice.bookings?.services?.name || '-'}</p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.bookings?.booking_number}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.issue_date 
                        ? format(new Date(invoice.issue_date), 'MMM d, yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {invoice.due_date 
                        ? format(new Date(invoice.due_date), 'MMM d, yyyy')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="font-medium">${invoice.total_amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={invoice.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === 'pending' && (
                          <Button size="sm">Pay</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
