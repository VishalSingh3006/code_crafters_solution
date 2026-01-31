using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendPasswordResetEmailAsync(
            string email,
            string resetToken,
            string userName = null
        )
        {
            var resetUrl = $"{_emailSettings.ResetPasswordUrl}?token={resetToken}&email={email}";
            var displayName = !string.IsNullOrEmpty(userName) ? userName : email;

            var subject = "Reset Your Password - Resource & Engagement Tracking System";

            var htmlBody =
                $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .header {{
            background: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            padding: 30px;
            background: #f8f9fa;
            border-radius: 0 0 8px 8px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .footer {{
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 14px;
        }}
        .security-notice {{
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <h2>Hello {displayName},</h2>
            
            <p>We received a request to reset your password for your Resource & Engagement Tracking System account.</p>
            
            <p>To reset your password, please click the button below:</p>
            
            <a href='{resetUrl}' class='button'>Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style='word-break: break-all; background: #f1f3f4; padding: 10px; border-radius: 3px;'>{resetUrl}</p>
            
            <div class='security-notice'>
                <strong>🔒 Security Notice:</strong>
                <ul>
                    <li>This link will expire in 24 hours for security reasons</li>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                </ul>
            </div>
            
            <div class='footer'>
                <p><strong>Resource & Engagement Tracking System</strong></p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
                <p>For support, please contact your system administrator.</p>
            </div>
        </div>
    </div>
</body>
</html>";

            var textBody =
                $@"
Password Reset Request

Hello {displayName},

We received a request to reset your password for your Resource & Engagement Tracking System account.

To reset your password, please visit the following link:
{resetUrl}

Security Notice:
- This link will expire in 24 hours for security reasons
- If you didn't request this password reset, please ignore this email
- Never share this link with anyone

Resource & Engagement Tracking System
This is an automated message. Please do not reply to this email.
";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendWelcomeEmailAsync(string email, string userName)
        {
            var subject = "Welcome to Resource & Engagement Tracking System";

            var htmlBody =
                $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .header {{
            background: #28a745;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            padding: 30px;
            background: #f8f9fa;
            border-radius: 0 0 8px 8px;
        }}
        .button {{
            display: inline-block;
            padding: 12px 24px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .feature-list {{
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h1>🎉 Welcome to Our Platform!</h1>
        </div>
        <div class='content'>
            <h2>Hello {userName},</h2>
            
            <p>Welcome to the Resource & Engagement Tracking System! Your account has been successfully created.</p>
            
            <div class='feature-list'>
                <h3>What you can do:</h3>
                <ul>
                    <li>📊 Track project resources and allocations</li>
                    <li>👥 Manage team assignments and skills</li>
                    <li>📈 Monitor engagement outcomes</li>
                    <li>🔒 Secure authentication with 2FA support</li>
                </ul>
            </div>
            
            <a href='{_emailSettings.ApplicationUrl}' class='button'>Access Your Account</a>
            
            <p>If you have any questions or need assistance, please contact your system administrator.</p>
            
            <p>Thank you for joining us!</p>
            
            <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;'>
                <p><strong>Resource & Engagement Tracking System</strong></p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>";

            var textBody =
                $@"
Welcome to Resource & Engagement Tracking System

Hello {userName},

Welcome to the Resource & Engagement Tracking System! Your account has been successfully created.

What you can do:
- Track project resources and allocations
- Manage team assignments and skills
- Monitor engagement outcomes
- Secure authentication with 2FA support

Access your account: {_emailSettings.ApplicationUrl}

If you have any questions or need assistance, please contact your system administrator.

Thank you for joining us!

Resource & Engagement Tracking System
This is an automated message. Please do not reply to this email.
";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendTwoFactorCodeEmailAsync(
            string email,
            string code,
            string userName = null
        )
        {
            var displayName = !string.IsNullOrEmpty(userName) ? userName : email;
            var subject = "Two-Factor Authentication Code - Resource & Engagement Tracking System";

            var htmlBody =
                $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .header {{
            background: #ffc107;
            color: #000;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            padding: 30px;
            background: #f8f9fa;
            border-radius: 0 0 8px 8px;
        }}
        .code-box {{
            background: #007bff;
            color: white;
            font-size: 24px;
            font-weight: bold;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            letter-spacing: 3px;
            margin: 20px 0;
        }}
        .warning {{
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='header'>
            <h1>🔐 Two-Factor Authentication</h1>
        </div>
        <div class='content'>
            <h2>Hello {displayName},</h2>
            
            <p>Your two-factor authentication code is:</p>
            
            <div class='code-box'>{code}</div>
            
            <p>Enter this code in the application to complete your login.</p>
            
            <div class='warning'>
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>This code is valid for 30 seconds only</li>
                    <li>Never share this code with anyone</li>
                    <li>If you didn't request this code, someone may be trying to access your account</li>
                </ul>
            </div>
            
            <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 14px;'>
                <p><strong>Resource & Engagement Tracking System</strong></p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>";

            var textBody =
                $@"
Two-Factor Authentication Code

Hello {displayName},

Your two-factor authentication code is: {code}

Enter this code in the application to complete your login.

Security Notice:
- This code is valid for 30 seconds only
- Never share this code with anyone
- If you didn't request this code, someone may be trying to access your account

Resource & Engagement Tracking System
This is an automated message. Please do not reply to this email.
";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendEmailAsync(
            string to,
            string subject,
            string htmlBody,
            string textBody = null
        )
        {
            try
            {
                using (
                    var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort)
                )
                {
                    client.EnableSsl = _emailSettings.EnableSsl;
                    client.Credentials = new NetworkCredential(
                        _emailSettings.Username,
                        _emailSettings.Password
                    );

                    var message = new MailMessage
                    {
                        From = new MailAddress(
                            _emailSettings.SenderEmail,
                            _emailSettings.SenderName
                        ),
                        Subject = subject,
                        Body = htmlBody,
                        IsBodyHtml = true,
                        Priority = MailPriority.Normal,
                    };

                    message.To.Add(to);

                    // Add plain text alternative if provided
                    if (!string.IsNullOrEmpty(textBody))
                    {
                        var plainView = AlternateView.CreateAlternateViewFromString(
                            textBody,
                            null,
                            "text/plain"
                        );
                        var htmlView = AlternateView.CreateAlternateViewFromString(
                            htmlBody,
                            null,
                            "text/html"
                        );

                        message.AlternateViews.Add(plainView);
                        message.AlternateViews.Add(htmlView);
                    }

                    await client.SendMailAsync(message);

                    _logger.LogInformation(
                        "Email sent successfully to {Email} with subject: {Subject}",
                        to,
                        subject
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send email to {Email} with subject: {Subject}",
                    to,
                    subject
                );
                throw new InvalidOperationException($"Failed to send email: {ex.Message}", ex);
            }
        }
    }
}
