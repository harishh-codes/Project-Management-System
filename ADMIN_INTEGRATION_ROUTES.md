# Admin Panel - API Routes & Integration Guide

## 📋 Backend Routes Summary

### 1. User Management Routes
**File:** `backend/src/routes/user.router.js`

```
GET /api/users
├─ Purpose: Get all users (admin only)
├─ Authentication: Required (JWT)
├─ Authorization: Admin role only
├─ Query Params: page, limit, search
├─ Response Format:
│  {
│    statusCode: 200,
│    data: {
│      users: [...],
│      pagination: {
│        total: number,
│        page: number,
│        limit: number,
│        totalPages: number
│      }
│    }
│  }
└─ Status: ✅ Working
```

**User Fields Returned:**
```javascript
{
  _id: String,
  username: String,
  email: String,
  fullName: String,
  role: "user" | "admin",
  isEmailVerified: Boolean,
  avatar: { url, localPath },
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2. Activity Logs Routes
**File:** `backend/src/routes/activityLog.router.js`

```
GET /api/activity-logs
├─ Purpose: Get all activity logs (admin only)
├─ Authentication: Required (JWT)
├─ Authorization: Admin role only
├─ Query Params: page, limit, resourceType, userId
├─ Response Format:
│  {
│    statusCode: 200,
│    data: {
│      logs: [...],  // ← Note: "logs" not "activities"
│      pagination: {
│        total: number,
│        page: number,
│        limit: number,
│        totalPages: number
│      }
│    }
│  }
└─ Status: ✅ Fixed
```

**Activity Log Fields:**
```javascript
{
  _id: String,
  action: "CREATE" | "UPDATE" | "DELETE",
  description: String,
  resourceType: "PROJECT" | "TASK" | "USER",
  resourceId: String,
  userId: {
    _id: String,
    username: String,
    email: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Frontend Implementation

### Admin Page Structure

**File:** `frontend/src/pages/Admin.jsx`

#### Imports Required:
```javascript
import { Users, Activity, Search, Shield, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { userAPI, activityAPI } from '../api'
```

#### API Calls:

**1. Fetch Users:**
```javascript
const fetchUsers = async () => {
  const res = await userAPI.getAllUsers({
    page: currentPage,
    limit: 10,
    search: searchTerm
  })
  const { users, pagination } = res.data.data
  setUsers(users)
  setTotalPages(pagination.totalPages)
}
```

**2. Fetch Activities:**
```javascript
const fetchActivities = async () => {
  const res = await activityAPI.getActivities({
    page: currentPage,
    limit: 10
  })
  // Important: Response has "logs" not "activities"
  const { logs, pagination } = res.data.data
  setActivities(logs)
  setTotalPages(pagination.totalPages)
}
```

---

## ✅ Changes Made to Admin Panel

### 1. User Management Tab

**Added Features:**
- ✅ Action column with "View Details" button
- ✅ Better table structure with all user fields
- ✅ Admin role badge with Shield icon
- ✅ Email verification status with icons
- ✅ Join date column
- ✅ Professional table styling

**Table Columns:**
1. Username
2. Email (with Mail icon)
3. Role (with colored badges - Purple for Admin, Blue for User)
4. Verified (with CheckCircle2/AlertCircle icons)
5. Joined (date)
6. Actions (View Details button)

**Search Functionality:**
- Searches by: username, email, fullName
- Real-time filtering
- Pagination resets on new search

---

### 2. Activity Logs Tab

**Key Fix:**
API returns `{ logs: [] }` not `{ activities: [] }`

**Response Handling:**
```javascript
const { logs = [], activities: actData = [], pagination = {} } = res.data.data
const activities = logs.length > 0 ? logs : actData
```

**Display Fields:**
- Action (CREATE, UPDATE, DELETE)
- Resource Type (PROJECT, TASK, USER)
- Description
- Username who performed action
- Resource ID
- Date and time (separate display)

**Features:**
- ✅ Activity cards with icons
- ✅ Resource type badges
- ✅ Separated date/time columns
- ✅ Better information hierarchy
- ✅ Professional styling with hover effects

---

## 🐛 Troubleshooting

### Issue 1: Activity Logs Showing Empty

**Symptoms:**
- No activities displayed
- Console shows empty array

**Causes:**
1. No activities in database (no projects/tasks created yet)
2. Activity logging not enabled on backend
3. API returns 403 Forbidden (not admin)

**Solutions:**

1. **Check if activities exist in database:**
```bash
# In MongoDB console
db.activitylogs.find().count()  # Should be > 0
```

2. **Check backend is logging activities:**
- Create a project/task
- Check MongoDB if activity was recorded
- Verify getActivityLogs function is called

3. **Verify admin role:**
```javascript
// In browser console
console.log(localStorage.getItem('user'))  // Check role is "admin"
```

4. **Check API response in DevTools:**
- Open DevTools → Network tab
- Look for `/activity-logs` request
- Check response in "Response" tab
- Verify `logs` array is populated

---

### Issue 2: Users Not Loading

**Symptoms:**
- Users table empty
- "No users found" message

**Causes:**
1. No users in database
2. API error (403 Forbidden)
3. Search filter too restrictive

**Solutions:**

1. **Check users exist:**
```bash
db.users.find().count()  # Should be > 0
```

2. **Verify admin access:**
```javascript
// Check auth state
const { user } = useSelector(state => state.auth)
console.log(user.role)  // Should be "admin"
```

3. **Check API error:**
- DevTools → Network → `/users` request
- Check status code (should be 200)
- Check response for error message

---

## 🔍 Console Logging for Debugging

The Admin page now includes debug logs. Open DevTools Console to see:

```javascript
// When loading users
✅ Connected to MongoDB
📊 Users loaded: [{username, email, ...}]

// When loading activities
📊 Fetching activities with params: {page, limit}
📊 Activities response: {...}
📊 Processed activities: [...]
📊 Total pages: 1
```

---

## 📱 Testing Checklist

### Test Users Tab:
- [ ] See list of all users
- [ ] Search works (type username/email)
- [ ] Admin users show purple badge
- [ ] Regular users show blue badge
- [ ] Verified users show checkmark
- [ ] Unverified users show alert
- [ ] Pagination works (if > 10 users)
- [ ] "View Details" button visible

### Test Activities Tab:
- [ ] See list of activities (if any exist)
- [ ] Search filters activities
- [ ] Each activity shows:
  - [ ] Action (CREATE/UPDATE/DELETE)
  - [ ] Resource type
  - [ ] Username
  - [ ] Date and time
  - [ ] Description
- [ ] Cards have good styling
- [ ] Pagination works (if > 10 activities)

### Test Tab Switching:
- [ ] Click between Users and Activities
- [ ] Search term clears
- [ ] Page resets to 1
- [ ] Data reloads correctly

---

## 🔌 Activity Logging on Backend

To ensure activities are logged, verify these controllers have activity logging:

**Files to Check:**
- `backend/src/controllers/project.controller.js`
- `backend/src/controllers/task.controller.js`
- `backend/src/controllers/user.controller.js`

**Example: Logging activity when creating project**
```javascript
// In project.controller.js createProject function
await ActivityLog.create({
  action: 'CREATE',
  description: `Created project: ${projectName}`,
  resourceType: 'PROJECT',
  resourceId: project._id,
  userId: req.user._id
})
```

---

## 📊 Expected Database Structure

### Users Collection:
```javascript
{
  _id: ObjectId,
  username: String,        // unique
  email: String,           // unique
  password: String,        // hashed
  fullName: String,
  role: "user" | "admin",  // default: "user"
  isEmailVerified: Boolean,
  avatar: {
    url: String,
    localPath: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLogs Collection:
```javascript
{
  _id: ObjectId,
  action: "CREATE" | "UPDATE" | "DELETE",
  description: String,
  resourceType: "PROJECT" | "TASK" | "USER",
  resourceId: ObjectId,
  userId: ObjectId,        // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Next Steps

1. **Test Users Tab:**
   - Login as admin
   - Go to `/admin`
   - Verify users are displayed

2. **Generate Activities:**
   - Create a project
   - Create a task
   - Edit/delete items
   - Go back to Activities tab
   - Verify activities appear

3. **Test Pagination:**
   - Create/register multiple users (> 10)
   - Test pagination in Users tab
   - Create multiple activities
   - Test pagination in Activities tab

4. **Test Search:**
   - Search for specific user
   - Search for activity by resource type
   - Verify results filter correctly

---

## 🔐 Security Notes

- ✅ Only admins can access `/admin` route
- ✅ Backend checks user role before returning data
- ✅ Passwords are excluded from user list
- ✅ Tokens are not exposed
- ✅ Activity logs are read-only (no delete/edit)

---

## 📞 Debugging Commands

**In DevTools Console:**

```javascript
// Check current user
console.log(JSON.parse(localStorage.getItem('user')))

// Check if admin
const user = JSON.parse(localStorage.getItem('user'))
console.log('Is Admin:', user?.role === 'admin')

// Test API directly
const response = await fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
})
console.log(await response.json())
```

---

**Last Updated:** November 15, 2025  
**Status:** ✅ Routes Verified, Frontend Updated, Ready for Testing
