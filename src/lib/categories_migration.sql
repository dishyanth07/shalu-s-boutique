-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key to products (optional, but good for integrity)
-- ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id);

-- Insert initial boutique categories
INSERT INTO categories (name, slug) VALUES 
  ('SHALU''S SAREE', 'shalus-saree'),
  ('SHALU''S KURTI', 'shalus-kurti'),
  ('SHALU''S SALWAR', 'shalus-salwar'),
  ('SHALU''S CHIDITHAR', 'shalus-chidithar'),
  ('SHALU''S BLOUSE', 'shalus-blouse'),
  ('SHALU''S ACCESSORIES', 'shalus-accessories')
ON CONFLICT (name) DO NOTHING;
