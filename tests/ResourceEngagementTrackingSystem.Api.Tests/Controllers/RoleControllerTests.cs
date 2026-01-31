using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ResourceEngagementTrackingSystem.Api.Controllers;
using ResourceEngagementTrackingSystem.Api.Tests.Fixtures;
using ResourceEngagementTrackingSystem.Application.DTOs;
using ResourceEngagementTrackingSystem.Infrastructure.Models;
using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class RoleControllerTests : IClassFixture<RoleControllerTestFixture>
    {
        private readonly RoleControllerTestFixture _fixture;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;
        private readonly RoleController _controller;

        public RoleControllerTests(RoleControllerTestFixture fixture)
        {
            _fixture = fixture;
            
            // Mock UserManager
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);
            
            // Mock RoleManager
            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                roleStoreMock.Object, null!, null!, null!, null!);

            _controller = new RoleController(_mockUserManager.Object, _mockRoleManager.Object);
        }

        #region GetAvailableRoles Tests

        [Fact]
        public void GetAvailableRoles_ReturnsOkWithRoles()
        {
            // Act
            var result = _controller.GetAvailableRoles();

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().NotBeNull();
        }

        #endregion

        #region AssignRole Tests

        [Fact]
        public async Task AssignRole_WithValidRole_ReturnsOk()
        {
            // Arrange
            var assignRoleDto = _fixture.SampleAssignRoleDto;
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = assignRoleDto.Email,
                UserName = assignRoleDto.Email
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(assignRoleDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.IsInRoleAsync(user, assignRoleDto.Role))
                .ReturnsAsync(false);
            _mockUserManager.Setup(x => x.AddToRoleAsync(user, assignRoleDto.Role))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.AssignRole(assignRoleDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task AssignRole_WithInvalidRole_ReturnsBadRequest()
        {
            // Arrange
            var assignRoleDto = new AssignRoleDto 
            { 
                Email = "test@example.com", 
                Role = "InvalidRole" 
            };

            // Act
            var result = await _controller.AssignRole(assignRoleDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            var badRequestResult = result as BadRequestObjectResult;
            badRequestResult!.Value.Should().NotBeNull();
        }

        [Fact]
        public async Task AssignRole_WithNonExistentUser_ReturnsNotFound()
        {
            // Arrange
            var assignRoleDto = _fixture.SampleAssignRoleDto;
            _mockUserManager.Setup(x => x.FindByEmailAsync(assignRoleDto.Email))
                .ReturnsAsync((ApplicationUser)null!);

            // Act
            var result = await _controller.AssignRole(assignRoleDto);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async Task AssignRole_WhenUserAlreadyHasRole_ReturnsBadRequest()
        {
            // Arrange
            var assignRoleDto = _fixture.SampleAssignRoleDto;
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = assignRoleDto.Email,
                UserName = assignRoleDto.Email
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(assignRoleDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.IsInRoleAsync(user, assignRoleDto.Role))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.AssignRole(assignRoleDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task AssignRole_WhenAddToRoleFails_ReturnsBadRequest()
        {
            // Arrange
            var assignRoleDto = _fixture.SampleAssignRoleDto;
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = assignRoleDto.Email,
                UserName = assignRoleDto.Email
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(assignRoleDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.IsInRoleAsync(user, assignRoleDto.Role))
                .ReturnsAsync(false);
            _mockUserManager.Setup(x => x.AddToRoleAsync(user, assignRoleDto.Role))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Failed to assign role" }));

            // Act
            var result = await _controller.AssignRole(assignRoleDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        #endregion

        #region RemoveRole Tests

        [Fact]
        public async Task RemoveRole_WithValidData_ReturnsOk()
        {
            // Arrange
            var removeRoleDto = _fixture.SampleRemoveRoleDto;
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = removeRoleDto.Email,
                UserName = removeRoleDto.Email
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(removeRoleDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.IsInRoleAsync(user, removeRoleDto.Role))
                .ReturnsAsync(true);
            _mockUserManager.Setup(x => x.RemoveFromRoleAsync(user, removeRoleDto.Role))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.RemoveRole(removeRoleDto);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task RemoveRole_WithInvalidRole_ReturnsBadRequest()
        {
            // Arrange
            var removeRoleDto = new RemoveRoleDto
            {
                Email = "test@example.com",
                Role = "InvalidRole"
            };

            // Act
            var result = await _controller.RemoveRole(removeRoleDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task RemoveRole_WithNonExistentUser_ReturnsNotFound()
        {
            // Arrange
            var removeRoleDto = _fixture.SampleRemoveRoleDto;
            _mockUserManager.Setup(x => x.FindByEmailAsync(removeRoleDto.Email))
                .ReturnsAsync((ApplicationUser)null!);

            // Act
            var result = await _controller.RemoveRole(removeRoleDto);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async Task RemoveRole_WhenUserDoesNotHaveRole_ReturnsBadRequest()
        {
            // Arrange
            var removeRoleDto = _fixture.SampleRemoveRoleDto;
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = removeRoleDto.Email,
                UserName = removeRoleDto.Email
            };

            _mockUserManager.Setup(x => x.FindByEmailAsync(removeRoleDto.Email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.IsInRoleAsync(user, removeRoleDto.Role))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.RemoveRole(removeRoleDto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        #endregion

        #region GetUserRoles Tests

        [Fact]
        public async Task GetUserRoles_WithValidEmail_ReturnsOkWithRoles()
        {
            // Arrange
            var email = "test@example.com";
            var user = new ApplicationUser 
            { 
                Id = "user-1", 
                Email = email,
                UserName = email
            };
            var roles = new[] { "Admin", "Manager" };

            _mockUserManager.Setup(x => x.FindByEmailAsync(email))
                .ReturnsAsync(user);
            _mockUserManager.Setup(x => x.GetRolesAsync(user))
                .ReturnsAsync(roles);

            // Act
            var result = await _controller.GetUserRoles(email);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().NotBeNull();
        }

        [Fact]
        public async Task GetUserRoles_WithNonExistentUser_ReturnsNotFound()
        {
            // Arrange
            var email = "nonexistent@example.com";
            _mockUserManager.Setup(x => x.FindByEmailAsync(email))
                .ReturnsAsync((ApplicationUser)null!);

            // Act
            var result = await _controller.GetUserRoles(email);

            // Assert
            result.Should().BeOfType<NotFoundObjectResult>();
        }

        #endregion
    }
}