CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_nickname TEXT NOT NULL,
  target_nickname TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_nickname, target_nickname)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view friendships they are part of" ON friendships
  FOR SELECT USING (true);
CREATE POLICY "Anyone can send friend requests" ON friendships
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Target can update friend request status" ON friendships
  FOR UPDATE USING (true);
CREATE POLICY "Either party can delete friendship" ON friendships
  FOR DELETE USING (true);

GRANT ALL ON friendships TO anon, authenticated, service_role;
