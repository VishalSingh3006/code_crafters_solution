using System.Collections.Generic;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Fixtures
{
    public class RoleControllerTestFixture
    {
        public List<string> SampleAvailableRoles { get; }
        public AssignRoleDto SampleAssignRoleDto { get; }
        public RemoveRoleDto SampleRemoveRoleDto { get; }
        public List<UserRolesResponseDto> SampleUserRoles { get; }

        public RoleControllerTestFixture()
        {
            SampleAvailableRoles = new List<string> { "Admin", "Manager", "Employee", "User" };

            SampleAssignRoleDto = new AssignRoleDto
            {
                Email = "john.doe@company.com",
                Role = "Manager",
            };

            SampleRemoveRoleDto = new RemoveRoleDto
            {
                Email = "jane.smith@company.com",
                Role = "Employee",
            };

            SampleUserRoles = new List<UserRolesResponseDto>
            {
                new UserRolesResponseDto
                {
                    UserId = "user-1",
                    Email = "admin@company.com",
                    FirstName = "Admin",
                    LastName = "User",
                    Roles = new List<string> { "Admin" },
                },
                new UserRolesResponseDto
                {
                    UserId = "user-2",
                    Email = "manager@company.com",
                    FirstName = "Manager",
                    LastName = "User",
                    Roles = new List<string> { "Manager", "Employee" },
                },
                new UserRolesResponseDto
                {
                    UserId = "user-3",
                    Email = "employee@company.com",
                    FirstName = "Employee",
                    LastName = "User",
                    Roles = new List<string> { "Employee" },
                },
            };
        }
    }
}
