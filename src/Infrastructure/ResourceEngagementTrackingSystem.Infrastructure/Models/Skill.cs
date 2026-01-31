using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class Skill : BaseEntity
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }
        public ICollection<EmployeeSkill> EmployeeSkills { get; set; }
    }
}
