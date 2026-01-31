using System.Collections.Generic;
using System.Threading.Tasks;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery;

namespace ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking
{
    public interface IDeliveryService
    {
        Task<IEnumerable<DeliveryDto>> GetAllDeliveriesAsync();
        Task<DeliveryDto?> GetDeliveryByIdAsync(int id);
        Task<DeliveryDto> CreateDeliveryAsync(CreateDeliveryDto createDeliveryDto);
        Task<bool> UpdateDeliveryAsync(int id, UpdateDeliveryDto updateDeliveryDto);
        Task<bool> DeleteDeliveryAsync(int id);
        Task<IEnumerable<DeliveryDto>> GetDeliveriesByProjectIdAsync(int projectId);
        Task<IEnumerable<DeliveryDto>> GetDeliveriesByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<DeliveryDto>> GetOverdueDeliveriesAsync();
    }
}