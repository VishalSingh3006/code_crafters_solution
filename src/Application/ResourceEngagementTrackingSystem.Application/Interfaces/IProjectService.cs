using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetAllAsync();
        Task<ProjectDto> GetByIdAsync(int id);
        Task<ProjectDto> CreateAsync(CreateProjectDto dto);
        Task<ProjectDto> UpdateAsync(int id, UpdateProjectDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
