using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ResourceEngagementTrackingSystem.Infrastructure.Common.Middleware
{
    public class ResourceTrackingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ResourceTrackingMiddleware> _logger;

        public ResourceTrackingMiddleware(RequestDelegate next, ILogger<ResourceTrackingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Log resource tracking API calls
            if (context.Request.Path.StartsWithSegments("/api/resource-tracking"))
            {
                var startTime = DateTime.UtcNow;
                var method = context.Request.Method;
                var path = context.Request.Path;
                var userEmail = context.User?.Identity?.Name ?? "Anonymous";

                _logger.LogInformation("Resource Tracking API Call Started: {Method} {Path} by {User} at {StartTime}", 
                    method, path, userEmail, startTime);

                await _next(context);

                var endTime = DateTime.UtcNow;
                var duration = endTime - startTime;
                var statusCode = context.Response.StatusCode;

                _logger.LogInformation("Resource Tracking API Call Completed: {Method} {Path} by {User} - Status: {StatusCode}, Duration: {Duration}ms", 
                    method, path, userEmail, statusCode, duration.TotalMilliseconds);
            }
            else
            {
                await _next(context);
            }
        }
    }
}