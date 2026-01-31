using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Logging
{
    public interface IExceptionLogService
    {
        Task LogExceptionAsync(ExceptionLog log);
    }

    public class ExceptionLogService : IExceptionLogService
    {
        private readonly ApplicationDbContext _db;

        public ExceptionLogService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task LogExceptionAsync(ExceptionLog log)
        {
            await _db.ExceptionLogs.AddAsync(log);
            await _db.SaveChangesAsync();
        }
    }
}
