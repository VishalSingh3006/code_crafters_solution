using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking
{
    [Table("Deliveries")]
    public class Delivery : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string DeliveryName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime PlannedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal EstimatedEffort { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ActualEffort { get; set; }

        [Required]
        public Priority Priority { get; set; } = Priority.Medium;

        [Required]
        public DeliveryStatus Status { get; set; } = DeliveryStatus.Planned;

        // Navigation properties
        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; } = null!;

        [ForeignKey("EmployeeId")]
        public virtual Employee Employee { get; set; } = null!;
    }
}
