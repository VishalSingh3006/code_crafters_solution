# React App: MUI + Tailwind + Router + Redux + RHF + Axios

## Prerequisites

- Node.js 20.19+ or 22.12+ (Vite requires this). On macOS, install with Homebrew or nvm.

### Upgrade Node (recommended)

```
brew update
brew install node@22
brew link --overwrite node@22
# or using nvm
# brew install nvm && mkdir -p ~/.nvm && echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc && source ~/.zshrc
# nvm install 22 && nvm use 22 && nvm alias default 22
```

## Install

```
npm install
```

## Run (dev)

```
npm run dev
```

### RBAC (Roles & Permissions)

- Roles are read from the JWT claim `roles` (array of strings).
- Defined roles and permissions live in [src/types/rbac.ts](src/types/rbac.ts).
- Permission checks are exposed via hooks in [src/hooks/useRbac.ts](src/hooks/useRbac.ts): `usePermission`, `useAnyPermission`, `useAllPermissions`.
- Admin role (`"admin"`) has full permissions by default.
- The route `/2fa/manage` is protected and requires the `MANAGE_2FA` permission via [src/routes/RequirePermission.tsx](src/routes/RequirePermission.tsx).

To test admin access in dev, ensure your JWT includes:

```json
{
  "sub": "123",
  "email": "admin@example.com",
  "exp": 9999999999,
  "roles": ["admin"]
}
```

To customize, extend `Role` and `Permission` unions and update `ROLE_PERMISSIONS` in [src/types/rbac.ts](src/types/rbac.ts).

## Build

```
npm run build
```

## Notes

- Styling: Tailwind preflight disabled; MUI CssBaseline provides resets.
- Auth: In-memory access token via `tokenStore`; replace `/auth/*` endpoints with your backend.
- Errors: Normalized `ApiError` shapes from Axios for consistent UI handling.
