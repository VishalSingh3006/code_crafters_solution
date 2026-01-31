using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers.ResourceTracking.Analytics;
using ResourceEngagementTrackingSystem.Api.Tests.Fixtures;
using ResourceEngagementTrackingSystem.Application.DTOs.ResourceTracking.Analytics;
using ResourceEngagementTrackingSystem.Application.Interfaces.ResourceTracking;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers.ResourceTracking
{
    public class AnalyticsControllerTests : IClassFixture<AnalyticsControllerTestFixture>
    {
        private readonly Mock<IAnalyticsService> _mockAnalyticsService;
        private readonly AnalyticsController _controller;
        private readonly AnalyticsControllerTestFixture _fixture;

        public AnalyticsControllerTests(AnalyticsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockAnalyticsService = new Mock<IAnalyticsService>();
            _controller = new AnalyticsController(_mockAnalyticsService.Object);
        }

        #region GetDashboardData Tests

        [Fact]
        public async Task GetDashboardData_ReturnsOkResult_WithDashboardData()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetDashboardDataAsync())
                .ReturnsAsync(_fixture.SampleDashboardData);

            // Act
            var result = await _controller.GetDashboardData();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleDashboardData);

            _mockAnalyticsService.Verify(x => x.GetDashboardDataAsync(), Times.Once);
        }

        [Fact]
        public async Task GetDashboardData_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetDashboardDataAsync())
                .ThrowsAsync(new Exception("Service error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetDashboardData());
            _mockAnalyticsService.Verify(x => x.GetDashboardDataAsync(), Times.Once);
        }

        #endregion

        #region GetResourceUtilization Tests

        [Fact]
        public async Task GetResourceUtilization_WithDateRange_ReturnsOkResult_WithUtilizationData()
        {
            // Arrange
            var startDate = new DateTime(2024, 1, 1);
            var endDate = new DateTime(2024, 1, 31);

            _mockAnalyticsService
                .Setup(x => x.GetResourceUtilizationAsync(startDate, endDate))
                .ReturnsAsync(_fixture.SampleResourceUtilizationData);

            // Act
            var result = await _controller.GetResourceUtilization(startDate, endDate);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleResourceUtilizationData);

            _mockAnalyticsService.Verify(
                x => x.GetResourceUtilizationAsync(startDate, endDate),
                Times.Once
            );
        }

        [Fact]
        public async Task GetResourceUtilization_WithNullDates_ReturnsOkResult()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetResourceUtilizationAsync(null, null))
                .ReturnsAsync(_fixture.SampleResourceUtilizationData);

            // Act
            var result = await _controller.GetResourceUtilization(null, null);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleResourceUtilizationData);

            _mockAnalyticsService.Verify(
                x => x.GetResourceUtilizationAsync(null, null),
                Times.Once
            );
        }

        [Fact]
        public async Task GetResourceUtilization_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            var startDate = new DateTime(2024, 1, 1);
            var endDate = new DateTime(2024, 1, 31);

            _mockAnalyticsService
                .Setup(x => x.GetResourceUtilizationAsync(startDate, endDate))
                .ThrowsAsync(new ArgumentException("Invalid date range"));

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() =>
                _controller.GetResourceUtilization(startDate, endDate)
            );

            _mockAnalyticsService.Verify(
                x => x.GetResourceUtilizationAsync(startDate, endDate),
                Times.Once
            );
        }

        #endregion

        #region GetProjectPerformance Tests

        [Fact]
        public async Task GetProjectPerformance_WithProjectId_ReturnsOkResult_WithPerformanceData()
        {
            // Arrange
            var projectId = 123;

            _mockAnalyticsService
                .Setup(x => x.GetProjectPerformanceAsync(projectId))
                .ReturnsAsync(_fixture.SampleProjectPerformanceDataWithId);

            // Act
            var result = await _controller.GetProjectPerformance(projectId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleProjectPerformanceDataWithId);

            _mockAnalyticsService.Verify(x => x.GetProjectPerformanceAsync(projectId), Times.Once);
        }

        [Fact]
        public async Task GetProjectPerformance_WithNullProjectId_ReturnsOkResult()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetProjectPerformanceAsync(null))
                .ReturnsAsync(_fixture.SampleProjectPerformanceData);

            // Act
            var result = await _controller.GetProjectPerformance(null);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleProjectPerformanceData);

            _mockAnalyticsService.Verify(x => x.GetProjectPerformanceAsync(null), Times.Once);
        }

        [Fact]
        public async Task GetProjectPerformance_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            var projectId = 999;
            _mockAnalyticsService
                .Setup(x => x.GetProjectPerformanceAsync(projectId))
                .ThrowsAsync(new InvalidOperationException("Project not found"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _controller.GetProjectPerformance(projectId)
            );

            _mockAnalyticsService.Verify(x => x.GetProjectPerformanceAsync(projectId), Times.Once);
        }

        #endregion

        #region GetEmployeePerformance Tests

        [Fact]
        public async Task GetEmployeePerformance_WithAllParameters_ReturnsOkResult_WithPerformanceData()
        {
            // Arrange
            var employeeId = 456;
            var startDate = new DateTime(2024, 1, 1);
            var endDate = new DateTime(2024, 3, 31);

            _mockAnalyticsService
                .Setup(x => x.GetEmployeePerformanceAsync(employeeId, startDate, endDate))
                .ReturnsAsync(_fixture.SampleEmployeePerformanceDataWithId);

            // Act
            var result = await _controller.GetEmployeePerformance(employeeId, startDate, endDate);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleEmployeePerformanceDataWithId);

            _mockAnalyticsService.Verify(
                x => x.GetEmployeePerformanceAsync(employeeId, startDate, endDate),
                Times.Once
            );
        }

        [Fact]
        public async Task GetEmployeePerformance_WithNullParameters_ReturnsOkResult()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetEmployeePerformanceAsync(null, null, null))
                .ReturnsAsync(_fixture.SampleEmployeePerformanceData);

            // Act
            var result = await _controller.GetEmployeePerformance(null, null, null);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleEmployeePerformanceData);

            _mockAnalyticsService.Verify(
                x => x.GetEmployeePerformanceAsync(null, null, null),
                Times.Once
            );
        }

        [Fact]
        public async Task GetEmployeePerformance_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            var employeeId = 999;
            var startDate = new DateTime(2024, 1, 1);
            var endDate = new DateTime(2024, 3, 31);

            _mockAnalyticsService
                .Setup(x => x.GetEmployeePerformanceAsync(employeeId, startDate, endDate))
                .ThrowsAsync(new ArgumentException("Employee not found"));

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() =>
                _controller.GetEmployeePerformance(employeeId, startDate, endDate)
            );

            _mockAnalyticsService.Verify(
                x => x.GetEmployeePerformanceAsync(employeeId, startDate, endDate),
                Times.Once
            );
        }

        #endregion

        #region GetRevenueAnalysis Tests

        [Fact]
        public async Task GetRevenueAnalysis_WithValidYear_ReturnsOkResult_WithRevenueData()
        {
            // Arrange
            var year = 2024;

            _mockAnalyticsService
                .Setup(x => x.GetRevenueAnalysisAsync(year))
                .ReturnsAsync(_fixture.SampleRevenueAnalysisData);

            // Act
            var result = await _controller.GetRevenueAnalysis(year);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleRevenueAnalysisData);

            _mockAnalyticsService.Verify(x => x.GetRevenueAnalysisAsync(year), Times.Once);
        }

        [Fact]
        public async Task GetRevenueAnalysis_WithInvalidYear_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            var invalidYear = 1990;
            _mockAnalyticsService
                .Setup(x => x.GetRevenueAnalysisAsync(invalidYear))
                .ThrowsAsync(
                    new ArgumentOutOfRangeException(nameof(invalidYear), "Year must be valid")
                );

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() =>
                _controller.GetRevenueAnalysis(invalidYear)
            );

            _mockAnalyticsService.Verify(x => x.GetRevenueAnalysisAsync(invalidYear), Times.Once);
        }

        [Fact]
        public async Task GetRevenueAnalysis_WithCurrentYear_ReturnsOkResult()
        {
            // Arrange
            var currentYear = DateTime.Now.Year;

            _mockAnalyticsService
                .Setup(x => x.GetRevenueAnalysisAsync(currentYear))
                .ReturnsAsync(_fixture.SampleRevenueAnalysisData);

            // Act
            var result = await _controller.GetRevenueAnalysis(currentYear);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleRevenueAnalysisData);

            _mockAnalyticsService.Verify(x => x.GetRevenueAnalysisAsync(currentYear), Times.Once);
        }

        #endregion

        #region GetCapacityPlanningData Tests

        [Fact]
        public async Task GetCapacityPlanningData_ReturnsOkResult_WithCapacityData()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetCapacityPlanningDataAsync())
                .ReturnsAsync(_fixture.SampleCapacityPlanningData);

            // Act
            var result = await _controller.GetCapacityPlanningData();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleCapacityPlanningData);

            _mockAnalyticsService.Verify(x => x.GetCapacityPlanningDataAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCapacityPlanningData_ServiceThrowsException_ThrowsException()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetCapacityPlanningDataAsync())
                .ThrowsAsync(new InvalidOperationException("Unable to calculate capacity"));

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _controller.GetCapacityPlanningData()
            );

            _mockAnalyticsService.Verify(x => x.GetCapacityPlanningDataAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCapacityPlanningData_ReturnsEmptyData_WhenNoDataAvailable()
        {
            // Arrange
            _mockAnalyticsService
                .Setup(x => x.GetCapacityPlanningDataAsync())
                .ReturnsAsync(_fixture.EmptyCapacityPlanningData);

            // Act
            var result = await _controller.GetCapacityPlanningData();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.EmptyCapacityPlanningData);

            _mockAnalyticsService.Verify(x => x.GetCapacityPlanningDataAsync(), Times.Once);
        }

        #endregion

        #region Constructor Tests

        [Fact]
        public void Constructor_WithValidAnalyticsService_CreatesInstance()
        {
            // Arrange
            var mockService = new Mock<IAnalyticsService>();

            // Act
            var controller = new AnalyticsController(mockService.Object);

            // Assert
            controller.Should().NotBeNull();
        }

        #endregion
    }
}
