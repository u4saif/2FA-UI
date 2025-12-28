# Component Documentation

## Components Overview

### AuthLayout
**Location**: `src/components/AuthLayout.tsx`

Base layout component for all authentication pages.

**Props**:
- `children`: React node
- `title`: Page title (string)
- `subtitle`: Optional subtitle (string)

**Features**:
- Centered card design
- Gradient background
- Lock icon header
- Professional styling

**Usage**:
```tsx
<AuthLayout title="Sign In" subtitle="Welcome back">
  <LoginForm />
</AuthLayout>
```

---

### LoginForm
**Location**: `src/components/LoginForm.tsx`

Handles user login with email and password.

**Features**:
- Email validation
- Password input
- Error handling
- Loading states
- Link to registration
- Automatic 2FA detection

**Flow**:
1. User enters credentials
2. Submits to backend
3. If 2FA enabled → redirect to /verify-totp
4. If 2FA disabled → redirect to /dashboard

---

### RegisterForm
**Location**: `src/components/RegisterForm.tsx`

Handles new user registration.

**Features**:
- Email input
- Password input
- Password confirmation
- Validation (min 6 chars)
- Error handling
- Loading states
- Link to login

**Validation**:
- Password must match confirmation
- Password min 6 characters
- Email required

---

### TOTPVerification
**Location**: `src/components/TOTPVerification.tsx`

TOTP code input for 2FA verification.

**Props**:
- `onSuccess`: Callback function
- `email`: User email (required for login)
- `isSetup`: Boolean (true during setup, false during login)

**Features**:
- 6-digit code input only
- Auto-formatting
- Error handling
- Loading states

**Usage During Login**:
```tsx
<TOTPVerification
  email="user@example.com"
  onSuccess={(token) => {
    setToken(token);
    navigate('/dashboard');
  }}
  isSetup={false}
/>
```

---

### TOTPSetup
**Location**: `src/components/TOTPSetup.tsx`

Complete TOTP setup flow with QR code.

**Props**:
- `onSuccess`: Callback after verification
- `onCancel`: Callback if user skips

**Features**:
- QR code display
- Manual entry key (with copy button)
- 6-digit code input
- Verification
- Skip option

**Flow**:
1. Backend generates secret
2. Display QR code
3. User scans with authenticator
4. User enters 6-digit code
5. Backend verifies
6. 2FA enabled

---

### ProtectedRoute
**Location**: `src/components/ProtectedRoute.tsx`

Route wrapper for authentication protection.

**Props**:
- `children`: Components to protect

**Features**:
- Checks authentication status
- Redirects to /login if not authenticated
- Guards /dashboard route

**Usage**:
```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

---

## Pages Overview

### LoginPage
**Location**: `src/pages/LoginPage.tsx`

Login page with AuthLayout and LoginForm.

**Route**: `/login`

**Features**:
- Professional styling
- Form validation
- Error display
- Loading states

---

### RegisterPage
**Location**: `src/pages/RegisterPage.tsx`

Registration page with AuthLayout and RegisterForm.

**Route**: `/register`

**Features**:
- Password confirmation
- Validation
- Error handling
- Success redirect to login

---

### DashboardPage
**Location**: `src/pages/DashboardPage.tsx`

Main dashboard with account & security info.

**Route**: `/dashboard` (Protected)

**Features**:
- Account information display
- TOTP status check
- Enable/disable 2FA
- Logout functionality

**Sections**:
1. Header with user email & logout button
2. Account Information Card
3. Security Card (2FA management)
4. Welcome section

---

### VerifyTOTPPage
**Location**: `src/pages/VerifyTOTPPage.tsx`

TOTP verification during login.

**Route**: `/verify-totp` (Semi-protected)

**Features**:
- 6-digit code input
- Session validation
- Error handling
- Redirect to login on session timeout

---

## Context & State

### AuthContext
**Location**: `src/context/AuthContext.tsx`

Global authentication state management.

**State**:
- `user`: Current user data
- `token`: JWT access token
- `isLoggedIn`: Boolean flag

**Methods**:
- `setUser()`: Update user data
- `setToken()`: Update & store token
- `logout()`: Clear auth state

**Usage**:
```tsx
const { user, token, isLoggedIn, logout } = useAuth();
```

---

## API Client

**Location**: `src/api.ts`

Axios instance with auto-token injection.

**Features**:
- Base URL configuration
- Request interceptor for JWT
- Centralized API methods

**Methods**:
- `authAPI.register()`
- `authAPI.login()`
- `authAPI.setupTOTP()`
- `authAPI.verifyTOTPSetup()`
- `authAPI.verifyTOTPLogin()`
- `authAPI.getTOTPStatus()`
- `authAPI.disableTOTP()`

---

## Component Dependency Tree

```
App.tsx
├── AuthProvider (context)
└── Routes
    ├── /login → LoginPage
    │   └── LoginForm
    │       └── AuthLayout
    ├── /register → RegisterPage
    │   └── RegisterForm
    │       └── AuthLayout
    ├── /verify-totp → VerifyTOTPPage
    │   └── TOTPVerification
    │       └── AuthLayout
    └── /dashboard → ProtectedRoute
        └── DashboardPage
            ├── TOTPSetup (optional)
            └── TOTPVerification (optional)
```

---

## Styling

All components use **Tailwind CSS** with a custom primary color scheme.

**Primary Colors** (customizable in `tailwind.config.js`):
- primary-600: #0284c7 (main)
- primary-700: #0369a1 (hover)

**Responsive Breakpoints**:
- Mobile: default
- Tablet: md (768px)
- Desktop: lg (1024px)

---

## Form Validation

### LoginForm
- Email: required, valid email format
- Password: required

### RegisterForm
- Email: required, valid email format
- Password: required, min 6 characters
- Confirm: must match password

### TOTPVerification
- Code: required, exactly 6 digits, numeric only

---

## Error Handling

All forms include:
- Try-catch error handling
- API error display
- User-friendly error messages
- Loading state management
- Disabled state during submission

---

## Storage

**localStorage**:
- `accessToken`: JWT token
- `user`: User object
- `tempToken`: Temporary token during 2FA
- `pendingEmail`: Email during TOTP verification

---

## Next Steps

1. ✅ Install dependencies: `npm install --legacy-peer-deps`
2. ✅ Start server: `npm start`
3. ✅ Test registration
4. ✅ Test login
5. ✅ Enable 2FA
6. ✅ Logout & login with 2FA

For more info, see README.md and SETUP_GUIDE.md
