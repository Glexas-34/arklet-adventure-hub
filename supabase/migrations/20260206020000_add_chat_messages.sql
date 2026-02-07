-- Create global chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_nickname TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can view messages
CREATE POLICY "Anyone can view messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Anyone can send messages
CREATE POLICY "Anyone can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

-- Enable realtime for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
