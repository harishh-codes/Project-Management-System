# 📊 Visual Guide & Flowcharts

## 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────┘

User visits /register
        ↓
Fills form (email, password, username, fullName)
        ↓
Clicks "Register" button
        ↓
Frontend validates input
  - Email format check
  - Password strength check
  - Passwords match
        ↓
Sends POST /auth/register to backend
        ↓
Backend validates input again
        ↓
Checks if user already exists
        ├─ Yes → Return 400 "User exists"
        └─ No → Continue
        ↓
Hash password with bcrypt
        ↓
Create user document in MongoDB
        ↓
Send verification email (optional)
        ↓
Return 201 success
        ↓
Frontend shows success message
        ↓
Redirects to /login page

---

┌─────────────────────────────────────────────────────────────┐
│                      LOGIN FLOW                              │
└─────────────────────────────────────────────────────────────┘

User visits /login
        ↓
Fills form (email, password)
        ↓
Frontend validates
        ↓
Sends POST /auth/login
        ↓
Backend finds user by email
        ├─ Not found → Return 401 "Invalid credentials"
        └─ Found → Continue
        ↓
Compare password with stored hash (bcrypt)
        ├─ Mismatch → Return 401 "Invalid credentials"
        └─ Match → Continue
        ↓
Generate accessToken (7 days)
        ↓
Generate refreshToken (30 days)
        ↓
Store refreshToken in database
        ↓
Return tokens + user data
        ↓
Frontend stores tokens in localStorage
        ↓
Redux dispatches setUser() and setTokens()
        ↓
Redirects to /dashboard
        ↓
User logged in! ✓

---

┌─────────────────────────────────────────────────────────────┐
│                 TOKEN REFRESH FLOW                           │
└─────────────────────────────────────────────────────────────┘

User makes API request
        ↓
Authorization header added: Bearer accessToken
        ↓
Backend receives request
        ↓
Auth middleware verifies token
        ├─ Valid → Process request ✓
        ├─ Expired → Return 401
        └─ Invalid → Return 401
        ↓
Frontend axios interceptor catches 401
        ↓
Sends POST /auth/refresh with refreshToken
        ↓
Backend verifies refreshToken
        ├─ Invalid/Expired → Return 401
        └─ Valid → Generate new accessToken
        ↓
Return new accessToken
        ↓
Frontend updates localStorage
        ↓
Retry original request with new token
        ↓
Request succeeds! ✓

---

┌─────────────────────────────────────────────────────────────┐
│               PASSWORD RESET FLOW                            │
└─────────────────────────────────────────────────────────────┘

Step 1: Request Password Reset

User visits /forgot-password
        ↓
Enters email address
        ↓
Clicks "Send Reset Link"
        ↓
Frontend validates email format
        ↓
Sends POST /auth/forgot-password
        ↓
Backend finds user by email
        ├─ Not found → Still return success (security)
        └─ Found → Continue
        ↓
Generate one-time reset token
        ↓
Save token (expires in 1 hour)
        ↓
Send email with reset link
        ↓
Return success message
        ↓
Frontend shows "Check your email"

---

Step 2: Reset Password

User clicks email link with token
        ↓
Link goes to /reset-password?token=...
        ↓
User enters new password
        ↓
Clicks "Reset Password"
        ↓
Frontend validates password strength
        ↓
Sends POST /auth/reset-password with token and password
        ↓
Backend validates token
        ├─ Invalid/Expired → Return 400
        └─ Valid → Continue
        ↓
Hash new password
        ↓
Update user password
        ↓
Invalidate token (mark used)
        ↓
Return success
        ↓
Frontend redirects to /login
        ↓
User logs in with new password ✓
```

---

## 🛣️ Request/Response Lifecycle

```
FRONTEND                          BACKEND                      DATABASE
  │                                │                               │
  │─── 1. User Action ────────────>│                               │
  │      (Click button)             │                               │
  │                                │                               │
  │<────── 2. Show Loading ────────│                               │
  │                                │                               │
  │                          3. Validate Input                      │
  │                                │                               │
  │                          4. Check Auth                          │
  │                                │                               │
  │                          5. Query Database ────────────────────>│
  │                                │                               │
  │                          6. Process Logic <─── Return Data ────│
  │                                │                               │
  │                          7. Save Changes (if needed) ──────────>│
  │                                │                               │
  │                          8. Log Activity ──────────────────────>│
  │                                │                               │
  │<────── 9. Format Response ────────┤                               │
  │                                │                               │
  │<────── 10. Parse JSON ───────┤                               │
  │                                │                               │
  │──────  11. Update State ──────>                               │
  │                                │                               │
  │──────  12. Re-render UI  ─────>                               │
  │                                │                               │
  │──────  13. Show Result ────────>                               │
  │       (Success/Error)          │                               │
  ↓                                ↓                               ↓
```

---

## 🎨 Frontend Page Hierarchy

```
App.jsx (Main Router)
├── <ProtectedRoute>
│   ├── /dashboard → Dashboard.jsx
│   │   └── Components: Header, Card, Button
│   │
│   ├── /projects → Projects.jsx
│   │   └── Components: Header, Card, Input, Button, Pagination
│   │
│   ├── /create-project → CreateProject.jsx
│   │   └── Components: Header, Form, Input, Button, Card
│   │
│   ├── /tasks → Tasks.jsx
│   │   └── Components: Header, Card, Button, Pagination
│   │
│   ├── /create-task → CreateTask.jsx
│   │   └── Components: Header, Form, Input, Button, Card
│   │
│   ├── /profile → Profile.jsx
│   │   └── Components: Header, Input, Button, Card
│   │
│   └── <AdminRoute>
│       └── /admin → Admin.jsx
│           └── Components: Header, Pagination, Table, Card
│
├── <PublicRoute>
│   ├── /login → Login.jsx
│   │   └── Components: Form, Input, Button, Card
│   │
│   ├── /register → Register.jsx
│   │   └── Components: Form, Input, Button, Card
│   │
│   └── /forgot-password → ForgotPassword.jsx
│       └── Components: Form, Input, Button, Card
│
└── <NotFound>
    └── /* → NotFound.jsx
```

---

## 🗄️ Database Relationships

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ password    │
│ role        │◄─────┐
│ avatar      │      │
│ createdAt   │      │
└─────────────┘      │
      ▲              │
      │              │
      │ (owner)      │
      │              │
┌─────────────┐      │
│  Project    │      │
├─────────────┤      │
│ id (PK)     │      │
│ name        │      │
│ description │      │
│ owner_id ───┼──────┘
│ members[]   │      ┌─────────────────────┐
│ isArchived  │      │ members[{          │
│ createdAt   │      │   userId,          │
└─────────────┘      │   role             │
      ▲              │ }]                  │
      │              └─────────────────────┘
      │ (project)
      │
┌─────────────┐
│    Task     │
├─────────────┤
│ id (PK)     │
│ title       │
│ description │
│ project_id ─┼─────────────>
│ assignee_id │─────────────>
│ status      │
│ priority    │
│ dueDate     │
│ isArchived  │
│ createdAt   │
└─────────────┘

┌──────────────────┐
│  ActivityLog     │
├──────────────────┤
│ id (PK)          │
│ user_id ─────────>
│ resource_id      │
│ resource_type    │
│ action           │
│ changes {        │
│   before,        │
│   after          │
│ }                │
│ timestamp        │
└──────────────────┘
```

---

## 🔄 CRUD Operations Flow

```
┌──────────────────────────────────────────────────────┐
│            CREATE OPERATION (POST)                    │
└──────────────────────────────────────────────────────┘

Frontend Form → Validate → API Call
                ↓
Backend Route → Validate Again → Check Auth
                ↓
Check Permissions (if owner required)
                ↓
Create Document → Save to Database
                ↓
Log Activity (CREATE action)
                ↓
Populate References → Format Response
                ↓
Return 201 + data → Show Toast → Update UI

---

┌──────────────────────────────────────────────────────┐
│            READ OPERATION (GET)                       │
└──────────────────────────────────────────────────────┘

Frontend Request → API Call with params
                ↓
Backend Route → Validate Auth
                ↓
Query Database with filters
  - Pagination: skip, limit
  - Search: regex match
  - Filters: status, priority, role
                ↓
Check Access (can user see this data?)
                ↓
Populate References → Format Response
                ↓
Return 200 + data → Parse → Update State → Render

---

┌──────────────────────────────────────────────────────┐
│            UPDATE OPERATION (PUT)                     │
└──────────────────────────────────────────────────────┘

Frontend Form → Validate → API Call
                ↓
Backend Route → Validate Again → Check Auth
                ↓
Check Ownership (only owner can update)
                ↓
Find Document → Update Fields
                ↓
Compare old and new values (for activity log)
                ↓
Save to Database
                ↓
Log Activity (UPDATE action with before/after)
                ↓
Populate References → Format Response
                ↓
Return 200 + updated data → Show Toast → Update UI

---

┌──────────────────────────────────────────────────────┐
│            DELETE OPERATION (DELETE)                  │
└──────────────────────────────────────────────────────┘

Frontend Confirm Dialog → API Call
                ↓
Backend Route → Validate Auth
                ↓
Check Ownership (only owner can delete)
                ↓
Find Document → Mark as Archived
  - isArchived = true
  - archivedAt = new Date()
                ↓
NOT permanently deleted from database
                ↓
Log Activity (ARCHIVE action)
                ↓
Return 200 + success message
                ↓
Frontend Remove from UI → Show Toast
```

---

## 📱 Frontend State Flow

```
┌─────────────────────────────────────────────────────┐
│              REDUX STORE (Redux Toolkit)             │
│                                                      │
│  authSlice                                           │
│  ├─ user { id, username, email, role }              │
│  ├─ tokens { accessToken, refreshToken }            │
│  ├─ isAuthenticated (boolean)                       │
│  └─ loading (boolean)                               │
│                                                      │
│  Actions:                                            │
│  ├─ setUser(userData)                               │
│  ├─ setTokens({ access, refresh })                  │
│  ├─ clearAuth()                                     │
│  └─ setLoading(boolean)                             │
└─────────────────────────────────────────────────────┘
            ▲           │           ▼
            │           │    Components use
            │           │    useSelector()
            │           │
    Component dispatches ├─ useDispatch()
    action when needed   │
            │            │
            ▼            ▼
    Component Logic ← Update triggers
                         re-render
```

---

## 🔌 Axios Interceptor Flow

```
Frontend API Call
        ↓
┌──────────────────────────────────┐
│   REQUEST INTERCEPTOR            │
│  ────────────────────────────    │
│  Add Authorization Header:       │
│  Bearer {accessToken}            │
└──────────────────────────────────┘
        ↓
Backend Receives Request
        ↓
Auth Middleware Verifies Token
        ├─ Valid → Process request
        ├─ Expired → Return 401
        └─ Invalid → Return 401
        ↓
Return Response
        ↓
┌──────────────────────────────────┐
│   RESPONSE INTERCEPTOR           │
│  ────────────────────────────    │
│  Check Status Code               │
│                                  │
│  If 401:                          │
│  └─ Send POST /auth/refresh      │
│     Get new accessToken          │
│     Retry original request       │
│                                  │
│  Else:                            │
│  └─ Return response              │
└──────────────────────────────────┘
        ↓
Component Receives Data
        ↓
Update State → Re-render → Show Result
```

---

## 🚦 Error Handling Flow

```
Any Error Occurs
        ↓
Try/Catch Block Catches
        ↓
Check Error Type
        ├─ Network Error
        │  └─ Show "Cannot reach server"
        │
        ├─ 400 Bad Request
        │  └─ Show specific validation error
        │
        ├─ 401 Unauthorized
        │  └─ Trigger token refresh or logout
        │
        ├─ 403 Forbidden
        │  └─ Show "You don't have permission"
        │
        ├─ 404 Not Found
        │  └─ Show "Resource not found"
        │
        └─ 500 Server Error
           └─ Show "Server error, try again"
        ↓
Format Error Message
        ↓
Show Toast Notification
        ↓
Log to Console (development)
        ↓
Log to Sentry (production)
        ↓
User Sees Error & Can Retry
```

---

## 📊 Data Flow for Project Creation

```
User at /create-project page
        ↓
┌─────────────────────────────────────────────────┐
│           FRONTEND                               │
│  ────────────────────────────────────────────   │
│  1. User fills form                              │
│     - Project name                               │
│     - Description                                │
│  ────────────────────────────────────────────   │
│  2. Click "Create" button                        │
│  ────────────────────────────────────────────   │
│  3. Validate input                               │
│     - Name required                              │
│     - Name not empty                             │
│  ────────────────────────────────────────────   │
│  4. Call projectAPI.create(formData)             │
└─────────────────────────────────────────────────┘
        ↓
    API Client (axios)
    Adds Authorization header
    POSTs to /api/v1/projects
        ↓
┌─────────────────────────────────────────────────┐
│           BACKEND                                │
│  ────────────────────────────────────────────   │
│  1. Receive request at POST /projects            │
│  ────────────────────────────────────────────   │
│  2. Auth middleware verifies JWT                 │
│     - Extract userId from token                  │
│  ────────────────────────────────────────────   │
│  3. Validator middleware checks fields          │
│     - Name: required, string                     │
│  ────────────────────────────────────────────   │
│  4. Controller: projectController.create()       │
│     - Create project object:                     │
│       { name, description, owner: userId }      │
│     - Save to MongoDB                            │
│  ────────────────────────────────────────────   │
│  5. Add user as admin member                     │
│     members: [{ userId, role: 'admin' }]        │
│  ────────────────────────────────────────────   │
│  6. Create activity log                          │
│     ActivityLog.create({                         │
│       userId, action: 'create',                  │
│       resourceType: 'project',                   │
│       resourceId: newProject._id                 │
│     })                                           │
│  ────────────────────────────────────────────   │
│  7. Populate references                          │
│     Include owner details in response            │
│  ────────────────────────────────────────────   │
│  8. Return 201 + project data                    │
└─────────────────────────────────────────────────┘
        ↓
    API Client
    Receives response (201 + project)
        ↓
┌─────────────────────────────────────────────────┐
│           FRONTEND RESPONSE HANDLING              │
│  ────────────────────────────────────────────   │
│  1. Call succeeded                               │
│  ────────────────────────────────────────────   │
│  2. Show success toast                           │
│     "Project created successfully"               │
│  ────────────────────────────────────────────   │
│  3. Navigate to /projects                        │
│  ────────────────────────────────────────────   │
│  4. Fetch projects list                          │
│  ────────────────────────────────────────────   │
│  5. New project appears in list ✓                │
└─────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline: From Click to Display

```
Time    Event                          Actor
────────────────────────────────────────────────────
0ms     User clicks "Create" button    Frontend
1ms     Form validation starts        Frontend
2ms     All fields valid              Frontend
3ms     API call starts               Frontend (Axios)
4ms     Authorization header added    Axios Interceptor
5ms     Network request sent          Browser
10ms    Request reaches server        Backend
11ms    Auth middleware runs          Backend
12ms    JWT verified                  Backend
13ms    Validator middleware runs     Backend
14ms    Input validation passes       Backend
15ms    Controller function starts    Backend
16ms    Create object in memory       Backend
17ms    Save to MongoDB               Backend
18ms    MongoDB returns _id           Database
19ms    Create activity log           Backend
20ms    Activity log saved            Database
21ms    Populate references           Backend
22ms    Format response               Backend
23ms    Response sent to frontend     Backend
28ms    Response received             Frontend
29ms    Response interceptor runs     Axios
30ms    JSON parsed                   Frontend
31ms    Success handler executes      Frontend
32ms    Toast notification created    Frontend
33ms    Navigation triggered          Frontend
34ms    /projects page loads          Frontend
35ms    useEffect runs                Frontend
36ms    Fetch projects API call       Frontend
50ms    Projects data received        Frontend
51ms    State updated                 Frontend
52ms    Component re-renders          React
55ms    New project visible on page   User
────────────────────────────────────────────────────
Total: ~55ms from click to display (fast!)
```

---

## 🎯 Feature Matrix

```
Feature                  Endpoint              Frontend          Auth Required
──────────────────────────────────────────────────────────────────────────────
Register                POST /auth/register   Register.jsx      No
Login                   POST /auth/login      Login.jsx         No
Logout                  POST /auth/logout     Header.jsx        Yes
Forgot Password         POST /auth/...        ForgotPassword.jsx No
Reset Password          POST /auth/...        ForgotPassword.jsx No

Create Project          POST /projects        CreateProject.jsx  Yes
View Projects           GET /projects         Projects.jsx       Yes
Search Projects         GET /projects?search  Projects.jsx       Yes
Paginate Projects       GET /projects?page    Projects.jsx       Yes
Update Project          PUT /projects/:id     Projects.jsx       Yes
Delete Project          DELETE /projects      Projects.jsx       Yes
Add Project Member      POST /projects/...    Projects.jsx       Yes

Create Task             POST /tasks           CreateTask.jsx     Yes
View Tasks              GET /tasks            Tasks.jsx          Yes
Filter Tasks Status     GET /tasks?status     Tasks.jsx          Yes
Filter Tasks Priority   GET /tasks?priority   Tasks.jsx          Yes
Update Task Status      PUT /tasks/:id        Tasks.jsx          Yes
Delete Task             DELETE /tasks         Tasks.jsx          Yes

View Profile            GET /users/profile    Profile.jsx        Yes
Edit Profile            PUT /users/profile    Profile.jsx        Yes
Change Password         POST /users/...       Profile.jsx        Yes

View Users (Admin)      GET /users            Admin.jsx          Admin
View Activities (Admin) GET /activity-logs    Admin.jsx          Admin
```

---

## 🔒 Permission Matrix

```
Resource        Owner   Admin   Member  Public
────────────────────────────────────────────────
User Profile    ✓ RW   ✓ RW   ✗       ✗
User Password   ✓ W    ✓ R    ✗       ✗
User List       ✗      ✓ R    ✗       ✗

Project View    ✓ RW   ✓ RW   ✓ R     ✗
Project Edit    ✓ RW   ✓ RW   ✗       ✗
Project Delete  ✓ D    ✓ D    ✗       ✗
Members Add     ✓ W    ✓ W    ✗       ✗
Members Remove  ✓ D    ✓ D    ✗       ✗

Task View       ✓ R    ✓ R    ✓ R     ✗
Task Create     ✓ C    ✓ C    ✓ C     ✗
Task Edit       ✓ W    ✓ W    ✓ W     ✗
Task Delete     ✓ D    ✓ D    ✗       ✗

Activity View   ✓ R    ✓ R    ✗       ✗

Legend: R=Read, W=Write, C=Create, D=Delete
```

---

This visual guide helps you understand the system flow, data relationships, and interactions between components!

