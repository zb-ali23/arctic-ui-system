import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Notification types
type NotificationType = 'booking_confirmation' | 'booking_reminder' | 'status_update' | 'technician_assigned' | 'job_completed' | 'review_request' | 'admin_alert';
type NotificationChannel = 'email' | 'sms' | 'push';

// Validation schemas
const sendNotificationSchema: ValidationSchema = {
  type: { required: true, type: 'string' },
  channel: { required: true, type: 'string' },
  content: { required: true, type: 'string' },
};

serve(async (req: Request) => {
  const logger = createLogger('notifications', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/notifications', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // All endpoints require authentication
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // List user notifications
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listUserNotifications(req, auth, logger);
    }

    // Send notification (admin only)
    if (method === 'POST' && (path === '' || path === '/')) {
      return await sendNotification(req, auth, logger);
    }

    // Booking notifications
    if (method === 'POST' && path === '/booking-confirmation') {
      return await sendBookingConfirmation(req, auth, logger);
    }

    if (method === 'POST' && path === '/status-update') {
      return await sendStatusUpdate(req, auth, logger);
    }

    if (method === 'POST' && path === '/technician-assigned') {
      return await sendTechnicianAssigned(req, auth, logger);
    }

    if (method === 'POST' && path === '/review-request') {
      return await sendReviewRequest(req, auth, logger);
    }

    // Admin alerts
    if (method === 'POST' && path === '/admin-alert') {
      return await sendAdminAlert(req, auth, logger);
    }

    // Get all notifications (admin only)
    if (method === 'GET' && path === '/all') {
      return await listAllNotifications(req, auth, logger);
    }

    // Retry failed notification
    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/retry$/)) {
      const id = path.replace('/retry', '').slice(1);
      return await retryNotification(id, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List user's notifications
async function listUserNotifications(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

  const offset = (page - 1) * limit;

  const { data: notifications, error, count } = await auth.supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list notifications', error as unknown as Error);
    return errorResponse('Failed to fetch notifications', 500);
  }

  return jsonResponse({
    notifications,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Send custom notification (admin only)
async function sendNotification(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, sendNotificationSchema);
  if (errors) return validationErrorResponse(errors);

  const notification = await createNotification({
    type: body.type,
    channel: body.channel,
    userId: body.user_id,
    customerId: body.customer_id,
    bookingId: body.booking_id,
    subject: body.subject,
    content: body.content,
    metadata: body.metadata,
  }, auth);

  if (!notification) {
    return errorResponse('Failed to send notification', 500);
  }

  logger.info('Notification sent', { notificationId: notification.id });
  return jsonResponse({ notification }, 201);
}

// Send booking confirmation
async function sendBookingConfirmation(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  if (!body.booking_id) {
    return validationErrorResponse({ booking_id: 'booking_id is required' });
  }

  const serviceClient = createServiceClient();

  // Get booking details
  const { data: booking } = await serviceClient
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, email, phone),
      services (name),
      customer_addresses (street, city, state, zip)
    `)
    .eq('id', body.booking_id)
    .single();

  if (!booking) {
    return notFoundResponse('Booking');
  }

  const content = generateBookingConfirmationContent(booking);

  const notification = await createNotification({
    type: 'booking_confirmation',
    channel: body.channel || 'email',
    customerId: booking.customer_id,
    bookingId: booking.id,
    subject: `Booking Confirmed - ${booking.booking_number}`,
    content,
    metadata: { booking_number: booking.booking_number },
  }, auth);

  logger.info('Booking confirmation sent', { bookingId: body.booking_id });
  return jsonResponse({ notification }, 201);
}

// Send status update
async function sendStatusUpdate(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  if (!body.booking_id || !body.status) {
    const errors: Record<string, string> = {};
    if (!body.booking_id) errors.booking_id = 'booking_id is required';
    if (!body.status) errors.status = 'status is required';
    return validationErrorResponse(errors);
  }

  const serviceClient = createServiceClient();

  // Get booking details
  const { data: booking } = await serviceClient
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, email)
    `)
    .eq('id', body.booking_id)
    .single();

  if (!booking) {
    return notFoundResponse('Booking');
  }

  const statusMessages: Record<string, string> = {
    confirmed: 'Your booking has been confirmed.',
    assigned: 'A technician has been assigned to your booking.',
    en_route: 'Your technician is on the way!',
    in_progress: 'Service has started.',
    completed: 'Your service has been completed. Thank you!',
    cancelled: 'Your booking has been cancelled.',
  };

  const content = `Hi ${booking.customers?.first_name},\n\n${statusMessages[body.status] || `Your booking status has been updated to: ${body.status}`}\n\nBooking: ${booking.booking_number}`;

  const notification = await createNotification({
    type: 'status_update',
    channel: body.channel || 'email',
    customerId: booking.customer_id,
    bookingId: booking.id,
    subject: `Booking Update - ${booking.booking_number}`,
    content,
    metadata: { status: body.status, booking_number: booking.booking_number },
  }, auth);

  logger.info('Status update sent', { bookingId: body.booking_id, status: body.status });
  return jsonResponse({ notification }, 201);
}

// Send technician assigned notification
async function sendTechnicianAssigned(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  if (!body.booking_id) {
    return validationErrorResponse({ booking_id: 'booking_id is required' });
  }

  const serviceClient = createServiceClient();

  // Get booking with technician details
  const { data: booking } = await serviceClient
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, email),
      technicians (
        profiles:user_id (first_name, last_name)
      )
    `)
    .eq('id', body.booking_id)
    .single();

  if (!booking) {
    return notFoundResponse('Booking');
  }

  // deno-lint-ignore no-explicit-any
  const techName = (booking.technicians as any)?.profiles?.first_name || 'Our technician';

  const content = `Hi ${booking.customers?.first_name},\n\n${techName} has been assigned to your booking.\n\nBooking: ${booking.booking_number}\nDate: ${booking.scheduled_date}\nTime: ${booking.time_slot_label || 'TBD'}`;

  const notification = await createNotification({
    type: 'technician_assigned',
    channel: body.channel || 'email',
    customerId: booking.customer_id,
    bookingId: booking.id,
    subject: `Technician Assigned - ${booking.booking_number}`,
    content,
    metadata: { booking_number: booking.booking_number },
  }, auth);

  logger.info('Technician assigned notification sent', { bookingId: body.booking_id });
  return jsonResponse({ notification }, 201);
}

// Send review request
async function sendReviewRequest(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  if (!body.booking_id) {
    return validationErrorResponse({ booking_id: 'booking_id is required' });
  }

  const serviceClient = createServiceClient();

  // Get booking details
  const { data: booking } = await serviceClient
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, email),
      services (name)
    `)
    .eq('id', body.booking_id)
    .single();

  if (!booking) {
    return notFoundResponse('Booking');
  }

  const content = `Hi ${booking.customers?.first_name},\n\nThank you for choosing us for your ${booking.services?.name || 'service'}!\n\nWe'd love to hear about your experience. Please take a moment to leave a review.\n\nBooking: ${booking.booking_number}`;

  const notification = await createNotification({
    type: 'review_request',
    channel: body.channel || 'email',
    customerId: booking.customer_id,
    bookingId: booking.id,
    subject: `How was your experience? - ${booking.booking_number}`,
    content,
    metadata: { booking_number: booking.booking_number },
  }, auth);

  logger.info('Review request sent', { bookingId: body.booking_id });
  return jsonResponse({ notification }, 201);
}

// Send admin alert
async function sendAdminAlert(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  if (!body.subject || !body.content) {
    const errors: Record<string, string> = {};
    if (!body.subject) errors.subject = 'subject is required';
    if (!body.content) errors.content = 'content is required';
    return validationErrorResponse(errors);
  }

  const notification = await createNotification({
    type: 'admin_alert',
    channel: 'email',
    userId: auth.userId,
    subject: body.subject,
    content: body.content,
    metadata: body.metadata,
  }, auth);

  logger.info('Admin alert sent');
  return jsonResponse({ notification }, 201);
}

// List all notifications (admin only)
async function listAllNotifications(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('notifications')
    .select(`
      *,
      customers (id, first_name, last_name, email)
    `, { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);

  const { data: notifications, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list notifications', error as unknown as Error);
    return errorResponse('Failed to fetch notifications', 500);
  }

  return jsonResponse({
    notifications,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Retry failed notification
async function retryNotification(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: notification, error } = await auth.supabase
    .from('notifications')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !notification) {
    return notFoundResponse('Notification');
  }

  // Reset status and retry
  const { data: updated, error: updateError } = await auth.supabase
    .from('notifications')
    .update({
      status: 'pending',
      error_message: null,
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    logger.error('Failed to retry notification', updateError as unknown as Error);
    return errorResponse('Failed to retry notification', 500);
  }

  // TODO: Actually resend the notification via email/SMS service

  logger.info('Notification retry initiated', { notificationId: id });
  return jsonResponse({ notification: updated });
}

// Helper: Create notification record
async function createNotification(params: {
  type: NotificationType;
  channel: NotificationChannel;
  userId?: string;
  customerId?: string;
  bookingId?: string;
  subject?: string;
  content: string;
  metadata?: Record<string, unknown>;
}, auth: AuthContext) {
  const { data: notification, error } = await auth.supabase
    .from('notifications')
    .insert({
      type: params.type,
      channel: params.channel,
      user_id: params.userId,
      customer_id: params.customerId,
      booking_id: params.bookingId,
      subject: params.subject,
      content: params.content,
      metadata: params.metadata || {},
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create notification:', error);
    return null;
  }

  // TODO: Actually send the notification via email/SMS service
  // For now, mark as sent
  await auth.supabase
    .from('notifications')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('id', notification.id);

  return notification;
}

// Helper: Generate booking confirmation content
// deno-lint-ignore no-explicit-any
function generateBookingConfirmationContent(booking: any): string {
  return `Hi ${booking.customers?.first_name},

Thank you for your booking!

Booking Details:
- Booking Number: ${booking.booking_number}
- Service: ${booking.services?.name || 'N/A'}
- Date: ${booking.scheduled_date}
- Time: ${booking.time_slot_label || 'TBD'}
- Address: ${booking.customer_addresses?.street}, ${booking.customer_addresses?.city}, ${booking.customer_addresses?.state} ${booking.customer_addresses?.zip}

We'll send you updates as your appointment approaches.

Thank you for choosing us!`;
}
