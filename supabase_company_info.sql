-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS company_info (
  id text PRIMARY KEY DEFAULT 'default',
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  working_hours text NOT NULL
);

-- Insert default row if not exists
INSERT INTO company_info (id, phone, email, address, working_hours)
VALUES (
  'default',
  '+91 97874 65677',
  'sales@donpack.in',
  '42A, Duraisamy Street, 2nd Main Rd
Rajiv Nagar, Vanagaram, Chennai
Adayalampattu, Tamil Nadu 600077, India',
  '10:00 - 18:30'
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
