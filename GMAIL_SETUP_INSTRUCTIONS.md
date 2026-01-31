# Gmail Email Service Setup

## Prerequisites
1. Gmail account with 2-factor authentication enabled
2. Gmail App Password (not your regular Gmail password)

## Steps to Configure Gmail SMTP

### 1. Enable 2-Factor Authentication
- Go to [Google Account Settings](https://myaccount.google.com)
- Navigate to Security → 2-Step Verification
- Follow the setup process if not already enabled

### 2. Generate App Password
- Go to [Google Account Settings](https://myaccount.google.com)
- Navigate to Security → 2-Step Verification → App passwords
- Select "Mail" and your device type
- Copy the 16-character app password (no spaces)

### 3. Update appsettings.json
Replace the placeholders in `appsettings.json`:

```json
{
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "EnableSsl": true,
    "Username": "your-actual-gmail@gmail.com",
    "Password": "your-16-char-app-password",
    "SenderEmail": "your-actual-gmail@gmail.com",
    "SenderName": "Resource & Engagement Tracking System",
    "ApplicationUrl": "https://localhost:5173",
    "ResetPasswordUrl": "https://localhost:5173/reset-password"
  }
}
```

### 4. Environment Variables (Production)
For production, use environment variables instead:
- `EmailSettings__Username`
- `EmailSettings__Password`
- `EmailSettings__SenderEmail`

Example Docker/Environment setup:
```bash
export EmailSettings__Username="your-gmail@gmail.com"
export EmailSettings__Password="your-app-password"
export EmailSettings__SenderEmail="your-gmail@gmail.com"
```

## Features Implemented

### Password Reset Email
- Professional HTML email template
- Secure reset link with token
- 24-hour expiration notice
- Security warnings
- Mobile-responsive design

### Welcome Email
- Branded welcome message
- Feature overview
- Direct login link
- Professional styling

### Two-Factor Authentication Email
- Time-sensitive code delivery
- Security notices
- Clear formatting

## Testing
1. Update `appsettings.json` with your Gmail credentials
2. Build and run the API
3. Test password reset endpoint:
   ```bash
   POST /api/auth/forgot-password
   {
     "email": "test-user@example.com"
   }
   ```

## Security Notes
- Never commit real credentials to version control
- Use environment variables in production
- App passwords are more secure than regular passwords
- Gmail SMTP has daily sending limits (500 emails/day for free accounts)

## Troubleshooting
- **Authentication failed**: Check app password is correct (16 characters, no spaces)
- **Connection refused**: Verify port 587 and SSL enabled
- **Sending limits**: Gmail free accounts limited to 500 emails/day
- **Blocked sender**: Gmail may temporarily block if too many emails sent quickly

## Production Considerations
- Consider using a dedicated email service (SendGrid, AWS SES, etc.)
- Implement proper logging for email failures
- Add retry logic for failed emails
- Monitor sending quotas and limits