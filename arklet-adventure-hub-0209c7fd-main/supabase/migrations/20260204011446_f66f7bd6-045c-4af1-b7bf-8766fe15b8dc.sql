-- Create player profiles table for global leaderboard
CREATE TABLE public.player_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL UNIQUE,
  unique_count INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (for leaderboard)
CREATE POLICY "Anyone can view profiles"
ON public.player_profiles
FOR SELECT
USING (true);

-- Anyone can create their profile
CREATE POLICY "Anyone can create profile"
ON public.player_profiles
FOR INSERT
WITH CHECK (true);

-- Anyone can update profiles (we'll use nickname matching)
CREATE POLICY "Anyone can update profiles"
ON public.player_profiles
FOR UPDATE
USING (true);

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_profiles;