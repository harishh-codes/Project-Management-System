# Quick Admin Setup - Step by Step

## 📋 Summary

The Admin Panel is locked to users with `admin` role. Regular users will be redirected to the dashboard.

## 🚀 Quick Setup (5 minutes)

### Step 1: Open MongoDB
Use MongoDB Compass or your MongoDB connection tool

### Step 2: Navigate to Database
- Database: `ProjectManagementAPI` (or your DB name)
- Collection: `users`

### Step 3: Find Your User
Click on your user document (the one you logged in with)

### Step 4: Update Role
Change this field:
```json
{
  "role": "user"
}
```

To:
```json
{
  "role": "admin"
}
```

Save the document.

### Step 5: Logout & Login Again
- Go to `http://localhost:5173`
- Click profile icon → Logout
- Login with your credentials
- Navigate to `http://localhost:5173/admin`

✅ **Done!** You should now see the Admin Panel

---

## 🔍 What You'll See in Admin Panel

### Users Management Tab
- List of all registered users
- Search functionality
- User email, username, role
- Email verification status
- Pagination

### Activity Logs Tab
- Track all system activities
- User actions on projects/tasks
- Created/Updated/Deleted resources
- Timestamps and resource types
- Searchable and paginated

---

## ❌ Troubleshooting

**Problem:** Still redirected to Dashboard after login

**Solutions:**
1. ✅ Clear browser cookies (Ctrl+Shift+Delete)
2. ✅ Logout and login again
3. ✅ Try incognito/private window
4. ✅ Check MongoDB that role is set to "admin" (not "user")

---

## 📱 URLs

- **Admin Panel:** `http://localhost:5173/admin`
- **Dashboard:** `http://localhost:5173/dashboard`
- **Profile:** `http://localhost:5173/profile`

---

**Note:** Only users with role = "admin" can access the admin panel. This is enforced both in frontend and backend.
