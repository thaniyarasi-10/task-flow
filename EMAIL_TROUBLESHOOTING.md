# 📧 EMAIL TROUBLESHOOTING GUIDE

## 🚨 Email Not Sending? Follow This Guide

### Issue 1: No Verification Email Received

**Cause:** Supabase email confirmation is disabled or SMTP not configured

**Solution:**
1. **Check Supabase Dashboard:**
   - Go to Authentication → Settings
   - Ensure "Enable email confirmations" is ✅ CHECKED
   - Verify SMTP settings are configured

2. **Check Spam Folder:**
   - Verification emails often go to spam
   - Add your domain to safe senders

3. **Verify SMTP Credentials:**
   - Test SMTP settings in Supabase
   - Ensure Gmail App Password is used (not regular password)

### Issue 2: "Session Not Found" Error

**Cause:** Email verification link is expired or invalid

**Solution:**
1. **Request New Verification:**
   - Try signing up again with same email
   - Check for new verification email

2. **Check URL Parameters:**
   - Ensure verification link includes proper tokens
   - Verify redirect URL matches Supabase settings

### Issue 3: Verification Link Doesn't Work

**Cause:** Incorrect redirect URLs in Supabase

**Solution:**
1. **Update Supabase Settings:**
   - Site URL: `https://taskspacetodo.netlify.app`
   - Redirect URLs: `https://taskspacetodo.netlify.app/auth`

2. **Check Email Template:**
   - Must include `{{ .ConfirmationURL }}`
   - Template must be properly formatted

### Issue 4: Gmail SMTP Not Working

**Cause:** Using regular password instead of App Password

**Solution:**
1. **Enable 2-Factor Authentication** on Gmail
2. **Generate App Password:**
   - Google Account → Security → App passwords
   - Select "Mail" and generate 16-character password
3. **Use App Password in Supabase SMTP settings**

### Issue 5: Rate Limiting

**Cause:** Too many email attempts

**Solution:**
1. **Wait 5-10 minutes** between attempts
2. **Check Supabase Rate Limits:**
   - Authentication → Rate Limits
   - Adjust email sending limits if needed

## 🔧 Quick Fixes

### Fix 1: Reset Email Verification
```sql
-- Run in Supabase SQL Editor to reset user email verification
UPDATE auth.users 
SET email_confirmed_at = NULL, 
    confirmation_token = NULL 
WHERE email = 'your-email@example.com';
```

### Fix 2: Manual Email Confirmation (Testing Only)
```sql
-- Run in Supabase SQL Editor to manually confirm email
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

### Fix 3: Check Email Logs
1. Go to Supabase Dashboard
2. Logs → Authentication
3. Look for email sending errors

## 📋 Verification Checklist

**Supabase Configuration:**
- [ ] Email confirmations enabled
- [ ] SMTP configured with valid credentials
- [ ] Site URL matches deployed domain
- [ ] Redirect URLs include auth page
- [ ] Email template includes confirmation URL

**Email Provider:**
- [ ] Gmail 2FA enabled (if using Gmail)
- [ ] App password generated and used
- [ ] Sender email verified
- [ ] Domain not blacklisted

**Testing:**
- [ ] New account creation triggers email
- [ ] Email received (check spam)
- [ ] Verification link works
- [ ] Redirects to correct page
- [ ] User can sign in after verification

## 🆘 Emergency Workaround

If email verification is blocking testing:

1. **Temporarily disable email confirmation:**
   - Supabase → Authentication → Settings
   - Uncheck "Enable email confirmations"
   - Users can sign in immediately after signup

2. **Re-enable after fixing SMTP:**
   - Configure SMTP properly
   - Re-enable email confirmations
   - Test with new account

## 📞 Need Help?

1. **Check Supabase Logs** for specific error messages
2. **Test SMTP settings** with a simple email client
3. **Verify domain reputation** isn't causing delivery issues
4. **Contact Supabase support** if configuration looks correct

**Remember: Email verification requires proper SMTP configuration in Supabase Dashboard!**