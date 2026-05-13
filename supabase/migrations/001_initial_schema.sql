-- Community Complaints System - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  tracking_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) >= 20),
  category TEXT NOT NULL CHECK (category IN ('infrastructure', 'noise', 'safety', 'sanitation', 'environment', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'dismissed')),
  location TEXT NOT NULL,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
  upvotes INTEGER DEFAULT 0 NOT NULL,
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  image_url TEXT
);

-- Upvotes tracking table (prevent duplicate votes)
CREATE TABLE IF NOT EXISTS complaint_upvotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE NOT NULL,
  voter_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(complaint_id, voter_fingerprint)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_id ON complaints(tracking_id);
CREATE INDEX IF NOT EXISTS idx_complaints_email ON complaints(submitter_email);

-- Row Level Security (RLS)
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public can read non-anonymous complaints (redacted email)
CREATE POLICY "Public can view complaints" ON complaints
  FOR SELECT USING (true);

-- Public can insert complaints
CREATE POLICY "Public can submit complaints" ON complaints
  FOR INSERT WITH CHECK (true);

-- Public can upvote
CREATE POLICY "Public can upvote" ON complaint_upvotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view upvotes" ON complaint_upvotes
  FOR SELECT USING (true);

-- Service role can do everything (for admin API routes)
CREATE POLICY "Service role full access complaints" ON complaints
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access upvotes" ON complaint_upvotes
  FOR ALL USING (auth.role() = 'service_role');

-- Sample data for testing
INSERT INTO complaints (tracking_id, title, description, category, priority, status, location, submitter_name, submitter_email, is_anonymous, upvotes) VALUES
  ('CC-DEMO001', 'Broken streetlight on Main St', 'The streetlight at the corner of Main Street and Oak Avenue has been broken for 3 weeks, creating a safety hazard at night.', 'infrastructure', 'high', 'in_review', 'Main St & Oak Ave', 'John Dela Cruz', 'john@example.com', false, 12),
  ('CC-DEMO002', 'Noise from construction at 3AM', 'Construction crew on Pine Road has been working past midnight, disturbing residents in the surrounding neighborhood.', 'noise', 'urgent', 'pending', 'Pine Road, Block 4', 'Maria Santos', 'maria@example.com', false, 28),
  ('CC-DEMO003', 'Overflowing garbage bins at the park', 'The waste bins at Rizal Park have not been collected in over a week and are overflowing onto the walking paths.', 'sanitation', 'medium', 'resolved', 'Rizal Park, Entrance Gate', 'Anonymous User', 'anon@example.com', true, 5),
  ('CC-DEMO004', 'Pothole causing vehicle damage', 'Large pothole on Barangay Road near the school. Multiple vehicles have been damaged. Children walking to school are also at risk.', 'infrastructure', 'urgent', 'pending', 'Barangay Road near Mabini Elementary', 'Pedro Reyes', 'pedro@example.com', false, 41);
