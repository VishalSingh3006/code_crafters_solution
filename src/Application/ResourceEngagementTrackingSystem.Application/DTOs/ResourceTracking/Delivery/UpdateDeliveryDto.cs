using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery
{
    public class UpdateDeliveryDto
    {
        [MaxLength(200)]
        public string? DeliveryName { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime? PlannedDeliveryDate { get; set; }

        public DateTime? ActualDeliveryDate { get; set; }

        [Range(0.1, double.MaxValue)]
        public decimal? EstimatedEffort { get; set; }

        public decimal? ActualEffort { get; set; }

        public string? Priority { get; set; }

        public string? Status { get; set; }
    }
}