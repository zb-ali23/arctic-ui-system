-- ============================================
-- FIX TECHNICIANS TABLE - Block anonymous access
-- ============================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Technicians can view customers" ON public.technicians;
DROP POLICY IF EXISTS "Technicians can view own data" ON public.technicians;

-- Recreate with explicit TO authenticated restriction
CREATE POLICY "Technicians can view own data"
ON public.technicians
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Technicians can view all technicians"
ON public.technicians
FOR SELECT
TO authenticated
USING (is_technician(auth.uid()));

-- ============================================
-- FIX CUSTOMERS TABLE - Block anonymous access
-- ============================================

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Customers can view own data" ON public.customers;

-- Recreate with explicit TO authenticated restriction
CREATE POLICY "Customers can view own data"
ON public.customers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- FIX CUSTOMER_ADDRESSES TABLE - Block anonymous access
-- ============================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Customers can view own addresses" ON public.customer_addresses;
DROP POLICY IF EXISTS "Technicians can view assigned booking addresses" ON public.customer_addresses;

-- Recreate with explicit TO authenticated restriction
CREATE POLICY "Customers can view own addresses"
ON public.customer_addresses
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

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