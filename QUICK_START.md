# Quick Start Reference

## Installation & Running

```bash
# 1. Navigate to project
cd c:\Users\ShaikhSaifuddin\Downloads\nest-client

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm start

# App opens at http://localhost:3000
```

## Project Structure Quick Reference

```
nest-client/
├── public/index.html              ← Main HTML file
├── src/
│   ├── api.ts                     ← API calls
│   ├── App.tsx                    ← Routes
│   ├── index.tsx                  ← Entry point
│   ├── index.css                  ← Tailwind styles
│   ├── context/
│   │   └── AuthContext.tsx        ← State management
│   ├── components/                ← Reusable components
│   │   ├── AuthLayout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── TOTPSetup.tsx
│   │   ├── TOTPVerification.tsx
│   │   └── ProtectedRoute.tsx
│   └── pages/                     ← Page components
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── DashboardPage.tsx
│       └── VerifyTOTPPage.tsx
├── .env                           ← API URL config
├── package.json                   ← Dependencies
└── tailwind.config.js             ← Tailwind config
```

## Routes

| Path | Purpose | Protected |
|------|---------|-----------|
| `/login` | User login | ❌ |
| `/register` | New registration | ❌ |
| `/verify-totp` | 2FA verification | ⚠️ Semi |
| `/dashboard` | Main dashboard | ✅ |
| `/` | Redirects to dashboard | - |

## Key Endpoints Called

```
POST   /auth/register          - Create account
POST   /auth/login             - Login
POST   /auth/totp/setup        - Start 2FA setup
POST   /auth/totp/verify-setup - Verify 2FA setup
POST   /auth/totp/verify-login - Verify TOTP code
GET    /auth/totp/status       - Check 2FA status
POST   /auth/totp/disable      - Disable 2FA
```

## Component Relationships

```
App
 ├─ AuthProvider (state)
 └─ Routes
     ├─ LoginPage (LoginForm + AuthLayout)
     ├─ RegisterPage (RegisterForm + AuthLayout)
     ├─ VerifyTOTPPage (TOTPVerification + AuthLayout)
     └─ /dashboard (ProtectedRoute + DashboardPage)
        └─ DashboardPage (TOTPSetup or status)
```

## Authentication State (useAuth)

```tsx
const { user, token, isLoggedIn, setUser, setToken, logout } = useAuth();

// user: { id, email, totpEnabled }
// token: JWT access token
// isLoggedIn: boolean
```

## Common Customizations

### Change API URL
Edit `.env`:
```env
REACT_APP_API_URL=http://your-api-url:3000
```

### Change Primary Color
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#your-color', // main button color
    700: '#your-color', // hover color
  }
}
```

### Change Page Title
Edit `public/index.html`:
```html
<title>Your App Name</title>
```

## Testing Checklist

- [ ] Register new account
- [ ] Login with email & password
- [ ] Dashboard loads correctly
- [ ] Can see 2FA status
- [ ] Can enable 2FA (scan QR code)
- [ ] Verify TOTP with authenticator app
- [ ] Logout works
- [ ] Login with 2FA enabled requires code
- [ ] Can disable 2FA
- [ ] Protected routes redirect when not logged in

## Troubleshooting

**Port 3000 already in use?**
```bash
# Either:
# 1. Stop other app using port 3000
# 2. Or run on different port:
PORT=3001 npm start
```

**API not connecting?**
```bash
# Check:
1. Is NestJS backend running?
2. Is it on http://localhost:3000?
3. Check .env REACT_APP_API_URL
4. Check browser console (F12) for errors
```

**npm install fails?**
```bash
# Try:
npm install --legacy-peer-deps

# If still fails:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**TOTP code invalid?**
```
1. Check system time is correct
2. Code valid for 30 seconds only
3. Authenticator app has latest secret
4. Device clocks synchronized
```

## Code Examples

### Using Auth Context
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isLoggedIn, logout } = useAuth();
  
  if (!isLoggedIn) return <div>Not logged in</div>;
  
  return <div>Welcome {user?.email}</div>;
}
```

### Making API Calls
```tsx
import { authAPI } from '../api';

// Login
const response = await authAPI.login('user@example.com', 'password');
const token = response.data.access_token;

// Setup 2FA
const setup = await authAPI.setupTOTP();
const qrCode = setup.data.qrCode;
```

### Protected Route
```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```
## Package Versions

- react: ^18.2.0
- react-router-dom: ^6.20.0
- axios: ^1.6.2
- tailwindcss: ^3.4.1
- typescript: ^4.9.5
- react-scripts: 5.0.1

## Build for Production

```bash
npm run build
```

Output: `build/` folder (static files ready to deploy)

Deploy to:
- Vercel
- Netlify
- AWS S3
- Any static hosting

## Documentation Files

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Setup instructions
- `COMPONENTS.md` - Component details
- `QUICK_START.md` - This file

## Environment Setup

Default `.env`:
```env
REACT_APP_API_URL=http://localhost:3000
```

For production `.env.production`:
```env
REACT_APP_API_URL=https://your-api-domain.com
```

## VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (or Postman) for API testing
- Prettier (code formatter)
- ESLint (linter)

## Performance Tips

1. Components lazy load automatically
2. Use ProtectedRoute for security
3. Token auto-attached to API calls
4. Context reduces prop drilling
5. Tailwind CSS purges unused styles in build

## Security Notes

✅ Tokens stored in localStorage (consider httpOnly in production)
✅ TOTP verified server-side
✅ Protected routes with authentication checks
✅ Automatic API token injection
✅ Session management with context

## Support & Help

1. Check browser console (F12)
2. Review network tab for API calls
3. Check .env configuration
4. Ensure backend is running
5. Review SETUP_GUIDE.md and COMPONENTS.md

---

**Last Updated**: December 28, 2025
**Status**: Ready to use ✅
