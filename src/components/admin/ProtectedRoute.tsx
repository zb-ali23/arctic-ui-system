import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requireAdmin = false,
  requireSuperAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Super Admin check - most restrictive
  if (requireSuperAdmin && !user.isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Admin check
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Role-based check
  if (allowedRoles && !user.roles.some(r => allowedRoles.includes(r))) {
    // Super admins bypass role checks
    if (!user.isSuperAdmin) {
      return <Navigate to="/admin/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
