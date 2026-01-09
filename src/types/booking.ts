// ============================================
// Core Data Models - Backend Ready
// ============================================

// -------------------- Status Types --------------------

export type BookingStatus = 
  | "pending"      // Just submitted, awaiting confirmation
  | "confirmed"    // Confirmed by staff
  | "assigned"     // Technician assigned
  | "en_route"     // Technician on the way
  | "in_progress"  // Service in progress
  | "completed"    // Service completed
  | "cancelled"    // Cancelled by user or admin
  | "rescheduled"; // Rescheduled to new time

export type PaymentStatus = 
  | "pending"
  | "paid"
  | "partial"
  | "refunded"
  | "failed";

export type ServiceCategory = "ac" | "refrigerator" | "hvac" | "commercial";

export type ServicePriority = "normal" | "urgent" | "emergency";

// -------------------- Address Model --------------------

export interface Address {
  id: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
  label?: string; // "Home", "Office", etc.
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface AddressInput {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  special_instructions?: string;
  label?: string;
}

// -------------------- Customer Model --------------------

export interface Customer {
  id: string;
  user_id?: string; // Link to auth.users if registered
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  avatar_url?: string;
  addresses?: Address[];
  default_address_id?: string;
  total_bookings?: number;
  loyalty_points?: number;
  notes?: string; // Admin notes
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Computed property helpers
export function getCustomerFullName(customer: Customer): string {
  return `${customer.first_name} ${customer.last_name}`.trim();
}

export function getCustomerInitials(customer: Customer): string {
  return `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase();
}

// -------------------- Service Model --------------------

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description?: string;
  category: ServiceCategory;
  base_price: number;
  price_type: "fixed" | "starting_from" | "hourly" | "custom";
  estimated_duration_minutes: number;
  icon?: string;
  image_url?: string;
  features?: string[];
  is_active: boolean;
  is_popular?: boolean;
  is_emergency?: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithCategory extends Service {
  category_name: string;
  category_icon: string;
}

// Price formatting helper
export function formatServicePrice(service: Service): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(service.base_price);

  switch (service.price_type) {
    case "starting_from":
      return `From ${formatted}`;
    case "hourly":
      return `${formatted}/hr`;
    case "custom":
      return "Get Quote";
    default:
      return formatted;
  }
}

// Duration formatting helper
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours}-${hours + 1} hrs`;
}

// -------------------- Technician Model --------------------

export interface Technician {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  specializations: ServiceCategory[];
  rating: number;
  total_jobs: number;
  is_active: boolean;
  is_available: boolean;
  current_location?: {
    latitude: number;
    longitude: number;
    updated_at: string;
  };
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

// -------------------- Booking Model --------------------

export interface BookingProblem {
  selected_issues: string[];
  description?: string;
}

export interface BookingSchedule {
  date: string; // ISO date string
  time_slot_id: string;
  time_slot_label: string;
  is_flexible?: boolean;
}

export interface BookingTimeline {
  status: BookingStatus;
  timestamp: string;
  note?: string;
  updated_by?: string; // user_id of who made the change
}

export interface Booking {
  id: string;
  booking_number: string; // Human-readable ID like "BK7X9K2M3N"
  
  // Relations
  customer_id: string;
  customer?: Customer;
  service_id: string;
  service?: Service;
  address_id: string;
  address?: Address;
  technician_id?: string;
  technician?: Technician;
  
  // Booking details
  status: BookingStatus;
  priority: ServicePriority;
  problem: BookingProblem;
  schedule: BookingSchedule;
  
  // Pricing
  estimated_price?: number;
  final_price?: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  
  // Tracking
  timeline: BookingTimeline[];
  admin_notes?: string;
  customer_notes?: string;
  
  // Ratings
  rating?: number;
  review?: string;
  
  // Metadata
  source?: "website" | "phone" | "app" | "admin";
  utm_source?: string;
  utm_campaign?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface BookingInput {
  customer: CustomerInput;
  service_id: string;
  address: AddressInput;
  problem: BookingProblem;
  schedule: BookingSchedule;
  priority?: ServicePriority;
  customer_notes?: string;
}

// -------------------- Time Slots --------------------

export interface TimeSlot {
  id: string;
  label: string;
  start_time: string; // "08:00"
  end_time: string;   // "10:00"
  period: "morning" | "afternoon" | "evening";
  is_available: boolean;
  capacity?: number;
  bookings_count?: number;
}

// -------------------- Notification Model --------------------

export type NotificationType = 
  | "booking_confirmed"
  | "booking_reminder"
  | "technician_assigned"
  | "technician_en_route"
  | "service_completed"
  | "payment_received"
  | "booking_cancelled";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export interface Notification {
  id: string;
  booking_id: string;
  customer_id: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: "pending" | "sent" | "failed" | "delivered";
  content: {
    subject?: string;
    body: string;
  };
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
}

// -------------------- Dashboard / Analytics --------------------

export interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  average_rating: number;
}

export interface DailyStats {
  date: string;
  bookings: number;
  revenue: number;
  completed: number;
}

// -------------------- API Response Types --------------------

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// -------------------- Filter Types --------------------

export interface BookingFilters {
  status?: BookingStatus[];
  date_from?: string;
  date_to?: string;
  customer_id?: string;
  technician_id?: string;
  service_id?: string;
  priority?: ServicePriority[];
  search?: string;
}

export interface ServiceFilters {
  category?: ServiceCategory[];
  is_active?: boolean;
  is_popular?: boolean;
  price_min?: number;
  price_max?: number;
  search?: string;
}

// -------------------- Status Helpers --------------------

export const bookingStatusConfig: Record<BookingStatus, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  pending: {
    label: "Pending",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    description: "Awaiting confirmation"
  },
  confirmed: {
    label: "Confirmed",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    description: "Booking confirmed"
  },
  assigned: {
    label: "Assigned",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    description: "Technician assigned"
  },
  en_route: {
    label: "En Route",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    description: "Technician on the way"
  },
  in_progress: {
    label: "In Progress",
    color: "text-frost",
    bgColor: "bg-frost/10",
    description: "Service in progress"
  },
  completed: {
    label: "Completed",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    description: "Service completed"
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    description: "Booking cancelled"
  },
  rescheduled: {
    label: "Rescheduled",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    description: "Booking rescheduled"
  }
};

export const paymentStatusConfig: Record<PaymentStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  pending: { label: "Pending", color: "text-amber-600", bgColor: "bg-amber-100" },
  paid: { label: "Paid", color: "text-green-600", bgColor: "bg-green-100" },
  partial: { label: "Partial", color: "text-blue-600", bgColor: "bg-blue-100" },
  refunded: { label: "Refunded", color: "text-purple-600", bgColor: "bg-purple-100" },
  failed: { label: "Failed", color: "text-red-600", bgColor: "bg-red-100" }
};

export const serviceCategoryConfig: Record<ServiceCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  ac: { label: "Air Conditioner", icon: "snowflake", color: "text-blue-500" },
  refrigerator: { label: "Refrigerator", icon: "thermometer", color: "text-emerald-500" },
  hvac: { label: "HVAC System", icon: "wind", color: "text-purple-500" },
  commercial: { label: "Commercial", icon: "building", color: "text-amber-500" }
};

// -------------------- Validation Helpers --------------------

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[\d\s\-\(\)\+]{10,}$/.test(phone.replace(/\s/g, ""));
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

// -------------------- Date Helpers --------------------

export function formatBookingDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatBookingDateTime(dateStr: string, timeSlot: string): string {
  const date = formatBookingDate(dateStr);
  return `${date} • ${timeSlot}`;
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatBookingDate(dateStr);
}

// -------------------- ID Generation --------------------

export function generateBookingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BK';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
