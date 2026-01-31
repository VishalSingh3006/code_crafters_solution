using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking
{
    public class RecruitmentService : IRecruitmentService
    {
        private readonly ApplicationDbContext _context;

        public RecruitmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RecruitmentRecordDto>> GetAllRecruitmentRecordsAsync()
        {
            var recruitmentRecords = await _context.RecruitmentRecords.ToListAsync();
            return recruitmentRecords.Select(MapToDto);
        }

        public async Task<RecruitmentRecordDto?> GetRecruitmentRecordByIdAsync(int id)
        {
            var recruitmentRecord = await _context.RecruitmentRecords.FindAsync(id);
            return recruitmentRecord != null ? MapToDto(recruitmentRecord) : null;
        }

        public async Task<RecruitmentRecordDto> CreateRecruitmentRecordAsync(CreateRecruitmentRecordDto createRecruitmentRecordDto)
        {
            var recruitmentRecord = new RecruitmentRecord
            {
                Position = createRecruitmentRecordDto.Position,
                Department = createRecruitmentRecordDto.Department,
                PostedDate = createRecruitmentRecordDto.PostedDate,
                ClosedDate = createRecruitmentRecordDto.ClosedDate,
                RecruitmentType = Enum.Parse<RecruitmentType>(createRecruitmentRecordDto.RecruitmentType),
                JobDescription = createRecruitmentRecordDto.JobDescription,
                Requirements = createRecruitmentRecordDto.Requirements,
                NumberOfOpenings = createRecruitmentRecordDto.NumberOfOpenings,
                Status = Enum.Parse<RecruitmentStatus>(createRecruitmentRecordDto.Status),
                Budget = createRecruitmentRecordDto.Budget
            };

            _context.RecruitmentRecords.Add(recruitmentRecord);
            await _context.SaveChangesAsync();

            return MapToDto(recruitmentRecord);
        }

        public async Task<bool> UpdateRecruitmentRecordAsync(int id, UpdateRecruitmentRecordDto updateRecruitmentRecordDto)
        {
            var recruitmentRecord = await _context.RecruitmentRecords.FindAsync(id);
            if (recruitmentRecord == null) return false;

            if (!string.IsNullOrEmpty(updateRecruitmentRecordDto.Position))
                recruitmentRecord.Position = updateRecruitmentRecordDto.Position;
            if (!string.IsNullOrEmpty(updateRecruitmentRecordDto.Department))
                recruitmentRecord.Department = updateRecruitmentRecordDto.Department;
            if (updateRecruitmentRecordDto.ClosedDate.HasValue)
                recruitmentRecord.ClosedDate = updateRecruitmentRecordDto.ClosedDate;
            if (!string.IsNullOrEmpty(updateRecruitmentRecordDto.RecruitmentType))
                recruitmentRecord.RecruitmentType = Enum.Parse<RecruitmentType>(updateRecruitmentRecordDto.RecruitmentType);
            if (updateRecruitmentRecordDto.JobDescription != null)
                recruitmentRecord.JobDescription = updateRecruitmentRecordDto.JobDescription;
            if (updateRecruitmentRecordDto.Requirements != null)
                recruitmentRecord.Requirements = updateRecruitmentRecordDto.Requirements;
            if (updateRecruitmentRecordDto.NumberOfOpenings.HasValue)
                recruitmentRecord.NumberOfOpenings = updateRecruitmentRecordDto.NumberOfOpenings.Value;
            if (!string.IsNullOrEmpty(updateRecruitmentRecordDto.Status))
                recruitmentRecord.Status = Enum.Parse<RecruitmentStatus>(updateRecruitmentRecordDto.Status);
            if (updateRecruitmentRecordDto.Budget.HasValue)
                recruitmentRecord.Budget = updateRecruitmentRecordDto.Budget;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRecruitmentRecordAsync(int id)
        {
            var recruitmentRecord = await _context.RecruitmentRecords.FindAsync(id);
            if (recruitmentRecord == null) return false;

            _context.RecruitmentRecords.Remove(recruitmentRecord);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<RecruitmentRecordDto>> GetOpenRecruitmentRecordsAsync()
        {
            var recruitmentRecords = await _context.RecruitmentRecords
                .Where(r => r.Status == RecruitmentStatus.Open)
                .ToListAsync();

            return recruitmentRecords.Select(MapToDto);
        }

        public async Task<IEnumerable<RecruitmentRecordDto>> GetRecruitmentRecordsByDepartmentAsync(string department)
        {
            var recruitmentRecords = await _context.RecruitmentRecords
                .Where(r => r.Department.ToLower() == department.ToLower())
                .ToListAsync();

            return recruitmentRecords.Select(MapToDto);
        }

        public async Task<IEnumerable<RecruitmentRecordDto>> GetRecruitmentRecordsByTypeAsync(string type)
        {
            if (!Enum.TryParse<RecruitmentType>(type, out var recruitmentType))
                return new List<RecruitmentRecordDto>();

            var recruitmentRecords = await _context.RecruitmentRecords
                .Where(r => r.RecruitmentType == recruitmentType)
                .ToListAsync();

            return recruitmentRecords.Select(MapToDto);
        }

        private static RecruitmentRecordDto MapToDto(RecruitmentRecord recruitmentRecord)
        {
            return new RecruitmentRecordDto
            {
                Id = recruitmentRecord.Id,
                Position = recruitmentRecord.Position,
                Department = recruitmentRecord.Department,
                PostedDate = recruitmentRecord.PostedDate,
                ClosedDate = recruitmentRecord.ClosedDate,
                RecruitmentType = recruitmentRecord.RecruitmentType.ToString(),
                JobDescription = recruitmentRecord.JobDescription,
                Requirements = recruitmentRecord.Requirements,
                NumberOfOpenings = recruitmentRecord.NumberOfOpenings,
                Status = recruitmentRecord.Status.ToString(),
                Budget = recruitmentRecord.Budget,
                CreatedAt = recruitmentRecord.CreatedAt,
                UpdatedAt = recruitmentRecord.UpdatedAt
            };
        }
    }
}