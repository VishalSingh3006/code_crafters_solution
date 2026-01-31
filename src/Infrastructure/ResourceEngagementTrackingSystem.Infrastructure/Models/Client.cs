
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    public class Client
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public ICollection<Project> Projects { get; set; }
    }
}