/*
  # Create Properties Schema

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `host_id` (uuid, references profiles)
      - `title` (text, not null)
      - `description` (text)
      - `property_type` (text: 'apartment', 'house', 'studio', 'room')
      - `address` (text, not null)
      - `city` (text, not null)
      - `country` (text, not null, default 'Côte d''Ivoire')
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `price_per_night` (numeric, not null)
      - `currency` (text, default 'XOF')
      - `bedrooms` (integer)
      - `bathrooms` (integer)
      - `max_guests` (integer)
      - `amenities` (jsonb)
      - `house_rules` (text)
      - `images` (jsonb)
      - `status` (text: 'pending', 'approved', 'rejected', default 'pending')
      - `is_active` (boolean, default true)
      - `rejection_reason` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `properties` table
    - Policy for hosts to manage their own properties
    - Policy for travelers to view approved properties
    - Policy for admins to manage all properties
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  property_type text NOT NULL CHECK (property_type IN ('apartment', 'house', 'studio', 'room')),
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'Côte d''Ivoire',
  latitude numeric,
  longitude numeric,
  price_per_night numeric NOT NULL,
  currency text DEFAULT 'XOF',
  bedrooms integer DEFAULT 1,
  bathrooms integer DEFAULT 1,
  max_guests integer DEFAULT 1,
  amenities jsonb DEFAULT '[]'::jsonb,
  house_rules text,
  images jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_active boolean DEFAULT true,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (host_id = auth.uid());

CREATE POLICY "Hosts can create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (host_id = auth.uid());

CREATE POLICY "Travelers can view approved properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (status = 'approved' AND is_active = true);

CREATE POLICY "Admins can manage all properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );