-- ============================================
-- FIX CUSTOMERS TABLE POLICIES
-- ============================================

-- Drop the insecure policy that allows NULL user_id
DROP POLICY IF EXISTS "Authenticated users can insert their own customer record" ON public.customers;

-- Create secure insert policy - user_id must match auth.uid() (no NULL allowed)
CREATE POLICY "Authenticated users can create their own customer profile"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FIX CUSTOMER_ADDRESSES TABLE POLICIES
-- ============================================

-- Drop the insecure "anyone can insert" policy
DROP POLICY IF EXISTS "Anyone can insert addresses" ON public.customer_addresses;

-- Create a helper function to check if user owns the customer record
CREATE OR REPLACE FUNCTION public.owns_customer(customer_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.customers
    WHERE id = customer_uuid
      AND user_id = auth.uid()
  )
$$;

-- Authenticated users can only insert addresses for their own customer record
CREATE POLICY "Authenticated users can insert own addresses"
ON public.customer_addresses
FOR INSERT
TO authenticated
WITH CHECK (public.owns_customer(customer_id));

-- Customers can view their own addresses
CREATE POLICY "Customers can view own addresses"
ON public.customer_addresses
FOR SELECT
TO authenticated
USING (public.owns_customer(customer_id));

-- Customers can update their own addresses
CREATE POLICY "Customers can update own addresses"
ON public.customer_addresses
FOR UPDATE
TO authenticated
USING (public.owns_customer(customer_id));

-- Customers can delete their own addresses
CREATE POLICY "Customers can delete own addresses"
ON public.customer_addresses
FOR DELETE
TO authenticated
USING (public.owns_customer(customer_id));

-- Technicians can view addresses for their assigned bookings
CREATE POLICY "Technicians can view assigned booking addresses"
ON public.customer_addresses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.address_id = customer_addresses.id
      AND b.technician_id = get_technician_id(auth.uid())
      AND b.status NOT IN ('cancelled', 'completed')
  )
);

-- ============================================
-- FIX BOOKINGS TABLE POLICIES
-- ============================================

-- Drop the insecure "anyone can create bookings" policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Authenticated users can create bookings for their own customer record
CREATE POLICY "Authenticated users can create own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (public.owns_customer(customer_id));

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (public.owns_customer(customer_id));

-- ============================================
-- FIX REVIEWS TABLE POLICIES
-- ============================================

-- Drop the insecure "anyone can create reviews" policy
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

-- Authenticated users can only create reviews for their own bookings
CREATE POLICY "Authenticated users can create reviews for own bookings"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.id = reviews.booking_id
      AND public.owns_customer(b.customer_id)
      AND b.status = 'completed'
  )
);

-- Customers can view their own reviews
CREATE POLICY "Customers can view own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.owns_customer(customer_id));