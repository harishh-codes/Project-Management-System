# Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Login   │  │Dashboard │  │Projects  │  │  Tasks   │           │
│  │ Register │  │ Profile  │  │  CRUD    │  │  CRUD    │           │
│  │Forgot PW │  │  Admin   │  │  Search  │  │  Filter  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│         │            │             │            │                  │
│         └────────────┴─────────────┴────────────┘                  │
│                      │                                              │
│              Redux Store + Context                                 │
│              ┌─────────────────────┐                               │
│              │ Auth State          │                               │
│              │ - user              │                               │
│              │ - tokens            │                               │
│              │ - isAuthenticated   │                               │
│              └─────────────────────┘                               │
│                      │                                              │
│              Axios API Client                                      │
│              ┌─────────────────────┐                               │
│              │ Request Interceptor │ (Add Auth Token)              │
│              │ Response Interceptor│ (Handle 401)                  │
│              └─────────────────────┘                               │
└──────────────────────┬──────────────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────┴──────────────────────────────────────────────┐
│                    Backend (Express.js)                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                     Routes Layer                          │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │      │
│  │  │ Auth     │ │ Projects │ │  Tasks   │ │ Activity │   │      │
│  │  │ Router   │ │ Router   │ │ Router   │ │ Router   │   │      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │      │
│  └──────────────────────────────────────────────────────────┘      │
│                           │                                        │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                  Controllers Layer                        │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │      │
│  │  │ Auth     │ │ Project  │ │  Task    │ │ Activity │   │      │
│  │  │ Controller│ │ Controller│ │Controller│ │Controller│   │      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │      │
│  │  ┌──────────┐                                            │      │
│  │  │ User     │                                            │      │
│  │  │ Controller                                            │      │
│  │  └──────────┘                                            │      │
│  └──────────────────────────────────────────────────────────┘      │
│                           │                                        │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │               Middleware Layer                           │      │
│  │  ┌──────────────────┐  ┌──────────────────┐            │      │
│  │  │ Auth Middleware  │  │ Validator        │            │      │
│  │  │ - verifyJWT      │  │ Middleware       │            │      │
│  │  │ - verify User    │  │ - Validation     │            │      │
│  │  └──────────────────┘  └──────────────────┘            │      │
│  └──────────────────────────────────────────────────────────┘      │
│                           │                                        │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                  Models Layer                            │      │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐        │      │
│  │  │ User   │ │Project │ │  Task  │ │Activity  │        │      │
│  │  │ Schema │ │ Schema │ │ Schema │ │ Log      │        │      │
│  │  └────────┘ └────────┘ └────────┘ │ Schema   │        │      │
│  │                                    └──────────┘        │      │
│  └──────────────────────────────────────────────────────────┘      │
│                           │                                        │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │               Utilities & Services                       │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │      │
│  │  │ API Error│ │ API Resp │ │ Async    │              │      │
│  │  │ Handling │ │ Handling │ │ Handler  │              │      │
│  │  └──────────┘ └──────────┘ └──────────┘              │      │
│  │  ┌──────────────────────────────────────────────┐     │      │
│  │  │ Email Service (Nodemailer + Mailgen)        │     │      │
│  │  └──────────────────────────────────────────────┘     │      │
│  └──────────────────────────────────────────────────────────┘      │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │    MongoDB Database      │
        │ ┌──────────────────────┐ │
        │ │ Users Collection     │ │
        │ │ Projects Collection  │ │
        │ │ Tasks Collection     │ │
        │ │ ActivityLogs Coll.   │ │
        │ └──────────────────────┘ │
        └──────────────────────────┘
```

## Frontend Architecture

### Folder Structure
```
frontend/src/
├── api/
│   ├── client.js          # Axios instance with interceptors
│   └── index.js           # API endpoints exports
├── components/            # Reusable UI components
│   ├── Header.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Card.jsx
│   └── Pagination.jsx
├── pages/                 # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   ├── Tasks.jsx
│   ├── Profile.jsx
│   └── Admin.jsx
├── router/
│   └── ProtectedRoutes.jsx # Route guards
├── store/                 # Redux store
│   ├── store.js
│   └── authSlice.js
├── utils/
│   └── helpers.js         # Helper functions
├── App.jsx                # Main app component
└── main.jsx               # Entry point
```

### State Management Flow

```
User Action (Login/Register)
    ↓
API Call via axios
    ↓
Response received
    ↓
Redux Dispatch
    ↓
Update authSlice
    ↓
Store tokens in localStorage
    ↓
Component re-renders
    ↓
Protected Route checks auth state
    ↓
Navigate to Dashboard
```

## Backend Architecture

### Folder Structure
```
backend/src/
├── controllers/           # Business logic
│   ├── auth.controller.js
│   ├── project.controller.js
│   ├── task.controller.js
│   ├── user.controller.js
│   └── activityLog.controller.js
├── models/               # Mongoose schemas
│   ├── user.model.js
│   ├── project.model.js
│   ├── task.model.js
│   └── activityLog.model.js
├── routes/               # API routes
│   ├── auth.router.js
│   ├── project.router.js
│   ├── task.router.js
│   ├── user.router.js
│   └── activityLog.router.js
├── middlewares/
│   ├── auth.middleware.js      # JWT verification
│   └── validator.middleware.js # Input validation
├── utils/
│   ├── api-error.js      # Error handling
│   ├── api-response.js   # Response formatting
│   ├── async-handler.js  # Async wrapper
│   ├── mail.js           # Email service
│   └── constants.js      # Enums and constants
├── validators/
│   └── index.js          # Express validators
├── db/
│   └── index.js          # MongoDB connection
├── app.js                # Express app setup
└── index.js              # Server startup
```

## Request/Response Flow

### Authentication Flow
```
1. User submits login form
   ↓
2. Frontend calls POST /auth/login
   ↓
3. Backend receives request
   - Validates email format
   - Finds user in database
   - Compares password with bcrypt
   ↓
4. Generate tokens
   - accessToken (7 days validity)
   - refreshToken (30 days validity)
   ↓
5. Return tokens + user data
   ↓
6. Frontend stores tokens in localStorage
   ↓
7. Redux updates auth state
   ↓
8. Redirect to Dashboard
```

### Protected Route Access
```
1. User visits /dashboard
   ↓
2. React Router checks <ProtectedRoute>
   ↓
3. Redux selector checks isAuthenticated
   ↓
4. If false → Redirect to /login
   If true → Render component
   ↓
5. Component mounts
   ↓
6. Axios adds Authorization header with token
   ↓
7. Backend middleware verifies token
   ↓
8. If valid → Process request
   If invalid → Return 401
   ↓
9. Frontend interceptor catches 401
   ↓
10. Attempt to refresh token using refreshToken
    ↓
11. If refresh successful → Retry original request
    If refresh failed → Clear auth, redirect to login
```

### Project Creation Flow
```
1. User fills project form
   ↓
2. Frontend validates input
   ↓
3. Calls POST /api/v1/projects
   ↓
4. Request includes Authorization header
   ↓
5. Backend middleware verifies JWT
   ↓
6. Controller validates request body
   ↓
7. Create project document
   ↓
8. Add current user as project owner
   ↓
9. Log activity
   ↓
10. Populate user references
    ↓
11. Return created project
    ↓
12. Frontend updates local state
    ↓
13. Redirect to projects list
    ↓
14. Show success toast
```

## Database Schema Relationships

```
User (1) ──────┐
                │
                ├──> Project (1) ──────┐
                │   - owner: User      │
                │   - members: [User]  │
                │                      ├──> Task (N)
                │                      │   - assignee: User
                │                      │   - project: Project
                │                      │
                ├──────────────────────┘

ActivityLog (N)
  - userId: User
  - resourceId: Project/Task/User
  - resourceType: String
  - action: create/update/delete/archive
```

## Error Handling

```
Request comes to server
    ↓
Route matches
    ↓
Middleware runs
    ├─ Auth check
    └─ Validation
        ↓
    If error → throw ApiError
        ↓
    Error caught by asyncHandler
        ↓
    Pass to error middleware
        ↓
    Format error response
        ↓
    Return 4xx/5xx response
        ↓
Frontend receives error
    ↓
Axios interceptor catches error
    ↓
Toast notification shows error
```

## Security Architecture

```
Frontend Security:
├─ HTTPS communication
├─ Token stored in localStorage
├─ Protected Routes component
├─ Axios interceptor adds token
└─ Automatic token refresh

Backend Security:
├─ JWT verification middleware
├─ Password hashing with bcrypt
├─ CORS whitelist validation
├─ Input validation & sanitization
├─ Environment variable secrets
├─ Secure HTTP-only cookies
├─ Activity logging for audit trail
└─ Role-based access control
```

## Scalability Considerations

### Current Implementation
- Single MongoDB database
- Single Node.js server
- In-memory caching (none currently)
- Synchronous email sending

### Future Enhancements
- Redis for session/cache
- Message queue for emails (Bull, RabbitMQ)
- Microservices architecture
- Load balancer
- Database replication
- CDN for static assets
- API rate limiting
- WebSocket for real-time updates

## Technology Stack

### Frontend
- React 19 - UI library
- React Router - Navigation
- Redux Toolkit - State management
- Axios - HTTP client
- Tailwind CSS - Styling
- React Toastify - Notifications

### Backend
- Node.js - Runtime
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcrypt - Password hashing
- Nodemailer - Email
- Winston - Logging
- Express Validator - Input validation

### Infrastructure
- MongoDB Atlas (cloud) or local MongoDB
- Mailtrap (email in development)
- Environment-based configuration
