import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './cors.ts';

export type AppRole = 'super_admin' | 'manager' | 'technician' | 'customer';

// Permanent Super Admin email - hardcoded for security
export const SUPER_ADMIN_EMAIL = 'zohaibali.codes@gmail.com';

export function isSuperAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

// deno-lint-ignore no-explicit-any
export type SupabaseClientType = SupabaseClient<any, any, any>;

export interface AuthContext {
  supabase: SupabaseClientType;
  userId: string;
  email?: string;
  roles: AppRole[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isTechnician: boolean;
  technicianId?: string;
}

export function createSupabaseClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );
}

export function createServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
}

export async function authenticate(req: Request): Promise<AuthContext | Response> {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createSupabaseClient(authHeader);
  const token = authHeader.replace('Bearer ', '');
  
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  
  if (claimsError || !claimsData?.claims) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Invalid or expired token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const userId = claimsData.claims.sub as string;
  const email = claimsData.claims.email as string | undefined;

  // Fetch user roles using service client to bypass RLS
  const serviceClient = createServiceClient();
  const { data: rolesData } = await serviceClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  const roles = (rolesData || []).map(r => r.role as AppRole);
  
  // Check if this is the permanent super admin email
  const isSuperAdmin = isSuperAdminEmail(email);
  
  // If super admin email, ensure super_admin role is included
  if (isSuperAdmin && !roles.includes('super_admin')) {
    roles.push('super_admin');
  }
  
  const isAdmin = isSuperAdmin || roles.includes('super_admin') || roles.includes('manager');
  const isTechnician = roles.includes('technician');

  // Get technician ID if user is a technician
  let technicianId: string | undefined;
  if (isTechnician) {
    const { data: techData } = await serviceClient
      .from('technicians')
      .select('id')
      .eq('user_id', userId)
      .single();
    technicianId = techData?.id;
  }

  return {
    supabase,
    userId,
    email,
    roles,
    isAdmin,
    isSuperAdmin,
    isTechnician,
    technicianId,
  };
}

export function requireAdmin(auth: AuthContext): Response | null {
  if (!auth.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Forbidden', message: 'Admin access required' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  return null;
}

export function requireSuperAdmin(auth: AuthContext): Response | null {
  if (!auth.isSuperAdmin) {
    return new Response(
      JSON.stringify({ error: 'Forbidden', message: 'Super Admin access required' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  return null;
}

export function requireTechnician(auth: AuthContext): Response | null {
  if (!auth.isTechnician && !auth.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Forbidden', message: 'Technician access required' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  return null;
}

export function requireRole(auth: AuthContext, ...allowedRoles: AppRole[]): Response | null {
  const hasRole = auth.roles.some(r => allowedRoles.includes(r));
  if (!hasRole) {
    return new Response(
      JSON.stringify({ error: 'Forbidden', message: `Required roles: ${allowedRoles.join(', ')}` }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  return null;
}
