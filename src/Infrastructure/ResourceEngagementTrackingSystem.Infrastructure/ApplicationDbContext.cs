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

    // ResourceTracking DbSets
    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<StaffingRecord> StaffingRecords { get; set; }
    public DbSet<RecruitmentRecord> RecruitmentRecords { get; set; }
    public DbSet<BillingRecord> BillingRecords { get; set; }
}
