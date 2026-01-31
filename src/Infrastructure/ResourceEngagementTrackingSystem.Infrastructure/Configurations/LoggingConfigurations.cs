using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Configurations
{
    public class ExceptionLogConfiguration : IEntityTypeConfiguration<ExceptionLog>
    {
        public void Configure(EntityTypeBuilder<ExceptionLog> builder)
        {
            builder.ToTable("ExceptionLogs");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Message).IsRequired().HasMaxLength(2048);
            builder.Property(e => e.StackTrace).HasColumnType("LONGTEXT");
            builder.Property(e => e.InnerException).HasMaxLength(2048);
            builder.Property(e => e.RequestPath).HasMaxLength(512);
            builder.Property(e => e.HttpMethod).HasMaxLength(16);
            builder.Property(e => e.RequestBody).HasColumnType("LONGTEXT");
            builder.Property(e => e.UserId).HasMaxLength(128);
            builder.Property(e => e.TraceId).HasMaxLength(128);
        }
    }

    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.ToTable("AuditLogs");
            builder.HasKey(a => a.Id);
            builder.Property(a => a.EntityName).IsRequired().HasMaxLength(128);
            builder.Property(a => a.Action).IsRequired().HasMaxLength(16);
            builder.Property(a => a.OldValues).HasMaxLength(4096);
            builder.Property(a => a.NewValues).HasMaxLength(4096);
            builder.Property(a => a.UserId).HasMaxLength(128);
            builder.Property(a => a.RequestIp).HasMaxLength(64);
            builder.Property(a => a.Endpoint).HasMaxLength(256);
        }
    }
}
