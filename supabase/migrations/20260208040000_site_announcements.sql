CREATE TABLE IF NOT EXISTS site_announcements (
  id TEXT PRIMARY KEY DEFAULT 'current',
  message TEXT NOT NULL DEFAULT '',
  set_by TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcements" ON site_announcements
  FOR SELECT USING (true);
CREATE POLICY "Admins can set announcements" ON site_announcements
  FOR INSERT WITH CHECK (set_by IN ('Adam', 'Admin___James', 'Admin___Levi'));
CREATE POLICY "Admins can update announcements" ON site_announcements
  FOR UPDATE USING (true);

GRANT ALL ON site_announcements TO anon, authenticated, service_role;
