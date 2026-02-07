-- Add a unique auto-incrementing user number to player profiles
CREATE SEQUENCE IF NOT EXISTS player_user_number_seq START WITH 1;

ALTER TABLE public.player_profiles
  ADD COLUMN user_number INTEGER UNIQUE DEFAULT nextval('player_user_number_seq');

-- Backfill existing rows in creation order
UPDATE public.player_profiles
SET user_number = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
  FROM public.player_profiles
) sub
WHERE public.player_profiles.id = sub.id;

-- Advance the sequence past the backfilled values
SELECT setval('player_user_number_seq', COALESCE((SELECT MAX(user_number) FROM public.player_profiles), 0) + 1, false);
