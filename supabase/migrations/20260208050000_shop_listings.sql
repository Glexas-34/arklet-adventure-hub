CREATE TABLE shop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_nickname TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_rarity TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE shop_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shop listings" ON shop_listings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON shop_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete" ON shop_listings FOR DELETE USING (true);

GRANT ALL ON shop_listings TO anon, authenticated, service_role;
