import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createReviewSchema: ValidationSchema = {
  booking_id: { required: true, type: 'uuid' },
  rating: { required: true, type: 'number', min: 1, max: 5 },
};

serve(async (req: Request) => {
  const logger = createLogger('reviews', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/reviews', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // Public endpoints
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listPublicReviews(req, logger);
    }

    if (method === 'POST' && (path === '' || path === '/')) {
      return await createReview(req, logger);
    }

    // Protected endpoints
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Admin routes
    if (method === 'GET' && path === '/all') {
      return await listAllReviews(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getReview(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await updateReview(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/approve$/)) {
      const id = path.replace('/approve', '').slice(1);
      return await approveReview(id, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/hide$/)) {
      const id = path.replace('/hide', '').slice(1);
      return await hideReview(id, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/respond$/)) {
      const id = path.replace('/respond', '').slice(1);
      return await respondToReview(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/feature$/)) {
      const id = path.replace('/feature', '').slice(1);
      return await featureReview(id, auth, logger);
    }

    // Technician rating
    if (method === 'GET' && path.match(/^\/technician\/[0-9a-f-]+$/)) {
      const technicianId = path.replace('/technician/', '');
      return await getTechnicianRating(technicianId, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List public reviews
async function listPublicReviews(req: Request, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
  const featured = url.searchParams.get('featured');
  const minRating = url.searchParams.get('min_rating');

  const offset = (page - 1) * limit;

  const serviceClient = createServiceClient();

  let query = serviceClient
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      created_at,
      customers (first_name, last_name),
      bookings (
        services (name)
      )
    `, { count: 'exact' })
    .eq('is_public', true);

  if (featured === 'true') query = query.eq('is_featured', true);
  if (minRating) query = query.gte('rating', parseInt(minRating));

  const { data: reviews, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list reviews', error as unknown as Error);
    return errorResponse('Failed to fetch reviews', 500);
  }

  // Get average rating
  const { data: avgData } = await serviceClient
    .from('reviews')
    .select('rating')
    .eq('is_public', true);

  const averageRating = avgData && avgData.length > 0
    ? avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
    : 0;

  return jsonResponse({
    reviews,
    averageRating: averageRating.toFixed(1),
    totalReviews: count || 0,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Create review (public - linked to booking)
async function createReview(req: Request, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  const errors = validate(body, createReviewSchema);
  if (errors) return validationErrorResponse(errors);

  const serviceClient = createServiceClient();

  // Verify booking exists and is completed
  const { data: booking } = await serviceClient
    .from('bookings')
    .select('id, customer_id, technician_id, status')
    .eq('id', body.booking_id)
    .single();

  if (!booking) {
    return notFoundResponse('Booking');
  }

  if (booking.status !== 'completed') {
    return errorResponse('Can only review completed bookings', 400);
  }

  // Check if review already exists
  const { data: existingReview } = await serviceClient
    .from('reviews')
    .select('id')
    .eq('booking_id', body.booking_id)
    .single();

  if (existingReview) {
    return errorResponse('Review already exists for this booking', 400);
  }

  // Create review
  const { data: review, error } = await serviceClient
    .from('reviews')
    .insert({
      booking_id: body.booking_id,
      customer_id: booking.customer_id,
      technician_id: booking.technician_id,
      rating: body.rating,
      title: body.title,
      content: body.content,
      service_quality: body.service_quality,
      punctuality: body.punctuality,
      professionalism: body.professionalism,
      value_for_money: body.value_for_money,
      is_public: true,
      is_verified: true,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create review', error as unknown as Error);
    return errorResponse('Failed to create review', 500);
  }

  // Update booking with review info
  await serviceClient
    .from('bookings')
    .update({
      rating: body.rating,
      review: body.content,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', body.booking_id);

  // Update technician rating
  if (booking.technician_id) {
    await updateTechnicianRating(booking.technician_id, serviceClient);
  }

  logger.info('Review created', { reviewId: review.id, bookingId: body.booking_id });
  return jsonResponse({ review }, 201);
}

// List all reviews (admin only)
async function listAllReviews(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const isPublic = url.searchParams.get('is_public');
  const technicianId = url.searchParams.get('technician_id');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('reviews')
    .select(`
      *,
      customers (id, first_name, last_name, email),
      technicians (
        id,
        profiles:user_id (first_name, last_name)
      ),
      bookings (id, booking_number, services (name))
    `, { count: 'exact' });

  if (isPublic !== null) query = query.eq('is_public', isPublic === 'true');
  if (technicianId) query = query.eq('technician_id', technicianId);

  const { data: reviews, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list reviews', error as unknown as Error);
    return errorResponse('Failed to fetch reviews', 500);
  }

  return jsonResponse({
    reviews,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Get single review
async function getReview(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: review, error } = await auth.supabase
    .from('reviews')
    .select(`
      *,
      customers (*),
      technicians (
        *,
        profiles:user_id (*)
      ),
      bookings (*, services (*))
    `)
    .eq('id', id)
    .single();

  if (error || !review) {
    return notFoundResponse('Review');
  }

  return jsonResponse({ review });
}

// Update review (admin only)
async function updateReview(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: review, error } = await auth.supabase
    .from('reviews')
    .update({
      title: body.title,
      content: body.content,
      is_public: body.is_public,
      is_featured: body.is_featured,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update review', error as unknown as Error);
    return errorResponse('Failed to update review', 500);
  }

  logger.info('Review updated', { reviewId: id });
  return jsonResponse({ review });
}

// Approve review
async function approveReview(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: review, error } = await auth.supabase
    .from('reviews')
    .update({ is_public: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to approve review', error as unknown as Error);
    return errorResponse('Failed to approve review', 500);
  }

  logger.info('Review approved', { reviewId: id });
  return jsonResponse({ review });
}

// Hide review
async function hideReview(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: review, error } = await auth.supabase
    .from('reviews')
    .update({ is_public: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to hide review', error as unknown as Error);
    return errorResponse('Failed to hide review', 500);
  }

  logger.info('Review hidden', { reviewId: id });
  return jsonResponse({ review });
}

// Respond to review
async function respondToReview(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  if (!body.response) {
    return validationErrorResponse({ response: 'response is required' });
  }

  const { data: review, error } = await auth.supabase
    .from('reviews')
    .update({
      admin_response: body.response,
      admin_responded_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to respond to review', error as unknown as Error);
    return errorResponse('Failed to respond to review', 500);
  }

  logger.info('Review response added', { reviewId: id });
  return jsonResponse({ review });
}

// Feature review
async function featureReview(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: review } = await auth.supabase
    .from('reviews')
    .select('is_featured')
    .eq('id', id)
    .single();

  if (!review) {
    return notFoundResponse('Review');
  }

  const { data: updated, error } = await auth.supabase
    .from('reviews')
    .update({ is_featured: !review.is_featured })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to feature review', error as unknown as Error);
    return errorResponse('Failed to feature review', 500);
  }

  logger.info('Review featured status toggled', { reviewId: id, featured: updated.is_featured });
  return jsonResponse({ review: updated });
}

// Get technician rating
async function getTechnicianRating(technicianId: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const { data: reviews, error } = await auth.supabase
    .from('reviews')
    .select('rating, service_quality, punctuality, professionalism, value_for_money')
    .eq('technician_id', technicianId)
    .eq('is_public', true);

  if (error) {
    logger.error('Failed to fetch technician rating', error as unknown as Error);
    return errorResponse('Failed to fetch rating', 500);
  }

  if (!reviews || reviews.length === 0) {
    return jsonResponse({
      technicianId,
      averageRating: 0,
      totalReviews: 0,
      breakdown: {},
    });
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  const breakdown = {
    serviceQuality: average(reviews.map(r => r.service_quality)),
    punctuality: average(reviews.map(r => r.punctuality)),
    professionalism: average(reviews.map(r => r.professionalism)),
    valueForMoney: average(reviews.map(r => r.value_for_money)),
  };

  return jsonResponse({
    technicianId,
    averageRating: avgRating.toFixed(1),
    totalReviews: reviews.length,
    breakdown,
  });
}

// Helper: Calculate average
function average(values: (number | null)[]): number {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return 0;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

// Helper: Update technician rating
// deno-lint-ignore no-explicit-any
async function updateTechnicianRating(technicianId: string, supabase: any) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('technician_id', technicianId);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length;
    
    await supabase
      .from('technicians')
      .update({ rating: avgRating })
      .eq('id', technicianId);
  }
}
