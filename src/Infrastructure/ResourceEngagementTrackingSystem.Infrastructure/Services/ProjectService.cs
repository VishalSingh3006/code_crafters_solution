using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectDto>> GetAllAsync()
        {
            return await _context
                .Projects.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    ClientId = p.ClientId,
                })
                .ToListAsync();
        }

        public async Task<ProjectDto> GetByIdAsync(int id)
        {
            var p = await _context.Projects.FindAsync(id);
            if (p == null)
                return null;
            return new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ClientId = p.ClientId,
            };
        }

        public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
        {
            var p = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                ClientId = dto.ClientId,
            };
            _context.Projects.Add(p);
            await _context.SaveChangesAsync();
            return new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ClientId = p.ClientId,
            };
        }

        public async Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto)
        {
            var p = await _context.Projects.FindAsync(id);
            if (p == null)
                return null;
            p.Name = dto.Name;
            p.Description = dto.Description;
            p.ClientId = dto.ClientId;
            await _context.SaveChangesAsync();
            return new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ClientId = p.ClientId,
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var p = await _context.Projects.FindAsync(id);
            if (p == null)
                return false;
            _context.Projects.Remove(p);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
