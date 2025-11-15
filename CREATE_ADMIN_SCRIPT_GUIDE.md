# Create Admin Account - Setup Script

## Overview

Two scripts are provided to easily create a default admin account:

1. **create-admin.js** - Node.js script (cross-platform)
2. **setup-admin.bat** - Batch script (Windows only)

## Quick Setup (2 Minutes)

### On Windows - Using Batch Script

```bash
cd backend
scripts\setup-admin.bat
```

That's it! The script will:
- ✅ Install dependencies (if needed)
- ✅ Connect to MongoDB
- ✅ Create admin account
- ✅ Show you the login credentials

### On Mac/Linux - Using Node Script

```bash
cd backend
node scripts/create-admin.js
```

### Manual - Using Node Script (All Platforms)

```bash
cd backend
npm install
node scripts/create-admin.js
```

---

## Default Admin Credentials

**Email:** `admin@example.com`  
**Password:** `admin123`  
**Username:** `admin`  
**Role:** `admin`

⚠️ **IMPORTANT:** Change the password after first login!

---

## How to Change Default Credentials

Edit `backend/scripts/create-admin.js` before running:

```javascript
const ADMIN_CREDENTIALS = {
  username: 'admin',              // Change this
  email: 'admin@example.com',     // Change this
  password: 'admin123',           // Change this - make it strong!
  fullName: 'Admin User',         // Change this
  role: 'admin',
  isEmailVerified: true
}
```

Example with secure credentials:

```javascript
const ADMIN_CREDENTIALS = {
  username: 'superadmin',
  email: 'superadmin@company.com',
  password: 'MySecure@Password123!',
  fullName: 'Company Admin',
  role: 'admin',
  isEmailVerified: true
}
```

Then run the script.

---

## What Happens When You Run The Script

### If Admin Doesn't Exist:
```
✅ Connected to MongoDB
🔐 Creating admin user with credentials:
Username: admin
Email: admin@example.com
Password: [hidden]
Role: admin

✅ Admin user created successfully!

📝 Login Credentials:
──────────────────────────────────────
Email: admin@example.com
Password: admin123
──────────────────────────────────────

⚡ Next Steps:
1. Go to http://localhost:5173/login
2. Login with the credentials above
3. Navigate to http://localhost:5173/admin
```

### If Admin Already Exists:
```
⚠️  Admin user already exists!
Email: admin@example.com
Username: admin
Role: admin
```

(It won't create duplicate, prevents errors)

---

## Usage Steps

### 1️⃣ Run the Script
```bash
cd backend
node scripts/create-admin.js
# or on Windows: scripts\setup-admin.bat
```

### 2️⃣ Start Backend Server
```bash
npm start
```

### 3️⃣ Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

### 4️⃣ Login to Admin Panel
- Open: `http://localhost:5173/login`
- Email: `admin@example.com`
- Password: `admin123`
- Click Login

### 5️⃣ Access Admin Panel
- Open: `http://localhost:5173/admin`
- You should see Users Management and Activity Logs tabs

---

## Troubleshooting

### Error: "MongoDB connection failed"
**Solution:**
- Make sure MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB is accessible

### Error: "Cannot find module"
**Solution:**
```bash
cd backend
npm install
node scripts/create-admin.js
```

### Error: "User already exists"
**Solution:**
- The admin account is already created (safe to ignore)
- Just login with the credentials
- Or use MongoDB to update the password manually

### Admin account created but can't login
**Solution:**
- Restart backend server
- Clear browser cookies
- Try in incognito/private window
- Check MongoDB has the user document

---

## Modifying the Script

### Custom Field Values

Edit the `ADMIN_CREDENTIALS` object:

```javascript
const ADMIN_CREDENTIALS = {
  username: 'your-username',
  email: 'your-email@domain.com',
  password: 'YourSecurePassword123!',
  fullName: 'Your Full Name',
  role: 'admin',
  isEmailVerified: true  // Set to false if you want verification needed
}
```

### For Production

Update the password to something strong:

```javascript
password: 'Pr0duct10n!Secure@Admin#2024'
```

Add additional validation:

```javascript
// Add before running
if (process.env.NODE_ENV === 'production') {
  if (ADMIN_CREDENTIALS.password === 'admin123') {
    console.error('❌ Cannot use default password in production!')
    process.exit(1)
  }
}
```

---

## File Locations

```
backend/
├── scripts/
│   ├── create-admin.js      (Main script)
│   └── setup-admin.bat      (Windows batch file)
├── src/
│   ├── models/
│   │   └── user.model.js    (User schema - has role field)
│   └── ...
├── .env                      (Config with MONGO_URI)
├── package.json
└── ...
```

---

## What The Script Does

1. **Reads .env** - Gets MongoDB connection string
2. **Connects to MongoDB** - Establishes database connection
3. **Checks if Admin Exists** - Prevents duplicate accounts
4. **Creates Admin User** - Inserts user with `role: "admin"`
5. **Hashes Password** - Uses bcrypt (automatic via model hook)
6. **Shows Credentials** - Displays login info
7. **Closes Connection** - Safely disconnects from MongoDB

---

## Security Best Practices

✅ **DO:**
- Change default password immediately after setup
- Use strong, unique passwords in production
- Store credentials securely
- Rotate admin password periodically
- Use environment variables for sensitive data

❌ **DON'T:**
- Use default credentials in production
- Share admin credentials
- Commit passwords to Git
- Use simple passwords like "123456"
- Run this script on public servers without changing password

---

## For Development Team

### First Time Setup
```bash
# 1. Clone repo
git clone <repo-url>
cd Project-Management-API

# 2. Setup backend
cd backend
npm install

# 3. Create .env with MONGO_URI
echo MONGO_URI=mongodb://localhost:27017/ProjectManagementAPI > .env

# 4. Create admin
node scripts/create-admin.js

# 5. Start backend
npm start

# 6. Setup frontend
cd ../frontend
npm install
npm run dev
```

### Team Member Onboarding
```bash
# They get admin account with team email
cd backend

# Edit scripts/create-admin.js - change email to team member's email
# Then run:
node scripts/create-admin.js

# Share the generated credentials via secure channel
```

---

## Need Help?

Check these files for more details:
- `backend/src/models/user.model.js` - User schema with role field
- `frontend/src/router/ProtectedRoutes.jsx` - AdminRoute protection
- `ADMIN_QUICK_SETUP.md` - Quick manual setup
- `ADMIN_PANEL_GUIDE.md` - Complete admin panel guide

---

**Last Updated:** November 15, 2025  
**Status:** ✅ Ready to use
