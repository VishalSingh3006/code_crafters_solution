using System;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics;

namespace ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking
{
    public interface IAnalyticsService
    {
        Task<DashboardDataDto> GetDashboardDataAsync();
        Task<ResourceAnalyticsDto> GetResourceAnalyticsAsync();
        Task<ResourceUtilizationDto> GetResourceUtilizationAsync(
            DateTime? startDate,
            DateTime? endDate
        );
        Task<object> GetProjectPerformanceAsync(int? projectId);
        Task<object> GetEmployeePerformanceAsync(
            int? employeeId,
            DateTime? startDate,
            DateTime? endDate
        );
        Task<object> GetRevenueAnalysisAsync(int year);
        Task<object> GetCapacityPlanningDataAsync();
    }
}
