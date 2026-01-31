using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics;

namespace ResourceEngagementTrackingSystem.Api.Tests.Fixtures
{
    public class AnalyticsControllerTestFixture
    {
        public DashboardDataDto SampleDashboardData { get; }
        public ResourceUtilizationDto SampleResourceUtilizationData { get; }
        public object SampleProjectPerformanceData { get; }
        public object SampleProjectPerformanceDataWithId { get; }
        public object SampleEmployeePerformanceData { get; }
        public object SampleEmployeePerformanceDataWithId { get; }
        public object SampleRevenueAnalysisData { get; }
        public object SampleCapacityPlanningData { get; }
        public object EmptyCapacityPlanningData { get; }

        public AnalyticsControllerTestFixture()
        {
            SampleDashboardData = new DashboardDataDto
            {
                TotalActiveProjects = 15,
                TotalActiveEmployees = 50,
                TotalPendingDeliveries = 8,
                TotalRevenueThisMonth = 125000.50m,
                AverageResourceUtilization = 78.5m,
                ProjectStatusSummary = new List<ProjectStatusSummaryDto>
                {
                    new()
                    {
                        Status = "Active",
                        Count = 10,
                        Percentage = 66.7m,
                    },
                    new()
                    {
                        Status = "On Hold",
                        Count = 3,
                        Percentage = 20.0m,
                    },
                    new()
                    {
                        Status = "Completed",
                        Count = 2,
                        Percentage = 13.3m,
                    },
                },
                TopUtilizedEmployees = new List<EmployeeUtilizationSummaryDto>
                {
                    new()
                    {
                        EmployeeId = 1,
                        EmployeeName = "John Doe",
                        UtilizationPercentage = 95.5m,
                        TotalHours = 160,
                    },
                    new()
                    {
                        EmployeeId = 2,
                        EmployeeName = "Jane Smith",
                        UtilizationPercentage = 88.2m,
                        TotalHours = 152,
                    },
                },
            };

            SampleResourceUtilizationData = new ResourceUtilizationDto
            {
                StartDate = new DateTime(2024, 1, 1),
                EndDate = new DateTime(2024, 1, 31),
                AverageUtilization = 85.2m,
                EmployeeUtilizations = new List<EmployeeUtilizationDto>
                {
                    new()
                    {
                        EmployeeId = 1,
                        EmployeeName = "Alice Johnson",
                        Department = "Engineering",
                        TotalAllocatedHours = 160,
                        TotalWorkedHours = 152,
                        UtilizationPercentage = 95.0m,
                        ProjectAllocations = new List<ProjectAllocationDto>(),
                    },
                    new()
                    {
                        EmployeeId = 2,
                        EmployeeName = "Bob Wilson",
                        Department = "Design",
                        TotalAllocatedHours = 160,
                        TotalWorkedHours = 136,
                        UtilizationPercentage = 85.0m,
                        ProjectAllocations = new List<ProjectAllocationDto>(),
                    },
                },
                DepartmentUtilizations = new List<DepartmentUtilizationDto>
                {
                    new()
                    {
                        Department = "Engineering",
                        EmployeeCount = 20,
                        AverageUtilization = 87.5m,
                    },
                    new()
                    {
                        Department = "Design",
                        EmployeeCount = 15,
                        AverageUtilization = 82.3m,
                    },
                },
            };

            SampleProjectPerformanceDataWithId = new
            {
                ProjectId = 123,
                ProjectName = "Project Alpha",
                Progress = 75.5,
                TotalHours = 1200,
                CompletedTasks = 45,
                TotalTasks = 60,
                Budget = 150000.00m,
                SpentAmount = 112500.00m,
                TeamSize = 8,
                StartDate = new DateTime(2024, 1, 1),
                EstimatedEndDate = new DateTime(2024, 6, 30),
            };

            SampleProjectPerformanceData = new
            {
                TotalProjects = 25,
                AverageProgress = 68.3,
                TotalHours = 15000,
                CompletedProjects = 8,
                OnTrackProjects = 12,
                DelayedProjects = 5,
            };

            SampleEmployeePerformanceDataWithId = new
            {
                EmployeeId = 456,
                EmployeeName = "Bob Johnson",
                TotalHours = 480,
                CompletedTasks = 35,
                ProductivityScore = 8.7,
                ProjectsWorkedOn = 3,
                AverageTaskCompletionTime = 2.5, // hours
                QualityRating = 4.8,
                OnTimeDeliveryRate = 92.5,
            };

            SampleEmployeePerformanceData = new
            {
                TotalEmployees = 50,
                AverageProductivityScore = 7.8,
                TopPerformer = "Alice Anderson",
                BottomPerformer = "Charlie Brown",
                AverageHoursPerEmployee = 156.8,
            };

            SampleRevenueAnalysisData = new
            {
                Year = 2024,
                TotalRevenue = 2500000.75m,
                MonthlyRevenue = new[]
                {
                    new { Month = "January", Revenue = 200000.50m },
                    new { Month = "February", Revenue = 220000.25m },
                    new { Month = "March", Revenue = 195000.00m },
                    new { Month = "April", Revenue = 210000.75m },
                    new { Month = "May", Revenue = 225000.00m },
                    new { Month = "June", Revenue = 240000.50m },
                },
                QuarterlyGrowth = 12.5m,
                YearOverYearGrowth = 18.3m,
                TopRevenueProjects = new[]
                {
                    new { ProjectName = "Enterprise Solution", Revenue = 500000.00m },
                    new { ProjectName = "Mobile App Redesign", Revenue = 350000.00m },
                    new { ProjectName = "Data Analytics Platform", Revenue = 275000.00m },
                },
                RevenueByDepartment = new[]
                {
                    new { Department = "Engineering", Revenue = 1200000.00m },
                    new { Department = "Design", Revenue = 800000.00m },
                    new { Department = "Consulting", Revenue = 500000.75m },
                },
            };

            SampleCapacityPlanningData = new
            {
                TotalCapacity = 2000,
                CurrentUtilization = 1650,
                AvailableCapacity = 350,
                UtilizationPercentage = 82.5,
                DepartmentCapacity = new[]
                {
                    new
                    {
                        Department = "Engineering",
                        Capacity = 800,
                        Utilized = 720,
                        AvailableCapacity = 80,
                    },
                    new
                    {
                        Department = "Design",
                        Capacity = 400,
                        Utilized = 350,
                        AvailableCapacity = 50,
                    },
                    new
                    {
                        Department = "QA",
                        Capacity = 300,
                        Utilized = 280,
                        AvailableCapacity = 20,
                    },
                    new
                    {
                        Department = "DevOps",
                        Capacity = 200,
                        Utilized = 180,
                        AvailableCapacity = 20,
                    },
                    new
                    {
                        Department = "Project Management",
                        Capacity = 300,
                        Utilized = 120,
                        AvailableCapacity = 180,
                    },
                },
                ProjectedCapacityNeeds = new[]
                {
                    new { Month = "February", RequiredCapacity = 1800 },
                    new { Month = "March", RequiredCapacity = 1900 },
                    new { Month = "April", RequiredCapacity = 2100 },
                    new { Month = "May", RequiredCapacity = 2200 },
                },
                SkillGaps = new[]
                {
                    new
                    {
                        Skill = "React",
                        CurrentCount = 5,
                        RequiredCount = 8,
                        GapPercentage = 37.5,
                    },
                    new
                    {
                        Skill = "Python",
                        CurrentCount = 10,
                        RequiredCount = 12,
                        GapPercentage = 16.7,
                    },
                    new
                    {
                        Skill = "DevOps",
                        CurrentCount = 3,
                        RequiredCount = 6,
                        GapPercentage = 50.0,
                    },
                    new
                    {
                        Skill = "UI/UX Design",
                        CurrentCount = 8,
                        RequiredCount = 10,
                        GapPercentage = 20.0,
                    },
                },
                UpcomingProjectsRequirements = new[]
                {
                    new
                    {
                        ProjectName = "Mobile App V2",
                        RequiredResources = 250,
                        StartDate = "2024-03-01",
                    },
                    new
                    {
                        ProjectName = "AI Integration",
                        RequiredResources = 180,
                        StartDate = "2024-04-15",
                    },
                },
            };

            EmptyCapacityPlanningData = new
            {
                TotalCapacity = 0,
                CurrentUtilization = 0,
                AvailableCapacity = 0,
                UtilizationPercentage = 0.0,
                DepartmentCapacity = Array.Empty<object>(),
                ProjectedCapacityNeeds = Array.Empty<object>(),
                SkillGaps = Array.Empty<object>(),
            };
        }
    }
}
