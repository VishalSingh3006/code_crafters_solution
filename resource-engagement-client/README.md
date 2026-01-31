# Resource & Engagement Tracking Client - React Application

This is a React TypeScript application that consumes the Resource & Engagement Tracking System APIs, providing a complete authentication and profile management interface.

## Features

✅ **User Registration** - Complete signup with profile information
✅ **User Login** - JWT-based authentication with 2FA support  
✅ **Two-Factor Authentication** - QR code setup and verification
✅ **Profile Management** - View and update user profile
✅ **Protected Routes** - Route-based authentication
✅ **Responsive Design** - Mobile-friendly interface

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Resource & Engagement Tracking System API running on http://localhost:5000

## Installation

1. Navigate to the auth-client directory:
```bash
cd auth-client
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Make sure your AuthMicroservice API is running on http://localhost:5000

2. Start the React development server:
```bash
npm start
```

3. Open your browser and navigate to http://localhost:3000

## Application Structure

```
src/
├── components/          # React components
│   ├── Login.tsx        # Login form with 2FA support
│   ├── Register.tsx     # User registration form
│   ├── Dashboard.tsx    # User dashboard
│   ├── Profile.tsx      # Profile management
│   ├── TwoFactorSetup.tsx # 2FA setup with QR code
│   └── ProtectedRoute.tsx # Route protection
├── context/             # React Context
│   └── AuthContext.tsx  # Authentication state management
├── services/            # API services
│   └── api.ts          # API client and methods
├── types/              # TypeScript type definitions
│   └── index.ts        # All interface definitions
├── App.tsx             # Main application component
├── App.css             # Application styles
└── index.tsx           # Application entry point
```

## API Integration

The application integrates with the following AuthMicroservice endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/2fa/setup` - Get 2FA setup data
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code
- `GET /api/auth/2fa/status` - Get 2FA status

## Usage Flow

### 1. Registration
1. Navigate to `/register`
2. Fill out the registration form with all required information
3. Submit to create a new account
4. Redirect to login page

### 2. Login
1. Navigate to `/login` 
2. Enter email and password
3. If 2FA is enabled, enter verification code
4. Successfully authenticated users are redirected to dashboard

### 3. Dashboard
- View profile information
- Access to edit profile
- Setup 2FA if not already enabled
- Logout functionality

### 4. Profile Management
1. Navigate to `/profile`
2. Update profile information
3. Save changes

### 5. Two-Factor Authentication Setup
1. Navigate to `/2fa-setup`
2. Scan QR code with authenticator app
3. Enter verification code to enable 2FA
4. 2FA is now required for future logins

## Environment Configuration

The application uses a proxy configuration to forward API calls to the backend:

```json
"proxy": "http://localhost:5000"
```

If you need to change the API URL, update the `API_BASE_URL` in `src/services/api.ts`.

## Authentication Flow

1. **JWT Token Storage** - Tokens are stored in localStorage
2. **Automatic Headers** - Authorization headers added automatically
3. **Token Expiration** - Automatic logout on 401 responses  
4. **Protected Routes** - Redirect to login for unauthorized access
5. **2FA Support** - Complete two-factor authentication flow

## Styling

The application uses custom CSS with:
- Responsive design for mobile and desktop
- Clean, modern interface
- Form validation styling
- Loading states and error handling
- Accessible color scheme

## Build for Production

```bash
npm run build
```

This creates a `build/` directory with production-ready files.

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests  
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## Security Features

- JWT token-based authentication
- Automatic token cleanup on logout
- Protected route components
- CSRF protection through proper headers
- Input validation and sanitization
- Secure 2FA implementation with QR codes

## Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## Troubleshooting

**CORS Issues**: Make sure the AuthMicroservice API has CORS properly configured for http://localhost:3000

**API Connection**: Verify the AuthMicroservice is running on http://localhost:5000

**2FA Issues**: Ensure your authenticator app time is synchronized

**Build Issues**: Clear node_modules and package-lock.json, then reinstall dependencies