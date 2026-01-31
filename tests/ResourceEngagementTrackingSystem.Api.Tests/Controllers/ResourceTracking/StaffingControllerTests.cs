using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Staffing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class StaffingControllerTests : IClassFixture<StaffingControllerTestFixture>
    {
        private readonly Mock<IStaffingService> _mockStaffingService;
        private readonly StaffingController _controller;
        private readonly StaffingControllerTestFixture _fixture;

        public StaffingControllerTests(StaffingControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockStaffingService = new Mock<IStaffingService>();
            _controller = new StaffingController(_mockStaffingService.Object);
        }

        #region GetAllStaffingRecords Tests

        [Fact]
        public async Task GetAllStaffingRecords_ReturnsOkResult_WithStaffingRecordsList()
        {
            // Arrange
            _mockStaffingService
                .Setup(x => x.GetAllStaffingRecordsAsync())
                .ReturnsAsync(_fixture.SampleStaffingRecords);

            // Act
            var result = await _controller.GetAllStaffingRecords();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleStaffingRecords);

            _mockStaffingService.Verify(x => x.GetAllStaffingRecordsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllStaffingRecords_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            _mockStaffingService
                .Setup(x => x.GetAllStaffingRecordsAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAllStaffingRecords());
            _mockStaffingService.Verify(x => x.GetAllStaffingRecordsAsync(), Times.Once);
        }

        #endregion

        #region GetStaffingRecord Tests

        [Fact]
        public async Task GetStaffingRecord_WithValidId_ReturnsOkResult_WithStaffingRecord()
        {
            // Arrange
            var recordId = 1;
            _mockStaffingService
                .Setup(x => x.GetStaffingRecordByIdAsync(recordId))
                .ReturnsAsync(_fixture.SampleStaffingRecord);

            // Act
            var result = await _controller.GetStaffingRecord(recordId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleStaffingRecord);

            _mockStaffingService.Verify(x => x.GetStaffingRecordByIdAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task GetStaffingRecord_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockStaffingService
                .Setup(x => x.GetStaffingRecordByIdAsync(recordId))
                .ReturnsAsync((StaffingRecordDto?)null);

            // Act
            var result = await _controller.GetStaffingRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockStaffingService.Verify(x => x.GetStaffingRecordByIdAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task GetStaffingRecord_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var recordId = 1;
            _mockStaffingService
                .Setup(x => x.GetStaffingRecordByIdAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetStaffingRecord(recordId));
            _mockStaffingService.Verify(x => x.GetStaffingRecordByIdAsync(recordId), Times.Once);
        }

        #endregion

        #region CreateStaffingRecord Tests

        [Fact]
        public async Task CreateStaffingRecord_WithValidDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateStaffingRecordDto;
            _mockStaffingService
                .Setup(x => x.CreateStaffingRecordAsync(createDto))
                .ReturnsAsync(_fixture.SampleStaffingRecord);

            // Act
            var result = await _controller.CreateStaffingRecord(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be("GetStaffingRecord");
            createdResult.RouteValues!["id"].Should().Be(_fixture.SampleStaffingRecord.Id);
            createdResult.Value.Should().BeEquivalentTo(_fixture.SampleStaffingRecord);

            _mockStaffingService.Verify(x => x.CreateStaffingRecordAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task CreateStaffingRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var createDto = _fixture.SampleCreateStaffingRecordDto;
            _controller.ModelState.AddModelError("EmployeeId", "Employee ID is required");

            // Act
            var result = await _controller.CreateStaffingRecord(createDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();

            _mockStaffingService.Verify(
                x => x.CreateStaffingRecordAsync(It.IsAny<CreateStaffingRecordDto>()),
                Times.Never
            );
        }

        [Fact]
        public async Task CreateStaffingRecord_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var createDto = _fixture.SampleCreateStaffingRecordDto;
            _mockStaffingService
                .Setup(x => x.CreateStaffingRecordAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.CreateStaffingRecord(createDto));
            _mockStaffingService.Verify(x => x.CreateStaffingRecordAsync(createDto), Times.Once);
        }

        #endregion

        #region UpdateStaffingRecord Tests

        [Fact]
        public async Task UpdateStaffingRecord_WithValidIdAndDto_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateStaffingRecordDto;
            _mockStaffingService
                .Setup(x => x.UpdateStaffingRecordAsync(recordId, updateDto))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateStaffingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockStaffingService.Verify(
                x => x.UpdateStaffingRecordAsync(recordId, updateDto),
                Times.Once
            );
        }

        [Fact]
        public async Task UpdateStaffingRecord_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            var updateDto = _fixture.SampleUpdateStaffingRecordDto;
            _mockStaffingService
                .Setup(x => x.UpdateStaffingRecordAsync(recordId, updateDto))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateStaffingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockStaffingService.Verify(
                x => x.UpdateStaffingRecordAsync(recordId, updateDto),
                Times.Once
            );
        }

        [Fact]
        public async Task UpdateStaffingRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateStaffingRecordDto;
            _controller.ModelState.AddModelError("ProjectId", "Project ID is required");

            // Act
            var result = await _controller.UpdateStaffingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();

            _mockStaffingService.Verify(
                x =>
                    x.UpdateStaffingRecordAsync(
                        It.IsAny<int>(),
                        It.IsAny<UpdateStaffingRecordDto>()
                    ),
                Times.Never
            );
        }

        [Fact]
        public async Task UpdateStaffingRecord_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateStaffingRecordDto;
            _mockStaffingService
                .Setup(x => x.UpdateStaffingRecordAsync(recordId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _controller.UpdateStaffingRecord(recordId, updateDto)
            );
            _mockStaffingService.Verify(
                x => x.UpdateStaffingRecordAsync(recordId, updateDto),
                Times.Once
            );
        }

        #endregion

        #region DeleteStaffingRecord Tests

        [Fact]
        public async Task DeleteStaffingRecord_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            _mockStaffingService
                .Setup(x => x.DeleteStaffingRecordAsync(recordId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteStaffingRecord(recordId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockStaffingService.Verify(x => x.DeleteStaffingRecordAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task DeleteStaffingRecord_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockStaffingService
                .Setup(x => x.DeleteStaffingRecordAsync(recordId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteStaffingRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockStaffingService.Verify(x => x.DeleteStaffingRecordAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task DeleteStaffingRecord_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var recordId = 1;
            _mockStaffingService
                .Setup(x => x.DeleteStaffingRecordAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.DeleteStaffingRecord(recordId));
            _mockStaffingService.Verify(x => x.DeleteStaffingRecordAsync(recordId), Times.Once);
        }

        #endregion

        #region Constructor Tests

        [Fact]
        public void Constructor_WithValidService_CreatesInstance()
        {
            // Arrange
            var service = new Mock<IStaffingService>().Object;

            // Act
            var controller = new StaffingController(service);

            // Assert
            controller.Should().NotBeNull();
        }

        #endregion
    }
}
