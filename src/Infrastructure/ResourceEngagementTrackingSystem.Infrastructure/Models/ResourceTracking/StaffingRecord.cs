using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking
{
    [Table("StaffingRecords")]
    public class StaffingRecord : BaseEntity
    {
        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        [Range(1, 100)]
        public decimal AllocationPercentage { get; set; }

        [Required]
        [MaxLength(100)]
        public string Role { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal? HourlyRate { get; set; }

        public int? TotalHours { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        [Required]
        public StaffingStatus Status { get; set; } = StaffingStatus.Active;

        // Navigation properties
        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; } = null!;

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; } = null!;
    }
}
