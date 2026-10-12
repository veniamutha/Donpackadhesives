-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS company_info (
  id text PRIMARY KEY DEFAULT 'default',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  working_hours text NOT NULL DEFAULT '',
  about_us text NOT NULL DEFAULT ''
);

-- 2. If the table already existed without 'about_us', add the column
ALTER TABLE company_info ADD COLUMN IF NOT EXISTS about_us text NOT NULL DEFAULT '';

-- 3. Reload Supabase / PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';

-- Insert default row if not exists
INSERT INTO company_info (id, phone, email, address, working_hours, about_us)
VALUES (
  'default',
  '+91 97874 65677',
  'sales@donpack.in',
  '42A, Duraisamy Street, 2nd Main Rd
Rajiv Nagar, Vanagaram, Chennai
Adayalampattu, Tamil Nadu 600077, India',
  '10:00 - 18:30',
  'Welcome to Donpack, your trusted partner in advanced industrial bonding solutions. Headquartered in Chennai, we are premier importers and suppliers of high-grade hot melt adhesives, engineered to meet the demanding performance standards of modern, high-speed manufacturing environments.\n\nWith a deep understanding of diverse industrial workflows, we supply versatile, reliable, and premium-quality hot melt formulations designed to ensure seamless production lines and superior structural integrity for our clients across India.'
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read access on company_info" ON company_info;
CREATE POLICY "Public read access on company_info"
ON company_info FOR SELECT
TO public
USING (true);

-- Allow public to update/insert since auth is handled client-side
DROP POLICY IF EXISTS "Auth users can update company_info" ON company_info;
CREATE POLICY "Auth users can update company_info"
ON company_info FOR ALL
TO public
USING (true)
WITH CHECK (true);
