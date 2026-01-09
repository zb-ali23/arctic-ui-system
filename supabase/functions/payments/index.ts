import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createPaymentSchema: ValidationSchema = {
  invoice_id: { required: true, type: 'uuid' },
  amount: { required: true, type: 'number', min: 0 },
  payment_method: { required: true, type: 'string' },
};

const createInvoiceSchema: ValidationSchema = {
  booking_id: { required: true, type: 'uuid' },
  customer_id: { required: true, type: 'uuid' },
  subtotal: { required: true, type: 'number', min: 0 },
  total_amount: { required: true, type: 'number', min: 0 },
};

serve(async (req: Request) => {
  const logger = createLogger('payments', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/payments', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // All endpoints require authentication
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Payment routes
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listPayments(req, auth, logger);
    }

    if (method === 'POST' && (path === '' || path === '/')) {
      return await createPayment(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getPayment(id, auth, logger);
    }

    // Invoice routes
    if (method === 'GET' && path === '/invoices') {
      return await listInvoices(req, auth, logger);
    }

    if (method === 'POST' && path === '/invoices') {
      return await createInvoice(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/invoices\/[0-9a-f-]+$/)) {
      const id = path.replace('/invoices/', '');
      return await getInvoice(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/invoices\/[0-9a-f-]+$/)) {
      const id = path.replace('/invoices/', '');
      return await updateInvoice(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/invoices\/[0-9a-f-]+\/send$/)) {
      const id = path.replace('/invoices/', '').replace('/send', '');
      return await sendInvoice(id, auth, logger);
    }

    // Pending payments
    if (method === 'GET' && path === '/pending') {
      return await getPendingPayments(auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List payments (admin only)
async function listPayments(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const status = url.searchParams.get('status');
  const customerId = url.searchParams.get('customer_id');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('payments')
    .select(`
      *,
      customers (id, first_name, last_name, email),
      invoices (id, invoice_number),
      bookings (id, booking_number)
    `, { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (customerId) query = query.eq('customer_id', customerId);

  const { data: payments, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list payments', error as unknown as Error);
    return errorResponse('Failed to fetch payments', 500);
  }

  return jsonResponse({
    payments,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Create payment (admin only)
async function createPayment(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createPaymentSchema);
  if (errors) return validationErrorResponse(errors);

  // Get invoice details
  const { data: invoice } = await auth.supabase
    .from('invoices')
    .select('customer_id, booking_id, total_amount, amount_paid')
    .eq('id', body.invoice_id)
    .single();

  if (!invoice) {
    return notFoundResponse('Invoice');
  }

  // Create payment
  const { data: payment, error } = await auth.supabase
    .from('payments')
    .insert({
      invoice_id: body.invoice_id,
      customer_id: invoice.customer_id,
      booking_id: invoice.booking_id,
      amount: body.amount,
      payment_method: body.payment_method,
      status: 'completed',
      processed_at: new Date().toISOString(),
      transaction_id: body.transaction_id,
      stripe_payment_id: body.stripe_payment_id,
      notes: body.notes,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create payment', error as unknown as Error);
    return errorResponse('Failed to create payment', 500);
  }

  // Update invoice amount_paid and status
  const newAmountPaid = (invoice.amount_paid || 0) + body.amount;
  const newStatus = newAmountPaid >= invoice.total_amount ? 'paid' : 'partial';

  await auth.supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      status: newStatus,
      paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('id', body.invoice_id);

  logger.info('Payment created', { paymentId: payment.id, invoiceId: body.invoice_id });
  return jsonResponse({ payment }, 201);
}

// Get single payment
async function getPayment(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: payment, error } = await auth.supabase
    .from('payments')
    .select(`
      *,
      customers (*),
      invoices (*),
      bookings (id, booking_number, services (name))
    `)
    .eq('id', id)
    .single();

  if (error || !payment) {
    return notFoundResponse('Payment');
  }

  return jsonResponse({ payment });
}

// List invoices (admin only)
async function listInvoices(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const status = url.searchParams.get('status');
  const customerId = url.searchParams.get('customer_id');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('invoices')
    .select(`
      *,
      customers (id, first_name, last_name, email),
      bookings (id, booking_number)
    `, { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (customerId) query = query.eq('customer_id', customerId);

  const { data: invoices, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list invoices', error as unknown as Error);
    return errorResponse('Failed to fetch invoices', 500);
  }

  return jsonResponse({
    invoices,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Create invoice (admin only)
async function createInvoice(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createInvoiceSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: invoice, error } = await auth.supabase
    .from('invoices')
    .insert({
      booking_id: body.booking_id,
      customer_id: body.customer_id,
      subtotal: body.subtotal,
      tax_amount: body.tax_amount || 0,
      discount_amount: body.discount_amount || 0,
      total_amount: body.total_amount,
      line_items: body.line_items || [],
      issue_date: body.issue_date || new Date().toISOString().split('T')[0],
      due_date: body.due_date,
      terms: body.terms,
      notes: body.notes,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create invoice', error as unknown as Error);
    return errorResponse('Failed to create invoice', 500);
  }

  logger.info('Invoice created', { invoiceId: invoice.id, invoiceNumber: invoice.invoice_number });
  return jsonResponse({ invoice }, 201);
}

// Get single invoice
async function getInvoice(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: invoice, error } = await auth.supabase
    .from('invoices')
    .select(`
      *,
      customers (*),
      bookings (
        id,
        booking_number,
        services (name, base_price),
        customer_addresses (*)
      ),
      payments (*)
    `)
    .eq('id', id)
    .single();

  if (error || !invoice) {
    return notFoundResponse('Invoice');
  }

  return jsonResponse({ invoice });
}

// Update invoice (admin only)
async function updateInvoice(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: invoice, error } = await auth.supabase
    .from('invoices')
    .update({
      subtotal: body.subtotal,
      tax_amount: body.tax_amount,
      discount_amount: body.discount_amount,
      total_amount: body.total_amount,
      line_items: body.line_items,
      due_date: body.due_date,
      terms: body.terms,
      notes: body.notes,
      status: body.status,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update invoice', error as unknown as Error);
    return errorResponse('Failed to update invoice', 500);
  }

  logger.info('Invoice updated', { invoiceId: id });
  return jsonResponse({ invoice });
}

// Send invoice (placeholder - would integrate with email service)
async function sendInvoice(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: invoice } = await auth.supabase
    .from('invoices')
    .select(`
      *,
      customers (email, first_name)
    `)
    .eq('id', id)
    .single();

  if (!invoice) {
    return notFoundResponse('Invoice');
  }

  // TODO: Integrate with email service (Resend, SendGrid, etc.)
  logger.info('Invoice send requested', { invoiceId: id, customerEmail: invoice.customers?.email });

  return jsonResponse({ 
    success: true, 
    message: 'Invoice sending initiated',
    invoiceNumber: invoice.invoice_number,
  });
}

// Get pending payments summary
async function getPendingPayments(auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: pendingInvoices, error } = await auth.supabase
    .from('invoices')
    .select(`
      id,
      invoice_number,
      total_amount,
      amount_paid,
      due_date,
      customers (id, first_name, last_name, email)
    `)
    .in('status', ['pending', 'partial'])
    .order('due_date', { ascending: true });

  if (error) {
    logger.error('Failed to fetch pending payments', error as unknown as Error);
    return errorResponse('Failed to fetch pending payments', 500);
  }

  const totalPending = pendingInvoices?.reduce((sum, inv) => 
    sum + (inv.total_amount - (inv.amount_paid || 0)), 0
  ) || 0;

  const overdue = pendingInvoices?.filter(inv => 
    inv.due_date && new Date(inv.due_date) < new Date()
  ) || [];

  return jsonResponse({
    pendingInvoices,
    summary: {
      totalPending,
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, inv) => 
        sum + (inv.total_amount - (inv.amount_paid || 0)), 0
      ),
    },
  });
}
