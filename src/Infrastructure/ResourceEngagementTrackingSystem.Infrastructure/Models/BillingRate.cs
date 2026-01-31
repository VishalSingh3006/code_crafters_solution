using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResourceEngagementTrackingSystem.Infrastructure.Models
{
    [Table("BillingRates")]
    public class BillingRate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Role { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Level { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal UsdRate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal InrRate { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; } = string.Empty; // USD or INR

        [Required]
        public DateTime EffectiveDate { get; set; }

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        public BillingRate()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
