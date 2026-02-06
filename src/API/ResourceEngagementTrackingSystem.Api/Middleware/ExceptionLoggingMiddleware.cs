using System;
using System.IO;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ResourceEngagementTrackingSystem.Infrastructure.Logging;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Api.Middleware
{
    public class ExceptionLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionLoggingMiddleware> _logger;
        private readonly IExceptionLogService _exceptionLogService;
        private readonly ExceptionLoggingOptions _options;

        public ExceptionLoggingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionLoggingMiddleware> logger,
            IExceptionLogService exceptionLogService,
            ExceptionLoggingOptions options
        )
        {
            _next = next;
            _logger = logger;
            _exceptionLogService = exceptionLogService;
            _options = options;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string traceId = context.TraceIdentifier;
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var requestPath = context.Request.Path;
                var httpMethod = context.Request.Method;
                var requestBody = await ReadRequestBodyAsync(context, _options);
                var statusCode = 500;
                var timestamp = DateTime.UtcNow;

                var exceptionLog = new ExceptionLog
                {
                    Id = Guid.NewGuid(),
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerException = ex.InnerException?.Message,
                    RequestPath = requestPath,
                    HttpMethod = httpMethod,
                    RequestBody = requestBody,
                    StatusCode = statusCode,
                    UserId = userId,
                    TraceId = traceId,
                    TimestampUtc = timestamp,
                };

                if (_options.EnableExceptionLogging)
                {
                    try
                    {
                        await _exceptionLogService.LogExceptionAsync(exceptionLog);
                    }
                    catch (Exception logEx)
                    {
                        _logger.LogWarning(logEx, "Failed to persist exception log; proceeding without DB logging. TraceId: {TraceId}", traceId);
                    }
                }
                _logger.LogError(
                    ex,
                    "Exception caught: {Message}, TraceId: {TraceId}",
                    ex.Message,
                    traceId
                );

                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/json";
                var errorResponse = new
                {
                    success = false,
                    message = "An unexpected error occurred.",
                    traceId,
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse));
            }
        }

        private async Task<string> ReadRequestBodyAsync(
            HttpContext context,
            ExceptionLoggingOptions options
        )
        {
            if (!options.LogRequestBody)
                return null;
            try
            {
                context.Request.EnableBuffering();
                context.Request.Body.Position = 0;
                using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
                return MaskSensitiveFields(body, options);
            }
            catch
            {
                return null;
            }
        }

        private string MaskSensitiveFields(string body, ExceptionLoggingOptions options)
        {
            if (string.IsNullOrEmpty(body) || options?.SensitiveFields == null)
                return body;
            foreach (var field in options.SensitiveFields)
            {
                var pattern = $"\"{field}\"\\s*:\\s*\".*?\"";
                var replacement = $"\"{field}\":\"***MASKED***\"";
                body = System.Text.RegularExpressions.Regex.Replace(
                    body,
                    pattern,
                    replacement,
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase
                );
            }
            return body;
        }
    }

    public class ExceptionLoggingOptions
    {
        public bool EnableExceptionLogging { get; set; } = true;
        public bool LogRequestBody { get; set; } = true;
        public string[] SensitiveFields { get; set; } = new[] { "password", "token", "secret" };
    }
}
