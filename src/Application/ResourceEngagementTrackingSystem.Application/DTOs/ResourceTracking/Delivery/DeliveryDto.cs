using System;

namespace ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery
{
    public class DeliveryDto
    {
        public int Id { get; set; }
        public string DeliveryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime PlannedDeliveryDate { get; set; }
        public DateTime? ActualDeliveryDate { get; set; }
        public decimal EstimatedEffort { get; set; }
        public decimal? ActualEffort { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}