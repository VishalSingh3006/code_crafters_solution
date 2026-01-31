using System;
using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery;

namespace ResourceEngagementTrackingSystem.Api.Tests.Fixtures.ResourceTracking
{
    public class DeliveryControllerTestFixture
    {
        public List<DeliveryDto> SampleDeliveries { get; }
        public CreateDeliveryDto SampleCreateDeliveryDto { get; }
        public UpdateDeliveryDto SampleUpdateDeliveryDto { get; }

        public DeliveryControllerTestFixture()
        {
            SampleDeliveries = new List<DeliveryDto>
            {
                new DeliveryDto
                {
                    Id = 1,
                    DeliveryName = "E-commerce Platform Phase 1",
                    Description = "First phase delivery including user auth and product catalog",
                    ProjectId = 1,
                    ProjectName = "E-commerce Platform",
                    EmployeeId = 1,
                    EmployeeName = "John Smith",
                    PlannedDeliveryDate = DateTime.Now.AddDays(7),
                    ActualDeliveryDate = null,
                    EstimatedEffort = 80.5m,
                    ActualEffort = null,
                    Priority = "High",
                    Status = "InProgress",
                    CreatedAt = DateTime.Now.AddDays(-30),
                    UpdatedAt = DateTime.Now.AddDays(-1),
                },
                new DeliveryDto
                {
                    Id = 2,
                    DeliveryName = "Mobile App Beta Release",
                    Description = "Beta version of mobile banking application",
                    ProjectId = 2,
                    ProjectName = "Mobile Banking App",
                    EmployeeId = 2,
                    EmployeeName = "Jane Doe",
                    PlannedDeliveryDate = DateTime.Now.AddDays(-5),
                    ActualDeliveryDate = DateTime.Now.AddDays(-3),
                    EstimatedEffort = 120.0m,
                    ActualEffort = 118.5m,
                    Priority = "Medium",
                    Status = "Delivered",
                    CreatedAt = DateTime.Now.AddDays(-60),
                    UpdatedAt = DateTime.Now.AddDays(-3),
                },
            };

            SampleCreateDeliveryDto = new CreateDeliveryDto
            {
                DeliveryName = "API Integration Module",
                Description = "Third-party API integration components",
                ProjectId = 3,
                EmployeeId = 3,
                PlannedDeliveryDate = DateTime.Now.AddDays(45),
                EstimatedEffort = 40.0m,
                Priority = "Medium",
                Status = "Planned",
            };

            SampleUpdateDeliveryDto = new UpdateDeliveryDto
            {
                DeliveryName = "Enhanced API Integration Module",
                Description = "Third-party API integration with enhanced error handling",
                PlannedDeliveryDate = DateTime.Now.AddDays(40),
                ActualDeliveryDate = null,
                EstimatedEffort = 45.0m,
                ActualEffort = 20.0m,
                Priority = "High",
                Status = "InProgress",
            };
        }
    }
}
