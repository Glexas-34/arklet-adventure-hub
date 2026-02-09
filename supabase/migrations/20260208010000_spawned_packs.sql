CREATE TABLE IF NOT EXISTS spawned_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_key TEXT NOT NULL UNIQUE,
  pack_name TEXT NOT NULL,
  spawned_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE spawned_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view spawned packs" ON spawned_packs
  FOR SELECT USING (true);
CREATE POLICY "Admins can spawn packs" ON spawned_packs
  FOR INSERT WITH CHECK (spawned_by IN ('Adam', 'Admin___James', 'Admin___Levi'));
CREATE POLICY "Admins can unspawn packs" ON spawned_packs
  FOR DELETE USING (true);

GRANT ALL ON spawned_packs TO anon, authenticated, service_role;
