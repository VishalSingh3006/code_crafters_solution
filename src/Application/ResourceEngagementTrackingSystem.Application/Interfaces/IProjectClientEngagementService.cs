using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IProjectClientEngagementService
    {
        Task<IEnumerable<ProjectClientEngagementDto>> GetAllAsync();
        Task<IEnumerable<ProjectClientEngagementDto>> GetProjectEngagementsAsync();
        Task<IEnumerable<ProjectClientEngagementDto>> GetClientEngagementsAsync();
        Task<ProjectClientEngagementDto> GetByIdAsync(int id);
        Task<ProjectClientEngagementDto> CreateAsync(CreateProjectClientEngagementDto dto);
        Task<ProjectClientEngagementDto> UpdateAsync(int id, UpdateProjectClientEngagementDto dto);
        Task<bool> DeleteAsync(int id);
    }
}