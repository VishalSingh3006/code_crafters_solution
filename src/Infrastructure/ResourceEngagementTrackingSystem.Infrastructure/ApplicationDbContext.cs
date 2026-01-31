using ResourceEngagementTrackingSystem.Infrastructure.Models;
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
}
