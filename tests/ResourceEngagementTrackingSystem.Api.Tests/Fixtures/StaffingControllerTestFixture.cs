using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class StaffingControllerTestFixture
    {
        public IEnumerable<StaffingRecordDto> SampleStaffingRecords { get; }
        public StaffingRecordDto SampleStaffingRecord { get; }
        public StaffingRecordDto SampleUpdatedStaffingRecord { get; }
        public CreateStaffingRecordDto SampleCreateStaffingRecordDto { get; }
        public UpdateStaffingRecordDto SampleUpdateStaffingRecordDto { get; }

        public StaffingControllerTestFixture()
        {
            SampleStaffingRecord = new StaffingRecordDto
            {
                Id = 1,
                EmployeeId = 1,
                EmployeeName = "John Doe",
                EmployeeEmail = "john.doe@company.com",
                ProjectId = 1,
                ProjectName = "Website Redesign",
                StartDate = DateTime.Now.AddMonths(-6),
                EndDate = DateTime.Now.AddMonths(2),
                AllocationPercentage = 80.0m,
                Role = "Senior Developer",
                HourlyRate = 150.00m,
                TotalHours = 320,
                Notes = "Lead developer on frontend redesign",
                Status = "Active",
                CreatedAt = DateTime.Now.AddMonths(-6),
                UpdatedAt = DateTime.Now,
            };

            SampleUpdatedStaffingRecord = new StaffingRecordDto
            {
                Id = 1,
                EmployeeId = 1,
                EmployeeName = "John Doe",
                EmployeeEmail = "john.doe@company.com",
                ProjectId = 1,
                ProjectName = "Website Redesign",
                StartDate = DateTime.Now.AddMonths(-6),
                EndDate = DateTime.Now.AddMonths(3), // Extended end date
                AllocationPercentage = 90.0m, // Increased allocation
                Role = "Lead Developer", // Promoted role
                HourlyRate = 160.00m, // Increased rate
                TotalHours = 400, // Updated hours
                Notes = "Promoted to lead developer with increased responsibility",
                Status = "Active",
                CreatedAt = DateTime.Now.AddMonths(-6),
                UpdatedAt = DateTime.Now,
            };

            var staffingRecord2 = new StaffingRecordDto
            {
                Id = 2,
                EmployeeId = 2,
                EmployeeName = "Sarah Johnson",
                EmployeeEmail = "sarah.johnson@company.com",
                ProjectId = 2,
                ProjectName = "Mobile App Development",
                StartDate = DateTime.Now.AddMonths(-3),
                EndDate = DateTime.Now.AddMonths(4),
                AllocationPercentage = 100.0m,
                Role = "Mobile Developer",
                HourlyRate = 140.00m,
                TotalHours = 480,
                Notes = "Full-time mobile app developer",
                Status = "Active",
                CreatedAt = DateTime.Now.AddMonths(-3),
                UpdatedAt = DateTime.Now,
            };

            var staffingRecord3 = new StaffingRecordDto
            {
                Id = 3,
                EmployeeId = 3,
                EmployeeName = "David Brown",
                EmployeeEmail = "david.brown@company.com",
                ProjectId = 3,
                ProjectName = "Data Analytics Platform",
                StartDate = DateTime.Now.AddMonths(-2),
                EndDate = DateTime.Now.AddMonths(6),
                AllocationPercentage = 60.0m,
                Role = "Data Analyst",
                HourlyRate = 160.00m,
                TotalHours = 240,
                Notes = "Part-time data analytics specialist",
                Status = "Active",
                CreatedAt = DateTime.Now.AddMonths(-2),
                UpdatedAt = DateTime.Now,
            };

            SampleStaffingRecords = new List<StaffingRecordDto>
            {
                SampleStaffingRecord,
                staffingRecord2,
                staffingRecord3,
            };

            SampleCreateStaffingRecordDto = new CreateStaffingRecordDto
            {
                EmployeeId = 4,
                ProjectId = 4,
                StartDate = DateTime.Now.AddDays(7),
                EndDate = DateTime.Now.AddMonths(8),
                AllocationPercentage = 75.0m,
                Role = "Full Stack Developer",
                HourlyRate = 145.00m,
                TotalHours = 400,
                Notes = "New project assignment for Q2",
                Status = "Active",
            };

            SampleUpdateStaffingRecordDto = new UpdateStaffingRecordDto
            {
                StartDate = DateTime.Now.AddDays(14),
                EndDate = DateTime.Now.AddMonths(10),
                AllocationPercentage = 90.0m,
                Role = "Senior Full Stack Developer",
                HourlyRate = 155.00m,
                TotalHours = 500,
                Notes = "Promoted to senior role with increased allocation",
                Status = "Active",
            };
        }
    }
}
