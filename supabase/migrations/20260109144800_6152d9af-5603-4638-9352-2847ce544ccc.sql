-- ============================================
-- FIX PROFILES TABLE - Block anonymous access
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- ============================================
-- FIX BOOKINGS TABLE - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Technicians can view assigned bookings" ON public.bookings;

CREATE POLICY "Customers can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

CREATE POLICY "Technicians can view assigned bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (technician_id = get_technician_id(auth.uid()));

-- ============================================
-- FIX INVOICES TABLE - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Customers can view own invoices" ON public.invoices;

CREATE POLICY "Customers can view own invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

-- ============================================
-- FIX PAYMENTS TABLE - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;

CREATE POLICY "Customers can view own payments"
ON public.payments
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

-- ============================================
-- FIX TECHNICIAN_LOCATIONS - Block anonymous access
-- ============================================

DROP POLICY IF EXISTS "Admins can view locations" ON public.technician_locations;
DROP POLICY IF EXISTS "Technicians can manage own location" ON public.technician_locations;

CREATE POLICY "Admins can view locations"
ON public.technician_locations
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Technicians can manage own location"
ON public.technician_locations
FOR ALL
TO authenticated
USING (technician_id = get_technician_id(auth.uid()));

-- ============================================
-- FIX NOTIFICATIONS - Block anonymous access
-- ============================================

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR owns_customer(customer_id));

-- ============================================
-- FIX ADMIN_ACTIVITY_LOGS - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Admins can view logs" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "System can insert logs" ON public.admin_activity_logs;

CREATE POLICY "Admins can view logs"
ON public.admin_activity_logs
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can insert logs"
ON public.admin_activity_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- FIX SYSTEM_SETTINGS - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;

CREATE POLICY "Admins can manage settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- ============================================
-- FIX USER_ROLES - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'));

-- ============================================
-- FIX BOOKING_STATUS_HISTORY - Ensure TO authenticated
-- ============================================

DROP POLICY IF EXISTS "Admins can view history" ON public.booking_status_history;
DROP POLICY IF EXISTS "Technicians can view assigned booking history" ON public.booking_status_history;
DROP POLICY IF EXISTS "Customers can view own booking history" ON public.booking_status_history;

CREATE POLICY "Admins can view history"
ON public.booking_status_history
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Technicians can view assigned booking history"
ON public.booking_status_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = booking_status_history.booking_id
      AND b.technician_id = get_technician_id(auth.uid())
  )
);

CREATE POLICY "Customers can view own booking history"
ON public.booking_status_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = booking_status_history.booking_id
      AND owns_customer(b.customer_id)
  )
);

-- ============================================
-- FIX TECHNICIAN_AVAILABILITY - Block anonymous access
-- ============================================

DROP POLICY IF EXISTS "Admins can manage availability" ON public.technician_availability;
DROP POLICY IF EXISTS "Technicians can manage own availability" ON public.technician_availability;

CREATE POLICY "Admins can manage availability"
ON public.technician_availability
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

CREATE POLICY "Technicians can manage own availability"
ON public.technician_availability
FOR ALL
TO authenticated
USING (technician_id = get_technician_id(auth.uid()));