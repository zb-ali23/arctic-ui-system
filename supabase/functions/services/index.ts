import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createServiceSchema: ValidationSchema = {
  name: { required: true, type: 'string', minLength: 1, maxLength: 200 },
  slug: { required: true, type: 'string', minLength: 1 },
  base_price: { required: true, type: 'number', min: 0 },
};

const createCategorySchema: ValidationSchema = {
  name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  slug: { required: true, type: 'string', minLength: 1 },
};

serve(async (req: Request) => {
  const logger = createLogger('services', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/services', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // Public endpoints (no auth required)
    if (method === 'GET' && (path === '' || path === '/')) {
      return await listPublicServices(req, logger);
    }

    if (method === 'GET' && path === '/categories') {
      return await listPublicCategories(logger);
    }

    if (method === 'GET' && path.match(/^\/[a-z0-9-]+$/) && !path.match(/^\/[0-9a-f-]{36}$/)) {
      const slug = path.slice(1);
      return await getServiceBySlug(slug, logger);
    }

    // Protected endpoints
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Admin routes
    if (method === 'POST' && (path === '' || path === '/')) {
      return await createService(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await getService(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await updateService(id, req, auth, logger);
    }

    if (method === 'DELETE' && path.match(/^\/[0-9a-f-]+$/)) {
      const id = path.slice(1);
      return await deleteService(id, auth, logger);
    }

    // Category routes
    if (method === 'POST' && path === '/categories') {
      return await createCategory(req, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/categories\/[0-9a-f-]+$/)) {
      const id = path.replace('/categories/', '');
      return await updateCategory(id, req, auth, logger);
    }

    if (method === 'DELETE' && path.match(/^\/categories\/[0-9a-f-]+$/)) {
      const id = path.replace('/categories/', '');
      return await deleteCategory(id, auth, logger);
    }

    // Time slots
    if (method === 'GET' && path === '/time-slots') {
      return await getTimeSlots(auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// List public services
async function listPublicServices(req: Request, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const isEmergency = url.searchParams.get('is_emergency');
  const isPopular = url.searchParams.get('is_popular');

  // Use service client for public access
  const { createServiceClient } = await import('../_shared/auth.ts');
  const supabase = createServiceClient();

  let query = supabase
    .from('services')
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      base_price,
      price_type,
      estimated_duration_minutes,
      icon,
      image_url,
      is_popular,
      is_emergency,
      features,
      service_categories (id, name, slug)
    `)
    .eq('is_active', true);

  if (category) {
    const { data: cat } = await supabase
      .from('service_categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (isEmergency === 'true') query = query.eq('is_emergency', true);
  if (isPopular === 'true') query = query.eq('is_popular', true);

  const { data: services, error } = await query.order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to list services', error as unknown as Error);
    return errorResponse('Failed to fetch services', 500);
  }

  return jsonResponse({ services });
}

// List public categories
async function listPublicCategories(logger: ReturnType<typeof createLogger>) {
  const { createServiceClient } = await import('../_shared/auth.ts');
  const supabase = createServiceClient();

  const { data: categories, error } = await supabase
    .from('service_categories')
    .select('id, name, slug, description, icon')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to list categories', error as unknown as Error);
    return errorResponse('Failed to fetch categories', 500);
  }

  return jsonResponse({ categories });
}

// Get service by slug (public)
async function getServiceBySlug(slug: string, logger: ReturnType<typeof createLogger>) {
  const { createServiceClient } = await import('../_shared/auth.ts');
  const supabase = createServiceClient();

  const { data: service, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories (id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !service) {
    return notFoundResponse('Service');
  }

  return jsonResponse({ service });
}

// Create service (admin only)
async function createService(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createServiceSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: service, error } = await auth.supabase
    .from('services')
    .insert({
      name: body.name,
      slug: body.slug,
      short_description: body.short_description,
      description: body.description,
      base_price: body.base_price,
      price_type: body.price_type || 'starting_from',
      estimated_duration_minutes: body.estimated_duration_minutes || 60,
      category_id: body.category_id,
      icon: body.icon,
      image_url: body.image_url,
      is_popular: body.is_popular || false,
      is_emergency: body.is_emergency || false,
      is_active: body.is_active ?? true,
      features: body.features || [],
      display_order: body.display_order || 0,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create service', error as unknown as Error);
    return errorResponse('Failed to create service', 500);
  }

  logger.info('Service created', { serviceId: service.id });
  return jsonResponse({ service }, 201);
}

// Get service (admin)
async function getService(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: service, error } = await auth.supabase
    .from('services')
    .select(`
      *,
      service_categories (id, name, slug)
    `)
    .eq('id', id)
    .single();

  if (error || !service) {
    return notFoundResponse('Service');
  }

  return jsonResponse({ service });
}

// Update service (admin only)
async function updateService(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: service, error } = await auth.supabase
    .from('services')
    .update({
      name: body.name,
      slug: body.slug,
      short_description: body.short_description,
      description: body.description,
      base_price: body.base_price,
      price_type: body.price_type,
      estimated_duration_minutes: body.estimated_duration_minutes,
      category_id: body.category_id,
      icon: body.icon,
      image_url: body.image_url,
      is_popular: body.is_popular,
      is_emergency: body.is_emergency,
      is_active: body.is_active,
      features: body.features,
      display_order: body.display_order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update service', error as unknown as Error);
    return errorResponse('Failed to update service', 500);
  }

  logger.info('Service updated', { serviceId: id });
  return jsonResponse({ service });
}

// Delete service (admin only - soft delete)
async function deleteService(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { error } = await auth.supabase
    .from('services')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete service', error as unknown as Error);
    return errorResponse('Failed to delete service', 500);
  }

  logger.info('Service deleted', { serviceId: id });
  return jsonResponse({ success: true });
}

// Create category (admin only)
async function createCategory(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createCategorySchema);
  if (errors) return validationErrorResponse(errors);

  const { data: category, error } = await auth.supabase
    .from('service_categories')
    .insert({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      is_active: body.is_active ?? true,
      display_order: body.display_order || 0,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create category', error as unknown as Error);
    return errorResponse('Failed to create category', 500);
  }

  logger.info('Category created', { categoryId: category.id });
  return jsonResponse({ category }, 201);
}

// Update category (admin only)
async function updateCategory(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: category, error } = await auth.supabase
    .from('service_categories')
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
      is_active: body.is_active,
      display_order: body.display_order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update category', error as unknown as Error);
    return errorResponse('Failed to update category', 500);
  }

  logger.info('Category updated', { categoryId: id });
  return jsonResponse({ category });
}

// Delete category (admin only - soft delete)
async function deleteCategory(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { error } = await auth.supabase
    .from('service_categories')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete category', error as unknown as Error);
    return errorResponse('Failed to delete category', 500);
  }

  logger.info('Category deleted', { categoryId: id });
  return jsonResponse({ success: true });
}

// Get time slots
async function getTimeSlots(auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const { data: timeSlots, error } = await auth.supabase
    .from('time_slots')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to fetch time slots', error as unknown as Error);
    return errorResponse('Failed to fetch time slots', 500);
  }

  return jsonResponse({ timeSlots });
}
