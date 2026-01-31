# 🔧 Gmail SMTP Authentication Fix

## Issue
You're getting a **5.7.0 Authentication Required** error because Gmail doesn't allow regular passwords for SMTP authentication when 2-Factor Authentication is enabled.

## ✅ Solution Steps

### 1. Enable 2-Factor Authentication (if not already enabled)
- Go to [Google Account Security](https://myaccount.google.com/security)
- Click "2-Step Verification" and follow the setup

### 2. Generate Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Select **Mail** and **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the **16-character password** (no spaces)

### 3. Update appsettings.json
Replace `"YOUR_GMAIL_APP_PASSWORD_HERE"` in appsettings.json with your 16-character app password:

```json
{
  "EmailSettings": {
    "Username": "code.craftersht@gmail.com",
    "Password": "abcd efgh ijkl mnop",  // Your 16-character app password here
    "SenderEmail": "code.craftersht@gmail.com"
  }
}
```

### 4. Test Email Functionality
After updating with the correct app password, restart your API and test the password reset feature.

## 🛡️ Security Notes
- **Never commit real credentials** to version control
- App passwords are more secure than regular passwords
- Each app password is unique and can be revoked individually

## 🚨 Quick Fix
If you need to test immediately, you can temporarily:
1. Turn off 2FA for the Gmail account
2. Enable "Less secure app access" 
3. Use regular password

**But this is NOT recommended for production!**

## ✅ Verification
Once configured correctly, you should see:
```
Email sent successfully to user@example.com with subject: Reset Your Password
```

Instead of the authentication error you're currently getting.