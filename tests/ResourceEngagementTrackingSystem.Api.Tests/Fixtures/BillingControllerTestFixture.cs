using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class BillingControllerTestFixture
    {
        public IEnumerable<BillingRecordDto> SampleBillingRecords { get; }
        public BillingRecordDto SampleBillingRecord { get; }
        public BillingRecordDto SampleUpdatedBillingRecord { get; }
        public CreateBillingRecordDto SampleCreateBillingRecordDto { get; }
        public UpdateBillingRecordDto SampleUpdateBillingRecordDto { get; }
        public MonthlyBillingReportDto SampleMonthlyReport { get; }

        public BillingControllerTestFixture()
        {
            SampleBillingRecord = new BillingRecordDto
            {
                Id = 1,
                ProjectId = 1,
                ProjectName = "Website Redesign",
                EmployeeId = 1,
                EmployeeName = "John Doe",
                BillingDate = DateTime.Now.AddDays(-5),
                HoursWorked = 8.0m,
                HourlyRate = 150.00m,
                TotalAmount = 1200.00m,
                Description = "Frontend development work",
                BillingType = "Regular",
                Status = "Approved",
                IsInvoiced = false,
                InvoicedDate = null,
                InvoiceNumber = null,
                CreatedAt = DateTime.Now.AddDays(-5),
                UpdatedAt = DateTime.Now.AddDays(-1)
            };

            SampleUpdatedBillingRecord = new BillingRecordDto
            {
                Id = 1,
                ProjectId = 1,
                ProjectName = "Website Redesign",
                EmployeeId = 1,
                EmployeeName = "John Doe",
                BillingDate = DateTime.Now.AddDays(-5),
                HoursWorked = 8.0m,
                HourlyRate = 150.00m,
                TotalAmount = 1200.00m,
                Description = "Frontend development work - updated",
                BillingType = "Regular",
                Status = "Invoiced", // Updated status
                IsInvoiced = true, // Updated
                InvoicedDate = DateTime.Now,
                InvoiceNumber = "INV-2024-001",
                CreatedAt = DateTime.Now.AddDays(-5),
                UpdatedAt = DateTime.Now
            };

            var billingRecord2 = new BillingRecordDto
            {
                Id = 2,
                ProjectId = 2,
                ProjectName = "Mobile App",
                EmployeeId = 2,
                EmployeeName = "Sarah Johnson",
                BillingDate = DateTime.Now.AddDays(-3),
                HoursWorked = 6.5m,
                HourlyRate = 140.00m,
                TotalAmount = 910.00m,
                Description = "Backend API development",
                BillingType = "Regular",
                Status = "Submitted",
                IsInvoiced = false,
                CreatedAt = DateTime.Now.AddDays(-3),
                UpdatedAt = DateTime.Now.AddDays(-3)
            };

            var billingRecord3 = new BillingRecordDto
            {
                Id = 3,
                ProjectId = 1,
                ProjectName = "Website Redesign",
                EmployeeId = 3,
                EmployeeName = "Mike Wilson",
                BillingDate = DateTime.Now.AddDays(-2),
                HoursWorked = 4.0m,
                HourlyRate = 160.00m,
                TotalAmount = 640.00m,
                Description = "Code review and testing",
                BillingType = "Overtime",
                Status = "Draft",
                IsInvoiced = false,
                CreatedAt = DateTime.Now.AddDays(-2),
                UpdatedAt = DateTime.Now.AddDays(-2)
            };

            SampleBillingRecords = new List<BillingRecordDto> 
            { 
                SampleBillingRecord, 
                billingRecord2, 
                billingRecord3 
            };

            SampleCreateBillingRecordDto = new CreateBillingRecordDto
            {
                ProjectId = 3,
                EmployeeId = 4,
                BillingDate = DateTime.Now,
                HoursWorked = 7.5m,
                HourlyRate = 145.00m,
                Description = "New feature development",
                BillingType = "Regular",
                Status = "Draft",
                IsInvoiced = false
            };

            SampleUpdateBillingRecordDto = new UpdateBillingRecordDto
            {
                BillingDate = DateTime.Now.AddDays(-5),
                HoursWorked = 8.0m,
                HourlyRate = 150.00m,
                Description = "Frontend development work - updated",
                BillingType = "Regular",
                Status = "Invoiced",
                IsInvoiced = true,
                InvoicedDate = DateTime.Now,
                InvoiceNumber = "INV-2024-001"
            };

            SampleMonthlyReport = new MonthlyBillingReportDto
            {
                Month = DateTime.Now.Month,
                Year = DateTime.Now.Year,
                TotalBilledHours = 18.5m,
                TotalBilledAmount = 2750.00m,
                InvoicedAmount = 1200.00m,
                PendingAmount = 1550.00m,
                ProjectSummaries = new List<ProjectBillingSummaryDto>
                {
                    new ProjectBillingSummaryDto
                    {
                        ProjectId = 1,
                        ProjectName = "Website Redesign",
                        TotalHours = 12.0m,
                        TotalAmount = 1840.00m
                    },
                    new ProjectBillingSummaryDto
                    {
                        ProjectId = 2,
                        ProjectName = "Mobile App",
                        TotalHours = 6.5m,
                        TotalAmount = 910.00m
                    }
                }
            };
        }
    }
}