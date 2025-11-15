# Admin Panel Access Guide

## How Admin Panel Works

The admin panel at `http://localhost:5173/admin` is protected by role-based access control. Only users with the `admin` role can access it.

### Current Admin Access Flow

1. **Login** → User authentication
2. **Check Role** → Frontend verifies user's role is `"admin"`
3. **Access Granted** → Shows Admin Panel with:
   - Users Management tab
   - Activity Logs tab
4. **Access Denied** → Redirects to Dashboard if user role is not `"admin"`

## How to Create an Admin User

### Option 1: Make Your Current User an Admin (Recommended)

Use MongoDB directly to update your user role:

```bash
# Connect to MongoDB (using MongoDB Compass or command line)
# Database: ProjectManagementAPI
# Collection: users

# Find your user document and update the role field:
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Or using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to your MongoDB instance
3. Select `ProjectManagementAPI` database
4. Open `users` collection
5. Find your user document
6. Edit the document and change `role` from `"user"` to `"admin"`
7. Save the changes

### Option 2: Register New User and Make Them Admin

1. Create a new account at `http://localhost:5173/register`
2. Use MongoDB to update that user's role to `"admin"` (follow Option 1)

### Option 3: Backend API (via Terminal)

```bash
# Get MongoDB connection string and update user role
# If you're using a script or have direct DB access

# Using Node.js (create a script in backend folder)
# Save as: backend/scripts/make-admin.js

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../src/models/user.model.js'

dotenv.config()

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    )
    console.log('User updated:', user)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

makeAdmin(process.argv[2])
```

Then run:
```bash
node backend/scripts/make-admin.js your-email@example.com
```

## Verification Steps

After making a user an admin:

1. **Clear Browser Cache:**
   - Clear all cookies/storage for `localhost:5173`
   - Or open in private/incognito window

2. **Log Out and Log Back In:**
   - Click profile icon → Logout
   - Login again with admin credentials

3. **Navigate to Admin Panel:**
   - Go to `http://localhost:5173/admin`
   - Should see Admin Panel with tabs for:
     - Users Management
     - Activity Logs

4. **Verify Admin Access:**
   - Should see list of all users
   - Should see all activity logs
   - If redirected to dashboard → role update didn't work

## Admin Panel Features

### Users Management Tab
- Search users by username/email
- View all registered users
- See user roles
- Check email verification status
- Future: Edit, delete, or change user roles

### Activity Logs Tab
- View all system activities
- Track user actions
- See resource changes
- Filter by date/resource type
- Monitor project and task modifications

## Troubleshooting

### "Access Denied" - Redirects to Dashboard

**Cause:** Your user role is not `"admin"`

**Solution:**
1. Check MongoDB that your user document has `role: "admin"`
2. Log out and log back in
3. Clear browser cache/cookies
4. Try in incognito/private window

### Can't Find Admin User in MongoDB

**Check MongoDB Connection:**
```bash
# Verify MongoDB is running
# Windows: Check Task Manager for mongod.exe
# Or start MongoDB: mongod.exe

# Verify database and collection exist
# Use MongoDB Compass or mongo shell
```

### Admin Panel Shows but Data is Empty

**Check Backend:**
1. Make sure backend server is running: `npm start` in backend folder
2. Check if user has proper auth token (should auto-refresh)
3. Verify API endpoints are working (getUsers, getActivities)

## Backend User Role Constants

```javascript
// From: backend/src/models/user.model.js

role: {
  type: String,
  enum: ["user", "admin"],  // Only these two roles allowed
  default: "user"
}
```

## API Endpoints (Admin Only)

Once you're an admin, the frontend calls these endpoints:

### Get All Users
```
GET /api/users
Headers: Authorization: Bearer {token}
```

### Get Activity Logs
```
GET /api/activity-logs
Headers: Authorization: Bearer {token}
```

These endpoints likely have middleware checking user role = "admin".

## Security Notes

⚠️ **Important:**
- Only make trusted users admins
- Admin panel has full visibility into all users and activities
- In production, implement proper admin onboarding process
- Consider adding audit logs for admin actions
- Use environment variables for sensitive operations

## Next Steps

1. ✅ Make yourself an admin (using MongoDB)
2. ✅ Log out and log back in
3. ✅ Navigate to `/admin`
4. ✅ Explore Users and Activity Logs

---

**Need Help?**
- Check backend logs for API errors
- Verify token is valid (should refresh automatically)
- Ensure MongoDB is running and accessible
- Confirm user document has correct role value
