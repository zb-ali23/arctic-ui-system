-- ============================================
-- ADD CUSTOMER ACCESS TO INVOICES
-- ============================================

CREATE POLICY "Customers can view own invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

-- ============================================
-- ADD CUSTOMER ACCESS TO PAYMENTS
-- ============================================

CREATE POLICY "Customers can view own payments"
ON public.payments
FOR SELECT
TO authenticated
USING (owns_customer(customer_id));

-- ============================================
-- ADD CUSTOMER ACCESS TO BOOKING STATUS HISTORY
-- ============================================

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