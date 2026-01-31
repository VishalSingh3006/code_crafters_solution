
# Resource & Engagement Tracking System (.NET 8)

ASP.NET Core Web API microservice designed for React applications.

## Features
- Clean / Layered Architecture
- ASP.NET Core Identity
- MySQL with Entity Framework Core (Code First)
- JWT Authentication
- Login / Logout / Registration APIs
- Two-Factor Authentication (TOTP – Microsoft Authenticator compatible)
- Ready for React frontend consumption

## Layers
- API (Controllers)
- Application (DTOs, Interfaces)
- Infrastructure (EF Core, Identity, Repositories)
- Domain (Entities)

## Run
1. Update MySQL connection string in `appsettings.json`
2. Run:
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
