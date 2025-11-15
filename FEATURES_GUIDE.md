# Features Guide

## Authentication & Authorization

### Registration
- **Endpoint:** `POST /api/v1/auth/register`
- **What happens:**
  1. User submits email, password, username, fullName
  2. Backend validates input
  3. Checks if user already exists
  4. Hashes password with bcrypt
  5. Creates user document with role='user'
  6. Sends verification email
  7. Returns success message

- **Frontend:**
  - Page: `/frontend/src/pages/Register.jsx`
  - Form validation for matching passwords
  - Redirects to login after success

### Login
- **Endpoint:** `POST /api/v1/auth/login`
- **What happens:**
  1. User submits email and password
  2. Backend finds user
  3. Compares password with stored hash
  4. Generates accessToken (7 days)
  5. Generates refreshToken (30 days)
  6. Returns tokens and user data
  7. Frontend stores in localStorage

- **Frontend:**
  - Page: `/frontend/src/pages/Login.jsx`
  - Redux dispatch: `setUser()`, `setTokens()`
  - Redirects to dashboard on success

### Token Refresh
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Automatic process:**
  1. AccessToken expires (7 days)
  2. Frontend makes API request
  3. Gets 401 Unauthorized response
  4. Axios interceptor automatically calls refresh endpoint
  5. RefreshToken is validated
  6. New accessToken generated
  7. Original request is retried
  8. All transparent to user

- **Code:** `/frontend/src/api/client.js` (Response interceptor)

### Password Reset
- **2-Step Process:**

**Step 1: Request Reset**
- Endpoint: `POST /api/v1/auth/forgot-password`
- User enters email
- Backend sends reset link via email
- Link contains one-time token

**Step 2: Reset Password**
- Endpoint: `POST /api/v1/auth/reset-password`
- User clicks email link
- Enters new password
- Token validated
- Password updated

- **Frontend:** `/frontend/src/pages/ForgotPassword.jsx`

### Role-Based Access Control
- **User Roles:**
  - `user` - Regular user (default)
  - `admin` - Administrator

- **Access Control Levels:**
  ```
  Public Routes (No Auth):
  - Register
  - Login
  - Forgot Password
  
  Protected Routes (user role):
  - Dashboard
  - Projects
  - Tasks
  - Profile
  
  Admin Routes (admin role):
  - Admin Panel
  - User Management
  - Activity Logs (all users)
  ```

- **Frontend Guards:**
  - `<ProtectedRoute>` - Requires authentication
  - `<PublicRoute>` - Redirects if authenticated
  - `<AdminRoute>` - Requires admin role

- **Backend Checks:**
  - `/frontend/src/router/ProtectedRoutes.jsx` - Frontend validation
  - `auth.middleware.js` - Backend JWT verification
  - Controllers check ownership and permissions

---

## Project Management

### Create Project
- **Endpoint:** `POST /api/v1/projects`
- **What you send:**
  ```json
  {
    "name": "Website Redesign",
    "description": "Complete website redesign project"
  }
  ```

- **What happens:**
  1. Request validated
  2. New project created
  3. Current user set as owner
  4. User added to members with admin role
  5. Activity logged
  6. Project returned

- **Frontend:** `/frontend/src/pages/CreateProject.jsx`

### View All Projects
- **Endpoint:** `GET /api/v1/projects`
- **Features:**
  - **Pagination:**
    ```
    Query: ?page=1&limit=10
    Response includes: totalProjects, totalPages, currentPage
    ```
  
  - **Search:**
    ```
    Query: ?search=website
    Searches by project name (case-insensitive)
    ```
  
  - **Filters:**
    ```
    Query: ?status=active
    Values: active, archived, all
    ```

- **Response includes:**
  - Project details
  - Owner information
  - Members array with roles
  - Created/updated timestamps
  - isArchived status

- **Frontend:** `/frontend/src/pages/Projects.jsx`

### Get Single Project
- **Endpoint:** `GET /api/v1/projects/:projectId`
- **What you get:**
  - Full project details
  - Owner information
  - All members with roles
  - Can be used for project detail view

### Update Project
- **Endpoint:** `PUT /api/v1/projects/:projectId`
- **What you send:**
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description"
  }
  ```

- **Requirements:**
  - Must be project owner
  - Activity logged
  - Returns updated project

- **Frontend:** Edit functionality in Projects.jsx (ready to implement)

### Delete Project (Soft Delete)
- **Endpoint:** `DELETE /api/v1/projects/:projectId`
- **What happens:**
  1. Ownership verified
  2. Project marked as archived (isArchived = true)
  3. Timestamp recorded (archivedAt)
  4. NOT permanently deleted from database
  5. Activity logged
  6. Can be unarchived if needed

- **Benefits:**
  - Data recovery possible
  - Audit trail maintained
  - Associated tasks not affected
  - Admin can restore if needed

### Project Members Management

**Add Member**
- **Endpoint:** `POST /api/v1/projects/:projectId/members`
- **What you send:**
  ```json
  {
    "userId": "user_id",
    "role": "editor"  // admin, editor, or viewer
  }
  ```

- **Role Permissions:**
  - `admin` - Can manage members, tasks, and project
  - `editor` - Can create and edit tasks
  - `viewer` - Can only view project and tasks

**Remove Member**
- **Endpoint:** `DELETE /api/v1/projects/:projectId/members/:userId`
- **What happens:**
  1. Membership verified
  2. User removed from project members
  3. Activity logged
  4. User loses access to project

---

## Task Management

### Create Task
- **Endpoint:** `POST /api/v1/tasks`
- **What you send:**
  ```json
  {
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockups",
    "projectId": "project_id",
    "status": "todo",           // todo, in_progress, done
    "priority": "high",         // low, medium, high
    "dueDate": "2024-02-15",
    "assignee": "user_id"       // optional
  }
  ```

- **Frontend:** `/frontend/src/pages/CreateTask.jsx`

### View All Tasks
- **Endpoint:** `GET /api/v1/tasks`
- **Features:**
  - **Pagination:** `?page=1&limit=20`
  - **Search:** `?search=design`
  - **Status Filter:** `?status=in_progress`
  - **Priority Filter:** `?priority=high`

- **Response includes:**
  - Task details
  - Status and priority
  - Assignee information
  - Due date
  - Created/updated timestamps

- **Frontend:** `/frontend/src/pages/Tasks.jsx`

### Get Tasks by Project
- **Endpoint:** `GET /api/v1/tasks/project/:projectId`
- **What happens:**
  1. Verifies user access to project
  2. Returns all non-archived tasks for project
  3. Supports same filtering and pagination as all tasks

### Update Task
- **Endpoint:** `PUT /api/v1/tasks/:taskId`
- **What you send:**
  ```json
  {
    "title": "Updated title",
    "status": "in_progress",
    "priority": "medium",
    "dueDate": "2024-02-20",
    "assignee": "new_user_id"
  }
  ```

- **What happens:**
  1. Task ownership verified
  2. Status change logged
  3. Priority change logged
  4. Assignee change logged
  5. Activity record created for each change
  6. Updated task returned

- **Use Cases:**
  - Progress updates
  - Priority adjustments
  - Reassigning tasks
  - Changing due dates

### Delete Task (Soft Delete)
- **Endpoint:** `DELETE /api/v1/tasks/:taskId`
- **What happens:**
  1. Task marked as archived (isArchived = true)
  2. archivedAt timestamp recorded
  3. NOT permanently deleted
  4. Activity logged
  5. Excluded from list views automatically

---

## User Profile Management

### View Profile
- **Endpoint:** `GET /api/v1/users/profile`
- **What you get:**
  - Username
  - Email
  - Full name
  - Role (user/admin)
  - Account creation date
  - Last login

- **Frontend:** `/frontend/src/pages/Profile.jsx`

### Update Profile
- **Endpoint:** `PUT /api/v1/users/profile`
- **What you send:**
  ```json
  {
    "fullName": "John Doe Updated"
  }
  ```

- **What can be updated:**
  - Full name only
  - Username is immutable
  - Email requires verification (future feature)

### Change Password
- **Endpoint:** `POST /api/v1/users/change-password`
- **What you send:**
  ```json
  {
    "oldPassword": "current_password",
    "newPassword": "new_password_123"
  }
  ```

- **What happens:**
  1. Old password verified
  2. New password requirements checked
  3. Password hashed
  4. Updated in database
  5. All sessions invalidated (logout after change)

- **Security:**
  - Old password must be correct
  - New password requirements enforced
  - Session cleared after change
  - User must login again

### Avatar Upload
- **Endpoint:** `POST /api/v1/users/avatar`
- **Current:** Accepts image URL
- **Future:** File upload support

---

## Activity Logging & Audit Trail

### What Gets Logged
Every action is automatically recorded:

**Create Actions:**
- New project created
- New task created
- New user registered (admin only)

**Update Actions:**
- Project details changed
- Task status updated
- Task priority changed
- Task assignee changed
- User profile updated
- Password changed

**Delete Actions:**
- Project archived
- Task archived
- User deactivated

**Access Actions:**
- Project member added
- Project member removed

### View Activity Logs

**Admin View (All Activities)**
- **Endpoint:** `GET /api/v1/activity-logs`
- **Admin only access**
- **Features:**
  - See all user actions system-wide
  - Pagination support
  - Filter by date range (future feature)

- **Frontend:** Admin panel tab in `/frontend/src/pages/Admin.jsx`

**User View (Personal Activities)**
- **Endpoint:** `GET /api/v1/activity-logs/user/my-activities`
- **What you get:**
  - Your own actions only
  - Projects you created
  - Tasks you modified
  - Profile changes
  - Password changes

**Resource View (Activity on Specific Item)**
- **Endpoint:** `GET /api/v1/activity-logs/:resourceType/:resourceId`
- **Examples:**
  ```
  GET /api/v1/activity-logs/project/project_id
  GET /api/v1/activity-logs/task/task_id
  ```

- **What you get:**
  - All changes to that specific item
  - Who made changes
  - When changes were made
  - Before/after values (for updates)

### Activity Log Information
Each log entry includes:
```json
{
  "userId": "user_id",
  "resourceType": "project|task|user|team",
  "resourceId": "item_id",
  "action": "create|update|delete|archive|restore",
  "changes": {
    "before": { "status": "todo" },
    "after": { "status": "in_progress" }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "userDetails": {
    "username": "john_doe",
    "fullName": "John Doe"
  }
}
```

---

## Admin Panel Features

### User Management
- **View all users** - See username, email, role, verification status
- **User statistics** - Total users, active users, admins
- **Future features:**
  - Promote user to admin
  - Deactivate users
  - Reset user passwords
  - View user projects and tasks

### Activity Logs
- **System-wide audit trail**
- **See all actions** from all users
- **Identify problems** - Find what broke and who did it
- **Compliance** - Maintain audit trail for regulations

- **Frontend:** `/frontend/src/pages/Admin.jsx`

### Admin-Only Endpoints
```
GET /api/v1/users              - List all users
GET /api/v1/activity-logs      - All system activities
POST /api/v1/users/:userId/role - Promote/demote user (future)
DELETE /api/v1/users/:userId   - Deactivate user (future)
```

---

## Search & Filtering

### Project Search
- **Endpoint:** `GET /api/v1/projects?search=website`
- **Searches:** Project name
- **Case-insensitive**
- **Partial matches supported**

### Task Search
- **Endpoint:** `GET /api/v1/tasks?search=design`
- **Searches:** Task title and description
- **Case-insensitive**

### Status Filter (Tasks)
- **Endpoint:** `GET /api/v1/tasks?status=in_progress`
- **Options:**
  - `todo` - Not started
  - `in_progress` - Currently working
  - `done` - Completed

### Priority Filter (Tasks)
- **Endpoint:** `GET /api/v1/tasks?priority=high`
- **Options:**
  - `low` - Can be done anytime
  - `medium` - Should be done soon
  - `high` - Urgent, do first

### Combined Filters
```
GET /api/v1/tasks?
  search=design&
  status=in_progress&
  priority=high&
  page=1&
  limit=10
```

---

## Pagination

### How It Works
- **Default page:** 1
- **Default limit:** 10 (max 100)
- **Calculation:** Skip = (page - 1) × limit

### Response Structure
```json
{
  "data": [...items],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Frontend Usage
- Component: `/frontend/src/components/Pagination.jsx`
- Shows current page highlighted
- Previous/Next buttons
- Direct page number links
- Ellipsis for large page ranges

---

## Error Handling

### Common Errors

**401 Unauthorized**
- Access token expired
- RefreshToken invalid
- Not authenticated
- **Auto-handled:** Axios interceptor refreshes token

**403 Forbidden**
- Not project owner
- Not admin
- Don't have permission
- **Example:** Try to edit someone else's project

**404 Not Found**
- Project doesn't exist
- Task doesn't exist
- Resource archived

**400 Bad Request**
- Missing required fields
- Invalid data format
- Validation failed
- **Example:** Password too short

**500 Server Error**
- Database connection issue
- Email service down
- Unexpected error
- Check backend logs

### Error Response Format
```json
{
  "success": false,
  "message": "Project not found",
  "error": "RESOURCE_NOT_FOUND",
  "statusCode": 404
}
```

### Frontend Error Display
- Automatic toast notifications
- Error messages from server displayed to user
- See `/frontend/src/utils/helpers.js` for error handling

---

## Email Features

### Verification Email
- Sent after registration
- Contains verification link
- Must verify before certain features (future)

### Password Reset Email
- Sent when user requests password reset
- Contains one-time reset link
- Link expires after use or timeout

### Notifications (Future)
- Task assignments
- Project invitations
- Activity summaries
- Deadline reminders

### Email Configuration
- Service: Mailtrap (development) or SendGrid (production)
- SMTP credentials in .env file
- HTML templates using mailgen

---

## Data Model Details

### User Schema
```javascript
{
  username: String (unique),
  email: String (unique),
  fullName: String,
  password: String (hashed),
  role: 'user' | 'admin',
  avatar: String (URL),
  isEmailVerified: Boolean,
  refreshTokens: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [{
    userId: ObjectId (User),
    role: 'admin' | 'editor' | 'viewer'
  }],
  isArchived: Boolean,
  archivedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignee: ObjectId (User),
  status: 'todo' | 'in_progress' | 'done',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  isArchived: Boolean,
  archivedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Log Schema
```javascript
{
  userId: ObjectId (User),
  resourceType: 'project' | 'task' | 'user' | 'team',
  resourceId: ObjectId,
  action: 'create' | 'update' | 'delete' | 'archive' | 'restore',
  changes: {
    before: Object,
    after: Object
  },
  timestamp: Date
}
```

---

## Common Workflows

### Create a Project and Add Task
1. **Login** → `/login`
2. **Go to Dashboard** → `/dashboard`
3. **Click "Create Project"** → `/create-project`
4. **Fill form and submit**
5. **See project in Projects list** → `/projects`
6. **Click project**
7. **Click "Create Task"**
8. **Select this project**
9. **Fill task details**
10. **Submit**
11. **Task appears in Tasks list** → `/tasks`

### Collaborate on Project
1. **Owner creates project**
2. **Goes to Projects page**
3. **Clicks "Add Member"**
4. **Selects user and role** (editor, viewer)
5. **Member notified** (future)
6. **Member can see project and tasks**
7. **Based on role, can edit or view only**

### Change Task Status
1. **Go to Tasks** → `/tasks`
2. **Click task**
3. **Change status from "todo" to "in_progress"**
4. **Submit**
5. **Activity logged automatically**
6. **Shows in activity history**

### Monitor Team Activity
1. **Go to Admin Panel** → `/admin`
2. **Click "Activity Logs" tab**
3. **See all team activities**
4. **Filter by date or user** (future)
5. **See before/after values for updates**
6. **Export for compliance** (future)

