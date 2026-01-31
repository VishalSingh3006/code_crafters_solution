using System;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Api.Middleware;
using ResourceEngagementTrackingSystem.Infrastructure.Logging;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Logging options from config (manual binding)
var exceptionLoggingOptions = new ExceptionLoggingOptions();
builder.Configuration.GetSection("CentralizedLogging:ExceptionLogging").Bind(exceptionLoggingOptions);
builder.Services.AddSingleton(exceptionLoggingOptions);
builder.Services.AddScoped(typeof(ResourceEngagementTrackingSystem.Infrastructure.Logging.IExceptionLogService), typeof(ResourceEngagementTrackingSystem.Infrastructure.Logging.ExceptionLogService));
builder.Services.AddSingleton(typeof(Microsoft.AspNetCore.Http.IHttpContextAccessor), typeof(Microsoft.AspNetCore.Http.HttpContextAccessor));
builder.Services.AddScoped(typeof(ResourceEngagementTrackingSystem.Infrastructure.Logging.AuditLogInterceptor));

builder.Services.AddControllers();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    );
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Resource & Engagement Tracking System API", Version = "v1" });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description =
                "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
        }
    );

    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement()
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                    Scheme = "oauth2",
                    Name = "Bearer",
                    In = ParameterLocation.Header,
                },
                new List<string>()
            },
        }
    );
});

builder.Services.AddInfrastructure(builder.Configuration);
// Add AuditLogInterceptor to DbContext
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) => {
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    options.AddInterceptors(serviceProvider.GetRequiredService<AuditLogInterceptor>());
});

var app = builder.Build();

// Initialize roles and seed default admin
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var roleSeeder = services.GetRequiredService<RoleSeederService>();
        await roleSeeder.SeedRolesAsync();
        
        // Create default admin - you should change these credentials in production
        await roleSeeder.SeedDefaultAdminAsync("admin@company.com", "Admin123!");
    }
    catch (Exception ex)
    {
        // Log the error in production
        Console.WriteLine($"An error occurred while seeding roles: {ex.Message}");
    }
}

// Use CORS
app.UseCors("AllowAll");

// Exception logging middleware
app.UseMiddleware<ResourceEngagementTrackingSystem.Api.Middleware.ExceptionLoggingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Auth Microservice API V1");
});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
