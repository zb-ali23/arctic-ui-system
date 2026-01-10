// Super Admin configuration and utilities
// This email is permanently recognized as Super Admin with full system access

export const SUPER_ADMIN_EMAIL = 'zohaibali.codes@gmail.com';

export function isSuperAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

// Super Admin has unrestricted access to everything
export const SUPER_ADMIN_PERMISSIONS = {
  // Full control over all website content
  manageContent: true,
  // Full control over admin panel
  manageAdminPanel: true,
  // Full control over bookings
  manageBookings: true,
  // Full control over customers
  manageCustomers: true,
  // Full control over technicians
  manageTechnicians: true,
  // Full control over services
  manageServices: true,
  // Full control over pricing
  managePricing: true,
  // Full access to reports
  viewReports: true,
  // Full access to analytics
  viewAnalytics: true,
  // Full access to logs
  viewLogs: true,
  // Full CMS access
  manageCMS: true,
  // Create/edit/remove other admins
  manageAdmins: true,
  // Change roles and permissions
  manageRoles: true,
  // Access to system settings
  manageSystemSettings: true,
  // Access to security logs
  viewSecurityLogs: true,
  // Access to activity history
  viewActivityHistory: true,
} as const;

export type SuperAdminPermission = keyof typeof SUPER_ADMIN_PERMISSIONS;
