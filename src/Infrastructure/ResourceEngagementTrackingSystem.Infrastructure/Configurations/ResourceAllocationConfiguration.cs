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
            
            // Ignore CreatedBy and UpdatedBy columns that don't exist in the database
            builder.Ignore(ra => ra.CreatedBy);
            builder.Ignore(ra => ra.UpdatedBy);
            
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
