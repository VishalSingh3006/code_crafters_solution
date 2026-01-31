# Copilot Instructions for Resource & Engagement Tracking System

## Overview
This monorepo contains:
- **Backend**: ASP.NET Core Web API (Clean Architecture)
- **Frontend**: React (Vite, MUI, Tailwind, Redux, RHF, Axios)

## Architecture
- **Backend**
  - Follows Clean/Layered Architecture: API (Controllers), Application (DTOs, Interfaces), Infrastructure (EF Core, Identity, Repositories), Domain (Entities)
  - Uses ASP.NET Core Identity, JWT Auth, MySQL (EF Core, Code First)
  - Controllers are in `src/API/ResourceEngagementTrackingSystem.Api/Controllers/`
  - DTOs and interfaces in `src/Application/ResourceEngagementTrackingSystem.Application/`
  - Data models/entities in `src/Infrastructure/ResourceEngagementTrackingSystem.Infrastructure/Models/`
- **Frontend**
  - Located in `resource-engagement-client/`
  - Uses React, MUI, Tailwind, Redux, React Hook Form, Axios
  - RBAC logic: see `src/types/rbac.ts` and `src/hooks/useRbac.ts`
  - Custom theme/colors: see `src/styles/colors.ts` and `src/styles/globals.scss`

## Developer Workflows
- **Backend**
  - Update MySQL connection in `appsettings.json`
  - Build: `dotnet build`
  - Migrate DB: `dotnet ef database update`
  - Run: `dotnet run --project src/API/ResourceEngagementTrackingSystem.Api/ResourceEngagementTrackingSystem.Api.csproj`
- **Frontend**
  - Install: `npm install` in `resource-engagement-client/`
  - Dev: `npm run dev`
  - Build: `npm run build`

## Project Conventions
- **Backend**
  - Use DTOs for all API input/output (no direct entity exposure)
  - Controllers are thin; business logic in Application layer
  - Use dependency injection for services
  - Two-Factor Auth via TOTP (see Auth endpoints)
- **Frontend**
  - Role/permission checks via hooks (`usePermission`, etc.)
  - JWT tokens stored in-memory (`tokenStore`)
  - Tailwind preflight is disabled; MUI CssBaseline used for resets
  - Extend roles/permissions in `src/types/rbac.ts`

## Integration Points
- **Auth**: JWT-based, endpoints in `/auth/*` (see backend controllers)
- **RBAC**: Claims-based, roles in JWT, permissions in TS unions
- **API consumption**: Use Axios, endpoints prefixed with `/api/`

## Examples
- Add a new API: create a controller in `Controllers/`, add DTOs in Application, update DI in Infrastructure
- Add a new role/permission: update `src/types/rbac.ts`, extend hooks if needed

## References
- Backend: `README.md` at repo root
- Frontend: `resource-engagement-client/README.md`, `src/types/rbac.ts`, `src/hooks/useRbac.ts`, `src/styles/colors.ts`

---
For more, see the respective README files and code comments. Keep to these conventions for consistency.
