using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing
{
    public class UpdateBillingRecordDto
    {
        public DateTime? BillingDate { get; set; }

        [Range(0.1, double.MaxValue)]
        public decimal? HoursWorked { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal? HourlyRate { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public string? BillingType { get; set; }

        public string? Status { get; set; }

        public bool? IsInvoiced { get; set; }

        public DateTime? InvoicedDate { get; set; }

        [MaxLength(100)]
        public string? InvoiceNumber { get; set; }
    }
}