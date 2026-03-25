-- 1. Create the featured_collections table for the Home page slider
CREATE TABLE IF NOT EXISTS public.featured_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add Row Level Security (RLS)
ALTER TABLE public.featured_collections ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow everyone to view
CREATE POLICY "Allow public read" ON public.featured_collections
    FOR SELECT USING (true);

-- Allow authenticated users (Admin) to manage
CREATE POLICY "Allow authenticated manage" ON public.featured_collections
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Storage Bucket Setup Instructions (Run these in the Supabase Dashboard)
-- Go to Storage -> New Bucket
-- Name: "boutique-assets"
-- Public: Yes
-- Add Policy for "Public Access": Allow SELECT (READ) for ALL users
-- Add Policy for "Upload": Allow INSERT/UPDATE for AUTHENTICATED users
