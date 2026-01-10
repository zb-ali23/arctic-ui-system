import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { isSuperAdminEmail, SUPER_ADMIN_EMAIL } from '@/lib/super-admin';

export type AppRole = 'super_admin' | 'manager' | 'technician' | 'customer';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  roles: AppRole[];
  isAdmin: boolean;
  isTechnician: boolean;
  isSuperAdmin: boolean;
  technicianId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (...roles: AppRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(async () => {
            await fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authUser.id);

      const roles = (rolesData || []).map(r => r.role as AppRole);
      
      // Check if this is the permanent super admin email
      const isSuperAdmin = isSuperAdminEmail(authUser.email);
      
      // If super admin email, ensure super_admin role is included
      if (isSuperAdmin && !roles.includes('super_admin')) {
        roles.push('super_admin');
      }
      
      const isAdmin = isSuperAdmin || roles.includes('super_admin') || roles.includes('manager');
      const isTechnician = roles.includes('technician');

      // Fetch technician ID if applicable
      let technicianId: string | undefined;
      if (isTechnician) {
        const { data: techData } = await supabase
          .from('technicians')
          .select('id')
          .eq('user_id', authUser.id)
          .single();
        technicianId = techData?.id;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        firstName: profile?.first_name || authUser.user_metadata?.first_name || '',
        lastName: profile?.last_name || authUser.user_metadata?.last_name || '',
        avatarUrl: profile?.avatar_url,
        roles,
        isAdmin,
        isTechnician,
        isSuperAdmin,
        technicianId,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const hasRole = (...roles: AppRole[]) => {
    if (!user) return false;
    return user.roles.some(r => roles.includes(r));
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
