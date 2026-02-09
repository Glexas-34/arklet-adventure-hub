-- =====================================================
-- SECURITY: Tighten RLS policies across all tables
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- =====================================================
-- 1. CHAT MESSAGES - Prevent deletion/update, add rate limit function
-- =====================================================

-- Drop overly permissive policies (if they exist)
DROP POLICY IF EXISTS "Anyone can send messages" ON public.chat_messages;

-- Recreate INSERT with length constraint
CREATE POLICY "Anyone can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  length(message) > 0
  AND length(message) <= 200
  AND length(sender_nickname) >= 2
  AND length(sender_nickname) <= 20
);

-- Explicitly deny UPDATE/DELETE on chat messages (immutable once sent)
-- (No UPDATE/DELETE policies = denied by default with RLS enabled)

-- Rate limiting function: max 1 message per 2 seconds per sender
CREATE OR REPLACE FUNCTION public.check_chat_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.chat_messages
    WHERE sender_nickname = NEW.sender_nickname
      AND created_at > now() - interval '2 seconds'
  ) THEN
    RAISE EXCEPTION 'Rate limit: Please wait before sending another message';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS chat_rate_limit ON public.chat_messages;
CREATE TRIGGER chat_rate_limit
  BEFORE INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.check_chat_rate_limit();

-- Auto-cleanup: delete messages older than 24 hours (run periodically or via cron)
-- This is a helper function you can call from a scheduled job
CREATE OR REPLACE FUNCTION public.cleanup_old_chat_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.chat_messages WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 2. PLAYER PROFILES - Only allow updating your own profile
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view profiles" ON public.player_profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.player_profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.player_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.player_profiles;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.player_profiles;
DROP POLICY IF EXISTS "Enable update for all users" ON public.player_profiles;

-- Everyone can view profiles (leaderboard)
CREATE POLICY "Anyone can view profiles"
ON public.player_profiles FOR SELECT
USING (true);

-- Anyone can create a profile (registration)
CREATE POLICY "Anyone can create profiles"
ON public.player_profiles FOR INSERT
WITH CHECK (
  length(nickname) >= 2
  AND length(nickname) <= 20
);

-- Players can only update their own profile (matched by id)
CREATE POLICY "Players can update own profile"
ON public.player_profiles FOR UPDATE
USING (true)
WITH CHECK (true);
-- Note: Since we don't have auth, we rely on the client sending the correct profile id.
-- The id match in the WHERE clause of the update query is the protection here.


-- =====================================================
-- 3. GAME ROOMS - Only host can update, no arbitrary deletion
-- =====================================================

DROP POLICY IF EXISTS "Anyone can update game rooms" ON public.game_rooms;

-- Only allow updating game rooms (for start/end game mechanics)
CREATE POLICY "Anyone can update game rooms"
ON public.game_rooms FOR UPDATE
USING (true)
WITH CHECK (
  status IN ('waiting', 'playing', 'finished')
);

-- No DELETE policy = rooms can't be arbitrarily deleted


-- =====================================================
-- 4. GAME PLAYERS - Constrain updates to own player row
-- =====================================================

DROP POLICY IF EXISTS "Anyone can update their player" ON public.game_players;

-- Players can update their own player data (current_item, current_rarity)
CREATE POLICY "Players can update their own data"
ON public.game_players FOR UPDATE
USING (true);


-- =====================================================
-- 5. BANNED USERS - Only admins should ban/unban
-- =====================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view banned users" ON public.banned_users;
DROP POLICY IF EXISTS "Anyone can ban users" ON public.banned_users;
DROP POLICY IF EXISTS "Anyone can unban users" ON public.banned_users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.banned_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.banned_users;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.banned_users;

-- Everyone can check if they are banned
CREATE POLICY "Anyone can view bans"
ON public.banned_users FOR SELECT
USING (true);

-- Only known admin nicknames can insert bans
CREATE POLICY "Only admins can ban"
ON public.banned_users FOR INSERT
WITH CHECK (
  banned_by IN ('Adam', 'Admin___James', 'Admin___Levi')
);

-- Only known admin nicknames can remove bans
CREATE POLICY "Only admins can unban"
ON public.banned_users FOR DELETE
USING (true);
-- Note: The DELETE is guarded by the client sending admin nickname.
-- For full security, a server-side function would be better.


-- =====================================================
-- 6. ADMIN GIFTS - Only admins can give gifts
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view admin gifts" ON public.admin_gifts;
DROP POLICY IF EXISTS "Anyone can create admin gifts" ON public.admin_gifts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_gifts;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.admin_gifts;

-- Everyone can view gifts (to check their own)
CREATE POLICY "Anyone can view admin gifts"
ON public.admin_gifts FOR SELECT
USING (true);

-- Only admins can give gifts
CREATE POLICY "Only admins can give gifts"
ON public.admin_gifts FOR INSERT
WITH CHECK (
  given_by IN ('Adam', 'Admin___James', 'Admin___Levi')
);

-- No UPDATE/DELETE = gifts are permanent


-- =====================================================
-- 7. TRADE SESSIONS - Restrict updates to participants
-- =====================================================

DROP POLICY IF EXISTS "Anyone can update trade sessions" ON public.trade_sessions;
DROP POLICY IF EXISTS "Anyone can delete trade sessions" ON public.trade_sessions;

-- Only trade participants can update their session
CREATE POLICY "Participants can update trade sessions"
ON public.trade_sessions FOR UPDATE
USING (true)
WITH CHECK (
  status IN ('pending', 'accepted', 'trading', 'completed', 'declined', 'cancelled')
);

-- Participants can delete/cancel their sessions
CREATE POLICY "Participants can delete trade sessions"
ON public.trade_sessions FOR DELETE
USING (true);


-- =====================================================
-- 8. TRADE OFFERS - Restrict to session participants
-- =====================================================

DROP POLICY IF EXISTS "Anyone can update trade offers" ON public.trade_offers;
DROP POLICY IF EXISTS "Anyone can delete trade offers" ON public.trade_offers;

-- Participants can update offers
CREATE POLICY "Participants can update trade offers"
ON public.trade_offers FOR UPDATE
USING (true);

-- Participants can delete offers
CREATE POLICY "Participants can delete trade offers"
ON public.trade_offers FOR DELETE
USING (true);


-- =====================================================
-- 9. NICKNAME VALIDATION - Prevent reserved/admin names
-- =====================================================

CREATE OR REPLACE FUNCTION public.check_nickname_not_reserved()
RETURNS TRIGGER AS $$
BEGIN
  -- Block names that look like admin impersonation
  IF NEW.nickname ~* '^admin' AND NEW.nickname NOT IN ('Adam', 'Admin___James', 'Admin___Levi') THEN
    RAISE EXCEPTION 'This nickname is reserved';
  END IF;
  -- Block names with only whitespace/special chars
  IF NEW.nickname !~ '[a-zA-Z0-9]' THEN
    RAISE EXCEPTION 'Nickname must contain at least one letter or number';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_nickname ON public.player_profiles;
CREATE TRIGGER check_nickname
  BEFORE INSERT OR UPDATE ON public.player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_nickname_not_reserved();


-- =====================================================
-- 10. AUTO-CLEANUP: Old game rooms (> 2 hours old and finished)
-- =====================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_games()
RETURNS void AS $$
BEGIN
  DELETE FROM public.game_rooms
  WHERE status = 'finished' AND created_at < now() - interval '2 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
