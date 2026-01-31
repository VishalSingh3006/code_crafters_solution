# ResourceEngagementTrackingSystem API Tests

This project contains comprehensive unit tests for the Resource & Engagement Tracking System API controllers.

## Test Structure

### Controllers Tested
- **AnalyticsController** - Resource tracking analytics and reporting
- **EmployeesController** - Employee management CRUD operations
- **ClientsController** - Client management CRUD operations  
- **StaffingController** - Resource tracking staffing records
- **AuthController** - Authentication and user registration

### Test Organization
- `Controllers/` - Controller test classes
- `Controllers/ResourceTracking/` - Resource tracking controller tests
- `Fixtures/` - Test data fixtures using xUnit class fixtures
- Each controller has its own test class and corresponding fixture

### Testing Framework
- **xUnit 2.4.2** - Primary testing framework
- **Moq 4.20.69** - Mocking framework for dependency injection
- **FluentAssertions 6.12.0** - Readable assertion library

### Test Data Fixtures
- `AnalyticsControllerTestFixture` - Analytics test data for dashboards and reports
- `EmployeesControllerTestFixture` - Employee test data with realistic sample records
- `ClientsControllerTestFixture` - Client test data with comprehensive business information
- `StaffingControllerTestFixture` - Staffing records with allocation and billing data
- `AuthControllerTestFixture` - Authentication test data for login/register scenarios

### Mocking Strategy
- **Service Layer Mocking** - All service dependencies are mocked using Moq
- **Test Fixture Pattern** - Using `IClassFixture<T>` for shared test data
- **Verify() calls** - Ensure service methods are invoked correctly
- **Setup() variations** - Different return values for various test scenarios

### Assertion Patterns
- **FluentAssertions** for readable assertions
- **Type checking** - Ensures correct return types (OkResult, NotFound, etc.)
- **Value verification** - Validates returned data matches fixture expectations  
- **Service verification** - Confirms correct service method calls
- **ModelState validation** - Tests invalid model state handling

### Test Coverage

#### AnalyticsController (18 tests)
- Dashboard data retrieval
- Resource utilization analytics
- Project and employee performance metrics
- Revenue analysis and capacity planning
- Exception handling scenarios

#### EmployeesController (15 tests)
- CRUD operations (Create, Read, Update, Delete)
- Valid/invalid ID scenarios
- Exception propagation
- CreatedAtAction response validation
- NotFound handling

#### ClientsController (15 tests)
- Complete client management lifecycle
- Business data validation
- Service interaction verification
- Error response handling

#### StaffingController (18 tests)
- Staffing record management
- Model validation testing
- Resource allocation scenarios
- Service layer integration testing
- CRUD operation validation

#### AuthController (10 tests)
- User registration with validation
- Login with credential verification
- Two-factor authentication flow
- Account lockout handling
- Service dependency mocking

## Running Tests

```bash
# Run all tests
dotnet test

# Run with verbose output
dotnet test --verbosity normal

# Run specific test class
dotnet test --filter "ClassName=EmployeesControllerTests"

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Test Patterns

### Standard CRUD Controller Pattern
```csharp
[Fact]
public async Task GetAll_ReturnsOkResult_WithList()
{
    // Arrange
    _mockService.Setup(x => x.GetAllAsync()).ReturnsAsync(_fixture.SampleData);
    
    // Act
    var result = await _controller.GetAll();
    
    // Assert
    result.Should().BeOfType<OkObjectResult>();
    _mockService.Verify(x => x.GetAllAsync(), Times.Once);
}
```

### Exception Testing Pattern
```csharp
[Fact]
public async Task Method_ServiceThrowsException_PropagatesException()
{
    // Arrange
    _mockService.Setup(x => x.Method()).ThrowsAsync(new Exception("Error"));
    
    // Act & Assert
    await Assert.ThrowsAsync<Exception>(() => _controller.Method());
}
```

### Model Validation Pattern
```csharp
[Fact]
public async Task Create_WithInvalidModelState_ReturnsBadRequest()
{
    // Arrange
    _controller.ModelState.AddModelError("Field", "Error message");
    
    // Act
    var result = await _controller.Create(dto);
    
    // Assert
    result.Should().BeOfType<BadRequestObjectResult>();
}
```

## Best Practices Applied

- **Single Responsibility** - Each test validates one specific behavior
- **Arrange-Act-Assert** - Clear test structure
- **Descriptive Names** - Test names explain expected behavior
- **Isolated Tests** - No dependencies between test methods
- **Realistic Data** - Test fixtures use business-relevant sample data
- **Comprehensive Coverage** - Success, failure, and edge cases tested
- **Consistent Patterns** - Similar controllers use similar test structures

### GetRevenueAnalysis Tests
- ✅ Returns OK result with valid year
- ✅ Returns OK result with current year
- ✅ Throws exception with invalid year

### GetCapacityPlanningData Tests
- ✅ Returns OK result with capacity data
- ✅ Returns OK result with empty data when none available
- ✅ Throws exception when calculation fails

### Constructor Tests
- ✅ Validates null dependency injection
- ✅ Creates instance with valid dependencies

## Test Features

### Comprehensive Coverage
- **21 test methods** covering all controller actions
- **Happy path scenarios** - successful operations
- **Error scenarios** - exception handling
- **Edge cases** - null parameters, empty data
- **Constructor validation** - dependency injection

### Test Data Fixtures
- `AnalyticsControllerTestFixture` - xUnit class fixture containing centralized test data
- Consistent test data across all test methods
- Realistic sample data generation with proper relationships
- Reusable data properties for different test scenarios

### Mocking Strategy
- **IAnalyticsService** - Mocked for isolated controller testing  
- **Test Fixture Pattern** - Using `IClassFixture<T>` for shared test data
- **Verify()** calls ensure service methods are invoked correctly
- **Setup()** different return values for various scenarios

### Assertion Patterns
- **FluentAssertions** for readable assertions
- **Type checking** - Ensures correct return types
- **Value verification** - Validates returned data matches fixture expectations  
- **Service verification** - Confirms correct service method calls

## Running the Tests

```bash
# Run all tests
dotnet test

# Run with detailed output
dotnet test --verbosity normal

# Run specific test class
dotnet test --filter "ClassName=AnalyticsControllerTests"

# Run specific test method
dotnet test --filter "MethodName=GetDashboardData_ReturnsOkResult_WithDashboardData"
```

## Test Data Examples

### Dashboard Data
```csharp
{
    TotalActiveProjects = 15,
    TotalActiveEmployees = 50,
    TotalPendingDeliveries = 8,
    TotalRevenueThisMonth = 125000.50m,
    AverageResourceUtilization = 78.5m
}
```

### Resource Utilization
```csharp
{
    StartDate = DateTime,
    EndDate = DateTime,
    AverageUtilization = 85.2m,
    EmployeeUtilizations = [...]
}
```

### Revenue Analysis
```csharp
{
    Year = 2024,
    TotalRevenue = 2500000.75m,
    MonthlyRevenue = [...],
    QuarterlyGrowth = 12.5m
}
```

## Best Practices Demonstrated

1. **Arrange-Act-Assert Pattern** - Clear test structure
2. **Descriptive Test Names** - Method_Scenario_ExpectedResult format
3. **Single Responsibility** - Each test focuses on one scenario
4. **Mock Verification** - Ensures dependencies are used correctly
5. **Exception Testing** - Validates error handling
6. **Data Builder Pattern** - Centralized test data creation
7. **Null Parameter Testing** - Edge case coverage
8. **Type Safety** - Strong typing in assertions

## Integration with CI/CD

These tests are designed to run in:
- ✅ Local development environment
- ✅ CI/CD pipelines
- ✅ Build verification
- ✅ Code coverage analysis

## Extending the Tests

To add new tests:

1. Follow the existing naming convention
2. Use the `AnalyticsTestDataBuilder` for test data
3. Include both success and failure scenarios
4. Verify mock service calls
5. Use FluentAssertions for readable assertions

The test suite provides a solid foundation for maintaining code quality and catching regressions in the Analytics controller functionality.