# Testing & QA Guide

## Table of Contents
1. [Manual Testing](#manual-testing)
2. [API Testing with Postman](#api-testing-with-postman)
3. [Frontend Testing](#frontend-testing)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)
6. [Automated Testing (Future)](#automated-testing-future)

---

## Manual Testing

### Test Scenarios

#### 1. Authentication Flow

**Registration Test**
```
Test Case: TC-AUTH-001
Title: User Registration
Steps:
1. Navigate to http://localhost:5173/register
2. Enter valid email (test@example.com)
3. Enter username (testuser)
4. Enter full name (Test User)
5. Enter password (Test@123)
6. Re-enter password (Test@123)
7. Click "Register"

Expected Result:
- User created successfully
- Success message displayed
- Redirected to login page
- User can login with credentials

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Login Test**
```
Test Case: TC-AUTH-002
Title: User Login
Steps:
1. Navigate to http://localhost:5173/login
2. Enter email (test@example.com)
3. Enter password (Test@123)
4. Click "Login"

Expected Result:
- Login successful
- Redirected to dashboard
- User name shown in header
- Token stored in localStorage
- Can see dashboard stats

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Failed Login Test**
```
Test Case: TC-AUTH-003
Title: Login with Wrong Password
Steps:
1. Navigate to http://localhost:5173/login
2. Enter email (test@example.com)
3. Enter wrong password (Wrong123)
4. Click "Login"

Expected Result:
- Login fails
- Error message: "Invalid email or password"
- Stays on login page
- Can retry

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Logout Test**
```
Test Case: TC-AUTH-004
Title: User Logout
Steps:
1. Login to account
2. Click user menu in header
3. Click "Logout" button

Expected Result:
- Logged out successfully
- Redirected to login page
- localStorage cleared
- Token removed
- Cannot access protected routes

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

#### 2. Project Management

**Create Project Test**
```
Test Case: TC-PROJ-001
Title: Create New Project
Steps:
1. Login to account
2. Go to Dashboard
3. Click "Create Project" button
4. Enter project name: "Website Redesign"
5. Enter description: "Redesign company website"
6. Click "Create"

Expected Result:
- Project created successfully
- Redirected to projects list
- New project appears in list
- Current user is owner
- Success message shown

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**View Projects List Test**
```
Test Case: TC-PROJ-002
Title: View All Projects
Steps:
1. Login to account
2. Go to Projects page
3. Verify projects displayed
4. Try searching for project name
5. Test pagination if exists

Expected Result:
- All projects displayed
- Owner information shown
- Member count displayed
- Search filters projects
- Pagination works (if applicable)

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Update Project Test**
```
Test Case: TC-PROJ-003
Title: Edit Project Details
Steps:
1. Go to Projects page
2. Click on owned project
3. Click "Edit" button
4. Change name to "Website Redesign v2"
5. Change description
6. Click "Save"

Expected Result:
- Project updated
- New details displayed
- Success message shown
- Activity log records change

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Add Project Member Test**
```
Test Case: TC-PROJ-004
Title: Add Member to Project
Steps:
1. Go to Projects page
2. Click owned project
3. Click "Add Member" button
4. Select user from list
5. Choose role: "editor"
6. Click "Add"

Expected Result:
- Member added to project
- Member appears in members list
- Member can access project
- Activity log records addition
- Member sees project in their list

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Remove Project Member Test**
```
Test Case: TC-PROJ-005
Title: Remove Member from Project
Steps:
1. Go to Projects page
2. Click owned project
3. Find member in list
4. Click "Remove" button
5. Confirm removal

Expected Result:
- Member removed from project
- No longer in members list
- Member loses access to project
- Activity log records removal
- Member no longer sees project

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Delete Project Test**
```
Test Case: TC-PROJ-006
Title: Delete (Archive) Project
Steps:
1. Go to Projects page
2. Click owned project
3. Click "Delete" button
4. Confirm deletion

Expected Result:
- Project archived
- Disappears from projects list
- isArchived flag set to true
- Activity log records deletion
- Can restore project later (admin feature)

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

#### 3. Task Management

**Create Task Test**
```
Test Case: TC-TASK-001
Title: Create New Task
Steps:
1. Go to Dashboard
2. Click "Create Task"
3. Select project
4. Enter title: "Design homepage"
5. Enter description
6. Select status: "todo"
7. Select priority: "high"
8. Set due date: 2024-02-15
9. Click "Create"

Expected Result:
- Task created successfully
- Appears in tasks list
- Correct project association
- Status set correctly
- Priority color shows correctly
- Activity logged

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**View Tasks List Test**
```
Test Case: TC-TASK-002
Title: View All Tasks
Steps:
1. Go to Tasks page
2. Verify all tasks shown
3. Filter by status (todo, in_progress, done)
4. Filter by priority (low, medium, high)
5. Search for task by title
6. Test pagination

Expected Result:
- All tasks display with details
- Status filters work correctly
- Priority filters work correctly
- Search returns matching tasks
- Pagination navigates correctly

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Update Task Status Test**
```
Test Case: TC-TASK-003
Title: Change Task Status
Steps:
1. Go to Tasks page
2. Click on task
3. Change status from "todo" to "in_progress"
4. Save changes

Expected Result:
- Status updated
- Reflects in tasks list
- Activity logged with before/after
- Can view in activity history
- Shows in status filter

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Assign Task Test**
```
Test Case: TC-TASK-004
Title: Assign Task to User
Steps:
1. Go to Tasks page
2. Click on task
3. Click "Assign" dropdown
4. Select user
5. Save

Expected Result:
- Task assigned to user
- Assignee shown in task details
- Appears in user's task list
- Activity logged with assignment
- User can see their assignments

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Delete Task Test**
```
Test Case: TC-TASK-005
Title: Delete (Archive) Task
Steps:
1. Go to Tasks page
2. Click on task
3. Click "Delete" button
4. Confirm

Expected Result:
- Task archived
- Disappears from list
- isArchived flag set
- Activity logged
- Not counted in open tasks

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

#### 4. User Profile

**View Profile Test**
```
Test Case: TC-USER-001
Title: View User Profile
Steps:
1. Login to account
2. Go to Profile page
3. Verify all info displayed

Expected Result:
- User info shown (name, email, role)
- Username read-only
- Email read-only
- Account created date shown
- Last login shown

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Edit Profile Test**
```
Test Case: TC-USER-002
Title: Edit Profile Information
Steps:
1. Go to Profile page
2. Click "Edit Profile"
3. Change full name
4. Click "Save"

Expected Result:
- Name updated
- Changes reflected everywhere
- Success message shown
- Activity logged
- Header shows new name

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Change Password Test**
```
Test Case: TC-USER-003
Title: Change Password
Steps:
1. Go to Profile page
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click "Save"

Expected Result:
- Password changed
- Success message shown
- Logged out after change
- Can login with new password
- Cannot login with old password

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

#### 5. Admin Features

**View Users Test**
```
Test Case: TC-ADMIN-001
Title: View All Users (Admin Only)
Steps:
1. Login with admin account
2. Go to Admin panel
3. Click "Users Management" tab
4. Verify all users listed
5. Check user info displayed

Expected Result:
- All system users shown
- Username, email, role displayed
- User count shown
- Can see verified status
- Can view user details

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**View Activity Logs Test**
```
Test Case: TC-ADMIN-002
Title: View Activity Logs (Admin Only)
Steps:
1. Login with admin account
2. Go to Admin panel
3. Click "Activity Logs" tab
4. Verify activities displayed
5. Check details shown

Expected Result:
- All system activities shown
- User action shown
- Resource type shown
- Action type shown (create/update/delete)
- Timestamp shown
- Can see before/after values

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Non-Admin Cannot Access Test**
```
Test Case: TC-ADMIN-003
Title: Regular User Cannot Access Admin
Steps:
1. Login with regular user account
2. Navigate to /admin directly
3. Try to access admin endpoints

Expected Result:
- Access denied/redirected
- Admin panel not visible in menu
- Admin routes return 403
- Cannot view admin data

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

#### 6. Error Handling

**Required Field Validation Test**
```
Test Case: TC-ERROR-001
Title: Required Field Validation
Steps:
1. Go to Create Project page
2. Leave project name empty
3. Click "Create"

Expected Result:
- Error message displayed
- Form not submitted
- Stays on form
- Can fill in and retry

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Password Validation Test**
```
Test Case: TC-ERROR-002
Title: Password Format Validation
Steps:
1. Go to Register page
2. Enter weak password (12345)
3. Try to register

Expected Result:
- Error: Password too weak
- Requirements shown
- Form not submitted
- Can retry with strong password

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

**Unauthorized Access Test**
```
Test Case: TC-ERROR-003
Title: Unauthorized Project Access
Steps:
1. User A creates project
2. User B tries to edit User A's project
3. User B tries to delete User A's project

Expected Result:
- Access denied (403)
- User B cannot modify
- User B cannot delete
- Error message shown

Actual Result: [Fill during testing]
Status: [PASS/FAIL]
```

---

## API Testing with Postman

### Setup Postman

1. **Download Postman** - https://www.postman.com/downloads/
2. **Import Environment**
   - Create environment called "Local Development"
   - Set variables:
     ```
     base_url: http://localhost:3000/api/v1
     token: [will be set after login]
     projectId: [will be set after creating project]
     taskId: [will be set after creating task]
     userId: [user ID from login response]
     ```

### Authentication API Tests

**Test 1: Register User**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "Test@123456",
  "fullName": "Test User"
}

Expected Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "username": "testuser123",
    "email": "testuser@example.com",
    "fullName": "Test User",
    "role": "user"
  }
}
```

**Test 2: Login User**
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "Test@123456"
}

Expected Response: 200
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "testuser123",
      "email": "testuser@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}

Post-Test: 
- Copy accessToken value
- Set {{token}} to this value in environment
```

**Test 3: Refresh Token**
```
POST {{base_url}}/auth/refresh
Content-Type: application/json
Authorization: Bearer {{token}}

{}

Expected Response: 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Project API Tests

**Test 4: Create Project**
```
POST {{base_url}}/projects
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Website Redesign",
  "description": "Complete website redesign project"
}

Expected Response: 201
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Website Redesign",
    "description": "Complete website redesign project",
    "owner": { "username": "testuser123", ... },
    "members": [{ "userId": {...}, "role": "admin" }],
    "isArchived": false,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}

Post-Test:
- Copy _id value
- Set {{projectId}} to this value
```

**Test 5: Get All Projects**
```
GET {{base_url}}/projects?page=1&limit=10&search=website
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Website Redesign",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

**Test 6: Get Single Project**
```
GET {{base_url}}/projects/{{projectId}}
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": {
    "_id": "{{projectId}}",
    "name": "Website Redesign",
    "members": [...]
  }
}
```

**Test 7: Update Project**
```
PUT {{base_url}}/projects/{{projectId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "Website Redesign v2",
  "description": "Updated description"
}

Expected Response: 200
{
  "success": true,
  "data": {
    "_id": "{{projectId}}",
    "name": "Website Redesign v2",
    "description": "Updated description",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Test 8: Add Project Member**
```
POST {{base_url}}/projects/{{projectId}}/members
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "userId": "other_user_id",
  "role": "editor"
}

Expected Response: 200
{
  "success": true,
  "data": {
    "members": [
      { "userId": {...}, "role": "admin" },
      { "userId": {...}, "role": "editor" }
    ]
  }
}
```

**Test 9: Delete Project**
```
DELETE {{base_url}}/projects/{{projectId}}
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Task API Tests

**Test 10: Create Task**
```
POST {{base_url}}/tasks
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "title": "Design homepage",
  "description": "Create high-fidelity mockups",
  "projectId": "{{projectId}}",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-02-15"
}

Expected Response: 201

Post-Test:
- Copy task _id
- Set {{taskId}} to this value
```

**Test 11: Get All Tasks**
```
GET {{base_url}}/tasks?page=1&status=todo&priority=high
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Design homepage",
      "status": "todo",
      "priority": "high"
    }
  ],
  "pagination": {...}
}
```

**Test 12: Get Tasks by Project**
```
GET {{base_url}}/tasks/project/{{projectId}}
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": [...]
}
```

**Test 13: Update Task**
```
PUT {{base_url}}/tasks/{{taskId}}
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "status": "in_progress",
  "priority": "medium"
}

Expected Response: 200
```

### Activity Log Tests

**Test 14: Get Activity Logs (Admin)**
```
GET {{base_url}}/activity-logs
Authorization: Bearer {{admin_token}}

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "userId": {...},
      "action": "create",
      "resourceType": "project",
      "resourceId": "{{projectId}}",
      "changes": {...},
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Test 15: Get User Activity**
```
GET {{base_url}}/activity-logs/user/my-activities
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": [...]
}
```

**Test 16: Get Resource Activity**
```
GET {{base_url}}/activity-logs/project/{{projectId}}
Authorization: Bearer {{token}}

Expected Response: 200
{
  "success": true,
  "data": [
    {
      "action": "create",
      "userId": {...},
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Error Scenario Tests

**Test 17: 401 Unauthorized (No Token)**
```
GET {{base_url}}/projects
[No Authorization header]

Expected Response: 401
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Access token is missing"
}
```

**Test 18: 403 Forbidden (Not Owner)**
```
PUT {{base_url}}/projects/other_user_project_id
Authorization: Bearer {{token}}

{
  "name": "Try to edit"
}

Expected Response: 403
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "Only project owner can update"
}
```

**Test 19: 404 Not Found**
```
GET {{base_url}}/projects/nonexistent_id
Authorization: Bearer {{token}}

Expected Response: 404
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Project not found"
}
```

**Test 20: 400 Bad Request (Missing Field)**
```
POST {{base_url}}/projects
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "description": "No name provided"
}

Expected Response: 400
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Project name is required"
}
```

---

## Frontend Testing

### Browser DevTools Testing

**Console Tab**
```javascript
// Check for errors
// Watch for: Uncaught errors, warnings, network issues

// Test Redux state
// In browser console:
// Note: Requires Redux DevTools extension

// Monitor API calls in Network tab
// Watch Request/Response headers
// Verify Authorization token present
```

**Network Tab**
```
Monitor all API calls:
- Verify endpoints called correctly
- Check request headers (Authorization)
- Verify response status codes
- Monitor response times
- Check payload size

Expected patterns:
- Login → returns tokens
- API calls → include Authorization header
- 401 response → automatic refresh attempt
- Refresh successful → retry original request
```

**Application Tab**
```
Check localStorage:
- auth token present after login
- user data stored
- localStorage cleared after logout

Check Cookies:
- CORS credentials sent
- HttpOnly cookies set (if used)
```

### React Component Testing

**Header Component**
```
Test: Show/Hide based on auth state
- Logged out: Show Login/Register links
- Logged in: Show username, role, logout button
- Admin: Show Admin link

Test: Logout functionality
- Click logout
- localStorage cleared
- Redirect to login
- Cannot access protected routes
```

**Protected Routes**
```
Test: ProtectedRoute behavior
- Logged out user → redirected to /login
- Logged in user → can access
- Regular user → cannot access /admin
- Admin user → can access /admin

Test: PublicRoute behavior
- Logged out user → can access
- Logged in user → redirected to /dashboard
```

**Form Validation**
```
Test: Register form
- Empty username → error shown
- Invalid email → error shown
- Passwords don't match → error shown
- Weak password → error shown
- Valid input → form submits

Test: Project creation
- Empty name → error shown
- Valid input → project created
- Redirect to projects list
- New project appears in list
```

---

## Performance Testing

### Load Testing

**Tools:** Apache JMeter, k6, Locust

**Example Test (k6)**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 },  // 1 minute ramp-up to 10 users
    { duration: '3m', target: 10 },  // 3 minutes at 10 users
    { duration: '1m', target: 0 },   // 1 minute ramp-down
  ],
};

export default function () {
  let response = http.get('http://localhost:3000/api/v1/projects', {
    headers: {
      'Authorization': 'Bearer ' + __ENV.TOKEN
    }
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

**Run:** `k6 run test.js`

### Metrics to Monitor
- Response time (< 500ms target)
- Throughput (requests/second)
- Error rate (< 1%)
- CPU usage (< 80%)
- Memory usage (< 500MB)
- Database query time (< 100ms)

### Frontend Performance

**Lighthouse Audit**
```
In Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Review scores for:
   - Performance (90+)
   - Accessibility (90+)
   - Best Practices (90+)
   - SEO (90+)
```

**Bundle Size**
```bash
cd frontend

# Analyze bundle
npm run build

# Check size
du -sh dist/

# Target: < 500KB total
# Assets: < 300KB JS, < 100KB CSS
```

---

## Security Testing

### OWASP Top 10 Testing

**1. SQL Injection**
```
Test: Enter SQL in search field
- Search: "' OR '1'='1"
- Expected: Treated as literal string (not executable)
- MongoDB uses parameterized queries: Safe
```

**2. Authentication Issues**
```
Test: Token manipulation
- Modify JWT token in localStorage
- Expected: Invalid token error
- Cannot access protected routes

Test: Token expiry
- Wait for token to expire (7 days)
- Make API call
- Expected: 401, auto-refresh
- If refresh fails: Logout and redirect to login
```

**3. Broken Authorization**
```
Test: Access Control
- User A tries to access User B's project
- User A tries to update User B's task
- Expected: 403 Forbidden errors
- Non-owners cannot modify others' resources
```

**4. Cross-Site Scripting (XSS)**
```
Test: Enter malicious scripts
- In project name: <script>alert('xss')</script>
- In task description: <img src=x onerror=alert('xss')>
- Expected: Rendered as text, not executed
- React escapes HTML by default: Safe
```

**5. CORS**
```
Test: Cross-origin requests
- Frontend at http://localhost:5173
- Backend at http://localhost:3000
- Expected: CORS headers allow frontend
- Verify CORS_ORIGIN whitelist

Test: Invalid origin
- Make request from different origin
- Expected: CORS policy blocks request
```

**6. Data Exposure**
```
Test: Sensitive data in response
- Login response should NOT include password
- Activity logs should NOT expose passwords
- Verify no secrets in logs

Test: HTTPS
- In production, all traffic encrypted
- Verify SSL certificate valid
```

**7. Rate Limiting**
```
Test: Brute force protection
- Make many login attempts quickly
- Expected: Blocked after N attempts
- Implementation: Future feature

Current state: No rate limiting
Recommendation: Add express-rate-limit
```

### Penetration Testing Checklist

- [ ] SQL Injection attempts - blocked
- [ ] XSS attacks - prevented
- [ ] CSRF attacks - prevented (JWT + CORS)
- [ ] Broken authentication - token validation
- [ ] Broken authorization - ownership checks
- [ ] Sensitive data - not exposed
- [ ] API key exposure - not in code
- [ ] Weak passwords - validation enforced
- [ ] Session hijacking - secure tokens
- [ ] Directory traversal - not applicable

---

## Automated Testing (Future)

### Unit Testing Example
```javascript
// tests/auth.test.js
import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';

describe('Auth Tests', () => {
  it('should hash password correctly', async () => {
    const password = 'Test@123';
    const hashed = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, hashed);
    expect(isMatch).toBe(true);
  });

  it('should not match wrong password', async () => {
    const password = 'Test@123';
    const wrongPassword = 'Wrong@123';
    const hashed = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(wrongPassword, hashed);
    expect(isMatch).toBe(false);
  });
});
```

### Integration Testing Example
```javascript
// tests/projects.integration.test.js
import request from 'supertest';
import app from '../src/app';

describe('Projects API', () => {
  let token;
  let projectId;

  beforeAll(async () => {
    // Login and get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test@123'
      });
    token = res.body.data.accessToken;
  });

  it('should create a project', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Test Description'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test Project');
    projectId = res.body.data._id;
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

### Setup Commands
```bash
# Backend tests
npm install --save-dev vitest supertest jest

# Frontend tests
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

---

## Test Reporting

### Sample Test Report Template

```
PROJECT MANAGEMENT API - TEST REPORT
Date: 2024-01-15
Tester: QA Team
Version Tested: v1.0.0

SUMMARY
=======
Total Test Cases: 60
Passed: 58
Failed: 2
Skipped: 0
Pass Rate: 96.7%

FAILED TESTS
============
1. TC-ERROR-002: Password Validation
   Issue: Special character requirement not enforced
   Severity: Medium
   Fix: Add regex validation to password field

2. TC-ADMIN-002: Activity Logs Admin Page
   Issue: Performance slow on large datasets
   Severity: Medium
   Fix: Implement pagination caching

ENVIRONMENT
===========
Backend: Running on http://localhost:3000
Frontend: Running on http://localhost:5173
Database: MongoDB local
Node Version: v18.0.0
Browser: Chrome 121.0

RECOMMENDATIONS
===============
1. Implement rate limiting on login attempts
2. Add automated UI tests (Cypress)
3. Performance optimization for activity logs
4. Email service testing
5. Load testing with 100+ concurrent users

Sign-off: [QA Lead] - Date: 2024-01-15
```

