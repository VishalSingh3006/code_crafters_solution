using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace ResourceEngagementTrackingSystem.Infrastructure.Common.Middleware
{
    public class ResourceTrackingExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ResourceTrackingExceptionMiddleware> _logger;

        public ResourceTrackingExceptionMiddleware(
            RequestDelegate next,
            ILogger<ResourceTrackingExceptionMiddleware> logger
        )
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
                when (context.Request.Path.StartsWithSegments("/api/resource-tracking"))
            {
                _logger.LogError(
                    ex,
                    "An error occurred in Resource Tracking API: {Path}",
                    context.Request.Path
                );
                await HandleResourceTrackingExceptionAsync(context, ex);
            }
        }

        private static async Task HandleResourceTrackingExceptionAsync(
            HttpContext context,
            Exception exception
        )
        {
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = new
                {
                    message = "An error occurred in the Resource Tracking system",
                    details = exception.Message,
                    timestamp = DateTime.UtcNow,
                    path = context.Request.Path.ToString(),
                },
            };

            context.Response.StatusCode = exception switch
            {
                ArgumentException => 400,
                UnauthorizedAccessException => 401,
                KeyNotFoundException => 404,
                InvalidOperationException => 409,
                _ => 500,
            };

            var jsonResponse = JsonSerializer.Serialize(
                response,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
            );

            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
