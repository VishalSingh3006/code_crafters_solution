using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking
{
    public interface IDeliveryRepository
    {
        Task<IEnumerable<Delivery>> GetAllAsync();
        Task<Delivery?> GetByIdAsync(int id);
        Task<Delivery> AddAsync(Delivery delivery);
        Task<bool> UpdateAsync(Delivery delivery);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Delivery>> GetByProjectIdAsync(int projectId);
        Task<IEnumerable<Delivery>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Delivery>> GetOverdueDeliveriesAsync();
    }
}