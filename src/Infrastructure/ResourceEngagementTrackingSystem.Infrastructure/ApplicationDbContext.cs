using ResourceEngagementTrackingSystem.Infrastructure.Models;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ResourceEngagementTrackingSystem.Infrastructure;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Designation> Designations { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<PortfolioCompany> PortfolioCompanies { get; set; }
        public DbSet<ExceptionLog> ExceptionLogs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<EmployeeSkill> EmployeeSkills { get; set; }

    // ResourceTracking DbSets
    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<StaffingRecord> StaffingRecords { get; set; }
    public DbSet<RecruitmentRecord> RecruitmentRecords { get; set; }
    public DbSet<BillingRecord> BillingRecords { get; set; }

    // Engagement/ResourceAllocation DbSets
    public DbSet<Engagement> Engagements { get; set; }
    public DbSet<EngagementPosition> EngagementPositions { get; set; }
    public DbSet<ResourceAllocation> ResourceAllocations { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Employee-Manager (self-referencing)
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Manager)
            .WithMany(e => e.Subordinates)
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Employee-Department
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Employee-Designation
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Designation)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DesignationId)
            .OnDelete(DeleteBehavior.Restrict);

        // EmployeeSkill (many-to-many)
        modelBuilder.Entity<EmployeeSkill>()
            .HasKey(es => new { es.EmployeeId, es.SkillId });
        modelBuilder.Entity<EmployeeSkill>()
            .HasOne(es => es.Employee)
            .WithMany(e => e.EmployeeSkills)
            .HasForeignKey(es => es.EmployeeId);

        // Logging tables
        modelBuilder.ApplyConfiguration(new Configurations.ExceptionLogConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.AuditLogConfiguration());
        modelBuilder.Entity<EmployeeSkill>()
            .HasOne(es => es.Skill)
            .WithMany(s => s.EmployeeSkills)
            .HasForeignKey(es => es.SkillId);

        // Engagement/ResourceAllocation configurations
        modelBuilder.ApplyConfiguration(new Configurations.EngagementConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.EngagementPositionConfiguration());
        modelBuilder.ApplyConfiguration(new Configurations.ResourceAllocationConfiguration());
    }
}
