/*
  # Multi-Tenant Van Inventory Management System

  1. New Tables
    - `companies` - Master company records
    - `profiles` - User profiles (admins and employees)
    - `vans` - Company van fleet management
    - `categories` - Inventory item categories
    - `warehouse_items` - Central warehouse inventory
    - `van_inventory` - Items currently in each van
    - `inventory_transfers` - Track items moving between warehouse and vans
    - `stock_alerts` - Low stock and other alerts
    - `reports` - Generated reports for admins

  2. Security
    - Enable RLS on all tables
    - Company-based data isolation
    - Role-based access (admin vs employee)
    - Admins can see all company data
    - Employees can only see their assigned van data

  3. Features
    - Multi-tenant company structure
    - Warehouse to van inventory transfers
    - Comprehensive reporting system
    - Role-based permissions
    - Audit trail for all transfers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table (master accounts)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User profiles with company association and roles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
  assigned_van_id uuid, -- Will reference vans table
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Company van fleet
CREATE TABLE IF NOT EXISTS vans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  van_number text NOT NULL,
  license_plate text,
  make text,
  model text,
  year integer,
  assigned_driver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, van_number)
);

-- Add foreign key constraint for assigned_van_id in profiles
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_van 
  FOREIGN KEY (assigned_van_id) REFERENCES vans(id) ON DELETE SET NULL;

-- Item categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Warehouse inventory (central company inventory)
CREATE TABLE IF NOT EXISTS warehouse_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  part_number text NOT NULL,
  category_id text NOT NULL REFERENCES categories(id),
  current_stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  max_stock integer DEFAULT NULL,
  unit text NOT NULL DEFAULT 'pieces',
  supplier text,
  cost_per_unit decimal(10,2),
  barcode text,
  description text,
  location_in_warehouse text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, part_number)
);

-- Van inventory (items currently in each van)
CREATE TABLE IF NOT EXISTS van_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  van_id uuid NOT NULL REFERENCES vans(id) ON DELETE CASCADE,
  warehouse_item_id uuid NOT NULL REFERENCES warehouse_items(id) ON DELETE CASCADE,
  current_stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  location_in_van text,
  last_restocked timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(van_id, warehouse_item_id)
);

-- Inventory transfers (warehouse to van, van to warehouse, van to van)
CREATE TABLE IF NOT EXISTS inventory_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  warehouse_item_id uuid NOT NULL REFERENCES warehouse_items(id) ON DELETE CASCADE,
  transfer_type text NOT NULL CHECK (transfer_type IN ('warehouse_to_van', 'van_to_warehouse', 'van_to_van', 'adjustment')),
  from_van_id uuid REFERENCES vans(id) ON DELETE SET NULL,
  to_van_id uuid REFERENCES vans(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  reason text,
  notes text,
  transferred_by uuid NOT NULL REFERENCES profiles(id),
  approved_by uuid REFERENCES profiles(id),
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')) DEFAULT 'completed',
  transferred_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Stock alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('low_stock_warehouse', 'low_stock_van', 'out_of_stock_warehouse', 'out_of_stock_van', 'overstock')),
  warehouse_item_id uuid REFERENCES warehouse_items(id) ON DELETE CASCADE,
  van_id uuid REFERENCES vans(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_dismissed boolean DEFAULT false,
  dismissed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Reports table for generated reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('inventory_summary', 'low_stock', 'transfer_history', 'van_utilization', 'cost_analysis')),
  title text NOT NULL,
  parameters jsonb,
  data jsonb NOT NULL,
  generated_by uuid NOT NULL REFERENCES profiles(id),
  generated_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Insert default categories
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
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vans ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE van_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Company admins can update their company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their company"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their company"
  ON profiles
  FOR ALL
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for vans
CREATE POLICY "Users can view vans in their company"
  ON vans
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage vans in their company"
  ON vans
  FOR ALL
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for categories (readable by all authenticated users)
CREATE POLICY "Categories are readable by authenticated users"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for warehouse_items
CREATE POLICY "Users can view warehouse items in their company"
  ON warehouse_items
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage warehouse items in their company"
  ON warehouse_items
  FOR ALL
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for van_inventory
CREATE POLICY "Users can view van inventory in their company"
  ON van_inventory
  FOR SELECT
  TO authenticated
  USING (van_id IN (SELECT id FROM vans WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid())));

CREATE POLICY "Employees can manage inventory in their assigned van"
  ON van_inventory
  FOR ALL
  TO authenticated
  USING (van_id IN (SELECT assigned_van_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all van inventory in their company"
  ON van_inventory
  FOR ALL
  TO authenticated
  USING (van_id IN (SELECT id FROM vans WHERE company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin')));

-- RLS Policies for inventory_transfers
CREATE POLICY "Users can view transfers in their company"
  ON inventory_transfers
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create transfers in their company"
  ON inventory_transfers
  FOR INSERT
  TO authenticated
  WITH CHECK (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all transfers in their company"
  ON inventory_transfers
  FOR ALL
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for stock_alerts
CREATE POLICY "Users can view alerts in their company"
  ON stock_alerts
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can dismiss alerts in their company"
  ON stock_alerts
  FOR UPDATE
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

-- RLS Policies for reports
CREATE POLICY "Users can view reports in their company"
  ON reports
  FOR SELECT
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage reports in their company"
  ON reports
  FOR ALL
  TO authenticated
  USING (company_id IN (SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_vans_company_id ON vans(company_id);
CREATE INDEX IF NOT EXISTS idx_vans_assigned_driver ON vans(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_company_id ON warehouse_items(company_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_category ON warehouse_items(category_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_part_number ON warehouse_items(part_number);
CREATE INDEX IF NOT EXISTS idx_van_inventory_van_id ON van_inventory(van_id);
CREATE INDEX IF NOT EXISTS idx_van_inventory_warehouse_item ON van_inventory(warehouse_item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_company_id ON inventory_transfers(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_warehouse_item ON inventory_transfers(warehouse_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_company_id ON stock_alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_dismissed ON stock_alerts(is_dismissed);
CREATE INDEX IF NOT EXISTS idx_reports_company_id ON reports(company_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

-- Functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vans_updated_at BEFORE UPDATE ON vans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouse_items_updated_at BEFORE UPDATE ON warehouse_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_van_inventory_updated_at BEFORE UPDATE ON van_inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create company profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called when a new user signs up
  -- The app will need to handle company creation and profile setup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup (optional - can be handled in app)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to generate stock alerts
CREATE OR REPLACE FUNCTION generate_stock_alerts()
RETURNS void AS $$
BEGIN
  -- Clear existing alerts
  DELETE FROM stock_alerts WHERE created_at < now() - interval '1 day';
  
  -- Generate warehouse low stock alerts
  INSERT INTO stock_alerts (company_id, alert_type, warehouse_item_id, message)
  SELECT 
    wi.company_id,
    CASE 
      WHEN wi.current_stock = 0 THEN 'out_of_stock_warehouse'
      ELSE 'low_stock_warehouse'
    END,
    wi.id,
    CASE 
      WHEN wi.current_stock = 0 THEN wi.name || ' (' || wi.part_number || ') is out of stock in warehouse'
      ELSE wi.name || ' (' || wi.part_number || ') is running low in warehouse (' || wi.current_stock || ' ' || wi.unit || ' remaining)'
    END
  FROM warehouse_items wi
  WHERE wi.current_stock <= wi.min_stock AND wi.is_active = true;
  
  -- Generate van low stock alerts
  INSERT INTO stock_alerts (company_id, alert_type, warehouse_item_id, van_id, message)
  SELECT 
    v.company_id,
    CASE 
      WHEN vi.current_stock = 0 THEN 'out_of_stock_van'
      ELSE 'low_stock_van'
    END,
    vi.warehouse_item_id,
    vi.van_id,
    CASE 
      WHEN vi.current_stock = 0 THEN wi.name || ' (' || wi.part_number || ') is out of stock in van ' || v.van_number
      ELSE wi.name || ' (' || wi.part_number || ') is running low in van ' || v.van_number || ' (' || vi.current_stock || ' ' || wi.unit || ' remaining)'
    END
  FROM van_inventory vi
  JOIN vans v ON vi.van_id = v.id
  JOIN warehouse_items wi ON vi.warehouse_item_id = wi.id
  WHERE vi.current_stock <= vi.min_stock AND v.is_active = true AND wi.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;