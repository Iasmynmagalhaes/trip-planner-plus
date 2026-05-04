
CREATE TABLE public.trip_data (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own trip" ON public.trip_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own trip" ON public.trip_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own trip" ON public.trip_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own trip" ON public.trip_data FOR DELETE USING (auth.uid() = user_id);
