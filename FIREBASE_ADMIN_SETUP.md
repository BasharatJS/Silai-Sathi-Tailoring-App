# Firebase Admin Authentication Setup

## Step 1: Enable Firebase Authentication

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **tailoring-app-25d94**
3. Click on **Authentication** in the left sidebar
4. Click on **Get Started** button
5. Go to **Sign-in method** tab
6. Click on **Email/Password**
7. **Enable** the Email/Password provider
8. Click **Save**

## Step 2: Create Admin User

### Option A: Using Firebase Console (Recommended)

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user** button
3. Enter admin email: `admin@silaisathi.com` (or your preferred email)
4. Enter a strong password
5. Click **Add user**

### Option B: Using Firebase CLI

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create admin user (run this in terminal)
firebase auth:import admin-users.json --project tailoring-app-25d94
```

Create `admin-users.json`:
```json
{
  "users": [
    {
      "email": "admin@silaisathi.com",
      "emailVerified": true,
      "password": "your-secure-password-here",
      "displayName": "Admin",
      "disabled": false
    }
  ]
}
```

## Step 3: Login to Admin Dashboard

1. Go to: http://localhost:3000/admin/login
2. Enter the admin email and password you created
3. Click **Sign In**
4. You'll be redirected to the admin dashboard

## Security Notes

- ✅ Demo credentials have been removed
- ✅ Now using Firebase Authentication
- ✅ Authentication state persists on page refresh
- ✅ Only Firebase authenticated users can access admin panel
- 🔒 Make sure to use a strong password for production
- 🔒 Consider enabling 2FA in Firebase Console for added security

## Testing

1. **Login**: Try logging in with correct credentials
2. **Persistence**: Refresh the page - should stay logged in
3. **Logout**: Click logout button - should redirect to login page
4. **Invalid Login**: Try with wrong credentials - should show error

## Troubleshooting

### "Missing or insufficient permissions" error
- Make sure Firebase Authentication is enabled
- Check that the user exists in Firebase Console > Authentication > Users

### Page keeps redirecting to login
- Clear browser localStorage
- Check browser console for errors
- Verify Firebase config in `.env.local`

### Can't create admin user
- Make sure Email/Password auth is enabled in Firebase Console
- Check Firebase project permissions
