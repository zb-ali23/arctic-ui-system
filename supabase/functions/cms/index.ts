import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { authenticate, requireAdmin, createServiceClient, AuthContext } from '../_shared/auth.ts';
import { jsonResponse, errorResponse, notFoundResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const createBlogPostSchema: ValidationSchema = {
  title: { required: true, type: 'string', minLength: 1, maxLength: 200 },
  slug: { required: true, type: 'string', minLength: 1 },
  content: { required: true, type: 'string', minLength: 1 },
};

const createFAQSchema: ValidationSchema = {
  question: { required: true, type: 'string', minLength: 1 },
  answer: { required: true, type: 'string', minLength: 1 },
};

const createTestimonialSchema: ValidationSchema = {
  customer_name: { required: true, type: 'string', minLength: 1 },
  content: { required: true, type: 'string', minLength: 1 },
};

serve(async (req: Request) => {
  const logger = createLogger('cms', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/cms', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // Public endpoints
    if (method === 'GET' && path === '/blog') {
      return await listPublicBlogPosts(req, logger);
    }

    if (method === 'GET' && path.match(/^\/blog\/[a-z0-9-]+$/)) {
      const slug = path.replace('/blog/', '');
      return await getBlogPostBySlug(slug, logger);
    }

    if (method === 'GET' && path === '/faqs') {
      return await listPublicFAQs(req, logger);
    }

    if (method === 'GET' && path === '/testimonials') {
      return await listPublicTestimonials(req, logger);
    }

    // Protected endpoints
    const auth = await authenticate(req);
    if (auth instanceof Response) return auth;
    
    logger.setUserId(auth.userId);

    // Blog routes (admin only)
    if (method === 'GET' && path === '/blog/all') {
      return await listAllBlogPosts(req, auth, logger);
    }

    if (method === 'POST' && path === '/blog') {
      return await createBlogPost(req, auth, logger);
    }

    if (method === 'GET' && path.match(/^\/blog\/id\/[0-9a-f-]+$/)) {
      const id = path.replace('/blog/id/', '');
      return await getBlogPost(id, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/blog\/[0-9a-f-]+$/)) {
      const id = path.replace('/blog/', '');
      return await updateBlogPost(id, req, auth, logger);
    }

    if (method === 'DELETE' && path.match(/^\/blog\/[0-9a-f-]+$/)) {
      const id = path.replace('/blog/', '');
      return await deleteBlogPost(id, auth, logger);
    }

    if (method === 'POST' && path.match(/^\/blog\/[0-9a-f-]+\/publish$/)) {
      const id = path.replace('/blog/', '').replace('/publish', '');
      return await publishBlogPost(id, auth, logger);
    }

    // FAQ routes
    if (method === 'GET' && path === '/faqs/all') {
      return await listAllFAQs(req, auth, logger);
    }

    if (method === 'POST' && path === '/faqs') {
      return await createFAQ(req, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/faqs\/[0-9a-f-]+$/)) {
      const id = path.replace('/faqs/', '');
      return await updateFAQ(id, req, auth, logger);
    }

    if (method === 'DELETE' && path.match(/^\/faqs\/[0-9a-f-]+$/)) {
      const id = path.replace('/faqs/', '');
      return await deleteFAQ(id, auth, logger);
    }

    // Testimonial routes
    if (method === 'GET' && path === '/testimonials/all') {
      return await listAllTestimonials(req, auth, logger);
    }

    if (method === 'POST' && path === '/testimonials') {
      return await createTestimonial(req, auth, logger);
    }

    if (method === 'PUT' && path.match(/^\/testimonials\/[0-9a-f-]+$/)) {
      const id = path.replace('/testimonials/', '');
      return await updateTestimonial(id, req, auth, logger);
    }

    if (method === 'DELETE' && path.match(/^\/testimonials\/[0-9a-f-]+$/)) {
      const id = path.replace('/testimonials/', '');
      return await deleteTestimonial(id, auth, logger);
    }

    // System settings
    if (method === 'GET' && path === '/settings') {
      return await getSettings(auth, logger);
    }

    if (method === 'PUT' && path === '/settings') {
      return await updateSettings(req, auth, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// ========== BLOG ==========

async function listPublicBlogPosts(req: Request, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
  const category = url.searchParams.get('category');
  const tag = url.searchParams.get('tag');

  const offset = (page - 1) * limit;

  const serviceClient = createServiceClient();

  let query = serviceClient
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, category, tags, published_at, created_at', { count: 'exact' })
    .eq('is_published', true);

  if (category) query = query.eq('category', category);
  if (tag) query = query.contains('tags', [tag]);

  const { data: posts, error, count } = await query
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list blog posts', error as unknown as Error);
    return errorResponse('Failed to fetch blog posts', 500);
  }

  return jsonResponse({
    posts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

async function getBlogPostBySlug(slug: string, logger: ReturnType<typeof createLogger>) {
  const serviceClient = createServiceClient();

  const { data: post, error } = await serviceClient
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !post) {
    return notFoundResponse('Blog post');
  }

  return jsonResponse({ post });
}

async function listAllBlogPosts(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

  const offset = (page - 1) * limit;

  const { data: posts, error, count } = await auth.supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error('Failed to list blog posts', error as unknown as Error);
    return errorResponse('Failed to fetch blog posts', 500);
  }

  return jsonResponse({
    posts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

async function createBlogPost(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createBlogPostSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: post, error } = await auth.supabase
    .from('blog_posts')
    .insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      category: body.category,
      tags: body.tags || [],
      author_id: auth.userId,
      is_published: body.is_published || false,
      is_featured: body.is_featured || false,
      published_at: body.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create blog post', error as unknown as Error);
    return errorResponse('Failed to create blog post', 500);
  }

  logger.info('Blog post created', { postId: post.id });
  return jsonResponse({ post }, 201);
}

async function getBlogPost(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: post, error } = await auth.supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    return notFoundResponse('Blog post');
  }

  return jsonResponse({ post });
}

async function updateBlogPost(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: post, error } = await auth.supabase
    .from('blog_posts')
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image: body.featured_image,
      category: body.category,
      tags: body.tags,
      is_published: body.is_published,
      is_featured: body.is_featured,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update blog post', error as unknown as Error);
    return errorResponse('Failed to update blog post', 500);
  }

  logger.info('Blog post updated', { postId: id });
  return jsonResponse({ post });
}

async function deleteBlogPost(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { error } = await auth.supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete blog post', error as unknown as Error);
    return errorResponse('Failed to delete blog post', 500);
  }

  logger.info('Blog post deleted', { postId: id });
  return jsonResponse({ success: true });
}

async function publishBlogPost(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: post, error } = await auth.supabase
    .from('blog_posts')
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to publish blog post', error as unknown as Error);
    return errorResponse('Failed to publish blog post', 500);
  }

  logger.info('Blog post published', { postId: id });
  return jsonResponse({ post });
}

// ========== FAQs ==========

async function listPublicFAQs(req: Request, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');

  const serviceClient = createServiceClient();

  let query = serviceClient
    .from('faq_items')
    .select('id, question, answer, category')
    .eq('is_active', true);

  if (category) query = query.eq('category', category);

  const { data: faqs, error } = await query.order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to list FAQs', error as unknown as Error);
    return errorResponse('Failed to fetch FAQs', 500);
  }

  return jsonResponse({ faqs });
}

async function listAllFAQs(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: faqs, error } = await auth.supabase
    .from('faq_items')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to list FAQs', error as unknown as Error);
    return errorResponse('Failed to fetch FAQs', 500);
  }

  return jsonResponse({ faqs });
}

async function createFAQ(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createFAQSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: faq, error } = await auth.supabase
    .from('faq_items')
    .insert({
      question: body.question,
      answer: body.answer,
      category: body.category,
      display_order: body.display_order || 0,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create FAQ', error as unknown as Error);
    return errorResponse('Failed to create FAQ', 500);
  }

  logger.info('FAQ created', { faqId: faq.id });
  return jsonResponse({ faq }, 201);
}

async function updateFAQ(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: faq, error } = await auth.supabase
    .from('faq_items')
    .update({
      question: body.question,
      answer: body.answer,
      category: body.category,
      display_order: body.display_order,
      is_active: body.is_active,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update FAQ', error as unknown as Error);
    return errorResponse('Failed to update FAQ', 500);
  }

  logger.info('FAQ updated', { faqId: id });
  return jsonResponse({ faq });
}

async function deleteFAQ(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { error } = await auth.supabase
    .from('faq_items')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete FAQ', error as unknown as Error);
    return errorResponse('Failed to delete FAQ', 500);
  }

  logger.info('FAQ deleted', { faqId: id });
  return jsonResponse({ success: true });
}

// ========== TESTIMONIALS ==========

async function listPublicTestimonials(req: Request, logger: ReturnType<typeof createLogger>) {
  const url = new URL(req.url);
  const featured = url.searchParams.get('featured');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);

  const serviceClient = createServiceClient();

  let query = serviceClient
    .from('testimonials')
    .select('id, customer_name, customer_title, customer_avatar, content, rating, service_type')
    .eq('is_active', true);

  if (featured === 'true') query = query.eq('is_featured', true);

  const { data: testimonials, error } = await query
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) {
    logger.error('Failed to list testimonials', error as unknown as Error);
    return errorResponse('Failed to fetch testimonials', 500);
  }

  return jsonResponse({ testimonials });
}

async function listAllTestimonials(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: testimonials, error } = await auth.supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    logger.error('Failed to list testimonials', error as unknown as Error);
    return errorResponse('Failed to fetch testimonials', 500);
  }

  return jsonResponse({ testimonials });
}

async function createTestimonial(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();
  
  const errors = validate(body, createTestimonialSchema);
  if (errors) return validationErrorResponse(errors);

  const { data: testimonial, error } = await auth.supabase
    .from('testimonials')
    .insert({
      customer_name: body.customer_name,
      customer_title: body.customer_title,
      customer_avatar: body.customer_avatar,
      content: body.content,
      rating: body.rating,
      service_type: body.service_type,
      display_order: body.display_order || 0,
      is_active: body.is_active ?? true,
      is_featured: body.is_featured || false,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create testimonial', error as unknown as Error);
    return errorResponse('Failed to create testimonial', 500);
  }

  logger.info('Testimonial created', { testimonialId: testimonial.id });
  return jsonResponse({ testimonial }, 201);
}

async function updateTestimonial(id: string, req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  const { data: testimonial, error } = await auth.supabase
    .from('testimonials')
    .update({
      customer_name: body.customer_name,
      customer_title: body.customer_title,
      customer_avatar: body.customer_avatar,
      content: body.content,
      rating: body.rating,
      service_type: body.service_type,
      display_order: body.display_order,
      is_active: body.is_active,
      is_featured: body.is_featured,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update testimonial', error as unknown as Error);
    return errorResponse('Failed to update testimonial', 500);
  }

  logger.info('Testimonial updated', { testimonialId: id });
  return jsonResponse({ testimonial });
}

async function deleteTestimonial(id: string, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { error } = await auth.supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Failed to delete testimonial', error as unknown as Error);
    return errorResponse('Failed to delete testimonial', 500);
  }

  logger.info('Testimonial deleted', { testimonialId: id });
  return jsonResponse({ success: true });
}

// ========== SYSTEM SETTINGS ==========

async function getSettings(auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const { data: settings, error } = await auth.supabase
    .from('system_settings')
    .select('*');

  if (error) {
    logger.error('Failed to fetch settings', error as unknown as Error);
    return errorResponse('Failed to fetch settings', 500);
  }

  // Convert to key-value object
  const settingsObj: Record<string, unknown> = {};
  settings?.forEach(s => {
    settingsObj[s.key] = s.value;
  });

  return jsonResponse({ settings: settingsObj });
}

async function updateSettings(req: Request, auth: AuthContext, logger: ReturnType<typeof createLogger>) {
  const adminCheck = requireAdmin(auth);
  if (adminCheck) return adminCheck;

  const body = await req.json();

  // Update each setting
  for (const [key, value] of Object.entries(body)) {
    await auth.supabase
      .from('system_settings')
      .upsert({
        key,
        value: value as object,
        updated_by: auth.userId,
      }, {
        onConflict: 'key',
      });
  }

  logger.info('Settings updated');
  return jsonResponse({ success: true });
}
