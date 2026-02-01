using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Application.DTOs
{
    public class EngagementPositionDto
    {
        public int Id { get; set; }
        public int EngagementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? RequiredSkill { get; set; }
        public string? RequiredProficiency { get; set; }
        
        // Optional navigation data
        public string? EngagementName { get; set; }
        public List<ResourceAllocationDto> ResourceAllocations { get; set; } = new List<ResourceAllocationDto>();
    }

    public class CreateEngagementPositionDto
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? RequiredSkill { get; set; }
        
        [MaxLength(100)]
        public string? RequiredProficiency { get; set; }
    }

    public class UpdateEngagementPositionDto
    {
        [Required]
        public int EngagementId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? RequiredSkill { get; set; }
        
        [MaxLength(100)]
        public string? RequiredProficiency { get; set; }
    }
}
