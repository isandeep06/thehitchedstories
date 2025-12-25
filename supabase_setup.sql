-- =====================================================
-- Supabase Database Setup for thehitchedstories
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. CONTACTS TABLE (for contact form submissions)
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    wedding_date DATE,
    location TEXT,
    service TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form submissions)
CREATE POLICY "Allow anonymous insert on contacts" 
ON contacts FOR INSERT 
WITH CHECK (true);

-- Allow reading for authenticated users only (admin dashboard)
CREATE POLICY "Allow authenticated read on contacts" 
ON contacts FOR SELECT 
USING (auth.role() = 'authenticated');


-- 2. NEWSLETTER TABLE (for email subscriptions)
CREATE TABLE IF NOT EXISTS newsletter (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous insert on newsletter" 
ON newsletter FOR INSERT 
WITH CHECK (true);

-- Allow reading for authenticated users only
CREATE POLICY "Allow authenticated read on newsletter" 
ON newsletter FOR SELECT 
USING (auth.role() = 'authenticated');


-- 3. BOOKINGS TABLE (for booking inquiries)
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    wedding_date DATE,
    location TEXT,
    service_type TEXT,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous insert on bookings" 
ON bookings FOR INSERT 
WITH CHECK (true);

-- Allow reading for authenticated users only
CREATE POLICY "Allow authenticated read on bookings" 
ON bookings FOR SELECT 
USING (auth.role() = 'authenticated');


-- =====================================================
-- DONE! Your tables are ready.
-- Test by submitting the contact form on your website.
-- =====================================================
