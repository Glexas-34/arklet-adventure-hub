-- Create game_rooms table for hosting games
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_code TEXT NOT NULL UNIQUE,
  host_nickname TEXT NOT NULL,
  target_rarity TEXT NOT NULL,
  time_limit_minutes INTEGER NOT NULL CHECK (time_limit_minutes >= 1 AND time_limit_minutes <= 30),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  winner_nickname TEXT,
  winning_item TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_players table for players in a room
CREATE TABLE public.game_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  is_host BOOLEAN NOT NULL DEFAULT false,
  current_item TEXT,
  current_rarity TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, nickname)
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

-- Game rooms are public (anyone can view/create/update for game mechanics)
CREATE POLICY "Anyone can view game rooms"
  ON public.game_rooms FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create game rooms"
  ON public.game_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update game rooms"
  ON public.game_rooms FOR UPDATE
  USING (true);

-- Game players are public (for multiplayer lobby)
CREATE POLICY "Anyone can view players"
  ON public.game_players FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join games"
  ON public.game_players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their player"
  ON public.game_players FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can leave games"
  ON public.game_players FOR DELETE
  USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_players;