using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery
{
    public class CreateDeliveryDto
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
        [Range(0.1, double.MaxValue)]
        public decimal EstimatedEffort { get; set; }

        public decimal? ActualEffort { get; set; }

        [Required]
        public string Priority { get; set; } = "Medium"; // High, Medium, Low

        [Required]
        public string Status { get; set; } = "Planned"; // Planned, InProgress, Delivered, Delayed
    }
}
