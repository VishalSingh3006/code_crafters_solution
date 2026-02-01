using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Configurations
{
    public class EngagementConfiguration : IEntityTypeConfiguration<ProjectClientEngagement>
    {
        public void Configure(EntityTypeBuilder<ProjectClientEngagement> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.OutcomeStatus).IsRequired();
            
            // Configure relationships
            builder
                .HasMany(e => e.Positions)
                .WithOne(p => p.Engagement)
                .HasForeignKey(p => p.EngagementId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder
                .HasMany(e => e.ResourceAllocations)
                .WithOne(ra => ra.Engagement)
                .HasForeignKey(ra => ra.EngagementId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
