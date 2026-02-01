using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class DataSeederService
    {
        private readonly ApplicationDbContext _context;

        public DataSeederService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedTestDataAsync()
        {
            try
            {
                // Seed test clients
                if (!await _context.Clients.AnyAsync())
                {
                    var clients = new[]
                    {
                        new Client
                        {
                            Name = "Test Client 1",
                            Email = "client1@example.com",
                            ContactName = "John Client",
                            ContactPhone = "123-456-7890",
                        },
                        new Client
                        {
                            Name = "Test Client 2",
                            Email = "client2@example.com",
                            ContactName = "Jane Client",
                            ContactPhone = "098-765-4321",
                        },
                    };

                    _context.Clients.AddRange(clients);
                    await _context.SaveChangesAsync();
                }

                // Seed test departments
                if (!await _context.Departments.AnyAsync())
                {
                    var departments = new[]
                    {
                        new Department { Name = "Engineering" },
                        new Department { Name = "Design" },
                        new Department { Name = "Management" },
                    };

                    _context.Departments.AddRange(departments);
                    await _context.SaveChangesAsync();
                }

                // Seed test designations
                if (!await _context.Designations.AnyAsync())
                {
                    var designations = new[]
                    {
                        new Designation { Name = "Senior Developer" },
                        new Designation { Name = "UI/UX Designer" },
                        new Designation { Name = "Project Manager" },
                    };

                    _context.Designations.AddRange(designations);
                    await _context.SaveChangesAsync();
                }

                // Seed test employees
                if (!await _context.Employees.AnyAsync())
                {
                    var departments = await _context.Departments.ToListAsync();
                    var designations = await _context.Designations.ToListAsync();

                    var employees = new[]
                    {
                        new Employee
                        {
                            EmployeeCode = "EMP001",
                            FirstName = "John",
                            LastName = "Developer",
                            Email = "john.dev@company.com",
                            Phone = "+1234567890",
                            DateOfJoining = DateTime.Now.AddYears(-2),
                            DateOfBirth = DateTime.Now.AddYears(-30),
                            DepartmentId = departments.First(d => d.Name == "Engineering").Id,
                            DesignationId = designations
                                .First(d => d.Name == "Senior Developer")
                                .Id,
                            EmploymentType = EmploymentType.Permanent,
                        },
                        new Employee
                        {
                            EmployeeCode = "EMP002",
                            FirstName = "Jane",
                            LastName = "Designer",
                            Email = "jane.design@company.com",
                            Phone = "+1234567891",
                            DateOfJoining = DateTime.Now.AddYears(-1),
                            DateOfBirth = DateTime.Now.AddYears(-28),
                            DepartmentId = departments.First(d => d.Name == "Design").Id,
                            DesignationId = designations.First(d => d.Name == "UI/UX Designer").Id,
                            EmploymentType = EmploymentType.Permanent,
                        },
                        new Employee
                        {
                            EmployeeCode = "EMP003",
                            FirstName = "Mike",
                            LastName = "Manager",
                            Email = "mike.pm@company.com",
                            Phone = "+1234567892",
                            DateOfJoining = DateTime.Now.AddYears(-3),
                            DateOfBirth = DateTime.Now.AddYears(-35),
                            DepartmentId = departments.First(d => d.Name == "Management").Id,
                            DesignationId = designations.First(d => d.Name == "Project Manager").Id,
                            EmploymentType = EmploymentType.Permanent,
                        },
                    };

                    _context.Employees.AddRange(employees);
                    await _context.SaveChangesAsync();
                }

                // Seed test projects
                if (!await _context.Projects.AnyAsync())
                {
                    var clients = await _context.Clients.ToListAsync();
                    if (clients.Any())
                    {
                        var projects = new[]
                        {
                            new Project
                            {
                                Name = "Web Application Project",
                                Description = "Building a modern web application",
                                ClientId = clients.First().Id,
                            },
                            new Project
                            {
                                Name = "Mobile App Development",
                                Description = "Native mobile application development",
                                ClientId = clients.Count > 1 ? clients[1].Id : clients.First().Id,
                            },
                            new Project
                            {
                                Name = "API Integration Project",
                                Description = "Third-party API integration and testing",
                                ClientId = clients.First().Id,
                            },
                        };

                        _context.Projects.AddRange(projects);
                        await _context.SaveChangesAsync();
                    }
                }

                // Seed test project-client engagements
                if (!await _context.ProjectClientEngagements.AnyAsync())
                {
                    var projects = await _context.Projects.ToListAsync();
                    var clients = await _context.Clients.ToListAsync();

                    var engagements = new[]
                    {
                        new ProjectClientEngagement
                        {
                            ProjectId = projects.Count > 0 ? projects[0].Id : null,
                            ClientId = null,
                            StartDate = DateTime.Now.AddDays(-30),
                            EndDate = DateTime.Now.AddDays(30),
                            OutcomeStatus = ProjectClientEngagementStatus.Success,
                        },
                        new ProjectClientEngagement
                        {
                            ProjectId = null,
                            ClientId = clients.Count > 0 ? clients[0].Id : null,
                            StartDate = DateTime.Now.AddDays(-60),
                            EndDate = DateTime.Now.AddDays(60),
                            OutcomeStatus = ProjectClientEngagementStatus.Success,
                        },
                        new ProjectClientEngagement
                        {
                            ProjectId = projects.Count > 1 ? projects[1].Id : null,
                            ClientId = null,
                            StartDate = DateTime.Now.AddDays(-15),
                            EndDate = DateTime.Now.AddDays(45),
                            OutcomeStatus = ProjectClientEngagementStatus.Success,
                        }
                    };

                    _context.ProjectClientEngagements.AddRange(engagements);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                // Log the error and continue - this allows the application to start even if seeding fails
                Console.WriteLine($"An error occurred while seeding data: {ex.Message}");
            }
        }
    }
}
