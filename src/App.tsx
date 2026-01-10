import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";

// Eager load critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Book = lazy(() => import("./pages/Book"));
const BookingStatus = lazy(() => import("./pages/BookingStatus"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/admin/AdminSignup"));
const ForgotPassword = lazy(() => import("./pages/admin/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const AdminUnauthorized = lazy(() => import("./pages/admin/AdminUnauthorized"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminTechnicians = lazy(() => import("./pages/admin/AdminTechnicians"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Super Admin pages
const SuperAdminDashboard = lazy(() => import("./pages/admin/SuperAdminDashboard"));
const AdminManagement = lazy(() => import("./pages/admin/AdminManagement"));
const RolesPermissions = lazy(() => import("./pages/admin/RolesPermissions"));
const BusinessAnalytics = lazy(() => import("./pages/admin/BusinessAnalytics"));
const ActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));

const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute").then(m => ({ default: m.ProtectedRoute })));

// Customer Portal pages
const CustomerPortalAuth = lazy(() => import("./pages/portal/CustomerPortalAuth"));
const CustomerPortalLayout = lazy(() => import("./components/portal/CustomerPortalLayout"));
const CustomerPortalDashboard = lazy(() => import("./pages/portal/CustomerPortalDashboard"));
const CustomerPortalBookings = lazy(() => import("./pages/portal/CustomerPortalBookings"));
const CustomerPortalHistory = lazy(() => import("./pages/portal/CustomerPortalHistory"));
const CustomerPortalInvoices = lazy(() => import("./pages/portal/CustomerPortalInvoices"));
const CustomerPortalReviews = lazy(() => import("./pages/portal/CustomerPortalReviews"));
const CustomerPortalAccount = lazy(() => import("./pages/portal/CustomerPortalAccount"));

// Technician Portal pages
const TechnicianAuth = lazy(() => import("./pages/technician/TechnicianAuth"));
const TechnicianLayout = lazy(() => import("./components/technician/TechnicianLayout"));
const TechnicianDashboard = lazy(() => import("./pages/technician/TechnicianDashboard"));
const TechnicianJobs = lazy(() => import("./pages/technician/TechnicianJobs"));
const TechnicianJobDetail = lazy(() => import("./pages/technician/TechnicianJobDetail"));
const TechnicianEarnings = lazy(() => import("./pages/technician/TechnicianEarnings"));
const TechnicianProfile = lazy(() => import("./pages/technician/TechnicianProfile"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/book" element={<Book />} />
                <Route path="/booking-status" element={<BookingStatus />} />

                {/* Admin auth routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/reset-password" element={<ResetPassword />} />
                <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
                
                {/* Protected admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="technicians" element={<AdminTechnicians />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<AdminSettings />} />
                  
                  {/* Super Admin routes */}
                  <Route path="super-admin" element={
                    <ProtectedRoute requireSuperAdmin>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="admin-management" element={
                    <ProtectedRoute requireSuperAdmin>
                      <AdminManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="roles-permissions" element={
                    <ProtectedRoute requireSuperAdmin>
                      <RolesPermissions />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute requireSuperAdmin>
                      <BusinessAnalytics />
                    </ProtectedRoute>
                  } />
                  <Route path="activity-logs" element={
                    <ProtectedRoute requireSuperAdmin>
                      <ActivityLogs />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Customer Portal routes */}
                <Route path="/portal/auth" element={<CustomerPortalAuth />} />
                <Route path="/portal" element={<CustomerPortalLayout />}>
                  <Route index element={<CustomerPortalDashboard />} />
                  <Route path="bookings" element={<CustomerPortalBookings />} />
                  <Route path="history" element={<CustomerPortalHistory />} />
                  <Route path="invoices" element={<CustomerPortalInvoices />} />
                  <Route path="reviews" element={<CustomerPortalReviews />} />
                  <Route path="account" element={<CustomerPortalAccount />} />
                </Route>

                {/* Technician Portal routes */}
                <Route path="/technician/auth" element={<TechnicianAuth />} />
                <Route path="/technician" element={<TechnicianLayout />}>
                  <Route index element={<TechnicianDashboard />} />
                  <Route path="jobs" element={<TechnicianJobs />} />
                  <Route path="jobs/:id" element={<TechnicianJobDetail />} />
                  <Route path="earnings" element={<TechnicianEarnings />} />
                  <Route path="profile" element={<TechnicianProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
