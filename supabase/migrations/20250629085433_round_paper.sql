/*
  # Add shared tasks functionality

  1. New Tables
    - `shared_tasks`
      - `id` (uuid, primary key)
      - `original_task_id` (uuid, foreign key to tasks)
      - `shared_by_user_id` (uuid, foreign key to auth.users)
      - `shared_with_email` (text)
      - `message` (text, optional)
      - `task_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `shared_tasks` table
    - Add policies for users to manage tasks they shared
*/

-- Create a shared_tasks table for task sharing functionality
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

-- Enable Row Level Security (RLS) for shared_tasks table
ALTER TABLE public.shared_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shared_tasks table
CREATE POLICY "Users can view tasks they shared" 
  ON public.shared_tasks 
  FOR SELECT 
  USING (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can create shared tasks" 
  ON public.shared_tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can update tasks they shared" 
  ON public.shared_tasks 
  FOR UPDATE 
  USING (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can delete tasks they shared" 
  ON public.shared_tasks 
  FOR DELETE 
  USING (auth.uid() = shared_by_user_id);