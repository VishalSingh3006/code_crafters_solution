using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using ResourceEngagementTrackingSystem.Infrastructure.Models;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services
{
    public class ProjectClientEngagementService : IProjectClientEngagementService
    {
        private readonly ApplicationDbContext _context;

        public ProjectClientEngagementService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectClientEngagementDto>> GetAllAsync()
        {
            return await _context
                .ProjectClientEngagements
                .Include(e => e.Project)
                .Include(e => e.Client)
                .Select(e => new ProjectClientEngagementDto
                {
                    Id = e.Id,
                    ProjectId = e.ProjectId,
                    ProjectName = e.Project != null ? e.Project.Name : null,
                    ClientId = e.ClientId,
                    ClientName = e.Client != null ? e.Client.Name : null,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    OutcomeStatus = e.OutcomeStatus.ToString(),
                    IsProjectEngagement = e.ProjectId.HasValue && !e.ClientId.HasValue,
                    IsClientEngagement = e.ClientId.HasValue && !e.ProjectId.HasValue,
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectClientEngagementDto>> GetProjectEngagementsAsync()
        {
            return await _context
                .ProjectClientEngagements
                .Include(e => e.Project)
                .Where(e => e.ProjectId.HasValue && !e.ClientId.HasValue)
                .Select(e => new ProjectClientEngagementDto
                {
                    Id = e.Id,
                    ProjectId = e.ProjectId,
                    ProjectName = e.Project.Name,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    OutcomeStatus = e.OutcomeStatus.ToString(),
                    IsProjectEngagement = true,
                    IsClientEngagement = false,
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectClientEngagementDto>> GetClientEngagementsAsync()
        {
            return await _context
                .ProjectClientEngagements
                .Include(e => e.Client)
                .Where(e => e.ClientId.HasValue && !e.ProjectId.HasValue)
                .Select(e => new ProjectClientEngagementDto
                {
                    Id = e.Id,
                    ClientId = e.ClientId,
                    ClientName = e.Client.Name,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    OutcomeStatus = e.OutcomeStatus.ToString(),
                    IsProjectEngagement = false,
                    IsClientEngagement = true,
                })
                .ToListAsync();
        }

        public async Task<ProjectClientEngagementDto> GetByIdAsync(int id)
        {
            var e = await _context
                .ProjectClientEngagements
                .Include(e => e.Project)
                .Include(e => e.Client)
                .FirstOrDefaultAsync(e => e.Id == id);
            
            if (e == null)
                return null;

            return new ProjectClientEngagementDto
            {
                Id = e.Id,
                ProjectId = e.ProjectId,
                ProjectName = e.Project?.Name,
                ClientId = e.ClientId,
                ClientName = e.Client?.Name,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                OutcomeStatus = e.OutcomeStatus.ToString(),
                IsProjectEngagement = e.ProjectId.HasValue && !e.ClientId.HasValue,
                IsClientEngagement = e.ClientId.HasValue && !e.ProjectId.HasValue,
            };
        }

        public async Task<ProjectClientEngagementDto> CreateAsync(CreateProjectClientEngagementDto dto)
        {
            // Validate that either ProjectId or ClientId is set, but not both
            if ((dto.ProjectId.HasValue && dto.ClientId.HasValue) || 
                (!dto.ProjectId.HasValue && !dto.ClientId.HasValue))
            {
                throw new ArgumentException("Either ProjectId or ClientId must be set, but not both.");
            }

            if (!Enum.TryParse<ProjectClientEngagementStatus>(dto.OutcomeStatus, out var status))
            {
                throw new ArgumentException("Invalid OutcomeStatus value.");
            }

            var engagement = new ProjectClientEngagement
            {
                ProjectId = dto.ProjectId,
                ClientId = dto.ClientId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                OutcomeStatus = status,
            };

            _context.ProjectClientEngagements.Add(engagement);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(engagement.Id);
        }

        public async Task<ProjectClientEngagementDto> UpdateAsync(int id, UpdateProjectClientEngagementDto dto)
        {
            var engagement = await _context.ProjectClientEngagements.FindAsync(id);
            if (engagement == null)
                return null;

            // For updates, we need to be more flexible - check the actual values being sent
            var hasProjectId = dto.ProjectId.HasValue && dto.ProjectId.Value > 0;
            var hasClientId = dto.ClientId.HasValue && dto.ClientId.Value > 0;
            
            // Validate that either ProjectId or ClientId is set, but not both
            if ((hasProjectId && hasClientId) || (!hasProjectId && !hasClientId))
            {
                throw new ArgumentException("Either ProjectId or ClientId must be set, but not both.");
            }

            if (!Enum.TryParse<ProjectClientEngagementStatus>(dto.OutcomeStatus, out var status))
            {
                throw new ArgumentException("Invalid OutcomeStatus value.");
            }

            // Update based on which ID is provided
            if (hasProjectId)
            {
                engagement.ProjectId = dto.ProjectId;
                engagement.ClientId = null;
            }
            else
            {
                engagement.ClientId = dto.ClientId;
                engagement.ProjectId = null;
            }
            
            engagement.StartDate = dto.StartDate;
            engagement.EndDate = dto.EndDate;
            engagement.OutcomeStatus = status;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(engagement.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var engagement = await _context.ProjectClientEngagements.FindAsync(id);
            if (engagement == null)
                return false;

            _context.ProjectClientEngagements.Remove(engagement);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}