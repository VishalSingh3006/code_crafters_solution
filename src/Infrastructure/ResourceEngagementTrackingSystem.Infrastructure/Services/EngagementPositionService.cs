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
    public class EngagementPositionService : IEngagementPositionService
    {
        private readonly ApplicationDbContext _context;

        public EngagementPositionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EngagementPositionDto>> GetAllAsync()
        {
            return await _context.EngagementPositions
                .Include(ep => ep.Engagement)
                .Select(ep => new EngagementPositionDto
                {
                    Id = ep.Id,
                    EngagementId = ep.EngagementId,
                    Title = ep.Title,
                    RequiredSkill = ep.RequiredSkill,
                    RequiredProficiency = ep.RequiredProficiency,
                    EngagementName = ep.Engagement != null 
                        ? (ep.Engagement.Project != null 
                            ? $"Project: {ep.Engagement.Project.Name}"
                            : ep.Engagement.Client != null 
                                ? $"Client: {ep.Engagement.Client.Name}" 
                                : "Unknown Engagement")
                        : null
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<EngagementPositionDto>> GetByEngagementIdAsync(int engagementId)
        {
            return await _context.EngagementPositions
                .Include(ep => ep.Engagement)
                .Where(ep => ep.EngagementId == engagementId)
                .Select(ep => new EngagementPositionDto
                {
                    Id = ep.Id,
                    EngagementId = ep.EngagementId,
                    Title = ep.Title,
                    RequiredSkill = ep.RequiredSkill,
                    RequiredProficiency = ep.RequiredProficiency,
                    EngagementName = ep.Engagement != null 
                        ? (ep.Engagement.Project != null 
                            ? $"Project: {ep.Engagement.Project.Name}"
                            : ep.Engagement.Client != null 
                                ? $"Client: {ep.Engagement.Client.Name}" 
                                : "Unknown Engagement")
                        : null
                })
                .ToListAsync();
        }

        public async Task<EngagementPositionDto?> GetByIdAsync(int id)
        {
            var ep = await _context.EngagementPositions
                .Include(ep => ep.Engagement)
                    .ThenInclude(e => e.Project)
                .Include(ep => ep.Engagement)
                    .ThenInclude(e => e.Client)
                .FirstOrDefaultAsync(ep => ep.Id == id);

            if (ep == null)
                return null;

            return new EngagementPositionDto
            {
                Id = ep.Id,
                EngagementId = ep.EngagementId,
                Title = ep.Title,
                RequiredSkill = ep.RequiredSkill,
                RequiredProficiency = ep.RequiredProficiency,
                EngagementName = ep.Engagement != null 
                    ? (ep.Engagement.Project != null 
                        ? $"Project: {ep.Engagement.Project.Name}"
                        : ep.Engagement.Client != null 
                            ? $"Client: {ep.Engagement.Client.Name}" 
                            : "Unknown Engagement")
                    : null
            };
        }

        public async Task<EngagementPositionDto> CreateAsync(CreateEngagementPositionDto dto)
        {
            // Validate engagement exists
            var engagementExists = await _context.ProjectClientEngagements
                .AnyAsync(e => e.Id == dto.EngagementId);
            
            if (!engagementExists)
                throw new ArgumentException("Engagement not found.");

            var position = new EngagementPosition
            {
                EngagementId = dto.EngagementId,
                Title = dto.Title,
                RequiredSkill = dto.RequiredSkill,
                RequiredProficiency = dto.RequiredProficiency
            };

            _context.EngagementPositions.Add(position);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(position.Id) ?? throw new InvalidOperationException("Failed to retrieve created position.");
        }

        public async Task<EngagementPositionDto?> UpdateAsync(int id, UpdateEngagementPositionDto dto)
        {
            var position = await _context.EngagementPositions.FindAsync(id);
            if (position == null)
                return null;

            // Validate engagement exists
            var engagementExists = await _context.ProjectClientEngagements
                .AnyAsync(e => e.Id == dto.EngagementId);
            
            if (!engagementExists)
                throw new ArgumentException("Engagement not found.");

            position.EngagementId = dto.EngagementId;
            position.Title = dto.Title;
            position.RequiredSkill = dto.RequiredSkill;
            position.RequiredProficiency = dto.RequiredProficiency;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(position.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var position = await _context.EngagementPositions.FindAsync(id);
            if (position == null)
                return false;

            _context.EngagementPositions.Remove(position);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}