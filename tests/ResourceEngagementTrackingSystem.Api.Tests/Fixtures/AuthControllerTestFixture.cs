using System;
using Microsoft.AspNetCore.Identity;
using ResourceEngagementTrackingSystem.Application.DTOs;

namespace ResourceEngagementTrackingSystem.Api.Tests.Controllers
{
    public class AuthControllerTestFixture
    {
        public RegisterDto SampleRegisterDto { get; }
        public LoginDto SampleLoginDto { get; }
        public IdentityUser SampleUser { get; }
        public IdentityUser SampleApplicationUser { get; } // Added missing property
        public string SampleJwtToken { get; }

        public AuthControllerTestFixture()
        {
            SampleRegisterDto = new RegisterDto
            {
                Email = "john.doe@example.com",
                Password = "Password123!",
                Title = "Mr",
                FirstName = "John",
                LastName = "Doe",
                PhoneNumber = "555-1234",
                Address = "123 Main St",
                ZipCode = "12345",
                Role = "User"
            };

            SampleLoginDto = new LoginDto
            {
                Email = "john.doe@example.com",
                Password = "Password123!"
            };

            SampleUser = new IdentityUser
            {
                Id = "user-123",
                Email = "john.doe@example.com",
                UserName = "john.doe@example.com",
                EmailConfirmed = true
            };

            SampleApplicationUser = new IdentityUser
            {
                Id = "app-user-456",
                Email = "app.user@example.com",
                UserName = "app.user@example.com",
                EmailConfirmed = true
            };

            SampleJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        }
    }
}