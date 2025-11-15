# Project Management API with Authentication

A full-stack project management application built with Node.js, Express, MongoDB, and React + Vite.

## Features

### Backend
- ✅ User Authentication (Register, Login, Logout)
- ✅ JWT-based Authorization
- ✅ Email Verification
- ✅ Password Reset
- ✅ Project Management (CRUD)
- ✅ Task Management (CRUD)
- ✅ Project Members Management
- ✅ Activity Logging
- ✅ Pagination & Search Filters
- ✅ Role-based Access Control (Admin, User)
- ✅ Soft Delete / Archive Feature
- ✅ Error Handling & Validation

### Frontend
- ✅ React 19 with Vite
- ✅ React Router for Navigation
- ✅ Redux Toolkit for State Management
- ✅ Axios with Interceptors
- ✅ Tailwind CSS for Styling
- ✅ Authentication Pages (Login, Register, Forgot Password)
- ✅ Protected Routes
- ✅ Dashboard
- ✅ Projects CRUD
- ✅ Tasks CRUD
- ✅ User Profile Management
- ✅ Admin Panel
- ✅ Activity Logs Viewer
- ✅ Toast Notifications
- ✅ Pagination UI
- ✅ Search & Filters

## Project Structure

```
Project-Management-API-with-Authentication-Node.js-Express-MongoDB-/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── activityLog.controller.js
│   │   │   └── healthcheck.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── project.model.js
│   │   │   ├── task.model.js
│   │   │   └── activityLog.model.js
│   │   ├── routes/
│   │   │   ├── auth.router.js
│   │   │   ├── project.router.js
│   │   │   ├── task.router.js
│   │   │   ├── user.router.js
│   │   │   ├── activityLog.router.js
│   │   │   └── healthcheck.router.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── validator.middleware.js
│   │   ├── utils/
│   │   │   ├── api-error.js
│   │   │   ├── api-response.js
│   │   │   ├── async-handler.js
│   │   │   ├── mail.js
│   │   │   └── constants.js
│   │   ├── validators/
│   │   │   └── index.js
│   │   └── db/
│   │       └── index.js
│   ├── logger.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── App.css
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── index.js
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Pagination.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── NotFound.jsx
│   │   ├── router/
│   │   │   └── ProtectedRoutes.jsx
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── authSlice.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── context/
│   │   ├── hooks/
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   └── eslint.config.js
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   Fill in your MongoDB URI and other configuration values.

3. **Start the Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/current-user` - Get current user
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/resend-email-verification` - Resend verification email

### Projects
- `GET /api/v1/projects` - Get all projects (with pagination & search)
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:projectId` - Get project details
- `PUT /api/v1/projects/:projectId` - Update project
- `DELETE /api/v1/projects/:projectId` - Archive project
- `POST /api/v1/projects/:projectId/members` - Add project member
- `DELETE /api/v1/projects/:projectId/members/:userId` - Remove project member

### Tasks
- `GET /api/v1/tasks` - Get all tasks (with pagination, search & filters)
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:taskId` - Get task details
- `PUT /api/v1/tasks/:taskId` - Update task
- `DELETE /api/v1/tasks/:taskId` - Archive task
- `GET /api/v1/tasks/project/:projectId` - Get tasks by project

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:userId` - Get user details
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/avatar` - Update user avatar

### Activity Logs
- `GET /api/v1/activity-logs` - Get all activity logs (admin only)
- `GET /api/v1/activity-logs/:resourceType/:resourceId` - Get activity for resource
- `GET /api/v1/activity-logs/user/my-activities` - Get user's own activities

### Health Check
- `GET /api/v1/healthcheck` - Server health check

## Request/Response Examples

### Register
**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**
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
  "message": "User registered successfully and verification email has been sent on your email",
  "success": true
}
```

### Login
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
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

### Create Project
**Request:**
```json
{
  "name": "My Project",
  "description": "Project description"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "name": "My Project",
    "description": "Project description",
    "owner": { ... },
    "members": [ ... ],
    "isArchived": false
  },
  "message": "Project created successfully",
  "success": true
}
```

## Authentication Flow

1. User registers with email, username, password
2. Verification email is sent
3. User clicks verification link
4. User can now login with email and password
5. On login, access token and refresh token are issued
6. Access token is stored in localStorage and sent with each request
7. When access token expires, refresh token is used to get a new one
8. Axios interceptor handles token refresh automatically

## Features Explained

### Pagination
All list endpoints support pagination:
- `page` - Current page (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Search
Projects and tasks support search:
- `search` - Search term

### Filters
Tasks support filtering by:
- `status` - todo, in_progress, done
- `priority` - low, medium, high

Projects support filtering by:
- `status` - active, paused, completed

### Soft Delete
Projects and Tasks use soft delete (archive):
- Archived items are not deleted from database
- `isArchived` field marks them as archived
- Can be restored by updating the project/task

### Activity Logging
All CRUD operations are logged with:
- User who performed action
- Action type (create, update, delete, archive)
- Resource type and ID
- Changes made (before and after)
- Timestamp

### Role-based Access Control
- **User**: Can create projects, invite members
- **Admin**: Can view all users and activity logs

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/projectmanagement
PORT=3000
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_secret_key
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=587
MAILTRAP_SMTP_USER=your_user
MAILTRAP_SMTP_PASS=your_password
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/forgot-password
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Mailgen
- Winston Logger

### Frontend
- React 19
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- React Toastify

## Validation

### User Registration
- Email must be valid
- Username must be at least 3 characters
- Password must be at least 6 characters (recommended: stronger)

### Project
- Name is required

### Task
- Title is required
- Project ID is required
- Status: todo, in_progress, done
- Priority: low, medium, high

## Error Handling

All endpoints return consistent error responses:
```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Token refresh mechanism
- ✅ CORS enabled
- ✅ Input validation
- ✅ Secure HTTP-only cookies
- ✅ Activity logging for audit trail
- ✅ Role-based access control

## Future Enhancements

- [ ] Email notification system
- [ ] Real-time notifications using WebSockets
- [ ] File upload for projects
- [ ] Team/Workspace feature
- [ ] Advanced reporting
- [ ] Analytics dashboard
- [ ] Export to PDF/Excel
- [ ] Calendar view
- [ ] Kanban board view
- [ ] Mobile app
- [ ] Unit tests
- [ ] Integration tests

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For support, email contact@example.com or create an issue on GitHub.
