# SETUP_GUIDE.md - React Authentication App with 2FA

## 📋 Project Overview

This is a complete React application with a professional login UI and Two-Factor Authentication (2FA) support. It's designed to work seamlessly with your NestJS API.

## 🚀 Quick Start

### Step 1: Complete Installation
```bash
npm install --legacy-peer-deps
```

### Step 2: Start the Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 3: Configure API Connection
Ensure `.env` has:
```env
REACT_APP_API_URL=http://localhost:3000
```

## 🎨 Features

✅ User Registration & Login
✅ Two-Factor Authentication (TOTP)
✅ Beautiful responsive UI with Tailwind CSS
✅ JWT-based authentication
✅ Protected routes
✅ Dashboard for account management

## 📁 Project Structure

- `src/api.ts` - API client with axios
- `src/context/AuthContext.tsx` - Authentication state
- `src/components/` - React components
- `src/pages/` - Page components

## 🔐 Security Features

✅ JWT Token authentication
✅ TOTP (Time-based One-Time Password) for 2FA
✅ Secure password handling
✅ Protected routes
✅ Automatic token in API requests

## 🔄 Authentication Flows

### Standard Login
User → Password verification → JWT token → Dashboard

### Login with 2FA
User → Password verification → Temporary token → TOTP verification → JWT token → Dashboard

## 🧪 Testing

1. Register a new account at `/register`
2. Login at `/login`
3. Enable 2FA in dashboard
4. Scan QR code with authenticator app
5. Verify with 6-digit code

## 🛠️ Key Files

| File | Purpose |
|------|---------|
| `src/api.ts` | Axios instance & API methods |
| `src/App.tsx` | Router & route setup |
| `src/context/AuthContext.tsx` | Authentication state |
| `src/components/LoginForm.tsx` | Login form |
| `src/pages/DashboardPage.tsx` | Main dashboard |

## 🚀 Running the App

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# Build for production
npm run build
```

## 📞 Common Issues

**"Cannot reach API"**
- Ensure backend is running on http://localhost:3000
- Check REACT_APP_API_URL in .env

**"TOTP not working"**
- Ensure device time is correct
- Codes valid for 30 seconds only
- Check 2FA is actually enabled

**npm install fails**
- Use flag: `npm install --legacy-peer-deps`
- Clear cache: `npm cache clean --force`

## 📱 Authenticator Apps

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password

---

**Ready to use!** Open http://localhost:3000 after running `npm start`
