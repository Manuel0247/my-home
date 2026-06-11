/*
  # Create Bookings Schema

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `traveler_id` (uuid, references profiles)
      - `check_in` (date, not null)
      - `check_out` (date, not null)
      - `guests` (integer, not null)
      - `total_price` (numeric, not null)
      - `status` (text: 'pending', 'confirmed', 'cancelled', 'completed')
      - `payment_status` (text: 'pending', 'paid', 'refunded')
      - `payment_method` (text)
      - `cancellation_reason` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `bookings` table
    - Policy for travelers to manage their bookings
    - Policy for hosts to view bookings for their properties
    - Policy for admins to view all bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  traveler_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method text,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Travelers can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (traveler_id = auth.uid());

CREATE POLICY "Travelers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (traveler_id = auth.uid());

CREATE POLICY "Travelers can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (traveler_id = auth.uid())
  WITH CHECK (traveler_id = auth.uid());

CREATE POLICY "Hosts can view bookings for their properties"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can update bookings for their properties"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = bookings.property_id
      AND properties.host_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );