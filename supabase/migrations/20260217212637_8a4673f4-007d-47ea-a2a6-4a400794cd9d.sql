
-- Fix RLS policies for blog_posts: make public SELECT permissive
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Fix RLS policies for faq_items: make public SELECT permissive
DROP POLICY IF EXISTS "Anyone can view active FAQs" ON public.faq_items;
CREATE POLICY "Anyone can view active FAQs"
  ON public.faq_items FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Fix RLS policies for testimonials: make public SELECT permissive
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
