using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Recruitment;

namespace ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking
{
    public interface IRecruitmentService
    {
        Task<IEnumerable<RecruitmentRecordDto>> GetAllRecruitmentRecordsAsync();
        Task<RecruitmentRecordDto?> GetRecruitmentRecordByIdAsync(int id);
        Task<RecruitmentRecordDto> CreateRecruitmentRecordAsync(CreateRecruitmentRecordDto createRecruitmentRecordDto);
        Task<bool> UpdateRecruitmentRecordAsync(int id, UpdateRecruitmentRecordDto updateRecruitmentRecordDto);
        Task<bool> DeleteRecruitmentRecordAsync(int id);
        Task<IEnumerable<RecruitmentRecordDto>> GetOpenRecruitmentRecordsAsync();
        Task<IEnumerable<RecruitmentRecordDto>> GetRecruitmentRecordsByDepartmentAsync(string department);
        Task<IEnumerable<RecruitmentRecordDto>> GetRecruitmentRecordsByTypeAsync(string type);
    }
}