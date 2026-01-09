import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, AppRole } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  if (allowedRoles && !user.roles.some(r => allowedRoles.includes(r))) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
