using System;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking
{
    [Table("RecruitmentRecords")]
    public class RecruitmentRecord : BaseEntity
    {
        [Required]
        [MaxLength(200)]
        public string Position { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [Required]
        public DateTime PostedDate { get; set; }

        public DateTime? ClosedDate { get; set; }

        [Required]
        public RecruitmentType RecruitmentType { get; set; } = RecruitmentType.Internal;

        [MaxLength(1000)]
        public string? JobDescription { get; set; }

        [MaxLength(500)]
        public string? Requirements { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int NumberOfOpenings { get; set; }

        [Required]
        public RecruitmentStatus Status { get; set; } = RecruitmentStatus.Open;

        [Column(TypeName = "decimal(12,2)")]
        public decimal? Budget { get; set; }
    }
}