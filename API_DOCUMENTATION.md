# API Documentation

## Base URL
`http://localhost:3000/api/v1`

## Authentication Headers
```
Authorization: Bearer <accessToken>
```

---

## 1. Authentication Endpoints

### Register User
- **Method:** POST
- **Endpoint:** `/auth/register`
- **Auth:** Not required
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe" (optional)
  }
  ```
- **Response:** 201 Created
  ```json
  {
    "statusCode": 201,
    "data": {
      "user": {
        "_id": "...",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "isEmailVerified": false
      }
    },
    "message": "User registered successfully...",
    "success": true
  }
  ```

### Login User
- **Method:** POST
- **Endpoint:** `/auth/login`
- **Auth:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** 200 OK
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": { ... },
      "accessToken": "...",
      "refreshToken": "..."
    },
    "message": "User logged in successfully",
    "success": true
  }
  ```

### Logout User
- **Method:** POST
- **Endpoint:** `/auth/logout`
- **Auth:** Required
- **Response:** 200 OK

### Get Current User
- **Method:** POST
- **Endpoint:** `/auth/current-user`
- **Auth:** Required
- **Response:** 200 OK

### Refresh Token
- **Method:** POST
- **Endpoint:** `/auth/refresh-token`
- **Auth:** Not required
- **Request Body:**
  ```json
  {
    "refreshToken": "..."
  }
  ```
- **Response:** 200 OK

### Verify Email
- **Method:** GET
- **Endpoint:** `/auth/verify-email/:verificationToken`
- **Auth:** Not required
- **Response:** 200 OK

### Resend Email Verification
- **Method:** POST
- **Endpoint:** `/auth/resend-email-verification`
- **Auth:** Required
- **Response:** 200 OK

### Forgot Password Request
- **Method:** POST
- **Endpoint:** `/auth/forgot-password`
- **Auth:** Not required
- **Request Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:** 200 OK

### Reset Password
- **Method:** POST
- **Endpoint:** `/auth/reset-password/:resetToken`
- **Auth:** Not required
- **Request Body:**
  ```json
  {
    "newPassword": "newpassword123",
    "confirmNewPassword": "newpassword123"
  }
  ```
- **Response:** 200 OK

### Change Password
- **Method:** POST
- **Endpoint:** `/auth/change-password`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "oldPassword": "currentpassword123",
    "newPassword": "newpassword123"
  }
  ```
- **Response:** 200 OK

---

## 2. Projects Endpoints

### Get All Projects
- **Method:** GET
- **Endpoint:** `/projects`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `search` (optional)
  - `status` (optional: active, paused, completed)
- **Response:** 200 OK
  ```json
  {
    "statusCode": 200,
    "data": {
      "projects": [ ... ],
      "pagination": {
        "total": 10,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    },
    "message": "Projects fetched successfully",
    "success": true
  }
  ```

### Create Project
- **Method:** POST
- **Endpoint:** `/projects`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "name": "My Project",
    "description": "Project description" (optional)
  }
  ```
- **Response:** 201 Created

### Get Project by ID
- **Method:** GET
- **Endpoint:** `/projects/:projectId`
- **Auth:** Required
- **Response:** 200 OK

### Update Project
- **Method:** PUT
- **Endpoint:** `/projects/:projectId`
- **Auth:** Required (Owner only)
- **Request Body:**
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "paused"
  }
  ```
- **Response:** 200 OK

### Delete Project (Soft Delete)
- **Method:** DELETE
- **Endpoint:** `/projects/:projectId`
- **Auth:** Required (Owner only)
- **Response:** 200 OK

### Add Project Member
- **Method:** POST
- **Endpoint:** `/projects/:projectId/members`
- **Auth:** Required (Owner only)
- **Request Body:**
  ```json
  {
    "userId": "...",
    "role": "viewer" (viewer, editor, admin)
  }
  ```
- **Response:** 200 OK

### Remove Project Member
- **Method:** DELETE
- **Endpoint:** `/projects/:projectId/members/:userId`
- **Auth:** Required (Owner only)
- **Response:** 200 OK

---

## 3. Tasks Endpoints

### Get All Tasks
- **Method:** GET
- **Endpoint:** `/tasks`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `search` (optional)
  - `status` (optional: todo, in_progress, done)
  - `priority` (optional: low, medium, high)
- **Response:** 200 OK

### Create Task
- **Method:** POST
- **Endpoint:** `/tasks`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "project": "projectId",
    "assignee": "userId" (optional),
    "status": "todo" (optional),
    "priority": "medium" (optional),
    "dueDate": "2024-12-31" (optional),
    "tags": ["tag1", "tag2"] (optional)
  }
  ```
- **Response:** 201 Created

### Get Task by ID
- **Method:** GET
- **Endpoint:** `/tasks/:taskId`
- **Auth:** Required
- **Response:** 200 OK

### Update Task
- **Method:** PUT
- **Endpoint:** `/tasks/:taskId`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "status": "in_progress",
    "priority": "high",
    "assignee": "userId"
  }
  ```
- **Response:** 200 OK

### Delete Task (Soft Delete)
- **Method:** DELETE
- **Endpoint:** `/tasks/:taskId`
- **Auth:** Required
- **Response:** 200 OK

### Get Tasks by Project
- **Method:** GET
- **Endpoint:** `/tasks/project/:projectId`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `status` (optional)
- **Response:** 200 OK

---

## 4. Users Endpoints

### Get All Users (Admin Only)
- **Method:** GET
- **Endpoint:** `/users`
- **Auth:** Required (Admin only)
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `search` (optional)
- **Response:** 200 OK

### Get User by ID
- **Method:** GET
- **Endpoint:** `/users/:userId`
- **Auth:** Required
- **Response:** 200 OK

### Update User Profile
- **Method:** PUT
- **Endpoint:** `/users/profile`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "fullName": "John Doe"
  }
  ```
- **Response:** 200 OK

### Update User Avatar
- **Method:** POST
- **Endpoint:** `/users/avatar`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```
- **Response:** 200 OK

---

## 5. Activity Logs Endpoints

### Get All Activity Logs (Admin Only)
- **Method:** GET
- **Endpoint:** `/activity-logs`
- **Auth:** Required (Admin only)
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
  - `resourceType` (optional: project, task, user)
  - `userId` (optional)
- **Response:** 200 OK

### Get Activity Logs for Resource
- **Method:** GET
- **Endpoint:** `/activity-logs/:resourceType/:resourceId`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response:** 200 OK

### Get User's Own Activities
- **Method:** GET
- **Endpoint:** `/activity-logs/user/my-activities`
- **Auth:** Required
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response:** 200 OK

---

## 6. Health Check

### Server Health Check
- **Method:** GET
- **Endpoint:** `/healthcheck`
- **Auth:** Not required
- **Response:** 200 OK
  ```json
  {
    "statusCode": 200,
    "data": {
      "message": "Server is running"
    },
    "success": true
  }
  ```

---

## Error Response Format

All errors follow this format:
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

Not currently implemented. Future versions may include rate limiting.

---

## Pagination

All list endpoints support pagination:
```
GET /projects?page=1&limit=10
```

Response includes pagination info:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Search & Filters

### Search
```
GET /projects?search=keyword
GET /tasks?search=keyword
```

### Filters
```
GET /tasks?status=todo&priority=high
GET /projects?status=active
```

---

## Soft Delete

Deleted items are archived, not permanently removed.
Query shows only non-archived items by default.

To retrieve archived items, you would need a separate endpoint (future enhancement).
