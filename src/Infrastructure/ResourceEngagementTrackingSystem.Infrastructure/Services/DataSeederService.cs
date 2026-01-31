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
                        ContactPhone = "123-456-7890"
                    },
                    new Client
                    {
                        Name = "Test Client 2",
                        Email = "client2@example.com",
                        ContactName = "Jane Client",
                        ContactPhone = "098-765-4321"
                    }
                };

                _context.Clients.AddRange(clients);
                await _context.SaveChangesAsync();
            }

            // Seed test employees
            if (!await _context.Employees.AnyAsync())
            {
                var employees = new[]
                {
                    new Employee
                    {
                        FirstName = "John",
                        LastName = "Developer",
                        Email = "john.dev@company.com",
                        Position = "Senior Developer"
                    },
                    new Employee
                    {
                        FirstName = "Jane",
                        LastName = "Designer",
                        Email = "jane.design@company.com",
                        Position = "UI/UX Designer"
                    },
                    new Employee
                    {
                        FirstName = "Mike",
                        LastName = "Manager",
                        Email = "mike.pm@company.com",
                        Position = "Project Manager"
                    }
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
                            ClientId = clients.First().Id
                        },
                        new Project
                        {
                            Name = "Mobile App Development",
                            Description = "Native mobile application development",
                            ClientId = clients.Count > 1 ? clients[1].Id : clients.First().Id
                        },
                        new Project
                        {
                            Name = "API Integration Project",
                            Description = "Third-party API integration and testing",
                            ClientId = clients.First().Id
                        }
                    };

                    _context.Projects.AddRange(projects);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}