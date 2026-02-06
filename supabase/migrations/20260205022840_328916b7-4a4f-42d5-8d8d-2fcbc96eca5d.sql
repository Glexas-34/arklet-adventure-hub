-- Add successful_trades column to player_profiles
ALTER TABLE public.player_profiles ADD COLUMN successful_trades integer NOT NULL DEFAULT 0;

-- Create trade_sessions table for active trades
CREATE TABLE public.trade_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_nickname text NOT NULL,
  target_nickname text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, trading, completed, declined, cancelled
  requester_accepted boolean NOT NULL DEFAULT false,
  target_accepted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on trade_sessions
ALTER TABLE public.trade_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for trade_sessions
CREATE POLICY "Anyone can view trade sessions"
ON public.trade_sessions FOR SELECT USING (true);

CREATE POLICY "Anyone can create trade sessions"
ON public.trade_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update trade sessions"
ON public.trade_sessions FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete trade sessions"
ON public.trade_sessions FOR DELETE USING (true);

-- Create trade_offers table for items being offered
CREATE TABLE public.trade_offers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.trade_sessions(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  item_name text NOT NULL,
  item_rarity text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on trade_offers
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;

-- RLS policies for trade_offers
CREATE POLICY "Anyone can view trade offers"
ON public.trade_offers FOR SELECT USING (true);

CREATE POLICY "Anyone can create trade offers"
ON public.trade_offers FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update trade offers"
ON public.trade_offers FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete trade offers"
ON public.trade_offers FOR DELETE USING (true);

-- Enable realtime for trade tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_offers;