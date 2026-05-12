-- VERDICT: Simple Stock Log Table
-- Standalone stock in/out logger (not tied to products table)
-- Matches view.html #page-stok prototype

CREATE TABLE IF NOT EXISTS stok_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT DEFAULT 'Lainnya',
  type TEXT NOT NULL CHECK (type IN ('masuk', 'keluar')),
  qty_change INTEGER NOT NULL CHECK (qty_change > 0),
  reason TEXT DEFAULT 'Lainnya',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stok_log_user_id ON stok_log(user_id);
CREATE INDEX IF NOT EXISTS idx_stok_log_created_at ON stok_log(created_at DESC);

-- RLS Policies
ALTER TABLE stok_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stok log"
  ON stok_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stok log"
  ON stok_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stok log"
  ON stok_log FOR DELETE
  USING (auth.uid() = user_id);