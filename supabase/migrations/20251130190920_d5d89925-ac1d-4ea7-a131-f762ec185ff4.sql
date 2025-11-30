-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'nutritionist')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height NUMERIC(5,2),
  weight NUMERIC(5,2),
  target_weight NUMERIC(5,2),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  health_conditions TEXT[],
  dietary_preferences TEXT[],
  allergies TEXT[],
  daily_calorie_goal INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  platform TEXT DEFAULT 'telegram' CHECK (platform IN ('telegram', 'whatsapp')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'ai', 'admin')),
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'voice', 'document')),
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  foods JSONB NOT NULL,
  total_calories INTEGER,
  total_protein NUMERIC(6,2),
  total_carbs NUMERIC(6,2),
  total_fats NUMERIC(6,2),
  notes TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  workout_type TEXT NOT NULL,
  exercises JSONB NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create progress_logs table
CREATE TABLE IF NOT EXISTS public.progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  weight NUMERIC(5,2),
  body_measurements JSONB,
  photos TEXT[],
  notes TEXT,
  mood TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  category TEXT NOT NULL CHECK (category IN ('meal_plans', 'workout_plans', 'ai_assistant', 'general')),
  feedback_text TEXT NOT NULL,
  suggestions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for clients (admins can access all)
CREATE POLICY "Admins can view all clients"
  ON public.clients FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can insert clients"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can update clients"
  ON public.clients FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for conversations
CREATE POLICY "Admins can view all conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can insert conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for messages
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for meal_plans
CREATE POLICY "Admins can view all meal plans"
  ON public.meal_plans FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can manage meal plans"
  ON public.meal_plans FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for workout_plans
CREATE POLICY "Admins can view all workout plans"
  ON public.workout_plans FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can manage workout plans"
  ON public.workout_plans FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for progress_logs
CREATE POLICY "Admins can view all progress logs"
  ON public.progress_logs FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can manage progress logs"
  ON public.progress_logs FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- RLS Policies for support_tickets
CREATE POLICY "Admins can view all support tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

CREATE POLICY "Admins can manage support tickets"
  ON public.support_tickets FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'nutritionist')));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;