using System;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class ResourceAllocationDto
    {
        public int Id { get; set; }
        public int EngagementId { get; set; }
        public int EmployeeId { get; set; }
        public decimal AllocationPercentage { get; set; }
        public DateTime AllocationStart { get; set; }
        public DateTime? AllocationEnd { get; set; }
        
        // Optional navigation data
        public string? EngagementName { get; set; }
        public string? EmployeeName { get; set; }
    }

    public class CreateResourceAllocationDto
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal AllocationPercentage { get; set; }

        [Required]
        public DateTime AllocationStart { get; set; }
        
        public DateTime? AllocationEnd { get; set; }
    }

    public class UpdateResourceAllocationDto
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        [Range(0, 100)]
        public decimal AllocationPercentage { get; set; }

        [Required]
        public DateTime AllocationStart { get; set; }
        
        public DateTime? AllocationEnd { get; set; }
    }
}
