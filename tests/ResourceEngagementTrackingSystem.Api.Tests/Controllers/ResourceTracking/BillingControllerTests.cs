using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Billing;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Billing;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class BillingControllerTests : IClassFixture<BillingControllerTestFixture>
    {
        private readonly Mock<IBillingService> _mockBillingService;
        private readonly BillingController _controller;
        private readonly BillingControllerTestFixture _fixture;

        public BillingControllerTests(BillingControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockBillingService = new Mock<IBillingService>();
            _controller = new BillingController(_mockBillingService.Object);
        }

        #region GetAllBillingRecords Tests

        [Fact]
        public async Task GetAllBillingRecords_WhenRecordsExist_ReturnsOkWithRecords()
        {
            // Arrange
            _mockBillingService.Setup(x => x.GetAllBillingRecordsAsync())
                .ReturnsAsync(_fixture.SampleBillingRecords);

            // Act
            var result = await _controller.GetAllBillingRecords();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleBillingRecords);
            _mockBillingService.Verify(x => x.GetAllBillingRecordsAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllBillingRecords_WhenNoRecords_ReturnsOkWithEmptyList()
        {
            // Arrange
            _mockBillingService.Setup(x => x.GetAllBillingRecordsAsync())
                .ReturnsAsync(new List<BillingRecordDto>());

            // Act
            var result = await _controller.GetAllBillingRecords();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(new List<BillingRecordDto>());
        }

        [Fact]
        public async Task GetAllBillingRecords_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockBillingService.Setup(x => x.GetAllBillingRecordsAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAllBillingRecords());
        }

        #endregion

        #region GetBillingRecord Tests

        [Fact]
        public async Task GetBillingRecord_WhenRecordExists_ReturnsOkWithRecord()
        {
            // Arrange
            var recordId = 1;
            _mockBillingService.Setup(x => x.GetBillingRecordByIdAsync(recordId))
                .ReturnsAsync(_fixture.SampleBillingRecord);

            // Act
            var result = await _controller.GetBillingRecord(recordId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleBillingRecord);
            _mockBillingService.Verify(x => x.GetBillingRecordByIdAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task GetBillingRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockBillingService.Setup(x => x.GetBillingRecordByIdAsync(recordId))
                .ReturnsAsync((BillingRecordDto)null);

            // Act
            var result = await _controller.GetBillingRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task GetBillingRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            _mockBillingService.Setup(x => x.GetBillingRecordByIdAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetBillingRecord(recordId));
        }

        #endregion

        #region CreateBillingRecord Tests

        [Fact]
        public async Task CreateBillingRecord_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateBillingRecordDto;
            var createdRecord = new BillingRecordDto 
            { 
                Id = 4, 
                ProjectId = createDto.ProjectId, 
                EmployeeId = createDto.EmployeeId,
                BillingDate = createDto.BillingDate,
                HoursWorked = createDto.HoursWorked,
                HourlyRate = createDto.HourlyRate,
                TotalAmount = createDto.HoursWorked * createDto.HourlyRate,
                Description = createDto.Description,
                BillingType = createDto.BillingType,
                Status = createDto.Status,
                IsInvoiced = createDto.IsInvoiced,
                CreatedAt = DateTime.Now
            };
            
            _mockBillingService.Setup(x => x.CreateBillingRecordAsync(createDto))
                .ReturnsAsync(createdRecord);

            // Act
            var result = await _controller.CreateBillingRecord(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.GetBillingRecord));
            createdResult.RouteValues!["id"].Should().Be(createdRecord.Id);
            createdResult.Value.Should().BeEquivalentTo(createdRecord);
            _mockBillingService.Verify(x => x.CreateBillingRecordAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task CreateBillingRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("ProjectId", "ProjectId is required");
            var createDto = new CreateBillingRecordDto();

            // Act
            var result = await _controller.CreateBillingRecord(createDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();
            
            _mockBillingService.Verify(x => x.CreateBillingRecordAsync(It.IsAny<CreateBillingRecordDto>()), Times.Never);
        }

        [Fact]
        public async Task CreateBillingRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateBillingRecordDto;
            _mockBillingService.Setup(x => x.CreateBillingRecordAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.CreateBillingRecord(createDto));
        }

        #endregion

        #region UpdateBillingRecord Tests

        [Fact]
        public async Task UpdateBillingRecord_WhenRecordExists_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateBillingRecordDto;
            _mockBillingService.Setup(x => x.UpdateBillingRecordAsync(recordId, updateDto))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateBillingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockBillingService.Verify(x => x.UpdateBillingRecordAsync(recordId, updateDto), Times.Once);
        }

        [Fact]
        public async Task UpdateBillingRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            var updateDto = _fixture.SampleUpdateBillingRecordDto;
            _mockBillingService.Setup(x => x.UpdateBillingRecordAsync(recordId, updateDto))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateBillingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task UpdateBillingRecord_WithInvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            var recordId = 1;
            _controller.ModelState.AddModelError("HoursWorked", "HoursWorked must be greater than 0");
            var updateDto = new UpdateBillingRecordDto();

            // Act
            var result = await _controller.UpdateBillingRecord(recordId, updateDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().BeOfType<SerializableError>();
            
            _mockBillingService.Verify(x => x.UpdateBillingRecordAsync(It.IsAny<int>(), It.IsAny<UpdateBillingRecordDto>()), Times.Never);
        }

        [Fact]
        public async Task UpdateBillingRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            var updateDto = _fixture.SampleUpdateBillingRecordDto;
            _mockBillingService.Setup(x => x.UpdateBillingRecordAsync(recordId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.UpdateBillingRecord(recordId, updateDto));
        }

        #endregion

        #region DeleteBillingRecord Tests

        [Fact]
        public async Task DeleteBillingRecord_WhenRecordExists_ReturnsNoContent()
        {
            // Arrange
            var recordId = 1;
            _mockBillingService.Setup(x => x.DeleteBillingRecordAsync(recordId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteBillingRecord(recordId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockBillingService.Verify(x => x.DeleteBillingRecordAsync(recordId), Times.Once);
        }

        [Fact]
        public async Task DeleteBillingRecord_WhenRecordNotFound_ReturnsNotFound()
        {
            // Arrange
            var recordId = 999;
            _mockBillingService.Setup(x => x.DeleteBillingRecordAsync(recordId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteBillingRecord(recordId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteBillingRecord_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var recordId = 1;
            _mockBillingService.Setup(x => x.DeleteBillingRecordAsync(recordId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.DeleteBillingRecord(recordId));
        }

        #endregion

        #region GetMonthlyBillingReport Tests

        [Fact]
        public async Task GetMonthlyBillingReport_WithValidParameters_ReturnsOkWithReport()
        {
            // Arrange
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;
            _mockBillingService.Setup(x => x.GetMonthlyBillingReportAsync(month, year))
                .ReturnsAsync(_fixture.SampleMonthlyReport);

            // Act
            var result = await _controller.GetMonthlyBillingReport(month, year);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleMonthlyReport);
            _mockBillingService.Verify(x => x.GetMonthlyBillingReportAsync(month, year), Times.Once);
        }

        [Fact]
        public async Task GetMonthlyBillingReport_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var month = 12;
            var year = 2023;
            _mockBillingService.Setup(x => x.GetMonthlyBillingReportAsync(month, year))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetMonthlyBillingReport(month, year));
        }

        #endregion
    }
}