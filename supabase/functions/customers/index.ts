import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createCustomerSchema: ValidationSchema = {
  first_name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  last_name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'string', minLength: 10 },
};

const updateCustomerSchema: ValidationSchema = {
  first_name: { type: 'string', minLength: 1, maxLength: 100 },
  last_name: { type: 'string', minLength: 1, maxLength: 100 },
  email: { type: 'email' },
  phone: { type: 'string', minLength: 10 },
};

serve(async (req: Request) => {
  const logger = createLogger('customers', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/customers', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // All endpoints require authentication
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Route handling
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listCustomers(req, auth, logger);
    }

    if (method === 'POST' && (path === '' || path === '/')) {
      return await createCustomer(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getCustomer(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await updateCustomer(id, req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+\/bookings$/)) {
      const id = path.replace('/bookings', '').slice(1);
      return await getCustomerBookings(id, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/notes$/)) {
      const id = path.replace('/notes', '').slice(1);
      return await addCustomerNote(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/tags$/)) {
      const id = path.replace('/tags', '').slice(1);
      return await updateCustomerTags(id, req, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List customers (admin only)
async function listCustomers(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const search = url.searchParams.get('search');
  const tag = url.searchParams.get('tag');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('customers')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data: customers, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list customers', error as unknown as Error);
    return errorResponse('Failed to fetch customers', 500);
  }

  return jsonResponse({
    customers,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Create customer (admin only)
async function createCustomer(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createCustomerSchema);
  if (errors) return validationErrorResponse(errors);

  // Check for existing customer with same email
  const { data: existing } = await auth.supabase
    .from('customers')
    .select('id')
    .eq('email', body.email)
    .single();

  if (existing) {
    return validationErrorResponse({ email: 'Customer with this email already exists' });
  }

  const { data: customer, error } = await auth.supabase
    .from('customers')
    .insert({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      notes: body.notes,
      tags: body.tags || [],
      source: body.source || 'admin',
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create customer', error as unknown as Error);
    return errorResponse('Failed to create customer', 500);
  }

  logger.info('Customer created', { customerId: customer.id });
  return jsonResponse({ customer }, 201);
}

// Get single customer (admin only)
async function getCustomer(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: customer, error } = await auth.supabase
    .from('customers')
    .select(`
      *,
      customer_addresses (*)
    `)
    .eq('id', id)
    .single();

  if (error || !customer) {
    return notFoundResponse('Customer');
  }

  return jsonResponse({ customer });
}

// Update customer (admin only)
async function updateCustomer(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, updateCustomerSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: customer, error } = await auth.supabase
    .from('customers')
    .update({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      notes: body.notes,
      tags: body.tags,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update customer', error as unknown as Error);
    return errorResponse('Failed to update customer', 500);
  }

  logger.info('Customer updated', { customerId: id });
  return jsonResponse({ customer });
}

// Get customer bookings (service history)
async function getCustomerBookings(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: bookings, error } = await auth.supabase
    .from('bookings')
    .select(`
      *,
      services (id, name),
      technicians (
        id,
        profiles:user_id (first_name, last_name)
      )
    `)
    .eq('customer_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Failed to fetch customer bookings', error as unknown as Error);
    return errorResponse('Failed to fetch bookings', 500);
  }

  return jsonResponse({ bookings });
}

// Add note to customer
async function addCustomerNote(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  if (!body.note) {
    return validationErrorResponse({ note: 'note is required' });
  }

  // Get current notes
  const { data: customer } = await auth.supabase
    .from('customers')
    .select('notes')
    .eq('id', id)
    .single();

  if (!customer) {
    return notFoundResponse('Customer');
  }

  const timestamp = new Date().toISOString();
  const newNote = `[${timestamp}] ${body.note}`;
  const updatedNotes = customer.notes ? `${customer.notes}\n\n${newNote}` : newNote;

  const { data: updated, error } = await auth.supabase
    .from('customers')
    .update({ notes: updatedNotes })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to add customer note', error as unknown as Error);
    return errorResponse('Failed to add note', 500);
  }

  logger.info('Customer note added', { customerId: id });
  return jsonResponse({ customer: updated });
}

// Update customer tags
async function updateCustomerTags(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  if (!Array.isArray(body.tags)) {
    return validationErrorResponse({ tags: 'tags must be an array' });
  }

  const { data: customer, error } = await auth.supabase
    .from('customers')
    .update({ tags: body.tags })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update customer tags', error as unknown as Error);
    return errorResponse('Failed to update tags', 500);
  }

  logger.info('Customer tags updated', { customerId: id });
  return jsonResponse({ customer });
}
