using System.Threading.Tasks;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string resetToken, string userName = null);
        Task SendEmailAsync(string to, string subject, string htmlBody, string textBody = null);
        Task SendWelcomeEmailAsync(string email, string userName);
        Task SendTwoFactorCodeEmailAsync(string email, string code, string userName = null);
    }
}
