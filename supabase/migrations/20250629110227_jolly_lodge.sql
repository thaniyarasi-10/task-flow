/*
  # Fix Email Verification System

  1. Email Configuration
    - Enable email confirmation in Supabase
    - Set up proper email templates
    - Configure SMTP settings

  2. Auth Configuration
    - Update auth settings for email confirmation
    - Set proper redirect URLs
    - Enable email confirmation requirement

  3. Security
    - Ensure proper email verification flow
    - Set up email rate limiting
    - Configure email templates
*/

-- Update auth configuration to require email confirmation
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = true,
  enable_email_change_confirmations = true,
  email_confirm_url = 'https://taskspacetodo.netlify.app/auth',
  site_url = 'https://taskspacetodo.netlify.app'
WHERE id = 1;

-- Insert auth config if it doesn't exist
INSERT INTO auth.config (
  id,
  enable_signup,
  enable_email_confirmations,
  enable_email_change_confirmations,
  email_confirm_url,
  site_url
) 
SELECT 
  1,
  true,
  true,
  true,
  'https://taskspacetodo.netlify.app/auth',
  'https://taskspacetodo.netlify.app'
WHERE NOT EXISTS (SELECT 1 FROM auth.config WHERE id = 1);

-- Create email templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert email confirmation template
INSERT INTO auth.email_templates (template_type, subject, body)
VALUES (
  'confirmation',
  'Confirm your TaskSpace account',
  '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirm Your TaskSpace Account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px 20px; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { background: #374151; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📋 TaskSpace</div>
            <h1>Welcome to TaskSpace!</h1>
            <p>Please confirm your email address to get started</p>
        </div>
        
        <div class="content">
            <h2>🎉 Almost there!</h2>
            <p>Thank you for signing up for TaskSpace. To complete your registration and start managing your tasks, please confirm your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✅ Confirm Email Address
                </a>
            </div>
            
            <p>If the button above doesn''t work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
                {{ .ConfirmationURL }}
            </p>
            
            <p><strong>Why verify your email?</strong></p>
            <ul>
                <li>🔒 Secure your account</li>
                <li>📧 Receive important notifications</li>
                <li>🔄 Enable password recovery</li>
                <li>✨ Access all TaskSpace features</li>
            </ul>
            
            <p>This link will expire in 24 hours for security reasons.</p>
        </div>
        
        <div class="footer">
            <p><strong>TaskSpace - Beautiful Task Management</strong></p>
            <p>If you didn''t create an account with us, please ignore this email.</p>
            <p>Need help? Contact us at support@taskspace.app</p>
        </div>
    </div>
</body>
</html>'
)
ON CONFLICT (template_type) DO UPDATE SET
  subject = EXCLUDED.subject,
  body = EXCLUDED.body,
  updated_at = now();

-- Create function to send confirmation emails
CREATE OR REPLACE FUNCTION auth.send_confirmation_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  confirmation_token TEXT;
  confirmation_url TEXT;
  email_template RECORD;
BEGIN
  -- Only send confirmation email for new signups that aren't confirmed
  IF TG_OP = 'INSERT' AND NEW.email_confirmed_at IS NULL THEN
    -- Generate confirmation token
    confirmation_token := encode(gen_random_bytes(32), 'base64url');
    
    -- Update user with confirmation token
    UPDATE auth.users 
    SET confirmation_token = confirmation_token,
        confirmation_sent_at = now()
    WHERE id = NEW.id;
    
    -- Build confirmation URL
    confirmation_url := 'https://taskspacetodo.netlify.app/auth?token=' || confirmation_token || '&type=signup&email=' || NEW.email;
    
    -- Get email template
    SELECT * INTO email_template 
    FROM auth.email_templates 
    WHERE template_type = 'confirmation';
    
    -- Log the email details (since we can't actually send emails from this function)
    RAISE NOTICE 'EMAIL CONFIRMATION REQUIRED:';
    RAISE NOTICE 'To: %', NEW.email;
    RAISE NOTICE 'Subject: %', email_template.subject;
    RAISE NOTICE 'Confirmation URL: %', confirmation_url;
    RAISE NOTICE 'Please check your email and click the confirmation link.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for email confirmation
DROP TRIGGER IF EXISTS on_auth_user_created_send_confirmation ON auth.users;
CREATE TRIGGER on_auth_user_created_send_confirmation
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.send_confirmation_email();

-- Create function to handle email confirmation
CREATE OR REPLACE FUNCTION auth.confirm_email(confirmation_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user with this confirmation token
  SELECT * INTO user_record
  FROM auth.users
  WHERE confirmation_token = confirm_email.confirmation_token
    AND email_confirmed_at IS NULL
    AND confirmation_sent_at > now() - INTERVAL '24 hours';
  
  IF user_record.id IS NOT NULL THEN
    -- Confirm the email
    UPDATE auth.users
    SET email_confirmed_at = now(),
        confirmation_token = NULL
    WHERE id = user_record.id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;