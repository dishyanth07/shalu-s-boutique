-- 🖼️ Shalu Boutique: POWER STORAGE SETUP (Final Fix)
-- Run this in your Supabase SQL Editor if you get "RLS Policy Violation" errors.

-- 1. Create the bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('boutique-assets', 'boutique-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clear old policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Manage" ON storage.objects;

-- 3. Simple Public Read Access
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'boutique-assets' );

-- 4. Simple Admin Upload (Authenticated)
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'boutique-assets' );

-- 5. Simple Admin Manage (All for Authenticated)
CREATE POLICY "Admin Manage"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'boutique-assets' );
