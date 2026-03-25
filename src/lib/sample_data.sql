-- 👗 Shalu Boutique: FINAL ONE-CLICK DATA Fix
-- Run this script in your Supabase SQL Editor to fill your empty website with 30 products.

-- 1. CLEAN UP (Start Fresh)
TRUNCATE categories, products, product_variants, featured_collections CASCADE;

-- 2. INSERT CATEGORIES
INSERT INTO categories (name, slug, image_url) VALUES 
  ('SHALU''S SAREE', 'shalus-saree', 'https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=600'),
  ('SHALU''S KURTI', 'shalus-kurti', 'https://images.unsplash.com/photo-1610189013229-87c10b2f56b2?q=80&w=600'),
  ('SHALU''S SALWAR', 'shalus-salwar', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600'),
  ('SHALU''S CHIDITHAR', 'shalus-chidithar', 'https://images.unsplash.com/photo-1594224709747-94863f099246?q=80&w=600'),
  ('SHALU''S BLOUSE', 'shalus-blouse', 'https://images.unsplash.com/photo-1621012430307-b4774b78d38b?q=80&w=600'),
  ('SHALU''S ACCESSORIES', 'shalus-accessories', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600');

-- 3. INSERT 30 PRODUCTS (CTE)
WITH new_products AS (
  INSERT INTO products (name, description, category, is_best_seller, is_pre_booking)
  VALUES 
    -- Sarees (7 items)
    ('Classic Kanchipuram Silk Saree', 'Timeless handwoven silk saree with traditional zari border.', 'SHALU''S SAREE', true, false),
    ('Elegant Banarasi Georgette Saree', 'Soft georgette with intricate silver zari work.', 'SHALU''S SAREE', false, false),
    ('Floral Chiffon Daily Wear Saree', 'Lightweight and breathable chiffon with delicate floral prints.', 'SHALU''S SAREE', false, true),
    ('Modern Linen Saree with Tassels', 'Stylish linen saree perfect for office and casual gatherings.', 'SHALU''S SAREE', true, false),
    ('Royal Blue Velvet Saree', 'Luxurious velvet saree with heavy sequin work for grand occasions.', 'SHALU''S SAREE', false, false),
    ('Traditional Cotton Silk Saree', 'Comfortable cotton silk blend with temple border design.', 'SHALU''S SAREE', false, false),
    ('Designer Net Saree with Embroidery', 'Contemporary net saree with heavy embroidery and stonework.', 'SHALU''S SAREE', true, false),

    -- Kurtis (5 items)
    ('Anarkali Style Long Kurti', 'Floor length Anarkali with Gota Patti work.', 'SHALU''S KURTI', true, false),
    ('Cotton Straight Cut Kurti', 'Simple yet elegant cotton kurti for everyday comfort.', 'SHALU''S KURTI', false, false),
    ('Embroidered Rayon Kurti', 'Rayon kurti with beautiful ethnic embroidery on the neck.', 'SHALU''S KURTI', false, true),
    ('Chikan Kari Work Kurti', 'Classic Lucknowi Chikan Kari on lightweight fabric.', 'SHALU''S KURTI', true, false),
    ('Stylish Peplum Kurti', 'Modern peplum design with matching borders.', 'SHALU''S KURTI', false, false),

    -- Salwars (5 items)
    ('Classic Patiala Suit Set', 'Full flare Patiala salwar with matching dupatta and kurti.', 'SHALU''S SALWAR', true, false),
    ('Simple Cotton Salwar Kameez', 'Everyday wear cotton salwar set with floral prints.', 'SHALU''S SALWAR', false, false),
    ('Heavy Embroidered Salwar Set', 'Perfect for weddings, this set features heavy thread work.', 'SHALU''S SALWAR', false, true),
    ('Printed Crepe Salwar Suit', 'Wrinkle-resistant crepe suit with modern geometric patterns.', 'SHALU''S SALWAR', false, false),
    ('Designer Sharara Suit', 'Trendy sharara pants with short kurti and net dupatta.', 'SHALU''S SALWAR', true, false),

    -- Chidithars (5 items)
    ('Traditional Silk Chidithar', 'Graceful silk chidithar with intricate border work.', 'SHALU''S CHIDITHAR', true, false),
    ('Floral Print Chidithar Set', 'Vibrant floral prints on soft cotton fabric.', 'SHALU''S CHIDITHAR', false, false),
    ('Elegant Georgette Chidithar', 'Flowy georgette set with minimal embroidery.', 'SHALU''S CHIDITHAR', false, false),
    ('Party Wear Chidithar with Sequins', 'Shimmery sequin work for a dazzling evening look.', 'SHALU''S CHIDITHAR', true, true),
    ('Pastel Shade Chidithar Set', 'Soft pastel colors for a sophisticated aesthetic.', 'SHALU''S CHIDITHAR', false, false),

    -- Blouses (4 items)
    ('Golden Brocade Readymade Blouse', 'Versatile brocade blouse that matches many sarees.', 'SHALU''S BLOUSE', true, false),
    ('Heavy Sequin Work Blouse', 'Glamorous sequin blouse for party wear sarees.', 'SHALU''S BLOUSE', false, false),
    ('Classic Elbow Sleeve Blouse', 'Traditional elbow-length sleeves with simple piping.', 'SHALU''S BLOUSE', false, true),
    ('Designer Backless Blouse', 'Modern backless design with tie-up tassels.', 'SHALU''S BLOUSE', true, false),

    -- Accessories (4 items)
    ('Traditional Kundan Necklace Set', 'Exquisite Kundan set with matching earrings.', 'SHALU''S ACCESSORIES', true, false),
    ('Antique Gold Plated Jhumkas', 'Beautiful temple design jhumkas for ethnic attire.', 'SHALU''S ACCESSORIES', false, false),
    ('Beaded Ethnic Clutch Bag', 'Handcrafted clutch with bead and mirror work.', 'SHALU''S ACCESSORIES', false, true),
    ('Elegant Silk Scarf', 'Premium silk scarf with traditional prints.', 'SHALU''S ACCESSORIES', true, false)
  RETURNING id, name, category
)
-- 4. INSERT VARIANTS (120 Total)
INSERT INTO product_variants (product_id, size, color, price, original_price, stock_quantity)
SELECT 
  p.id, 
  v.size, 
  v.color, 
  CASE 
    WHEN p.category = 'SHALU''S ACCESSORIES' THEN 499 + (random() * 1000)::int
    WHEN p.category = 'SHALU''S BLOUSE' THEN 899 + (random() * 500)::int
    ELSE 1999 + (random() * 3000)::int
  END as price,
  (1999 + (random() * 3000)::int) * 1.5 as original_price,
  (10 + (random() * 20))::int as stock
FROM new_products p
CROSS JOIN LATERAL (
  VALUES ('S', 'Multicolor'), ('M', 'Multicolor'), ('L', 'Multicolor'), ('XL', 'Multicolor')
) AS v(size, color);

-- 5. INSERT FEATURED SLIDER
INSERT INTO featured_collections (title, image_url, sort_order)
VALUES 
  ('Wedding Specials', 'https://images.unsplash.com/photo-1583391733958-d2597280170a?q=80&w=600', 1),
  ('Premium Silk', 'https://images.unsplash.com/photo-1610189013229-87c10b2f56b2?q=80&w=600', 2),
  ('New Year Collection', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600', 3)
ON CONFLICT (title) DO NOTHING;
