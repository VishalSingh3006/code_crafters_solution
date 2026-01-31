using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Configurations
{
    public class EngagementPositionConfiguration : IEntityTypeConfiguration<EngagementPosition>
    {
        public void Configure(EntityTypeBuilder<EngagementPosition> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
            builder.Property(p => p.RequiredSkill).HasMaxLength(100);
            builder.Property(p => p.RequiredProficiency).HasMaxLength(100);
            builder
                .HasMany(p => p.ResourceAllocations)
                .WithOne(ra => ra.EngagementPosition)
                .HasForeignKey(ra => ra.EngagementPositionId);
        }
    }
}
