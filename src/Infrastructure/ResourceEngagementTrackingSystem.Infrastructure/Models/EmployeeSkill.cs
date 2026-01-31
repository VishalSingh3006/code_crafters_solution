using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class EmployeeSkill:BaseEntity
    {
        [Key, Column(Order = 0)]
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        [Key, Column(Order = 1)]
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
        public ProficiencyLevel ProficiencyLevel { get; set; }
    }
}