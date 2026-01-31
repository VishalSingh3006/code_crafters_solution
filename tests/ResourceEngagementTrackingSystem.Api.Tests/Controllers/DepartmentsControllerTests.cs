using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Application.Interfaces;
using Xunit;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class DepartmentsControllerTests : IClassFixture<DepartmentsControllerTestFixture>
    {
        private readonly Mock<IDepartmentService> _mockDepartmentService;
        private readonly DepartmentsController _controller;
        private readonly DepartmentsControllerTestFixture _fixture;

        public DepartmentsControllerTests(DepartmentsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockDepartmentService = new Mock<IDepartmentService>();
            _controller = new DepartmentsController(_mockDepartmentService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_WhenDepartmentsExist_ReturnsOkWithDepartments()
        {
            // Arrange
            _mockDepartmentService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(_fixture.SampleDepartments);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleDepartments);
            _mockDepartmentService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAll_WhenNoDepartments_ReturnsOkWithEmptyList()
        {
            // Arrange
            _mockDepartmentService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(new List<DepartmentDto>());

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(new List<DepartmentDto>());
        }

        [Fact]
        public async Task GetAll_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            _mockDepartmentService.Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WhenDepartmentExists_ReturnsOkWithDepartment()
        {
            // Arrange
            var departmentId = 1;
            _mockDepartmentService.Setup(x => x.GetByIdAsync(departmentId))
                .ReturnsAsync(_fixture.SampleDepartment);

            // Act
            var result = await _controller.Get(departmentId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleDepartment);
            _mockDepartmentService.Verify(x => x.GetByIdAsync(departmentId), Times.Once);
        }

        [Fact]
        public async Task Get_WhenDepartmentNotFound_ReturnsNotFound()
        {
            // Arrange
            var departmentId = 999;
            _mockDepartmentService.Setup(x => x.GetByIdAsync(departmentId))
                .ReturnsAsync((DepartmentDto)null);

            // Act
            var result = await _controller.Get(departmentId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Get_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var departmentId = 1;
            _mockDepartmentService.Setup(x => x.GetByIdAsync(departmentId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(departmentId));
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDepartmentDto;
            var createdDepartment = new DepartmentDto { Id = 4, Name = createDto.Name };
            _mockDepartmentService.Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(createdDepartment);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be(nameof(_controller.Get));
            createdResult.RouteValues!["id"].Should().Be(createdDepartment.Id);
            createdResult.Value.Should().BeEquivalentTo(createdDepartment);
            _mockDepartmentService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task Create_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var createDto = _fixture.SampleCreateDepartmentDto;
            _mockDepartmentService.Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WhenDepartmentExists_ReturnsOkWithUpdatedDepartment()
        {
            // Arrange
            var departmentId = 1;
            var updateDto = _fixture.SampleUpdateDepartmentDto;
            _mockDepartmentService.Setup(x => x.UpdateAsync(departmentId, updateDto))
                .ReturnsAsync(_fixture.SampleUpdatedDepartment);

            // Act
            var result = await _controller.Update(departmentId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleUpdatedDepartment);
            _mockDepartmentService.Verify(x => x.UpdateAsync(departmentId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_WhenDepartmentNotFound_ReturnsNotFound()
        {
            // Arrange
            var departmentId = 999;
            var updateDto = _fixture.SampleUpdateDepartmentDto;
            _mockDepartmentService.Setup(x => x.UpdateAsync(departmentId, updateDto))
                .ReturnsAsync((DepartmentDto)null);

            // Act
            var result = await _controller.Update(departmentId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Update_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var departmentId = 1;
            var updateDto = _fixture.SampleUpdateDepartmentDto;
            _mockDepartmentService.Setup(x => x.UpdateAsync(departmentId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(departmentId, updateDto));
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WhenDepartmentExists_ReturnsNoContent()
        {
            // Arrange
            var departmentId = 1;
            _mockDepartmentService.Setup(x => x.DeleteAsync(departmentId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(departmentId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockDepartmentService.Verify(x => x.DeleteAsync(departmentId), Times.Once);
        }

        [Fact]
        public async Task Delete_WhenDepartmentNotFound_ReturnsNotFound()
        {
            // Arrange
            var departmentId = 999;
            _mockDepartmentService.Setup(x => x.DeleteAsync(departmentId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(departmentId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task Delete_WhenServiceThrows_ShouldThrow()
        {
            // Arrange
            var departmentId = 1;
            _mockDepartmentService.Setup(x => x.DeleteAsync(departmentId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(departmentId));
        }

        #endregion
    }
}