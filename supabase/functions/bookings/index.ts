import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createBookingSchema: ValidationSchema = {
  service_id: { required: true, type: 'uuid' },
  scheduled_date: { required: true, type: 'date' },
  first_name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  last_name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'string', minLength: 10 },
  street: { required: true, type: 'string', minLength: 1 },
  city: { required: true, type: 'string', minLength: 1 },
  state: { required: true, type: 'string', minLength: 1 },
  zip: { required: true, type: 'string', minLength: 5 },
};

const updateBookingSchema: ValidationSchema = {
  id: { required: true, type: 'uuid' },
};

serve(async (req: Request) => {
  const logger = createLogger('bookings', req);
  
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/bookings', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // Public endpoints (no auth required)
    if (method === 'POST' && (path === '' || path === '/')) {
      return await createPublicBooking(req, logger);
    }

    if (method === 'GET' && path.startsWith('/track/')) {
      const bookingNumber = path.replace('/track/', '');
      return await trackBooking(bookingNumber, logger);
    }

    // Protected endpoints
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Route handling
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listBookings(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getBooking(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await updateBooking(id, req, auth, logger);
    }

    if (method === 'PATCH' && path.match(/^\/[0-9a-f-]+\/status$/)) {
      const id = path.replace('/status', '').slice(1);
      return await updateBookingStatus(id, req, auth, logger);
    }

    if (method === 'PATCH' && path.match(/^\/[0-9a-f-]+\/assign$/)) {
      const id = path.replace('/assign', '').slice(1);
      return await assignTechnician(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/cancel$/)) {
      const id = path.replace('/cancel', '').slice(1);
      return await cancelBooking(id, req, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// Create booking (public endpoint)
async function createPublicBooking(req: Request, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  const errors = validate(body, createBookingSchema);
  if (errors) return validationErrorResponse(errors);

  const serviceClient = createServiceClient();

  // Get or create customer
  let customerId: string;
  const { data: existingCustomer } = await serviceClient
    .from('customers')
    .select('id')
    .eq('email', body.email)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await serviceClient
      .from('customers')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        source: body.source || 'website',
      })
      .select('id')
      .single();

    if (customerError) {
      logger.error('Failed to create customer', customerError as unknown as Error);
      return errorResponse('Failed to create booking', 500);
    }
    customerId = newCustomer.id;
  }

  // Create address
  const { data: address, error: addressError } = await serviceClient
    .from('customer_addresses')
    .insert({
      customer_id: customerId,
      street: body.street,
      apartment: body.apartment,
      city: body.city,
      state: body.state,
      zip: body.zip,
      special_instructions: body.special_instructions,
    })
    .select('id')
    .single();

  if (addressError) {
    logger.error('Failed to create address', addressError as unknown as Error);
    return errorResponse('Failed to create booking', 500);
  }

  // Get service price
  const { data: service } = await serviceClient
    .from('services')
    .select('base_price')
    .eq('id', body.service_id)
    .single();

  // Create booking
  const { data: booking, error: bookingError } = await serviceClient
    .from('bookings')
    .insert({
      customer_id: customerId,
      service_id: body.service_id,
      address_id: address.id,
      scheduled_date: body.scheduled_date,
      time_slot_id: body.time_slot_id,
      time_slot_label: body.time_slot_label,
      problem_description: body.problem_description,
      selected_issues: body.selected_issues || [],
      customer_notes: body.customer_notes,
      priority: body.priority || 'normal',
      estimated_price: service?.base_price,
      source: body.source || 'website',
      utm_source: body.utm_source,
      utm_campaign: body.utm_campaign,
    })
    .select('*, customers(*), services(*)')
    .single();

  if (bookingError) {
    logger.error('Failed to create booking', bookingError as unknown as Error);
    return errorResponse('Failed to create booking', 500);
  }

  logger.info('Booking created', { bookingId: booking.id, bookingNumber: booking.booking_number });
  
  return jsonResponse({ 
    success: true, 
    booking: {
      id: booking.id,
      booking_number: booking.booking_number,
      status: booking.status,
      scheduled_date: booking.scheduled_date,
    }
  }, 201);
}

// Track booking (public endpoint)
async function trackBooking(bookingNumber: string, logger: ReturnType<typeof createLogger>) {
  const serviceClient = createServiceClient();

  const { data: booking, error } = await serviceClient
    .from('bookings')
    .select(`
      id,
      booking_number,
      status,
      scheduled_date,
      time_slot_label,
      estimated_price,
      created_at,
      confirmed_at,
      assigned_at,
      started_at,
      completed_at,
      services (
        id,
        name,
        short_description
      ),
      technicians (
        id,
        profiles:user_id (
          first_name,
          last_name
        )
      )
    `)
    .eq('booking_number', bookingNumber.toUpperCase())
    .single();

  if (error || !booking) {
    return notFoundResponse('Booking');
  }

  logger.info('Booking tracked', { bookingNumber });

  return jsonResponse({ booking });
}

// Sanitize search input to prevent SQL injection
function sanitizeSearch(input: string): string {
  // Remove special characters that could be used for SQL/PostgREST injection
  // Allow only alphanumeric, spaces, hyphens, and basic punctuation
  return input.replace(/[^a-zA-Z0-9\s\-_.@]/g, '').substring(0, 100);
}

// List bookings (protected)
async function listBookings(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const status = url.searchParams.get('status');
  const technicianId = url.searchParams.get('technician_id');
  const dateFrom = url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('date_to');
  const rawSearch = url.searchParams.get('search');
  const search = rawSearch ? sanitizeSearch(rawSearch) : null;

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, last_name, email, phone),
      services (id, name, slug),
      customer_addresses (id, street, city, state, zip),
      technicians (
        id,
        profiles:user_id (first_name, last_name)
      )
    `, { count: 'exact' });

  // Apply filters
  if (status) query = query.eq('status', status);
  if (technicianId) query = query.eq('technician_id', technicianId);
  if (dateFrom) query = query.gte('scheduled_date', dateFrom);
  if (dateTo) query = query.lte('scheduled_date', dateTo);
  if (search) query = query.ilike('booking_number', `%${search}%`);

  // Technicians can only see their assigned bookings
  if (auth.isTechnician && !auth.isAdmin) {
    query = query.eq('technician_id', auth.technicianId);
  }

  const { data: bookings, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list bookings', error as unknown as Error);
    return errorResponse('Failed to fetch bookings', 500);
  }

  return jsonResponse({
    bookings,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Get single booking (protected)
async function getBooking(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const { data: booking, error } = await auth.supabase
    .from('bookings')
    .select(`
      *,
      customers (*),
      services (*),
      customer_addresses (*),
      technicians (
        *,
        profiles:user_id (*)
      ),
      booking_status_history (
        id,
        status,
        note,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error || !booking) {
    return notFoundResponse('Booking');
  }

  return jsonResponse({ booking });
}

// Update booking (protected - admin only)
async function updateBooking(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: booking, error } = await auth.supabase
    .from('bookings')
    .update({
      scheduled_date: body.scheduled_date,
      time_slot_id: body.time_slot_id,
      time_slot_label: body.time_slot_label,
      priority: body.priority,
      admin_notes: body.admin_notes,
      estimated_price: body.estimated_price,
      final_price: body.final_price,
      discount_amount: body.discount_amount,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update booking', error as unknown as Error);
    return errorResponse('Failed to update booking', 500);
  }

  logger.info('Booking updated', { bookingId: id });
  return jsonResponse({ booking });
}

// Update booking status (protected)
async function updateBookingStatus(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  if (!body.status) {
    return validationErrorResponse({ status: 'status is required' });
  }

  const validStatuses = ['pending', 'confirmed', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(body.status)) {
    return validationErrorResponse({ status: 'Invalid status' });
  }

  const updateData: Record<string, unknown> = { status: body.status };

  // Set timestamp based on status
  switch (body.status) {
    case 'confirmed':
      updateData.confirmed_at = new Date().toISOString();
      break;
    case 'assigned':
      updateData.assigned_at = new Date().toISOString();
      break;
    case 'in_progress':
      updateData.started_at = new Date().toISOString();
      break;
    case 'completed':
      updateData.completed_at = new Date().toISOString();
      break;
    case 'cancelled':
      updateData.cancelled_at = new Date().toISOString();
      updateData.cancellation_reason = body.reason;
      break;
  }

  // Technicians can update status of assigned bookings
  if (body.technician_notes) {
    updateData.technician_notes = body.technician_notes;
  }

  const { data: booking, error } = await auth.supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update booking status', error as unknown as Error);
    return errorResponse('Failed to update status', 500);
  }

  logger.info('Booking status updated', { bookingId: id, status: body.status });
  return jsonResponse({ booking });
}

// Assign technician (protected - admin only)
async function assignTechnician(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  if (!body.technician_id) {
    return validationErrorResponse({ technician_id: 'technician_id is required' });
  }

  const { data: booking, error } = await auth.supabase
    .from('bookings')
    .update({
      technician_id: body.technician_id,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to assign technician', error as unknown as Error);
    return errorResponse('Failed to assign technician', 500);
  }

  logger.info('Technician assigned', { bookingId: id, technicianId: body.technician_id });
  return jsonResponse({ booking });
}

// Cancel booking (protected)
async function cancelBooking(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();

  const { data: booking, error } = await auth.supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: body.reason,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to cancel booking', error as unknown as Error);
    return errorResponse('Failed to cancel booking', 500);
  }

  logger.info('Booking cancelled', { bookingId: id });
  return jsonResponse({ booking });
}
