using System;
using System.Collections.Generic;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing
{
    public class BillingRecordDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime BillingDate { get; set; }
        public decimal HoursWorked { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Description { get; set; }
        public string BillingType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsInvoiced { get; set; }
        public DateTime? InvoicedDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class MonthlyBillingReportDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal TotalBilledHours { get; set; }
        public decimal TotalBilledAmount { get; set; }
        public decimal InvoicedAmount { get; set; }
        public decimal PendingAmount { get; set; }
        public List<ProjectBillingSummaryDto> ProjectSummaries { get; set; } = new();
    }

    public class ProjectBillingSummaryDto
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public decimal TotalHours { get; set; }
        public decimal TotalAmount { get; set; }
    }
}