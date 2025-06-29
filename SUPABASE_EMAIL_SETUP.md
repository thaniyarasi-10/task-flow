# 🚨 SUPABASE EMAIL SETUP - CRITICAL FOR EMAIL VERIFICATION

## URGENT: Enable Email Verification in Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your TaskSpace project

### Step 2: Configure Authentication Settings
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **ENABLE** the following:
   - ✅ **Enable email confirmations**
   - ✅ **Enable email change confirmations**
   - ✅ **Enable secure email change**

### Step 3: Set Site URL
1. In the same Authentication Settings page
2. Set **Site URL** to: `https://taskspacetodo.netlify.app`
3. Add **Redirect URLs**:
   - `https://taskspacetodo.netlify.app/auth`
   - `https://taskspacetodo.netlify.app/dashboard`

### Step 4: Configure Email Templates
1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup**
3. Update the template with this content:

**Subject:** `Confirm your TaskSpace account`

**Body:**
```html
<h2>Welcome to TaskSpace!</h2>
<p>Thank you for signing up. Please click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>
<p>If the button doesn't work, copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account, please ignore this email.</p>
```

### Step 5: SMTP Configuration (CRITICAL)
1. Go to **Authentication** → **Settings**
2. Scroll to **SMTP Settings**
3. **ENABLE** SMTP and configure:

**Option A: Gmail SMTP (Recommended)**
- **Host:** `smtp.gmail.com`
- **Port:** `587`
- **Username:** Your Gmail address
- **Password:** Your Gmail App Password (not regular password)
- **Sender name:** `TaskSpace`
- **Sender email:** Your Gmail address

**Option B: SendGrid SMTP**
- **Host:** `smtp.sendgrid.net`
- **Port:** `587`
- **Username:** `apikey`
- **Password:** Your SendGrid API key
- **Sender name:** `TaskSpace`
- **Sender email:** Your verified sender email

### Step 6: Test Email Verification
1. Save all settings
2. Go to your TaskSpace app
3. Try creating a new account
4. Check your email (including spam folder)
5. Click the verification link

### Step 7: Enable Rate Limiting (Optional)
1. Go to **Authentication** → **Rate Limits**
2. Set reasonable limits:
   - **Email sending:** 10 per hour
   - **SMS sending:** 5 per hour

## 🔧 Quick Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **Google Account** → **Security** → **App passwords**
3. Generate a new app password for "Mail"
4. Use this 16-character password in Supabase SMTP settings

## ✅ Verification Checklist

- [ ] Email confirmations enabled in Supabase
- [ ] Site URL set correctly
- [ ] Redirect URLs configured
- [ ] Email template updated
- [ ] SMTP configured with valid credentials
- [ ] Test email sent successfully

## 🚨 CRITICAL NOTES

1. **Without SMTP configuration, NO emails will be sent**
2. **The Site URL must match your deployed domain exactly**
3. **Gmail requires App Passwords, not regular passwords**
4. **Check spam folders for verification emails**
5. **Email templates must include {{ .ConfirmationURL }}**

## 📧 Alternative: Use Supabase's Built-in Email

If SMTP setup is complex, you can temporarily use Supabase's built-in email service:

1. Go to **Authentication** → **Settings**
2. **DISABLE** SMTP settings
3. Supabase will use their default email service
4. This has limitations but works for testing

## 🧪 Testing

After setup:
1. Create a new account in your app
2. Check email inbox (and spam)
3. Click verification link
4. Should redirect to dashboard

**The email verification will NOT work without proper Supabase configuration!**