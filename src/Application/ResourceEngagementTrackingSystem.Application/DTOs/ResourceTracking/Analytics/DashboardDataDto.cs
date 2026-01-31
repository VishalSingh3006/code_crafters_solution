using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics
{
    public class DashboardDataDto
    {
        public int TotalActiveProjects { get; set; }
        public int TotalActiveEmployees { get; set; }
        public int TotalPendingDeliveries { get; set; }
        public decimal TotalRevenueThisMonth { get; set; }
        public decimal AverageResourceUtilization { get; set; }
        public List<ProjectStatusSummaryDto> ProjectStatusSummary { get; set; } = new();
        public List<EmployeeUtilizationSummaryDto> TopUtilizedEmployees { get; set; } = new();
    }

    public class ProjectStatusSummaryDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class EmployeeUtilizationSummaryDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public decimal UtilizationPercentage { get; set; }
        public decimal TotalHours { get; set; }
    }
}
