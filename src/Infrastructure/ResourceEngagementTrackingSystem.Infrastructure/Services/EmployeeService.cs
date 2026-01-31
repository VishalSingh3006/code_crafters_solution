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
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;

        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
        {
            return await _context
                .Employees.Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.EmployeeSkills)
                    .ThenInclude(es => es.Skill)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    EmployeeCode = e.EmployeeCode,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Email = e.Email,
                    Phone = e.Phone,
                    Department = e.Department.Name,
                    Designation = e.Designation.Name,
                    EmploymentType = e.EmploymentType.ToString(),
                    ManagerId = e.ManagerId,
                    Skills = e.EmployeeSkills.Select(es => new EmployeeSkillDto
                    {
                        SkillId = es.SkillId,
                        SkillName = es.Skill.Name,
                        ProficiencyLevel = es.ProficiencyLevel.ToString(),
                        YearsOfExperience = es.YearsOfExperience,
                        LastUsedDate = es.LastUsedDate
                    }).ToList()
                }).ToListAsync();
        }

        public async Task<EmployeeDto> GetByIdAsync(int id)
        {
            var e = await _context
                .Employees.Include(x => x.Department)
                .Include(x => x.Designation)
                .Include(x => x.EmployeeSkills)
                    .ThenInclude(es => es.Skill)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (e == null)
                return null;
            return new EmployeeDto
            {
                Id = e.Id,
                EmployeeCode = e.EmployeeCode,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Department = e.Department.Name,
                Designation = e.Designation.Name,
                EmploymentType = e.EmploymentType.ToString(),
                ManagerId = e.ManagerId,
                Skills = e.EmployeeSkills.Select(es => new EmployeeSkillDto
                {
                    SkillId = es.SkillId,
                    SkillName = es.Skill.Name,
                    ProficiencyLevel = es.ProficiencyLevel.ToString(),
                    YearsOfExperience = es.YearsOfExperience,
                    LastUsedDate = es.LastUsedDate
                }).ToList()
            };
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
        {
            var e = new Employee
            {
                EmployeeCode = dto.EmployeeCode,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId,
                EmploymentType = ParseEmploymentType(dto.EmploymentType),
                ManagerId = dto.ManagerId,
            };
            if (dto.Skills != null)
            {
                e.EmployeeSkills = dto.Skills.Select(s => new EmployeeSkill
                {
                    SkillId = s.SkillId,
                    ProficiencyLevel = ParseProficiencyLevel(s.ProficiencyLevel),
                    YearsOfExperience = s.YearsOfExperience,
                    LastUsedDate = s.LastUsedDate
                }).ToList();
            }
            _context.Employees.Add(e);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(e.Id);
        }

        public async Task<EmployeeDto> UpdateAsync(int id, UpdateEmployeeDto dto)
        {
            var e = await _context
                .Employees.Include(x => x.EmployeeSkills)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (e == null)
                return null;
            e.EmployeeCode = dto.EmployeeCode;
            e.FirstName = dto.FirstName;
            e.LastName = dto.LastName;
            e.Email = dto.Email;
            e.Phone = dto.Phone;
            e.DepartmentId = dto.DepartmentId;
            e.DesignationId = dto.DesignationId;
            e.EmploymentType = ParseEmploymentType(dto.EmploymentType);
            e.ManagerId = dto.ManagerId;
            // Update skills
            e.EmployeeSkills.Clear();
            if (dto.Skills != null)
            {
                foreach (var s in dto.Skills)
                {
                    e.EmployeeSkills.Add(new EmployeeSkill
                    {
                        EmployeeId = e.Id,
                        SkillId = s.SkillId,
                        ProficiencyLevel = ParseProficiencyLevel(s.ProficiencyLevel),
                        YearsOfExperience = s.YearsOfExperience,
                        LastUsedDate = s.LastUsedDate
                    });
                }
            }
            await _context.SaveChangesAsync();
            return await GetByIdAsync(e.Id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _context.Employees.FindAsync(id);
            if (e == null)
                return false;
            _context.Employees.Remove(e);
            await _context.SaveChangesAsync();
            return true;
        }

        private static EmploymentType ParseEmploymentType(string employmentType)
        {
            if (string.IsNullOrWhiteSpace(employmentType))
                return EmploymentType.Permanent; // Default value

            return employmentType.ToLowerInvariant().Replace("-", "").Replace(" ", "") switch
            {
                "fulltime" => EmploymentType.Permanent,
                "permanent" => EmploymentType.Permanent,
                "parttime" => EmploymentType.Contract, // Map part-time to contract
                "contract" => EmploymentType.Contract,
                "contractor" => EmploymentType.Contract,
                "intern" => EmploymentType.Intern,
                "internship" => EmploymentType.Intern,
                _ => Enum.TryParse<EmploymentType>(employmentType, true, out var result)
                    ? result
                    : EmploymentType.Permanent, // Default fallback
            };
        }

        private ProficiencyLevel ParseProficiencyLevel(string proficiencyLevel)
        {
            if (string.IsNullOrWhiteSpace(proficiencyLevel))
                return ProficiencyLevel.Beginner;

            return proficiencyLevel.ToLower().Replace(" ", "").Replace("-", "") switch
            {
                "beginner" => ProficiencyLevel.Beginner,
                "intermediate" => ProficiencyLevel.Intermediate,
                "expert" => ProficiencyLevel.Expert,
                "advanced" => ProficiencyLevel.Expert, // Map advanced to expert since it's not in enum
                _ => ProficiencyLevel.Beginner, // Default fallback
            };
        }
    }
}
