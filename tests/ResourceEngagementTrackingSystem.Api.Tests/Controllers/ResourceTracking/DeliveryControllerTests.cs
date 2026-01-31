using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Delivery;
using ResourceEngagementTrackingSystem.Api.Tests.Fixtures.ResourceTracking;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Delivery;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class DeliveryControllerTests : IClassFixture<DeliveryControllerTestFixture>
    {
        private readonly DeliveryControllerTestFixture _fixture;
        private readonly Mock<IDeliveryService> _mockDeliveryService;
        private readonly DeliveryController _controller;

        public DeliveryControllerTests(DeliveryControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockDeliveryService = new Mock<IDeliveryService>();
            _controller = new DeliveryController(_mockDeliveryService.Object);
        }

        #region GetAllDeliveries Tests

        [Fact]
        public async Task GetAllDeliveries_ReturnsOkWithDeliveries()
        {
            // Arrange
            _mockDeliveryService.Setup(x => x.GetAllDeliveriesAsync())
                .ReturnsAsync(_fixture.SampleDeliveries);

            // Act
            var result = await _controller.GetAllDeliveries();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleDeliveries);
        }

        [Fact]
        public async Task GetAllDeliveries_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockDeliveryService.Setup(x => x.GetAllDeliveriesAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAllDeliveries());
        }

        #endregion

        #region GetDelivery Tests

        [Fact]
        public async Task GetDelivery_WhenDeliveryExists_ReturnsOkWithDelivery()
        {
            // Arrange
            var deliveryId = 1;
            var expectedDelivery = _fixture.SampleDeliveries[0];
            _mockDeliveryService.Setup(x => x.GetDeliveryByIdAsync(deliveryId))
                .ReturnsAsync(expectedDelivery);

            // Act
            var result = await _controller.GetDelivery(deliveryId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(expectedDelivery);
        }

        [Fact]
        public async Task GetDelivery_WhenDeliveryNotFound_ReturnsNotFound()
        {
            // Arrange
            var deliveryId = 999;
            _mockDeliveryService.Setup(x => x.GetDeliveryByIdAsync(deliveryId))
                .ReturnsAsync((DeliveryDto)null!);

            // Act
            var result = await _controller.GetDelivery(deliveryId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetDelivery_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var deliveryId = 1;
            _mockDeliveryService.Setup(x => x.GetDeliveryByIdAsync(deliveryId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetDelivery(deliveryId));
        }

        #endregion

        #region CreateDelivery Tests

        [Fact]
        public async Task CreateDelivery_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDeliveryDto;
            var createdDelivery = new DeliveryDto 
            { 
                Id = 3,
                DeliveryName = createDto.DeliveryName,
                Description = createDto.Description,
                ProjectId = createDto.ProjectId,
                ProjectName = "New Project",
                EmployeeId = createDto.EmployeeId,
                EmployeeName = "John Doe",
                PlannedDeliveryDate = createDto.PlannedDeliveryDate,
                ActualDeliveryDate = createDto.ActualDeliveryDate,
                EstimatedEffort = createDto.EstimatedEffort,
                ActualEffort = createDto.ActualEffort,
                Priority = createDto.Priority,
                Status = createDto.Status,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            
            _mockDeliveryService.Setup(x => x.CreateDeliveryAsync(createDto))
                .ReturnsAsync(createdDelivery);

            // Act
            var result = await _controller.CreateDelivery(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.GetDelivery));
            createdResult.RouteValues!["id"].Should().Be(createdDelivery.Id);
            createdResult.Value.Should().BeEquivalentTo(createdDelivery);
            _mockDeliveryService.Verify(x => x.CreateDeliveryAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task CreateDelivery_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("ProjectId", "ProjectId is required");
            var createDto = new CreateDeliveryDto();

            // Act
            var result = await _controller.CreateDelivery(createDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();
            
            _mockDeliveryService.Verify(x => x.CreateDeliveryAsync(It.IsAny<CreateDeliveryDto>()), Times.Never);
        }

        [Fact]
        public async Task CreateDelivery_WithArgumentException_ReturnsBadRequest()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDeliveryDto;
            _mockDeliveryService.Setup(x => x.CreateDeliveryAsync(createDto))
                .ThrowsAsync(new ArgumentException("Invalid project ID"));

            // Act
            var result = await _controller.CreateDelivery(createDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().NotBeNull();
        }

        [Fact]
        public async Task CreateDelivery_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDeliveryDto;
            _mockDeliveryService.Setup(x => x.CreateDeliveryAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.CreateDelivery(createDto));
        }

        #endregion

        #region UpdateDelivery Tests

        [Fact]
        public async Task UpdateDelivery_WhenDeliveryExists_ReturnsNoContent()
        {
            // Arrange
            var deliveryId = 1;
            var updateDto = _fixture.SampleUpdateDeliveryDto;
            _mockDeliveryService.Setup(x => x.UpdateDeliveryAsync(deliveryId, updateDto))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateDelivery(deliveryId, updateDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockDeliveryService.Verify(x => x.UpdateDeliveryAsync(deliveryId, updateDto), Times.Once);
        }

        [Fact]
        public async Task UpdateDelivery_WhenDeliveryNotFound_ReturnsNotFound()
        {
            // Arrange
            var deliveryId = 999;
            var updateDto = _fixture.SampleUpdateDeliveryDto;
            _mockDeliveryService.Setup(x => x.UpdateDeliveryAsync(deliveryId, updateDto))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateDelivery(deliveryId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdateDelivery_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var deliveryId = 1;
            _controller.ModelState.AddModelError("ProjectId", "ProjectId is required");
            var updateDto = new UpdateDeliveryDto();

            // Act
            var result = await _controller.UpdateDelivery(deliveryId, updateDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();
            
            _mockDeliveryService.Verify(x => x.UpdateDeliveryAsync(It.IsAny<int>(), It.IsAny<UpdateDeliveryDto>()), Times.Never);
        }

        [Fact]
        public async Task UpdateDelivery_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var deliveryId = 1;
            var updateDto = _fixture.SampleUpdateDeliveryDto;
            _mockDeliveryService.Setup(x => x.UpdateDeliveryAsync(deliveryId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.UpdateDelivery(deliveryId, updateDto));
        }

        #endregion

        #region DeleteDelivery Tests

        [Fact]
        public async Task DeleteDelivery_WhenDeliveryExists_ReturnsNoContent()
        {
            // Arrange
            var deliveryId = 1;
            _mockDeliveryService.Setup(x => x.DeleteDeliveryAsync(deliveryId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteDelivery(deliveryId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task DeleteDelivery_WhenDeliveryNotFound_ReturnsNotFound()
        {
            // Arrange
            var deliveryId = 999;
            _mockDeliveryService.Setup(x => x.DeleteDeliveryAsync(deliveryId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteDelivery(deliveryId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteDelivery_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var deliveryId = 1;
            _mockDeliveryService.Setup(x => x.DeleteDeliveryAsync(deliveryId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.DeleteDelivery(deliveryId));
        }

        #endregion
    }
}