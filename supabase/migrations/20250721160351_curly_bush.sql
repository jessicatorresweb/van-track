/*
  # Van Inventory Management Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `name` (text)
      - `company` (text, optional)
      - `phone` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories`
      - `id` (text, primary key)
      - `name` (text)
      - `color` (text)
      - `icon` (text)
      - `created_at` (timestamp)
    
    - `inventory_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `part_number` (text)
      - `category_id` (text, references categories)
      - `current_stock` (integer)
      - `min_stock` (integer)
      - `unit` (text)
      - `location` (text)
      - `supplier` (text)
      - `barcode` (text, optional)
      - `last_restocked` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `stock_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `item_id` (uuid, references inventory_items)
      - `type` (text, check constraint)
      - `message` (text)
      - `is_dismissed` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Profiles are automatically created via trigger on auth.users

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for user-specific queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  company text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table with predefined categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  part_number text NOT NULL,
  category_id text NOT NULL REFERENCES categories(id),
  current_stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pieces',
  location text NOT NULL,
  supplier text NOT NULL,
  barcode text,
  last_restocked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stock_alerts table
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('low', 'out', 'overstock')),
  message text NOT NULL,
  is_dismissed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert predefined categories
INSERT INTO categories (id, name, color, icon) VALUES
  ('tools', 'Tools', '#2563eb', 'wrench'),
  ('hardware', 'Hardware', '#dc2626', 'hammer'),
  ('electrical', 'Electrical', '#eab308', 'zap'),
  ('plumbing', 'Plumbing', '#0ea5e9', 'droplets'),
  ('safety', 'Safety', '#16a34a', 'shield'),
  ('consumables', 'Consumables', '#9333ea', 'package'),
  ('other', 'Other', '#64748b', 'box')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for inventory_items
CREATE POLICY "Users can read own inventory items"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory items"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory items"
  ON inventory_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory items"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for stock_alerts
CREATE POLICY "Users can read own stock alerts"
  ON stock_alerts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stock alerts"
  ON stock_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stock alerts"
  ON stock_alerts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stock alerts"
  ON stock_alerts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for categories (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_current_stock ON inventory_items(current_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_items_part_number ON inventory_items(part_number);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_user_id ON stock_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_item_id ON stock_alerts(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_is_dismissed ON stock_alerts(is_dismissed);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();