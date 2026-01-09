-- Drop the insecure policy that allows anyone to insert
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;

-- Create a secure policy that only allows authenticated users to insert their own customer record
CREATE POLICY "Authenticated users can insert their own customer record"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Also create a policy for admins to insert any customer
CREATE POLICY "Admins can insert any customer"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));