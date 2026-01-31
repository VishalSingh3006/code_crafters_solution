
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class Client : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MaxLength(150)]
        public string ContactName { get; set; }

        [MaxLength(50)]
        public string ContactPhone { get; set; }

        public ICollection<Project> Projects { get; set; }
    }
}