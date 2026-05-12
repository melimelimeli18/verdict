-- VERDICT: Full App Migration
-- Adds products, stock_movements, price_history tables + updates checklists

-- ============================================================
-- 1. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT DEFAULT '',
  category TEXT DEFAULT '',
  supplier TEXT DEFAULT '',
  buy_price NUMERIC(12,2) DEFAULT 0,
  sell_price NUMERIC(12,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);

-- ============================================================
-- 2. STOCK MOVEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('masuk', 'keluar')),
  reason TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  note TEXT DEFAULT '',
  supplier TEXT DEFAULT '',
  nota TEXT DEFAULT '',
  buy_price NUMERIC(12,2) DEFAULT 0,
  movement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_user_id ON stock_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(movement_date);

-- ============================================================
-- 3. PRICE HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS price_history (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  old_price NUMERIC(12,2) DEFAULT 0,
  new_price NUMERIC(12,2) DEFAULT 0,
  supplier TEXT DEFAULT '',
  nota TEXT DEFAULT '',
  change_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_user_id ON price_history(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);

-- ============================================================
-- 4. CHECKLIST ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS checklist_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  phase INTEGER DEFAULT 1,
  item_order INTEGER DEFAULT 0,
  tag TEXT DEFAULT 'wajib',
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checklist_items_user_id ON checklist_items(user_id);

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- Checklist Items RLS
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checklist items"
  ON checklist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist items"
  ON checklist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist items"
  ON checklist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Stock Movements RLS
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stock movements"
  ON stock_movements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stock movements"
  ON stock_movements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stock movements"
  ON stock_movements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stock movements"
  ON stock_movements FOR DELETE
  USING (auth.uid() = user_id);

-- Price History RLS
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own price history"
  ON price_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price history"
  ON price_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own price history"
  ON price_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. HELPER: Run this to seed checklist_items
-- ============================================================
-- INSERT INTO checklist_items (user_id, item_id, completed, phase, item_order, tag, title, description)
-- VALUES 
-- (auth.uid(), 'hpp-margin', false, 1, 1, 'wajib', 'Tentukan niche / kategori produk yang spesifik', 'Jangan jual semua hal...'),
-- ... (seed via frontend or separate seed file)