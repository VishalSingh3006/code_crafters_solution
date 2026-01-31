using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class ExceptionLog
    {
        [Key]
        public Guid Id { get; set; }
        public string Message { get; set; }
        public string StackTrace { get; set; }
        public string InnerException { get; set; }
        public string RequestPath { get; set; }
        public string HttpMethod { get; set; }
        public string RequestBody { get; set; }
        public int StatusCode { get; set; }
        public string UserId { get; set; }
        public string TraceId { get; set; }
        public DateTime TimestampUtc { get; set; }
    }

    public class AuditLog
    {
        [Key]
        public Guid Id { get; set; }
        public string EntityName { get; set; }
        public string Action { get; set; } // INSERT, UPDATE, DELETE
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public string UserId { get; set; }
        public string RequestIp { get; set; }
        public string Endpoint { get; set; }
        public DateTime TimestampUtc { get; set; }
    }
}
