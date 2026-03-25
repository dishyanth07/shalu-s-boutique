-- 🏷️ Shalu Boutique: Category Fix & Linker
-- Run this if your products are visible but categories are empty.

-- 1. Ensure Table Reset (Ensures we start fresh with categories)
DELETE FROM categories;

-- 2. Insert Core Categories with Image Placeholders
-- These match the categories used in the sample products.
INSERT INTO categories (name, slug, image_url) VALUES 
  ('SHALU''S SAREE', 'shalus-saree', 'https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=600'),
  ('SHALU''S KURTI', 'shalus-kurti', 'https://images.unsplash.com/photo-1610189013229-87c10b2f56b2?q=80&w=600'),
  ('SHALU''S SALWAR', 'shalus-salwar', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600'),
  ('SHALU''S CHIDITHAR', 'shalus-chidithar', 'https://images.unsplash.com/photo-1594224709747-94863f099246?q=80&w=600'),
  ('SHALU''S BLOUSE', 'shalus-blouse', 'https://images.unsplash.com/photo-1621012430307-b4774b78d38b?q=80&w=600'),
  ('SHALU''S ACCESSORIES', 'shalus-accessories', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600');

-- 3. Sync Existing Products
-- In case there are minor typos in the naming, this ensures consistency.
UPDATE products SET category = 'SHALU''S SAREE' WHERE category ILIKE '%SAREE%';
UPDATE products SET category = 'SHALU''S KURTI' WHERE category ILIKE '%KURTI%';
UPDATE products SET category = 'SHALU''S SALWAR' WHERE category ILIKE '%SALWAR%';
UPDATE products SET category = 'SHALU''S CHIDITHAR' WHERE category ILIKE '%CHIDITHAR%';
UPDATE products SET category = 'SHALU''S BLOUSE' WHERE category ILIKE '%BLOUSE%';
UPDATE products SET category = 'SHALU''S ACCESSORIES' WHERE category ILIKE '%ACCESSORIES%';

-- 4. Verify RLS (Just in case)
-- This makes categories publicly readable.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin modify categories" ON public.categories;
CREATE POLICY "Allow admin modify categories" ON public.categories FOR ALL TO authenticated USING (true);
