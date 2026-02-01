using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Configurations
{
    public class ResourceAllocationConfiguration : IEntityTypeConfiguration<ResourceAllocation>
    {
        public void Configure(EntityTypeBuilder<ResourceAllocation> builder)
        {
            builder.HasKey(ra => ra.Id);
            builder.Property(ra => ra.AllocationPercentage).IsRequired();
            
            // Configure relationships
            builder
                .HasOne(ra => ra.Engagement)
                .WithMany(e => e.ResourceAllocations)
                .HasForeignKey(ra => ra.EngagementId)
                .OnDelete(DeleteBehavior.Cascade);
                
            builder
                .HasOne(ra => ra.Employee)
                .WithMany()
                .HasForeignKey(ra => ra.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
