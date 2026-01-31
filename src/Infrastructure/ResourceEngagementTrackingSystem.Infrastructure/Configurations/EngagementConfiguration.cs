using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Configurations
{
    public class EngagementConfiguration : IEntityTypeConfiguration<Engagement>
    {
        public void Configure(EntityTypeBuilder<Engagement> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Name).IsRequired().HasMaxLength(200);
            builder.Property(e => e.Description).HasMaxLength(1000);
            builder.Property(e => e.OutcomeStatus).IsRequired();
            builder.HasMany(e => e.Positions)
                   .WithOne(p => p.Engagement)
                   .HasForeignKey(p => p.EngagementId);
        }
    }
}
