using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing
{
    public class CreateBillingRecordDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime BillingDate { get; set; }

        [Required]
        [Range(0.1, double.MaxValue)]
        public decimal HoursWorked { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal HourlyRate { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public string BillingType { get; set; } = "Regular"; // Regular, Overtime, Holiday

        [Required]
        public string Status { get; set; } = "Draft"; // Draft, Submitted, Approved, Invoiced

        public bool IsInvoiced { get; set; } = false;

        public DateTime? InvoicedDate { get; set; }

        [MaxLength(100)]
        public string? InvoiceNumber { get; set; }
    }
}