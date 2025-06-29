/*
  # Email Verification System Setup

  1. Enhanced Profile Management
    - Add email verification tracking to profiles
    - Create email confirmation handling
    - Set up proper user onboarding flow

  2. Email Templates and Functions
    - Create custom email template storage
    - Add confirmation token handling
    - Set up verification workflow

  3. Security and RLS
    - Ensure proper access controls
    - Add verification status tracking
    - Create secure confirmation process
*/

-- Add email verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create email templates table for custom email content
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for email templates (read-only for authenticated users)
CREATE POLICY "Email templates are readable by authenticated users"
  ON public.email_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert confirmation email template
INSERT INTO public.email_templates (template_type, subject, body_html, body_text)
VALUES (
  'email_confirmation',
  '✅ Confirm your TaskSpace account',
  '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your TaskSpace Account</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
        }
        .logo { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .content { 
            padding: 40px 30px;
            background: white;
        }
        .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-1px);
        }
        .footer { 
            background: #f3f4f6; 
            color: #6b7280; 
            padding: 30px; 
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .feature-list {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            font-size: 15px;
        }
        .feature-icon {
            margin-right: 12px;
            font-size: 18px;
        }
        .url-box {
            word-break: break-all; 
            background: #f3f4f6; 
            padding: 16px; 
            border-radius: 6px; 
            font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
            font-size: 13px;
            border: 1px solid #e5e7eb;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="container">
            <div class="header">
                <div class="logo">
                    <span>📋</span>
                    <span>TaskSpace</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to TaskSpace!</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Please confirm your email address to get started</p>
            </div>
            
            <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">🎉 You''re almost ready!</h2>
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Thank you for signing up for TaskSpace. To complete your registration and start organizing your tasks beautifully, please confirm your email address by clicking the button below:
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                    <a href="{{ .ConfirmationURL }}" class="button">
                        ✅ Confirm Email Address
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #6b7280;">
                    If the button above doesn''t work, you can copy and paste this link into your browser:
                </p>
                <div class="url-box">{{ .ConfirmationURL }}</div>
                
                <div class="feature-list">
                    <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">🚀 What you''ll get with TaskSpace:</h3>
                    <div class="feature-item">
                        <span class="feature-icon">🔒</span>
                        <span>Secure account protection</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📧</span>
                        <span>Important notifications and updates</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🔄</span>
                        <span>Password recovery options</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✨</span>
                        <span>Full access to all TaskSpace features</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📊</span>
                        <span>Advanced analytics and insights</span>
                    </div>
                </div>
                
                <p style="font-size: 14px; color: #ef4444; background: #fef2f2; padding: 12px; border-radius: 6px; border-left: 4px solid #ef4444;">
                    <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0 0 8px 0;"><strong>TaskSpace - Beautiful Task Management</strong></p>
                <p style="margin: 0 0 8px 0;">Fall in love with productivity</p>
                <p style="margin: 0; font-size: 13px;">
                    If you didn''t create an account with us, please ignore this email.<br>
                    Need help? Contact us at <a href="mailto:support@taskspace.app" style="color: #3b82f6;">support@taskspace.app</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>',
  'Welcome to TaskSpace!

Please confirm your email address to complete your registration.

Confirmation Link: {{ .ConfirmationURL }}

What you''ll get:
- Secure account protection
- Important notifications
- Password recovery options
- Full access to TaskSpace features

This link expires in 24 hours.

If you didn''t create this account, please ignore this email.

TaskSpace - Beautiful Task Management
https://taskspacetodo.netlify.app'
)
ON CONFLICT (template_type) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text,
  updated_at = now();

-- Create shared tasks table for task sharing functionality
CREATE TABLE IF NOT EXISTS public.shared_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  shared_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email TEXT NOT NULL,
  message TEXT,
  task_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on shared tasks
ALTER TABLE public.shared_tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shared tasks
CREATE POLICY "Users can view tasks they shared"
  ON public.shared_tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can create shared tasks"
  ON public.shared_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can update tasks they shared"
  ON public.shared_tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = shared_by_user_id);

CREATE POLICY "Users can delete tasks they shared"
  ON public.shared_tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = shared_by_user_id);

-- Update the handle_new_user function to include new profile fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email_verified,
    bio,
    phone,
    location,
    job_title,
    company,
    website
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.email_confirmed_at IS NOT NULL, false),
    null,
    null,
    null,
    null,
    null,
    null
  );
  RETURN new;
END;
$$;

-- Create function to generate verification token
CREATE OR REPLACE FUNCTION public.generate_verification_token(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token TEXT;
  user_id UUID;
BEGIN
  -- Generate a secure random token
  token := encode(gen_random_bytes(32), 'base64url');
  
  -- Get user ID from email
  SELECT auth.users.id INTO user_id
  FROM auth.users
  WHERE auth.users.email = user_email;
  
  -- Update profile with verification token
  UPDATE public.profiles
  SET verification_token = token,
      verification_sent_at = now()
  WHERE id = user_id;
  
  RETURN token;
END;
$$;

-- Create function to verify email with token
CREATE OR REPLACE FUNCTION public.verify_email_with_token(token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- Find profile with this verification token
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE verification_token = token
    AND email_verified = false
    AND verification_sent_at > now() - INTERVAL '24 hours';
  
  IF profile_record.id IS NOT NULL THEN
    -- Mark email as verified
    UPDATE public.profiles
    SET email_verified = true,
        verification_token = null,
        updated_at = now()
    WHERE id = profile_record.id;
    
    -- Also update auth.users if possible
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = profile_record.id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create function to check if user email is verified
CREATE OR REPLACE FUNCTION public.is_email_verified(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_verified BOOLEAN;
BEGIN
  SELECT email_verified INTO is_verified
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(is_verified, false);
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_verification_token ON public.profiles(verification_token);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON public.profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_shared_by ON public.shared_tasks(shared_by_user_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_email ON public.shared_tasks(shared_with_email);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;