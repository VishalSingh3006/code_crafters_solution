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
    public class ClientsControllerTests : IClassFixture<ClientsControllerTestFixture>
    {
        private readonly Mock<IClientService> _mockClientService;
        private readonly ClientsController _controller;
        private readonly ClientsControllerTestFixture _fixture;

        public ClientsControllerTests(ClientsControllerTestFixture fixture)
        {
            _fixture = fixture;
            _mockClientService = new Mock<IClientService>();
            _controller = new ClientsController(_mockClientService.Object);
        }

        #region GetAll Tests

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithClientsList()
        {
            // Arrange
            _mockClientService.Setup(x => x.GetAllAsync())
                .ReturnsAsync(_fixture.SampleClients);

            // Act
            var result = await _controller.GetAll();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleClients);
            
            _mockClientService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAll_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            _mockClientService.Setup(x => x.GetAllAsync())
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.GetAll());
            _mockClientService.Verify(x => x.GetAllAsync(), Times.Once);
        }

        #endregion

        #region Get Tests

        [Fact]
        public async Task Get_WithValidId_ReturnsOkResult_WithClient()
        {
            // Arrange
            var clientId = 1;
            _mockClientService.Setup(x => x.GetByIdAsync(clientId))
                .ReturnsAsync(_fixture.SampleClient);

            // Act
            var result = await _controller.Get(clientId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleClient);
            
            _mockClientService.Verify(x => x.GetByIdAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task Get_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var clientId = 999;
            _mockClientService.Setup(x => x.GetByIdAsync(clientId))
                .ReturnsAsync((ClientDto?)null);

            // Act
            var result = await _controller.Get(clientId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockClientService.Verify(x => x.GetByIdAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task Get_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var clientId = 1;
            _mockClientService.Setup(x => x.GetByIdAsync(clientId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Get(clientId));
            _mockClientService.Verify(x => x.GetByIdAsync(clientId), Times.Once);
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_WithValidDto_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = _fixture.SampleCreateClientDto;
            _mockClientService.Setup(x => x.CreateAsync(createDto))
                .ReturnsAsync(_fixture.SampleClient);

            // Act
            var result = await _controller.Create(createDto);

            // Assert
            result.Should().BeOfType<CreatedAtActionResult>();
            var createdResult = result as CreatedAtActionResult;
            createdResult!.ActionName.Should().Be("Get");
            createdResult.RouteValues!["id"].Should().Be(_fixture.SampleClient.Id);
            createdResult.Value.Should().BeEquivalentTo(_fixture.SampleClient);
            
            _mockClientService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        [Fact]
        public async Task Create_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var createDto = _fixture.SampleCreateClientDto;
            _mockClientService.Setup(x => x.CreateAsync(createDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Create(createDto));
            _mockClientService.Verify(x => x.CreateAsync(createDto), Times.Once);
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_WithValidIdAndDto_ReturnsOkResult()
        {
            // Arrange
            var clientId = 1;
            var updateDto = _fixture.SampleUpdateClientDto;
            _mockClientService.Setup(x => x.UpdateAsync(clientId, updateDto))
                .ReturnsAsync(_fixture.SampleUpdatedClient);

            // Act
            var result = await _controller.Update(clientId, updateDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().BeEquivalentTo(_fixture.SampleUpdatedClient);
            
            _mockClientService.Verify(x => x.UpdateAsync(clientId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var clientId = 999;
            var updateDto = _fixture.SampleUpdateClientDto;
            _mockClientService.Setup(x => x.UpdateAsync(clientId, updateDto))
                .ReturnsAsync((ClientDto?)null);

            // Act
            var result = await _controller.Update(clientId, updateDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockClientService.Verify(x => x.UpdateAsync(clientId, updateDto), Times.Once);
        }

        [Fact]
        public async Task Update_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var clientId = 1;
            var updateDto = _fixture.SampleUpdateClientDto;
            _mockClientService.Setup(x => x.UpdateAsync(clientId, updateDto))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Update(clientId, updateDto));
            _mockClientService.Verify(x => x.UpdateAsync(clientId, updateDto), Times.Once);
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var clientId = 1;
            _mockClientService.Setup(x => x.DeleteAsync(clientId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(clientId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            _mockClientService.Verify(x => x.DeleteAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var clientId = 999;
            _mockClientService.Setup(x => x.DeleteAsync(clientId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(clientId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
            _mockClientService.Verify(x => x.DeleteAsync(clientId), Times.Once);
        }

        [Fact]
        public async Task Delete_ServiceThrowsException_PropagatesException()
        {
            // Arrange
            var clientId = 1;
            _mockClientService.Setup(x => x.DeleteAsync(clientId))
                .ThrowsAsync(new Exception("Database error"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _controller.Delete(clientId));
            _mockClientService.Verify(x => x.DeleteAsync(clientId), Times.Once);
        }

        #endregion

        #region Constructor Tests

        [Fact]
        public void Constructor_WithValidService_CreatesInstance()
        {
            // Arrange
            var service = new Mock<IClientService>().Object;

            // Act
            var controller = new ClientsController(service);

            // Assert
            controller.Should().NotBeNull();
        }

        #endregion
    }
}