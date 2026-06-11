/*
  # Create Availability and Transactions Schema

  1. New Tables
    - `property_availability`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `date` (date, not null)
      - `is_available` (boolean, default true)
      - `created_at` (timestamptz)

    - `transactions`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `amount` (numeric, not null)
      - `currency` (text, default 'XOF')
      - `commission_rate` (numeric, default 10)
      - `commission_amount` (numeric)
      - `host_amount` (numeric)
      - `payment_method` (text)
      - `payment_reference` (text)
      - `status` (text: 'pending', 'completed', 'refunded')
      - `created_at` (timestamptz)

    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Appropriate policies for each table
*/

CREATE TABLE IF NOT EXISTS property_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, date)
);

ALTER TABLE property_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can manage availability for own properties"
  ON property_availability
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_availability.property_id
      AND properties.host_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view availability"
  ON property_availability
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'XOF',
  commission_rate numeric DEFAULT 10,
  commission_amount numeric,
  host_amount numeric,
  payment_method text,
  payment_reference text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = transactions.booking_id
      AND (bookings.traveler_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM properties
             WHERE properties.id = bookings.property_id
             AND properties.host_id = auth.uid()
           ))
    )
  );

CREATE POLICY "Admins can manage all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

INSERT INTO settings (key, value) VALUES
  ('commission_rate', '{"rate": 10}'::jsonb),
  ('currencies', '{"default": "XOF", "supported": ["XOF", "EUR", "USD"]}'::jsonb),
  ('languages', '{"default": "fr", "supported": ["fr", "en"]}'::jsonb)
ON CONFLICT (key) DO NOTHING;