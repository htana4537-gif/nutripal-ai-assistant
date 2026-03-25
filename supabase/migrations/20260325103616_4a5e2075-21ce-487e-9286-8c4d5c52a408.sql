
-- Fix: Change default role from 'admin' to 'pending' for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'pending');
  RETURN NEW;
END;
$function$;

-- Fix: Change default value for role column from 'admin' to 'pending'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'pending';

-- Fix: Restrict profile UPDATE so users cannot change their own role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
