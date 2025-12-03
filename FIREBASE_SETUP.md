# Firebase Setup Instructions

## Required: Set up Firebase Authentication

Your calculator now supports **Email/Password** and **Google Sign-In** authentication with email verification.

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enter project name (e.g., "calculator1")
4. Follow the setup wizard

### Step 2: Enable Authentication Methods

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started" if not already enabled
3. Go to "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Select a support email
   - Click "Save"

### Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon (Settings) → "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register app with nickname (e.g., "Calculator Web")
5. Copy the `firebaseConfig` object

### Step 4: Update pricing-calculator.html

1. Open `pricing-calculator.html`
2. Find this section (around line 457):
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
3. Replace with your actual Firebase config values

### Step 5: Add Authorized Domain (for GitHub Pages)

1. In Firebase Console → Authentication → Settings → Authorized domains
2. Click "Add domain"
3. Add: `joshemrn.github.io`
4. Click "Add"

### Step 6: Configure Email Action Handler (Important!)

This ensures users are redirected back to your website after email verification.

1. In Firebase Console → Authentication → Templates
2. Click on "Email address verification"
3. In the "Action URL" field, you should see the default Firebase URL
4. The code is already configured to redirect users back to your page automatically
5. Make sure your domain (`joshemrn.github.io`) is in the Authorized domains list

**Note:** When users click the verification link in their email, they will:
- Be redirected to Firebase's verification page
- See a confirmation message
- Be automatically redirected back to your website
- Be able to sign in with their verified account

### Step 7: Test

1. Commit and push changes to GitHub
2. Visit https://joshemrn.github.io/calculator1/pricing-calculator.html
3. Try creating an account with email/password
4. Check your email for verification link
5. Click verification link
6. Sign in with verified email

## Features

✅ **Email/Password Sign-In** - Users can create accounts with email and password
✅ **Email Verification Required** - Users must verify their email before accessing calculator
✅ **Google Sign-In** - Alternative sign-in method with Google account
✅ **Secure Authentication** - Managed by Firebase (no passwords stored locally)
✅ **Password Reset** - Firebase handles password reset emails
✅ **Data Sync** - User calculations synced across devices

## Important Notes

- Email verification is **required** for all users
- Unverified users cannot access the calculator
- Minimum password length: 6 characters
- Firebase is free up to 10,000 email sign-ins per day
