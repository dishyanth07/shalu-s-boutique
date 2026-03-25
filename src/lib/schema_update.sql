-- Add boolean flags for filtering
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_pre_booking BOOLEAN DEFAULT FALSE;

-- Add original price for strikethrough display
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);

-- Update RLS if needed (usually covered by existing SELECT ALL)
-- No additional policies needed if SELECT is already enabled for products/variants.
