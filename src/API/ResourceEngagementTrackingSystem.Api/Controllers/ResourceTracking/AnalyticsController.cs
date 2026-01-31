using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Analytics
{
    [ApiController]
    [Route("api/resource-tracking/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardData()
        {
            var dashboardData = await _analyticsService.GetDashboardDataAsync();
            return Ok(dashboardData);
        }

        [HttpGet("resource-utilization")]
        public async Task<IActionResult> GetResourceUtilization([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var utilizationData = await _analyticsService.GetResourceUtilizationAsync(startDate, endDate);
            return Ok(utilizationData);
        }

        [HttpGet("project-performance")]
        public async Task<IActionResult> GetProjectPerformance([FromQuery] int? projectId)
        {
            var performanceData = await _analyticsService.GetProjectPerformanceAsync(projectId);
            return Ok(performanceData);
        }

        [HttpGet("employee-performance")]
        public async Task<IActionResult> GetEmployeePerformance([FromQuery] int? employeeId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var performanceData = await _analyticsService.GetEmployeePerformanceAsync(employeeId, startDate, endDate);
            return Ok(performanceData);
        }

        [HttpGet("revenue-analysis")]
        public async Task<IActionResult> GetRevenueAnalysis([FromQuery] int year)
        {
            var revenueData = await _analyticsService.GetRevenueAnalysisAsync(year);
            return Ok(revenueData);
        }

        [HttpGet("capacity-planning")]
        public async Task<IActionResult> GetCapacityPlanningData()
        {
            var capacityData = await _analyticsService.GetCapacityPlanningDataAsync();
            return Ok(capacityData);
        }
    }
}