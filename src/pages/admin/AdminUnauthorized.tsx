import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function AdminUnauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <ShieldX className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Website
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
