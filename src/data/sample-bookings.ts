/**
 * Sample booking data for UI development and testing.
 * Replace with real API calls when backend is connected.
 */

import { 
  Booking, 
  Service, 
  Customer, 
  Address, 
  Technician,
  TimeSlot,
  generateBookingNumber
} from "@/types/booking";

// -------------------- Sample Services --------------------

export const sampleServices: Service[] = [
  {
    id: "svc-001",
    slug: "ac-repair",
    name: "AC Repair",
    description: "Complete diagnosis and repair of air conditioning units",
    short_description: "Fix your AC issues fast",
    category: "ac",
    base_price: 149,
    price_type: "starting_from",
    estimated_duration_minutes: 90,
    features: ["Diagnosis", "Parts replacement", "Testing", "90-day warranty"],
    is_active: true,
    is_popular: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "svc-002",
    slug: "ac-installation",
    name: "AC Installation",
    description: "Professional installation of new air conditioning units",
    category: "ac",
    base_price: 299,
    price_type: "starting_from",
    estimated_duration_minutes: 180,
    features: ["Site assessment", "Professional install", "Testing", "1-year warranty"],
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "svc-003",
    slug: "gas-refill",
    name: "Gas Refill / Recharge",
    description: "AC gas top-up and leak detection",
    category: "ac",
    base_price: 89,
    price_type: "fixed",
    estimated_duration_minutes: 45,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "svc-004",
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    description: "Complete diagnosis and repair of refrigerators",
    category: "refrigerator",
    base_price: 129,
    price_type: "starting_from",
    estimated_duration_minutes: 90,
    is_active: true,
    is_popular: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "svc-005",
    slug: "emergency-repair",
    name: "Emergency Repair",
    description: "Same-day emergency repair service",
    category: "ac",
    base_price: 199,
    price_type: "fixed",
    estimated_duration_minutes: 120,
    is_active: true,
    is_emergency: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// -------------------- Sample Customers --------------------

export const sampleCustomers: Customer[] = [
  {
    id: "cust-001",
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    phone_verified: true,
    email_verified: true,
    total_bookings: 3,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cust-002",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    total_bookings: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cust-003",
    first_name: "Michael",
    last_name: "Williams",
    email: "m.williams@email.com",
    phone: "(555) 345-6789",
    total_bookings: 5,
    tags: ["VIP", "Repeat Customer"],
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// -------------------- Sample Addresses --------------------

export const sampleAddresses: Address[] = [
  {
    id: "addr-001",
    street: "123 Main Street",
    apartment: "Apt 4B",
    city: "Austin",
    state: "TX",
    zip: "78701",
    country: "USA",
    is_default: true,
    label: "Home",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "addr-002",
    street: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    zip: "78702",
    country: "USA",
    label: "Office",
    special_instructions: "Enter through side gate",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// -------------------- Sample Technicians --------------------

export const sampleTechnicians: Technician[] = [
  {
    id: "tech-001",
    user_id: "user-tech-001",
    first_name: "Mike",
    last_name: "Johnson",
    email: "mike.j@frostfix.com",
    phone: "(555) 999-1111",
    specializations: ["ac", "hvac"],
    rating: 4.9,
    total_jobs: 523,
    is_active: true,
    is_available: true,
    certifications: ["EPA Certified", "HVAC Master"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "tech-002",
    user_id: "user-tech-002",
    first_name: "David",
    last_name: "Chen",
    email: "david.c@frostfix.com",
    phone: "(555) 999-2222",
    specializations: ["refrigerator", "commercial"],
    rating: 4.8,
    total_jobs: 312,
    is_active: true,
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// -------------------- Sample Time Slots --------------------

export const sampleTimeSlots: TimeSlot[] = [
  { id: "ts-1", label: "8:00 AM - 10:00 AM", start_time: "08:00", end_time: "10:00", period: "morning", is_available: true },
  { id: "ts-2", label: "10:00 AM - 12:00 PM", start_time: "10:00", end_time: "12:00", period: "morning", is_available: true },
  { id: "ts-3", label: "12:00 PM - 2:00 PM", start_time: "12:00", end_time: "14:00", period: "afternoon", is_available: true },
  { id: "ts-4", label: "2:00 PM - 4:00 PM", start_time: "14:00", end_time: "16:00", period: "afternoon", is_available: true },
  { id: "ts-5", label: "4:00 PM - 6:00 PM", start_time: "16:00", end_time: "18:00", period: "evening", is_available: true },
  { id: "ts-6", label: "6:00 PM - 8:00 PM", start_time: "18:00", end_time: "20:00", period: "evening", is_available: false }
];

// -------------------- Sample Bookings --------------------

export const sampleBookings: Booking[] = [
  {
    id: "book-001",
    booking_number: "BK7X9K2M3N",
    customer_id: "cust-001",
    customer: sampleCustomers[0],
    service_id: "svc-001",
    service: sampleServices[0],
    address_id: "addr-001",
    address: sampleAddresses[0],
    technician_id: "tech-001",
    technician: sampleTechnicians[0],
    status: "confirmed",
    priority: "normal",
    problem: {
      selected_issues: ["Not cooling properly", "Making unusual noise"],
      description: "AC started making noise last week and cooling has reduced"
    },
    schedule: {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time_slot_id: "ts-2",
      time_slot_label: "10:00 AM - 12:00 PM"
    },
    estimated_price: 149,
    payment_status: "pending",
    timeline: [
      { status: "pending", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { status: "confirmed", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ],
    source: "website",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "book-002",
    booking_number: "BKA3B5C7D9",
    customer_id: "cust-002",
    customer: sampleCustomers[1],
    service_id: "svc-004",
    service: sampleServices[3],
    address_id: "addr-002",
    address: sampleAddresses[1],
    status: "pending",
    priority: "urgent",
    problem: {
      selected_issues: ["Not cooling enough"],
      description: "Refrigerator stopped cooling, food is spoiling"
    },
    schedule: {
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time_slot_id: "ts-1",
      time_slot_label: "8:00 AM - 10:00 AM"
    },
    estimated_price: 129,
    payment_status: "pending",
    timeline: [
      { status: "pending", timestamp: new Date().toISOString() }
    ],
    source: "phone",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "book-003",
    booking_number: "BKE5F7G9H1",
    customer_id: "cust-003",
    customer: sampleCustomers[2],
    service_id: "svc-005",
    service: sampleServices[4],
    address_id: "addr-001",
    address: sampleAddresses[0],
    technician_id: "tech-001",
    technician: sampleTechnicians[0],
    status: "in_progress",
    priority: "emergency",
    problem: {
      selected_issues: ["Not turning on"],
      description: "AC completely stopped working during heatwave"
    },
    schedule: {
      date: new Date().toISOString().split('T')[0],
      time_slot_id: "ts-3",
      time_slot_label: "12:00 PM - 2:00 PM"
    },
    estimated_price: 199,
    payment_status: "pending",
    timeline: [
      { status: "pending", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { status: "confirmed", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      { status: "assigned", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { status: "en_route", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { status: "in_progress", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
    ],
    source: "website",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "book-004",
    booking_number: "BKI1J3K5L7",
    customer_id: "cust-001",
    customer: sampleCustomers[0],
    service_id: "svc-003",
    service: sampleServices[2],
    address_id: "addr-001",
    address: sampleAddresses[0],
    technician_id: "tech-002",
    technician: sampleTechnicians[1],
    status: "completed",
    priority: "normal",
    problem: {
      selected_issues: ["Gas refill needed"],
      description: ""
    },
    schedule: {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time_slot_id: "ts-4",
      time_slot_label: "2:00 PM - 4:00 PM"
    },
    estimated_price: 89,
    final_price: 89,
    payment_status: "paid",
    payment_method: "card",
    rating: 5,
    review: "Great service, very professional!",
    timeline: [
      { status: "pending", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "confirmed", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "assigned", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "en_route", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "in_progress", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "completed", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    source: "website",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// -------------------- Helper Functions --------------------

export function getBookingById(id: string): Booking | undefined {
  return sampleBookings.find(b => b.id === id || b.booking_number === id);
}

export function getBookingsByStatus(status: Booking["status"]): Booking[] {
  return sampleBookings.filter(b => b.status === status);
}

export function getServiceById(id: string): Service | undefined {
  return sampleServices.find(s => s.id === id || s.slug === id);
}

export function getActiveServices(): Service[] {
  return sampleServices.filter(s => s.is_active);
}

export function getServicesByCategory(category: Service["category"]): Service[] {
  return sampleServices.filter(s => s.category === category && s.is_active);
}

export function getAvailableTimeSlots(): TimeSlot[] {
  return sampleTimeSlots.filter(ts => ts.is_available);
}
