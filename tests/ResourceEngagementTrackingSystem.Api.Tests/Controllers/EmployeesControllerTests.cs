using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class EmployeesControllerTests : IClassFixture<EmployeesControllerTestFixture>
    {
        private readonly Mock<IEmployeeService> _mockEmployeeService;
        private readonly EmployeesController _controller;
        private readonly EmployeesControllerTestFixture _fixture;

        public EmployeesControllerTests(EmployeesControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockEmployeeService = new Mock<IEmployeeService>();
            _controller = new EmployeesController(_mockEmployeeService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithEmployeesList()
        {
            // Arrange
            _mockEmployeeService
                .Setup(x => x.GetAllAsync())
                .ReturnsAsync(_fixture.SampleEmployees);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleEmployees);

            _mockEmployeeService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAll_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            _mockEmployeeService
                .Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
            _mockEmployeeService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WithValidId_ReturnsOkResult_WithEmployee()
        {
            // Arrange
            var employeeId = 1;
            _mockEmployeeService
                .Setup(x => x.GetByIdAsync(employeeId))
                .ReturnsAsync(_fixture.SampleEmployee);

            // Act
            var result = await _controller.Get(employeeId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleEmployee);

            _mockEmployeeService.Verify(x => x.GetByIdAsync(employeeId), Times.Once);
        }

        [Fact]
        public async Task Get_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var employeeId = 999;
            _mockEmployeeService
                .Setup(x => x.GetByIdAsync(employeeId))
                .ReturnsAsync((EmployeeDto?)null);

            // Act
            var result = await _controller.Get(employeeId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockEmployeeService.Verify(x => x.GetByIdAsync(employeeId), Times.Once);
        }

        [Fact]
        public async Task Get_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var employeeId = 1;
            _mockEmployeeService
                .Setup(x => x.GetByIdAsync(employeeId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(employeeId));
            _mockEmployeeService.Verify(x => x.GetByIdAsync(employeeId), Times.Once);
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateEmployeeDto;
            _mockEmployeeService
                .Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(_fixture.SampleEmployee);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be("Get");
            createdResult.RouteValues!["id"].Should().Be(_fixture.SampleEmployee.Id);
            createdResult.Value.Should().BeEquivalentTo(_fixture.SampleEmployee);

            _mockEmployeeService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task Create_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var createDto = _fixture.SampleCreateEmployeeDto;
            _mockEmployeeService
                .Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
            _mockEmployeeService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WithValidIdAndDto_ReturnsOkResult()
        {
            // Arrange
            var employeeId = 1;
            var updateDto = _fixture.SampleUpdateEmployeeDto;
            _mockEmployeeService
                .Setup(x => x.UpdateAsync(employeeId, updateDto))
                .ReturnsAsync(_fixture.SampleUpdatedEmployee);

            // Act
            var result = await _controller.Update(employeeId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleUpdatedEmployee);

            _mockEmployeeService.Verify(x => x.UpdateAsync(employeeId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var employeeId = 999;
            var updateDto = _fixture.SampleUpdateEmployeeDto;
            _mockEmployeeService
                .Setup(x => x.UpdateAsync(employeeId, updateDto))
                .ReturnsAsync((EmployeeDto?)null);

            // Act
            var result = await _controller.Update(employeeId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockEmployeeService.Verify(x => x.UpdateAsync(employeeId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var employeeId = 1;
            var updateDto = _fixture.SampleUpdateEmployeeDto;
            _mockEmployeeService
                .Setup(x => x.UpdateAsync(employeeId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(employeeId, updateDto));
            _mockEmployeeService.Verify(x => x.UpdateAsync(employeeId, updateDto), Times.Once);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var employeeId = 1;
            _mockEmployeeService.Setup(x => x.DeleteAsync(employeeId)).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(employeeId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockEmployeeService.Verify(x => x.DeleteAsync(employeeId), Times.Once);
        }

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var employeeId = 999;
            _mockEmployeeService.Setup(x => x.DeleteAsync(employeeId)).ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(employeeId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockEmployeeService.Verify(x => x.DeleteAsync(employeeId), Times.Once);
        }

        [Fact]
        public async Task Delete_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var employeeId = 1;
            _mockEmployeeService
                .Setup(x => x.DeleteAsync(employeeId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(employeeId));
            _mockEmployeeService.Verify(x => x.DeleteAsync(employeeId), Times.Once);
        }

        #endregion

        #region Constructor Tests

        [Fact]
        public void Constructor_WithValidService_CreatesInstance()
        {
            // Arrange
            var service = new Mock<IEmployeeService>().Object;

            // Act
            var controller = new EmployeesController(service);

            // Assert
            controller.Should().NotBeNull();
        }

        #endregion
    }
}
