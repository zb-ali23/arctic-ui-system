-- ================================================
-- FROSTFIX BACKEND DATABASE SCHEMA
-- Complete AC & Refrigerator Repair Service Platform
-- ================================================

-- ================== ENUMS ==================

-- User roles enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'manager', 'technician', 'customer');

-- Booking status enum  
CREATE TYPE public.booking_status AS ENUM (
  'pending', 'confirmed', 'assigned', 'en_route', 
  'in_progress', 'completed', 'cancelled', 'rescheduled'
);

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM (
  'pending', 'paid', 'partial', 'refunded', 'failed'
);

-- Service category enum
CREATE TYPE public.service_category AS ENUM ('ac', 'refrigerator', 'hvac', 'commercial');

-- Service priority enum
CREATE TYPE public.service_priority AS ENUM ('normal', 'urgent', 'emergency');

-- Notification type enum
CREATE TYPE public.notification_type AS ENUM (
  'booking_confirmed', 'booking_reminder', 'technician_assigned',
  'technician_en_route', 'service_completed', 'payment_received', 'booking_cancelled'
);

-- Notification channel enum
CREATE TYPE public.notification_channel AS ENUM ('email', 'sms', 'push', 'whatsapp');

-- ================== CORE TABLES ==================

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- ================== CUSTOMER MANAGEMENT ==================

-- Customers table (can be linked to auth or guest)
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  total_bookings INTEGER DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  notes TEXT,
  tags TEXT[],
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Customer addresses
CREATE TABLE public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Home',
  street TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  special_instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== SERVICE MANAGEMENT ==================

-- Service categories
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  price_type TEXT DEFAULT 'starting_from' CHECK (price_type IN ('fixed', 'starting_from', 'hourly', 'custom')),
  estimated_duration_minutes INTEGER DEFAULT 60,
  icon TEXT,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_emergency BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== TECHNICIAN MANAGEMENT ==================

-- Technicians
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  specializations public.service_category[] DEFAULT '{}',
  rating DECIMAL(2, 1) DEFAULT 5.0,
  total_jobs INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  certifications TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Technician locations (for tracking)
CREATE TABLE public.technician_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(6, 2),
  recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Technician availability
CREATE TABLE public.technician_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID NOT NULL REFERENCES public.technicians(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== BOOKING MANAGEMENT ==================

-- Time slots
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  period TEXT CHECK (period IN ('morning', 'afternoon', 'evening')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  address_id UUID NOT NULL REFERENCES public.customer_addresses(id) ON DELETE RESTRICT,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  status public.booking_status DEFAULT 'pending' NOT NULL,
  priority public.service_priority DEFAULT 'normal' NOT NULL,
  
  -- Schedule
  scheduled_date DATE NOT NULL,
  time_slot_id UUID REFERENCES public.time_slots(id),
  time_slot_label TEXT,
  is_flexible BOOLEAN DEFAULT false,
  
  -- Problem description
  selected_issues TEXT[] DEFAULT '{}',
  problem_description TEXT,
  
  -- Pricing
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  technician_notes TEXT,
  
  -- Tracking
  source TEXT DEFAULT 'website',
  utm_source TEXT,
  utm_campaign TEXT,
  
  -- Rating
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Booking status history
CREATE TABLE public.booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  status public.booking_status NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== PAYMENT & INVOICES ==================

-- Invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  
  -- Amounts
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  
  -- Status
  status public.payment_status DEFAULT 'pending' NOT NULL,
  
  -- Details
  line_items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  terms TEXT,
  
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  stripe_payment_id TEXT,
  
  status public.payment_status DEFAULT 'pending' NOT NULL,
  
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== REVIEWS & FEEDBACK ==================

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT,
  
  -- Specific ratings
  service_quality INTEGER CHECK (service_quality BETWEEN 1 AND 5),
  punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
  professionalism INTEGER CHECK (professionalism BETWEEN 1 AND 5),
  value_for_money INTEGER CHECK (value_for_money BETWEEN 1 AND 5),
  
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  
  admin_response TEXT,
  admin_responded_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== CMS & CONTENT ==================

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  category TEXT,
  tags TEXT[],
  
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- FAQ items
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  customer_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  service_type TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== NOTIFICATIONS ==================

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  type public.notification_type NOT NULL,
  channel public.notification_channel NOT NULL,
  
  subject TEXT,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== ADMIN & AUDIT ==================

-- Admin activity logs
CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- System settings
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================== HELPER FUNCTIONS ==================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin (super_admin or manager)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'manager')
  )
$$;

-- Function to check if user is technician
CREATE OR REPLACE FUNCTION public.is_technician(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'technician'
  )
$$;

-- Function to get user's technician ID
CREATE OR REPLACE FUNCTION public.get_technician_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.technicians WHERE user_id = _user_id LIMIT 1
$$;

-- Function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'BK';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  year_month TEXT;
  seq INTEGER;
BEGIN
  year_month := to_char(CURRENT_DATE, 'YYMM');
  SELECT COALESCE(MAX(CAST(substr(invoice_number, 7) AS INTEGER)), 0) + 1
  INTO seq
  FROM public.invoices
  WHERE invoice_number LIKE 'INV' || year_month || '%';
  RETURN 'INV' || year_month || lpad(seq::text, 4, '0');
END;
$$;

-- ================== TRIGGERS ==================

-- Trigger for auto-generating booking number
CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := public.generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_set_booking_number
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_number();

-- Trigger for auto-generating invoice number
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER tr_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to log booking status changes
CREATE OR REPLACE FUNCTION public.log_booking_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.booking_status_history (booking_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER tr_log_booking_status
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.log_booking_status_change();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================== ROW LEVEL SECURITY ==================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ================== RLS POLICIES ==================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin(auth.uid()));

-- User roles policies (only admins can manage)
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Customers policies
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can view customers" ON public.technicians FOR SELECT USING (public.is_technician(auth.uid()));
CREATE POLICY "Customers can view own data" ON public.customers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can insert customers" ON public.customers FOR INSERT WITH CHECK (true);

-- Customer addresses policies
CREATE POLICY "Admins can manage addresses" ON public.customer_addresses FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Anyone can insert addresses" ON public.customer_addresses FOR INSERT WITH CHECK (true);

-- Services & categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.is_admin(auth.uid()));

-- Time slots (public read)
CREATE POLICY "Anyone can view time slots" ON public.time_slots FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage time slots" ON public.time_slots FOR ALL USING (public.is_admin(auth.uid()));

-- Technicians policies
CREATE POLICY "Admins can manage technicians" ON public.technicians FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can view own data" ON public.technicians FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Technicians can update own data" ON public.technicians FOR UPDATE USING (user_id = auth.uid());

-- Technician locations
CREATE POLICY "Admins can view locations" ON public.technician_locations FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can manage own location" ON public.technician_locations FOR ALL USING (
  technician_id = public.get_technician_id(auth.uid())
);

-- Technician availability
CREATE POLICY "Admins can manage availability" ON public.technician_availability FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can manage own availability" ON public.technician_availability FOR ALL USING (
  technician_id = public.get_technician_id(auth.uid())
);

-- Bookings policies
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can view assigned bookings" ON public.bookings FOR SELECT USING (
  technician_id = public.get_technician_id(auth.uid())
);
CREATE POLICY "Technicians can update assigned bookings" ON public.bookings FOR UPDATE USING (
  technician_id = public.get_technician_id(auth.uid())
);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Booking status history
CREATE POLICY "Admins can view history" ON public.booking_status_history FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Technicians can view assigned booking history" ON public.booking_status_history FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings b 
    WHERE b.id = booking_id 
    AND b.technician_id = public.get_technician_id(auth.uid())
  )
);

-- Invoices policies
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL USING (public.is_admin(auth.uid()));

-- Payments policies  
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (public.is_admin(auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON public.reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Blog posts (public read published, admin write)
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage posts" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid()));

-- FAQ items (public read)
CREATE POLICY "Anyone can view active FAQs" ON public.faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage FAQs" ON public.faq_items FOR ALL USING (public.is_admin(auth.uid()));

-- Testimonials (public read)
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.is_admin(auth.uid()));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (public.is_admin(auth.uid()));

-- Admin activity logs (admin only)
CREATE POLICY "Admins can view logs" ON public.admin_activity_logs FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert logs" ON public.admin_activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- System settings (admin only)
CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL USING (public.is_admin(auth.uid()));

-- ================== INDEXES ==================

CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_user_id ON public.customers(user_id);

CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_technician_id ON public.bookings(technician_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON public.bookings(scheduled_date);
CREATE INDEX idx_bookings_booking_number ON public.bookings(booking_number);

CREATE INDEX idx_technicians_user_id ON public.technicians(user_id);
CREATE INDEX idx_technicians_is_available ON public.technicians(is_available);

CREATE INDEX idx_invoices_booking_id ON public.invoices(booking_id);
CREATE INDEX idx_invoices_customer_id ON public.invoices(customer_id);

CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);

CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_technician_id ON public.reviews(technician_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_booking_id ON public.notifications(booking_id);

CREATE INDEX idx_admin_logs_user_id ON public.admin_activity_logs(user_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_activity_logs(created_at DESC);