using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IDesignationService
    {
        Task<IEnumerable<DesignationDto>> GetAllAsync();
        Task<DesignationDto> GetByIdAsync(int id);
        Task<DesignationDto> CreateAsync(CreateDesignationDto dto);
        Task<DesignationDto> UpdateAsync(int id, UpdateDesignationDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
