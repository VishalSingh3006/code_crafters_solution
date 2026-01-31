using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDataDto> GetDashboardDataAsync()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            // Get counts
            var totalActiveProjects = await _context.Projects.CountAsync();
            var totalActiveEmployees = await _context.Employees.CountAsync();

            var totalPendingDeliveries = await _context.Deliveries.CountAsync(d =>
                d.Status == DeliveryStatus.Planned || d.Status == DeliveryStatus.InProgress
            );

            // Calculate revenue this month (using billing records)
            var totalRevenueThisMonth =
                await _context
                    .BillingRecords.Where(b =>
                        b.BillingDate >= startOfMonth && b.Status == BillingStatus.Invoiced
                    )
                    .SumAsync(b => (decimal?)b.TotalAmount)
                ?? 0;

            // Calculate average resource utilization
            var averageUtilization =
                await _context
                    .StaffingRecords.Where(s => s.Status == StaffingStatus.Active)
                    .AverageAsync(s => (decimal?)s.AllocationPercentage)
                ?? 0;

            // Get project status summary
            var projectStatusSummary = await _context
                .Projects.GroupBy(p => "Active") // Since we don't have project status enum yet
                .Select(g => new ProjectStatusSummaryDto
                {
                    Status = g.Key,
                    Count = g.Count(),
                    Percentage = 100.0m,
                })
                .ToListAsync();

            // Get top utilized employees
            var topUtilizedEmployees = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Where(s => s.Status == StaffingStatus.Active)
                .GroupBy(s => new
                {
                    s.EmployeeId,
                    EmployeeName = s.Employee.FirstName + " " + s.Employee.LastName,
                })
                .Select(g => new EmployeeUtilizationSummaryDto
                {
                    EmployeeId = g.Key.EmployeeId,
                    EmployeeName = g.Key.EmployeeName,
                    UtilizationPercentage = g.Average(s => s.AllocationPercentage),
                    TotalHours = 0, // Will be calculated from billing records separately
                })
                .OrderByDescending(e => e.UtilizationPercentage)
                .Take(5)
                .ToListAsync();

            return new DashboardDataDto
            {
                TotalActiveProjects = totalActiveProjects,
                TotalActiveEmployees = totalActiveEmployees,
                TotalPendingDeliveries = totalPendingDeliveries,
                TotalRevenueThisMonth = totalRevenueThisMonth,
                AverageResourceUtilization = averageUtilization,
                ProjectStatusSummary = projectStatusSummary,
                TopUtilizedEmployees = topUtilizedEmployees,
            };
        }

        public async Task<ResourceAnalyticsDto> GetResourceAnalyticsAsync()
        {
            // Delivery metrics
            var totalDeliveries = await _context.Deliveries.CountAsync();
            var completedDeliveries = await _context.Deliveries.CountAsync(d =>
                d.Status == DeliveryStatus.Delivered
            );
            var onTimeDeliveries = await _context.Deliveries.CountAsync(d =>
                d.Status == DeliveryStatus.Delivered
                && d.ActualDeliveryDate <= d.PlannedDeliveryDate
            );
            var averageEffort =
                await _context
                    .Deliveries.Where(d => d.ActualEffort.HasValue)
                    .AverageAsync(d => (decimal?)d.ActualEffort)
                ?? 0;

            // Staffing metrics
            var totalStaffingRecords = await _context.StaffingRecords.CountAsync();
            var activeStaffing = await _context.StaffingRecords.CountAsync(s =>
                s.Status == StaffingStatus.Active
            );
            var utilizationRate =
                await _context
                    .StaffingRecords.Where(s => s.Status == StaffingStatus.Active)
                    .AverageAsync(s => (decimal?)s.AllocationPercentage)
                ?? 0;

            // Billing metrics
            var totalBillingAmount =
                await _context.BillingRecords.SumAsync(b => (decimal?)b.TotalAmount) ?? 0;
            var paidAmount =
                await _context
                    .BillingRecords.Where(b => b.Status == BillingStatus.Invoiced)
                    .SumAsync(b => (decimal?)b.TotalAmount)
                ?? 0;
            var pendingAmount = totalBillingAmount - paidAmount;

            // Recruitment metrics
            var activeRecruitments = await _context.RecruitmentRecords.CountAsync(r =>
                r.Status == RecruitmentStatus.Open
            );
            var filledPositions = await _context.RecruitmentRecords.CountAsync(r =>
                r.Status == RecruitmentStatus.Closed
            );

            return new ResourceAnalyticsDto
            {
                TotalDeliveries = totalDeliveries,
                CompletedDeliveries = completedDeliveries,
                OnTimeDeliveries = onTimeDeliveries,
                AverageEffort = averageEffort,
                TotalStaffingRecords = totalStaffingRecords,
                ActiveStaffing = activeStaffing,
                UtilizationRate = utilizationRate,
                TotalBillingAmount = totalBillingAmount,
                PaidAmount = paidAmount,
                PendingAmount = pendingAmount,
                ActiveRecruitments = activeRecruitments,
                FilledPositions = filledPositions,
            };
        }

        public async Task<ResourceUtilizationDto> GetResourceUtilizationAsync(
            DateTime? startDate,
            DateTime? endDate
        )
        {
            startDate ??= DateTime.UtcNow.AddMonths(-1);
            endDate ??= DateTime.UtcNow;

            // Get employee utilizations within the date range
            var employeeUtilizations = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Where(s => s.StartDate <= endDate && (s.EndDate == null || s.EndDate >= startDate))
                .GroupBy(s => new
                {
                    s.EmployeeId,
                    EmployeeName = s.Employee.FirstName + " " + s.Employee.LastName,
                })
                .Select(g => new EmployeeUtilizationDto
                {
                    EmployeeId = g.Key.EmployeeId,
                    EmployeeName = g.Key.EmployeeName,
                    Department = "General", // Default department since Employee doesn't have department
                    TotalAllocatedHours = 0, // Would need to calculate based on business rules
                    TotalWorkedHours = 0, // Would need billing data
                    UtilizationPercentage = g.Average(s => s.AllocationPercentage),
                    ProjectAllocations = new List<ProjectAllocationDto>(),
                })
                .ToListAsync();

            return new ResourceUtilizationDto
            {
                StartDate = startDate.Value,
                EndDate = endDate.Value,
                EmployeeUtilizations = employeeUtilizations,
                AverageUtilization = employeeUtilizations.Any()
                    ? employeeUtilizations.Average(e => e.UtilizationPercentage)
                    : 0,
                DepartmentUtilizations = new List<DepartmentUtilizationDto>(),
            };
        }

        public async Task<object> GetProjectPerformanceAsync(int? projectId)
        {
            var query = _context.Projects.AsQueryable();

            if (projectId.HasValue)
            {
                query = query.Where(p => p.Id == projectId.Value);
            }

            var projectPerformance = await query
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    DeliveryCount = _context.Deliveries.Count(d => d.ProjectId == p.Id),
                    CompletedDeliveries = _context.Deliveries.Count(d =>
                        d.ProjectId == p.Id && d.Status == DeliveryStatus.Delivered
                    ),
                    OnTimeDeliveries = _context.Deliveries.Count(d =>
                        d.ProjectId == p.Id
                        && d.Status == DeliveryStatus.Delivered
                        && d.ActualDeliveryDate <= d.PlannedDeliveryDate
                    ),
                    TotalBilling = _context
                        .BillingRecords.Where(b => b.ProjectId == p.Id)
                        .Sum(b => b.TotalAmount),
                    ActiveStaffing = _context.StaffingRecords.Count(s =>
                        s.ProjectId == p.Id && s.Status == StaffingStatus.Active
                    ),
                })
                .ToListAsync();

            return projectPerformance;
        }

        public async Task<object> GetEmployeePerformanceAsync(
            int? employeeId,
            DateTime? startDate,
            DateTime? endDate
        )
        {
            startDate ??= DateTime.UtcNow.AddMonths(-3);
            endDate ??= DateTime.UtcNow;

            var query = _context.Employees.Include(e => e.Designation).AsQueryable();

            if (employeeId.HasValue)
            {
                query = query.Where(e => e.Id == employeeId.Value);
            }

            var employeePerformance = await query
                .Select(e => new
                {
                    e.Id,
                    Name = e.FirstName + " " + e.LastName,
                    Position = e.Designation.Name,
                    TotalDeliveries = _context.Deliveries.Count(d =>
                        d.EmployeeId == e.Id
                        && d.PlannedDeliveryDate >= startDate
                        && d.PlannedDeliveryDate <= endDate
                    ),
                    CompletedDeliveries = _context.Deliveries.Count(d =>
                        d.EmployeeId == e.Id
                        && d.Status == DeliveryStatus.Delivered
                        && d.PlannedDeliveryDate >= startDate
                        && d.PlannedDeliveryDate <= endDate
                    ),
                    OnTimeDeliveries = _context.Deliveries.Count(d =>
                        d.EmployeeId == e.Id
                        && d.Status == DeliveryStatus.Delivered
                        && d.ActualDeliveryDate <= d.PlannedDeliveryDate
                        && d.PlannedDeliveryDate >= startDate
                        && d.PlannedDeliveryDate <= endDate
                    ),
                    TotalHoursBilled = _context
                        .BillingRecords.Where(b =>
                            b.EmployeeId == e.Id
                            && b.BillingDate >= startDate
                            && b.BillingDate <= endDate
                        )
                        .Sum(b => b.HoursWorked),
                    TotalRevenue = _context
                        .BillingRecords.Where(b =>
                            b.EmployeeId == e.Id
                            && b.BillingDate >= startDate
                            && b.BillingDate <= endDate
                        )
                        .Sum(b => b.TotalAmount),
                    ActiveProjects = _context.StaffingRecords.Count(s =>
                        s.EmployeeId == e.Id && s.Status == StaffingStatus.Active
                    ),
                })
                .ToListAsync();

            return employeePerformance;
        }

        public async Task<object> GetRevenueAnalysisAsync(int year)
        {
            var startOfYear = new DateTime(year, 1, 1);
            var endOfYear = startOfYear.AddYears(1).AddDays(-1);

            var monthlyRevenue = await _context
                .BillingRecords.Where(b =>
                    b.BillingDate >= startOfYear
                    && b.BillingDate <= endOfYear
                    && b.Status == BillingStatus.Invoiced
                )
                .GroupBy(b => b.BillingDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Revenue = g.Sum(b => b.TotalAmount),
                    BillingCount = g.Count(),
                    AverageHourlyRate = g.Average(b => b.HourlyRate),
                })
                .OrderBy(r => r.Month)
                .ToListAsync();

            return new
            {
                Year = year,
                TotalRevenue = monthlyRevenue.Sum(m => m.Revenue),
                MonthlyBreakdown = monthlyRevenue,
                AverageMonthlyRevenue = monthlyRevenue.Any()
                    ? monthlyRevenue.Average(m => m.Revenue)
                    : 0,
            };
        }

        public async Task<object> GetCapacityPlanningDataAsync()
        {
            var activeStaffing = await _context
                .StaffingRecords.Include(s => s.Employee)
                .Include(s => s.Project)
                .Where(s => s.Status == StaffingStatus.Active)
                .GroupBy(s => s.EmployeeId)
                .Select(g => new
                {
                    EmployeeId = g.Key,
                    EmployeeName = g.First().Employee.FirstName + " " + g.First().Employee.LastName,
                    TotalAllocation = g.Sum(s => s.AllocationPercentage),
                    ProjectCount = g.Count(),
                    AvailableCapacity = 100 - g.Sum(s => s.AllocationPercentage),
                    Projects = g.Select(s => new
                        {
                            ProjectId = s.ProjectId,
                            ProjectName = s.Project.Name,
                            Role = s.Role,
                            AllocationPercentage = s.AllocationPercentage,
                            StartDate = s.StartDate,
                            EndDate = s.EndDate,
                        })
                        .ToList(),
                })
                .ToListAsync();

            return new
            {
                OverAllocatedEmployees = activeStaffing
                    .Where(a => a.TotalAllocation > 100)
                    .ToList(),
                UnderUtilizedEmployees = activeStaffing.Where(a => a.TotalAllocation < 80).ToList(),
                OptimallyAllocatedEmployees = activeStaffing
                    .Where(a => a.TotalAllocation >= 80 && a.TotalAllocation <= 100)
                    .ToList(),
                TotalEmployees = activeStaffing.Count,
                AverageUtilization = activeStaffing.Any()
                    ? activeStaffing.Average(a => a.TotalAllocation)
                    : 0,
            };
        }
    }
}
