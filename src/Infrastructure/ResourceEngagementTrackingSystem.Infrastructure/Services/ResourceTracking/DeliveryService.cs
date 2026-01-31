using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking;
using ResourceEngagementTrackingSystem.Infrastructure.Models.ResourceTracking.Enums;
using ResourceEngagementTrackingSystem.Infrastructure.Repositories.ResourceTracking;

namespace ResourceEngagementTrackingSystem.Infrastructure.Services.ResourceTracking
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly ApplicationDbContext _context;

        public DeliveryService(IDeliveryRepository deliveryRepository, ApplicationDbContext context)
        {
            _deliveryRepository = deliveryRepository;
            _context = context;
        }

        public async Task<IEnumerable<DeliveryDto>> GetAllDeliveriesAsync()
        {
            var deliveries = await _deliveryRepository.GetAllAsync();
            return deliveries.Select(MapToDto);
        }

        public async Task<DeliveryDto?> GetDeliveryByIdAsync(int id)
        {
            var delivery = await _deliveryRepository.GetByIdAsync(id);
            return delivery != null ? MapToDto(delivery) : null;
        }

        public async Task<DeliveryDto> CreateDeliveryAsync(CreateDeliveryDto createDeliveryDto)
        {
            // Validate that Employee exists
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == createDeliveryDto.EmployeeId);
            if (!employeeExists)
            {
                throw new ArgumentException($"Employee with ID {createDeliveryDto.EmployeeId} does not exist.");
            }

            // Validate that Project exists
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == createDeliveryDto.ProjectId);
            if (!projectExists)
            {
                throw new ArgumentException($"Project with ID {createDeliveryDto.ProjectId} does not exist.");
            }

            var delivery = new Delivery
            {
                DeliveryName = createDeliveryDto.DeliveryName,
                Description = createDeliveryDto.Description,
                ProjectId = createDeliveryDto.ProjectId,
                EmployeeId = createDeliveryDto.EmployeeId,
                PlannedDeliveryDate = createDeliveryDto.PlannedDeliveryDate,
                ActualDeliveryDate = createDeliveryDto.ActualDeliveryDate,
                EstimatedEffort = createDeliveryDto.EstimatedEffort,
                ActualEffort = createDeliveryDto.ActualEffort,
                Priority = Enum.Parse<Priority>(createDeliveryDto.Priority),
                Status = Enum.Parse<DeliveryStatus>(createDeliveryDto.Status)
            };

            var createdDelivery = await _deliveryRepository.AddAsync(delivery);
            return MapToDto(createdDelivery);
        }

        public async Task<bool> UpdateDeliveryAsync(int id, UpdateDeliveryDto updateDeliveryDto)
        {
            var delivery = await _deliveryRepository.GetByIdAsync(id);
            if (delivery == null) return false;

            if (!string.IsNullOrEmpty(updateDeliveryDto.DeliveryName))
                delivery.DeliveryName = updateDeliveryDto.DeliveryName;
            
            if (updateDeliveryDto.Description != null)
                delivery.Description = updateDeliveryDto.Description;
            
            if (updateDeliveryDto.PlannedDeliveryDate.HasValue)
                delivery.PlannedDeliveryDate = updateDeliveryDto.PlannedDeliveryDate.Value;
            
            if (updateDeliveryDto.ActualDeliveryDate.HasValue)
                delivery.ActualDeliveryDate = updateDeliveryDto.ActualDeliveryDate;
            
            if (updateDeliveryDto.EstimatedEffort.HasValue)
                delivery.EstimatedEffort = updateDeliveryDto.EstimatedEffort.Value;
            
            if (updateDeliveryDto.ActualEffort.HasValue)
                delivery.ActualEffort = updateDeliveryDto.ActualEffort;
            
            if (!string.IsNullOrEmpty(updateDeliveryDto.Priority))
                delivery.Priority = Enum.Parse<Priority>(updateDeliveryDto.Priority);
            
            if (!string.IsNullOrEmpty(updateDeliveryDto.Status))
                delivery.Status = Enum.Parse<DeliveryStatus>(updateDeliveryDto.Status);

            delivery.UpdatedAt = DateTime.UtcNow;

            return await _deliveryRepository.UpdateAsync(delivery);
        }

        public async Task<bool> DeleteDeliveryAsync(int id)
        {
            return await _deliveryRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<DeliveryDto>> GetDeliveriesByProjectIdAsync(int projectId)
        {
            var deliveries = await _deliveryRepository.GetByProjectIdAsync(projectId);
            return deliveries.Select(MapToDto);
        }

        public async Task<IEnumerable<DeliveryDto>> GetDeliveriesByEmployeeIdAsync(int employeeId)
        {
            var deliveries = await _deliveryRepository.GetByEmployeeIdAsync(employeeId);
            return deliveries.Select(MapToDto);
        }

        public async Task<IEnumerable<DeliveryDto>> GetOverdueDeliveriesAsync()
        {
            var deliveries = await _deliveryRepository.GetOverdueDeliveriesAsync();
            return deliveries.Select(MapToDto);
        }

        private static DeliveryDto MapToDto(Delivery delivery)
        {
            return new DeliveryDto
            {
                Id = delivery.Id,
                DeliveryName = delivery.DeliveryName,
                Description = delivery.Description,
                ProjectId = delivery.ProjectId,
                ProjectName = delivery.Project?.Name ?? string.Empty,
                EmployeeId = delivery.EmployeeId,
                EmployeeName = $"{delivery.Employee?.FirstName} {delivery.Employee?.LastName}".Trim(),
                PlannedDeliveryDate = delivery.PlannedDeliveryDate,
                ActualDeliveryDate = delivery.ActualDeliveryDate,
                EstimatedEffort = delivery.EstimatedEffort,
                ActualEffort = delivery.ActualEffort,
                Priority = delivery.Priority.ToString(),
                Status = delivery.Status.ToString(),
                CreatedAt = delivery.CreatedAt,
                UpdatedAt = delivery.UpdatedAt
            };
        }
    }
}