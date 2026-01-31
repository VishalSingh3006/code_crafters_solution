using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Logging
{
    public class AuditLogInterceptor : SaveChangesInterceptor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AuditLogInterceptor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            var context = eventData.Context;
            var httpContext = _httpContextAccessor.HttpContext;
            var userId = httpContext?.User?.FindFirst("sub")?.Value;
            var ip = httpContext?.Connection?.RemoteIpAddress?.ToString();
            var endpoint = httpContext?.Request?.Path.Value;
            var timestamp = DateTime.UtcNow;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
                .ToList();

            foreach (var entry in entries)
            {
                var audit = new AuditLog
                {
                    Id = Guid.NewGuid(),
                    EntityName = entry.Entity.GetType().Name,
                    Action = entry.State.ToString().ToUpper(),
                    OldValues = entry.State == EntityState.Added ? null : System.Text.Json.JsonSerializer.Serialize(entry.OriginalValues.ToObject()),
                    NewValues = entry.State == EntityState.Deleted ? null : System.Text.Json.JsonSerializer.Serialize(entry.CurrentValues.ToObject()),
                    UserId = userId,
                    RequestIp = ip,
                    Endpoint = endpoint,
                    TimestampUtc = timestamp
                };
                context.Set<AuditLog>().Add(audit);
            }
            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }
    }
}
