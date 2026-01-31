using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking
{
    [Table("BillingRecords")]
    public class BillingRecord : BaseEntity
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime BillingDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal HoursWorked { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal HourlyRate { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public BillingType BillingType { get; set; } = BillingType.Regular;

        [Required]
        public BillingStatus Status { get; set; } = BillingStatus.Draft;

        public bool IsInvoiced { get; set; } = false;

        public DateTime? InvoicedDate { get; set; }

        [MaxLength(100)]
        public string? InvoiceNumber { get; set; }

        // Navigation properties
        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; } = null!;

        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; } = null!;
    }
}
