
-- Fix blog_posts: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can manage posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;

CREATE POLICY "Admins can manage posts" ON public.blog_posts FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Fix faq_items: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can manage FAQs" ON public.faq_items;
DROP POLICY IF EXISTS "Anyone can view active FAQs" ON public.faq_items;

CREATE POLICY "Admins can manage FAQs" ON public.faq_items FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view active FAQs" ON public.faq_items FOR SELECT USING (is_active = true);

-- Fix testimonials: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;

CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);

-- Also fix services, service_categories, time_slots which have the same bug
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.service_categories;

CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view active categories" ON public.service_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage time slots" ON public.time_slots;
DROP POLICY IF EXISTS "Anyone can view time slots" ON public.time_slots;

CREATE POLICY "Admins can manage time slots" ON public.time_slots FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can view time slots" ON public.time_slots FOR SELECT USING (is_active = true);

-- Also fix system_settings for the same pattern
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;

CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL USING (is_admin(auth.uid()));
-- Add public read for non-sensitive settings so the website can load business info
CREATE POLICY "Anyone can view settings" ON public.system_settings FOR SELECT USING (true);
