-- Add HUDSONDASHARK to site_announcements insert policy
DROP POLICY IF EXISTS "Admins can set announcements" ON site_announcements;
CREATE POLICY "Admins can set announcements" ON site_announcements
  FOR INSERT WITH CHECK (set_by IN ('Adam', 'Admin___James', 'Admin___Levi', 'HUDSONDASHARK'));
