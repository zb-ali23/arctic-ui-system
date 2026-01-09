import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { jsonResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '../_shared/response.ts';
import { validate, ValidationSchema } from '../_shared/validation.ts';
import { createLogger } from '../_shared/logger.ts';

// Validation schemas
const signUpSchema: ValidationSchema = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 8 },
  first_name: { required: true, type: 'string', minLength: 1 },
  last_name: { required: true, type: 'string', minLength: 1 },
};

const signInSchema: ValidationSchema = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string', minLength: 1 },
};

const resetPasswordSchema: ValidationSchema = {
  email: { required: true, type: 'email' },
};

serve(async (req: Request) => {
  const logger = createLogger('auth', req);
  
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/auth', '');
  const method = req.method;

  logger.request(method, path);

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    // Sign up
    if (method === 'POST' && path === '/signup') {
      return await signUp(req, supabase, logger);
    }

    // Sign in
    if (method === 'POST' && path === '/signin') {
      return await signIn(req, supabase, logger);
    }

    // Sign out
    if (method === 'POST' && path === '/signout') {
      return await signOut(req, supabase, logger);
    }

    // Request password reset
    if (method === 'POST' && path === '/reset-password') {
      return await requestPasswordReset(req, supabase, logger);
    }

    // Update password
    if (method === 'POST' && path === '/update-password') {
      return await updatePassword(req, supabase, logger);
    }

    // Get current user
    if (method === 'GET' && path === '/me') {
      return await getCurrentUser(req, supabase, logger);
    }

    // Refresh token
    if (method === 'POST' && path === '/refresh') {
      return await refreshToken(req, supabase, logger);
    }

    return errorResponse('Not found', 404);
  } catch (error) {
    logger.error('Unhandled error', error as Error);
    return serverErrorResponse(error as Error);
  }
});

// Sign up new user
// deno-lint-ignore no-explicit-any
async function signUp(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  const errors = validate(body, signUpSchema);
  if (errors) return validationErrorResponse(errors);

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
      },
      emailRedirectTo: body.redirect_to || `${Deno.env.get('SUPABASE_URL')}/`,
    },
  });

  if (error) {
    logger.error('Sign up failed', error);
    
    if (error.message.includes('already registered')) {
      return errorResponse('Email already registered', 400);
    }
    
    return errorResponse(error.message, 400);
  }

  logger.info('User signed up', { userId: data.user?.id });

  return jsonResponse({
    user: data.user ? {
      id: data.user.id,
      email: data.user.email,
      first_name: data.user.user_metadata?.first_name,
      last_name: data.user.user_metadata?.last_name,
    } : null,
    session: data.session ? {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    } : null,
    message: data.session ? 'Signed up successfully' : 'Please check your email to confirm your account',
  }, 201);
}

// Sign in user
// deno-lint-ignore no-explicit-any
async function signIn(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  const errors = validate(body, signInSchema);
  if (errors) return validationErrorResponse(errors);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) {
    logger.error('Sign in failed', error);
    return errorResponse('Invalid email or password', 401);
  }

  // Get user roles
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: rolesData } = await serviceClient
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id);

  const roles = rolesData?.map(r => r.role) || [];

  // Get profile
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  logger.info('User signed in', { userId: data.user.id });

  return jsonResponse({
    user: {
      id: data.user.id,
      email: data.user.email,
      first_name: profile?.first_name || data.user.user_metadata?.first_name,
      last_name: profile?.last_name || data.user.user_metadata?.last_name,
      avatar_url: profile?.avatar_url,
      roles,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
}

// Sign out user
// deno-lint-ignore no-explicit-any
async function signOut(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const authHeader = req.headers.get('Authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    // Create client with token to sign out
    const authClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    
    await authClient.auth.signOut();
  }

  logger.info('User signed out');
  return jsonResponse({ message: 'Signed out successfully' });
}

// Request password reset
// deno-lint-ignore no-explicit-any
async function requestPasswordReset(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  const errors = validate(body, resetPasswordSchema);
  if (errors) return validationErrorResponse(errors);

  const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
    redirectTo: body.redirect_to || `${Deno.env.get('SUPABASE_URL')}/reset-password`,
  });

  if (error) {
    logger.error('Password reset request failed', error);
    // Don't reveal if email exists or not
  }

  logger.info('Password reset requested', { email: body.email });
  
  return jsonResponse({
    message: 'If an account exists with this email, you will receive a password reset link',
  });
}

// Update password
// deno-lint-ignore no-explicit-any
async function updatePassword(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401);
  }

  const body = await req.json();
  
  if (!body.password || body.password.length < 8) {
    return validationErrorResponse({ password: 'Password must be at least 8 characters' });
  }

  const token = authHeader.replace('Bearer ', '');
  const authClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { error } = await authClient.auth.updateUser({
    password: body.password,
  });

  if (error) {
    logger.error('Password update failed', error);
    return errorResponse('Failed to update password', 400);
  }

  logger.info('Password updated');
  return jsonResponse({ message: 'Password updated successfully' });
}

// Get current user
// deno-lint-ignore no-explicit-any
async function getCurrentUser(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const authClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await authClient.auth.getUser();

  if (error || !user) {
    return errorResponse('Unauthorized', 401);
  }

  // Get user roles and profile
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: rolesData } = await serviceClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const roles = rolesData?.map(r => r.role) || [];

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      first_name: profile?.first_name || user.user_metadata?.first_name,
      last_name: profile?.last_name || user.user_metadata?.last_name,
      phone: profile?.phone,
      avatar_url: profile?.avatar_url,
      roles,
      is_admin: roles.includes('super_admin') || roles.includes('manager'),
      is_technician: roles.includes('technician'),
    },
  });
}

// Refresh token
// deno-lint-ignore no-explicit-any
async function refreshToken(req: Request, supabase: any, logger: ReturnType<typeof createLogger>) {
  const body = await req.json();
  
  if (!body.refresh_token) {
    return validationErrorResponse({ refresh_token: 'refresh_token is required' });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: body.refresh_token,
  });

  if (error) {
    logger.error('Token refresh failed', error);
    return errorResponse('Failed to refresh token', 401);
  }

  logger.info('Token refreshed', { userId: data.user?.id });

  return jsonResponse({
    session: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
    },
  });
}
