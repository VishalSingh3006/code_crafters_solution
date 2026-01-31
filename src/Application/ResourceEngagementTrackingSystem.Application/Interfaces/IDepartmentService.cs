using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllAsync();
        Task<DepartmentDto> GetByIdAsync(int id);
        Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto);
        Task<DepartmentDto> UpdateAsync(int id, UpdateDepartmentDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
