using Microsoft.AspNetCore.Authorization;

namespace ResourceEngagementTrackingSystem.Infrastructure.Common.Auth
{
    public static class ResourceTrackingPolicies
    {
        public const string CanViewDeliveries = "CanViewDeliveries";
        public const string CanManageDeliveries = "CanManageDeliveries";
        public const string CanViewStaffing = "CanViewStaffing";
        public const string CanManageStaffing = "CanManageStaffing";
        public const string CanViewRecruitment = "CanViewRecruitment";
        public const string CanManageRecruitment = "CanManageRecruitment";
        public const string CanViewBilling = "CanViewBilling";
        public const string CanManageBilling = "CanManageBilling";
        public const string CanViewAnalytics = "CanViewAnalytics";
        public const string CanManageAnalytics = "CanManageAnalytics";

        public static void AddResourceTrackingPolicies(this AuthorizationOptions options)
        {
            options.AddPolicy(
                CanViewDeliveries,
                policy => policy.RequireRole("Admin", "Manager", "Employee")
            );

            options.AddPolicy(
                CanManageDeliveries,
                policy => policy.RequireRole("Admin", "Manager")
            );

            options.AddPolicy(
                CanViewStaffing,
                policy => policy.RequireRole("Admin", "Manager", "HR")
            );

            options.AddPolicy(
                CanManageStaffing,
                policy => policy.RequireRole("Admin", "Manager", "HR")
            );

            options.AddPolicy(
                CanViewRecruitment,
                policy => policy.RequireRole("Admin", "Manager", "HR")
            );

            options.AddPolicy(CanManageRecruitment, policy => policy.RequireRole("Admin", "HR"));

            options.AddPolicy(
                CanViewBilling,
                policy => policy.RequireRole("Admin", "Manager", "Finance")
            );

            options.AddPolicy(CanManageBilling, policy => policy.RequireRole("Admin", "Finance"));

            options.AddPolicy(
                CanViewAnalytics,
                policy => policy.RequireRole("Admin", "Manager", "Finance")
            );

            options.AddPolicy(CanManageAnalytics, policy => policy.RequireRole("Admin"));
        }
    }
}
