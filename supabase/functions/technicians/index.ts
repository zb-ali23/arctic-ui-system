import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, requireTechnician, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createTechnicianSchema: ValidationSchema = {
  user_id: { required: true, type: 'uuid' },
  specializations: { type: 'array' },
  hourly_rate: { type: 'number', min: 0 },
};

const updateAvailabilitySchema: ValidationSchema = {
  day_of_week: { required: true, type: 'number', min: 0, max: 6 },
  start_time: { required: true, type: 'string' },
  end_time: { required: true, type: 'string' },
  is_available: { type: 'boolean' },
};

serve(async (req: Request) => {
  const logger = createLogger('technicians', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/technicians', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // All endpoints require authentication
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Route handling
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listTechnicians(req, auth, logger);
    }

    if (method === 'POST' && (path === '' || path === '/')) {
      return await createTechnician(req, auth, logger);
    }

    if (method === 'GET' && path === '/me') {
      return await getMyProfile(auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getTechnician(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await updateTechnician(id, req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+\/jobs$/)) {
      const id = path.replace('/jobs', '').slice(1);
      return await getTechnicianJobs(id, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+\/performance$/)) {
      const id = path.replace('/performance', '').slice(1);
      return await getTechnicianPerformance(id, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+\/availability$/)) {
      const id = path.replace('/availability', '').slice(1);
      return await getTechnicianAvailability(id, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/availability$/)) {
      const id = path.replace('/availability', '').slice(1);
      return await setTechnicianAvailability(id, req, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/[0-9a-f-]+\/location$/)) {
      const id = path.replace('/location', '').slice(1);
      return await updateTechnicianLocation(id, req, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List technicians (admin only)
async function listTechnicians(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const isAvailable = url.searchParams.get('is_available');
  const specialization = url.searchParams.get('specialization');

  const offset = (page - 1) * limit;

  let query = auth.supabase
    .from('technicians')
    .select(`
      *,
      profiles:user_id (first_name, last_name, email, phone, avatar_url)
    `, { count: 'exact' });

  if (isAvailable !== null) {
    query = query.eq('is_available', isAvailable === 'true');
  }

  if (specialization) {
    query = query.contains('specializations', [specialization]);
  }

  const { data: technicians, error, count } = await query
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list technicians', error as unknown as Error);
    return errorResponse('Failed to fetch technicians', 500);
  }

  return jsonResponse({
    technicians,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

// Create technician (admin only)
async function createTechnician(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createTechnicianSchema);
  if (errors) return validationErrorResponse(errors);

  const serviceClient = createServiceClient();

  // Check if user already has technician profile
  const { data: existing } = await serviceClient
    .from('technicians')
    .select('id')
    .eq('user_id', body.user_id)
    .single();

  if (existing) {
    return validationErrorResponse({ user_id: 'User already has a technician profile' });
  }

  // Create technician profile
  const { data: technician, error: techError } = await serviceClient
    .from('technicians')
    .insert({
      user_id: body.user_id,
      specializations: body.specializations || [],
      certifications: body.certifications || [],
      hourly_rate: body.hourly_rate,
      employee_id: body.employee_id,
      notes: body.notes,
    })
    .select()
    .single();

  if (techError) {
    logger.error('Failed to create technician', techError as unknown as Error);
    return errorResponse('Failed to create technician', 500);
  }

  // Add technician role
  await serviceClient
    .from('user_roles')
    .insert({
      user_id: body.user_id,
      role: 'technician',
      granted_by: auth.userId,
    });

  logger.info('Technician created', { technicianId: technician.id });
  return jsonResponse({ technician }, 201);
}

// Get my technician profile
async function getMyProfile(auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const techCheck = requireTechnician(auth);
  if (techCheck) return techCheck;

  const { data: technician, error } = await auth.supabase
    .from('technicians')
    .select(`
      *,
      profiles:user_id (*)
    `)
    .eq('user_id', auth.userId)
    .single();

  if (error || !technician) {
    return notFoundResponse('Technician profile');
  }

  return jsonResponse({ technician });
}

// Get single technician
async function getTechnician(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const { data: technician, error } = await auth.supabase
    .from('technicians')
    .select(`
      *,
      profiles:user_id (first_name, last_name, email, phone, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error || !technician) {
    return notFoundResponse('Technician');
  }

  return jsonResponse({ technician });
}

// Update technician (admin or self)
async function updateTechnician(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();

  // Check if updating self or admin
  const { data: technician } = await auth.supabase
    .from('technicians')
    .select('user_id')
    .eq('id', id)
    .single();

  if (!technician) {
    return notFoundResponse('Technician');
  }

  const isSelf = technician.user_id === auth.userId;
  if (!isSelf && !auth.isAdmin) {
    return errorResponse('Forbidden', 403);
  }

  const updateData: Record<string, unknown> = {};

  // Fields technician can update
  if (body.is_available !== undefined) updateData.is_available = body.is_available;
  
  // Fields only admin can update
  if (auth.isAdmin) {
    if (body.specializations) updateData.specializations = body.specializations;
    if (body.certifications) updateData.certifications = body.certifications;
    if (body.hourly_rate !== undefined) updateData.hourly_rate = body.hourly_rate;
    if (body.employee_id) updateData.employee_id = body.employee_id;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
  }

  const { data: updated, error } = await auth.supabase
    .from('technicians')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update technician', error as unknown as Error);
    return errorResponse('Failed to update technician', 500);
  }

  logger.info('Technician updated', { technicianId: id });
  return jsonResponse({ technician: updated });
}

// Get technician jobs
async function getTechnicianJobs(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  // Technicians can only see their own jobs
  if (!auth.isAdmin && auth.technicianId !== id) {
    return errorResponse('Forbidden', 403);
  }

  const { data: bookings, error } = await auth.supabase
    .from('bookings')
    .select(`
      *,
      customers (id, first_name, last_name, phone),
      services (id, name),
      customer_addresses (*)
    `)
    .eq('technician_id', id)
    .order('scheduled_date', { ascending: true });

  if (error) {
    logger.error('Failed to fetch technician jobs', error as unknown as Error);
    return errorResponse('Failed to fetch jobs', 500);
  }

  return jsonResponse({ bookings });
}

// Get technician performance data
async function getTechnicianPerformance(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: technician, error } = await auth.supabase
    .from('technicians')
    .select('id, rating, total_jobs, completed_jobs')
    .eq('id', id)
    .single();

  if (error || !technician) {
    return notFoundResponse('Technician');
  }

  // Get recent reviews
  const { data: reviews } = await auth.supabase
    .from('reviews')
    .select('rating, content, created_at')
    .eq('technician_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get job stats by status
  const { data: jobStats } = await auth.supabase
    .from('bookings')
    .select('status')
    .eq('technician_id', id);

  const statusCounts: Record<string, number> = {};
  jobStats?.forEach(job => {
    statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
  });

  return jsonResponse({
    performance: {
      rating: technician.rating,
      totalJobs: technician.total_jobs,
      completedJobs: technician.completed_jobs,
      completionRate: technician.total_jobs > 0 
        ? (technician.completed_jobs / technician.total_jobs * 100).toFixed(1)
        : 0,
      jobsByStatus: statusCounts,
      recentReviews: reviews || [],
    },
  });
}

// Get technician availability
async function getTechnicianAvailability(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const { data: availability, error } = await auth.supabase
    .from('technician_availability')
    .select('*')
    .eq('technician_id', id)
    .order('day_of_week', { ascending: true });

  if (error) {
    logger.error('Failed to fetch availability', error as unknown as Error);
    return errorResponse('Failed to fetch availability', 500);
  }

  return jsonResponse({ availability: availability || [] });
}

// Set technician availability
async function setTechnicianAvailability(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  // Technicians can only update their own availability
  if (!auth.isAdmin && auth.technicianId !== id) {
    return errorResponse('Forbidden', 403);
  }

  const body = await req.json();
  
  const errors = validate(body, updateAvailabilitySchema);
  if (errors) return validationErrorResponse(errors);

  // Upsert availability
  const { data: availability, error } = await auth.supabase
    .from('technician_availability')
    .upsert({
      technician_id: id,
      day_of_week: body.day_of_week,
      start_time: body.start_time,
      end_time: body.end_time,
      is_available: body.is_available ?? true,
    }, {
      onConflict: 'technician_id,day_of_week',
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to set availability', error as unknown as Error);
    return errorResponse('Failed to set availability', 500);
  }

  logger.info('Availability updated', { technicianId: id, dayOfWeek: body.day_of_week });
  return jsonResponse({ availability });
}

// Update technician location
async function updateTechnicianLocation(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  // Technicians can only update their own location
  if (!auth.isAdmin && auth.technicianId !== id) {
    return errorResponse('Forbidden', 403);
  }

  const body = await req.json();
  
  if (!body.latitude || !body.longitude) {
    return validationErrorResponse({ location: 'latitude and longitude are required' });
  }

  const { data: location, error } = await auth.supabase
    .from('technician_locations')
    .insert({
      technician_id: id,
      latitude: body.latitude,
      longitude: body.longitude,
      accuracy: body.accuracy,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to update location', error as unknown as Error);
    return errorResponse('Failed to update location', 500);
  }

  logger.info('Location updated', { technicianId: id });
  return jsonResponse({ location });
}
