import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onCollapse={setSidebarCollapsed} 
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <AdminSidebar 
          collapsed={false} 
          onCollapse={() => setMobileMenuOpen(false)} 
        />
      </div>

      {/* Main content */}
      <div 
        className={cn(
          'transition-all duration-300 md:pl-64',
          sidebarCollapsed && 'md:pl-16'
        )}
      >
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
