-- Rename games_played to wins
ALTER TABLE public.player_profiles RENAME COLUMN games_played TO wins;