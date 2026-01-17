/*
  # Create Payment Dashboard Tables

  1. New Tables
    - `transactions` - Armazena transações de pagamento
      - `id` (uuid, primary key)
      - `amount` (decimal)
      - `status` (approved, pending, rejected)
      - `payment_method` (cartão, pix, boleto)
      - `device_type` (desktop, mobile, tablet)
      - `created_at` (timestamp)

    - `products` - Produtos mais vendidos
      - `id` (uuid, primary key)
      - `name` (text)
      - `image_url` (text)
      - `revenue` (decimal)
      - `quantity_sold` (integer)

    - `payment_methods` - Métodos de pagamento com estatísticas
      - `id` (uuid, primary key)
      - `name` (text)
      - `percentage` (decimal)
      - `revenue` (decimal)
      - `transaction_count` (integer)

    - `conversion_data` - Dados de conversão
      - `id` (uuid, primary key)
      - `category` (payment_method ou device_type)
      - `label` (nome da categoria)
      - `conversion_rate` (decimal)
      - `completed` (integer)
      - `total` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (dados de dashboard)
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(15, 2) NOT NULL,
  status text NOT NULL CHECK (status IN ('approved', 'pending', 'rejected')),
  payment_method text NOT NULL,
  device_type text NOT NULL,
  ticket_value decimal(15, 2),
  chargeback boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  revenue decimal(15, 2) NOT NULL,
  quantity_sold integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  percentage decimal(5, 2) NOT NULL,
  revenue decimal(15, 2) NOT NULL,
  transaction_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversion_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  label text NOT NULL,
  conversion_rate decimal(5, 2) NOT NULL,
  completed integer NOT NULL,
  total integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access on transactions"
  ON transactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access on products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access on payment_methods"
  ON payment_methods FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access on conversion_data"
  ON conversion_data FOR SELECT
  TO public
  USING (true);

INSERT INTO payment_methods (name, percentage, revenue, transaction_count) VALUES
  ('cartão', 64, 3275.20, 640),
  ('pix', 30, 931.80, 300),
  ('boleto', 6, 103.42, 60)
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, image_url, revenue, quantity_sold) VALUES
  ('Camiseta Color Trace manga l...', 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg', 1065.90, 11),
  ('Relógio esportivo masculino Fe...', 'https://images.pexels.com/photos/1738942/pexels-photo-1738942.jpeg', 2159.90, 9),
  ('Caneca de café preta cerâmica', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', 153.30, 7),
  ('Pulseira terapia magnética perd...', 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg', 232.85, 5)
ON CONFLICT DO NOTHING;

INSERT INTO conversion_data (category, label, conversion_rate, completed, total) VALUES
  ('payment_method', 'Cartão', 66.7, 18, 27),
  ('payment_method', 'Pix', 50, 7, 14),
  ('payment_method', 'Boleto', 25, 3, 12),
  ('device_type', 'Mobile', 100, 12, 12),
  ('device_type', 'Desktop', 100, 16, 16)
ON CONFLICT DO NOTHING;