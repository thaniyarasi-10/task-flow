/*
  # Database Schema Setup

  1. Tables
    - `profiles` - User profile information (create if not exists)
    - `tasks` - Task management (create if not exists) 
    - `shared_tasks` - Task sharing functionality (create if not exists)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add storage policies for avatar uploads

  3. Functions & Triggers
    - Auto-create profile on user registration
    - Storage bucket for avatars
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'completed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shared_tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.shared_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  shared_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shared_with_email TEXT NOT NULL,
  message TEXT,
  task_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for all tables
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'tasks' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'shared_tasks' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.shared_tasks ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for profiles table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" 
      ON public.profiles 
      FOR SELECT 
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
      ON public.profiles 
      FOR UPDATE 
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
      ON public.profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create RLS policies for tasks table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Users can view their own tasks'
  ) THEN
    CREATE POLICY "Users can view their own tasks" 
      ON public.tasks 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Users can create their own tasks'
  ) THEN
    CREATE POLICY "Users can create their own tasks" 
      ON public.tasks 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Users can update their own tasks'
  ) THEN
    CREATE POLICY "Users can update their own tasks" 
      ON public.tasks 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'tasks' AND policyname = 'Users can delete their own tasks'
  ) THEN
    CREATE POLICY "Users can delete their own tasks" 
      ON public.tasks 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create RLS policies for shared_tasks table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_tasks' AND policyname = 'Users can view tasks they shared'
  ) THEN
    CREATE POLICY "Users can view tasks they shared" 
      ON public.shared_tasks 
      FOR SELECT 
      USING (auth.uid() = shared_by_user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_tasks' AND policyname = 'Users can create shared tasks'
  ) THEN
    CREATE POLICY "Users can create shared tasks" 
      ON public.shared_tasks 
      FOR INSERT 
      WITH CHECK (auth.uid() = shared_by_user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_tasks' AND policyname = 'Users can update tasks they shared'
  ) THEN
    CREATE POLICY "Users can update tasks they shared" 
      ON public.shared_tasks 
      FOR UPDATE 
      USING (auth.uid() = shared_by_user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shared_tasks' AND policyname = 'Users can delete tasks they shared'
  ) THEN
    CREATE POLICY "Users can delete tasks they shared" 
      ON public.shared_tasks 
      FOR DELETE 
      USING (auth.uid() = shared_by_user_id);
  END IF;
END $$;

-- Create function to handle new user registration (replace if exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'full_name', new.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- Create storage bucket for profile pictures (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;
END $$;

-- Create storage policies for the avatars bucket (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible" 
      ON storage.objects 
      FOR SELECT 
      USING (bucket_id = 'avatars');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar" 
      ON storage.objects 
      FOR INSERT 
      WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar" 
      ON storage.objects 
      FOR UPDATE 
      USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar" 
      ON storage.objects 
      FOR DELETE 
      USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;