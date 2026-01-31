using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models;
using ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Services;
using ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(
                config.GetConnectionString("DefaultConnection"),
                ServerVersion.AutoDetect(config.GetConnectionString("DefaultConnection"))
            )
        );

        // Register Project, Client, and Employee services
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IClientService, ClientService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IDesignationService, DesignationService>();
        services.AddScoped<ISkillService, SkillService>();
        services.AddScoped<IPortfolioCompanyService, PortfolioCompanyService>();
        services.AddScoped<IBillingRateService, BillingRateService>();
        services.AddScoped<IProjectClientEngagementService, ProjectClientEngagementService>();

        // Register ResourceTracking repositories
        services.AddScoped<IDeliveryRepository, DeliveryRepository>();
        services.AddScoped<IBillingRecordRepository, BillingRecordRepository>();
        services.AddScoped<IStaffingRecordRepository, StaffingRecordRepository>();
        services.AddScoped<IRecruitmentRecordRepository, RecruitmentRecordRepository>();

        // Register ResourceTracking services
        services.AddScoped<IDeliveryService, DeliveryService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IStaffingService, StaffingService>();
        services.AddScoped<IRecruitmentService, RecruitmentService>();

        // JWT Authentication Configuration
        var jwtSettings = config.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                };
            });

        services
            .AddIdentityCore<ApplicationUser>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
                // Enable 2FA
                options.Tokens.AuthenticatorTokenProvider =
                    TokenOptions.DefaultAuthenticatorProvider;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Register services
        services.AddScoped<TokenService>();
        services.AddScoped<TwoFactorService>();
        services.AddScoped<RoleSeederService>();
        services.AddScoped<DataSeederService>();

        return services;
    }
}
