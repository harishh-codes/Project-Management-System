# Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

## Installation & Running

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Project-Management-API-with-Authentication-Node.js-Express-MongoDB-
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# At minimum, set:
# - MONGO_URI (MongoDB connection string)
# - ACCESS_TOKEN_SECRET (any string)
# - REFRESH_TOKEN_SECRET (any string)
```

**Example .env:**
```
MONGO_URI=mongodb://localhost:27017/projectmanagement
PORT=3000
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=my_super_secret_key_123
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=my_super_secret_refresh_key_123
REFRESH_TOKEN_EXPIRY=30d
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=587
MAILTRAP_SMTP_USER=your_email@mailtrap.io
MAILTRAP_SMTP_PASS=your_password
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/forgot-password
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

You should see:
```
Example app listening on port https://localhost:3000
MongoDB Connected
```

### Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default value should work if backend is on localhost:3000
```

**Example .env:**
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Start the frontend server:
```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api/v1

## Test the Application

### 1. Register a New User
- Go to http://localhost:5173/register
- Fill in:
  - Full Name: John Doe
  - Username: johndoe
  - Email: john@example.com
  - Password: password123
- Click "Sign Up"

### 2. Login
- Go to http://localhost:5173/login
- Use the email and password you registered
- Click "Sign In"

### 3. Create a Project
- After login, go to Dashboard
- Click "Create Project"
- Fill in project details
- Click "Create Project"

### 4. Create a Task
- Click "Create Task"
- Select the project you created
- Fill in task details
- Click "Create Task"

### 5. View Your Profile
- Click on your username in the header
- Click "View Profile"
- You can edit your profile and change password

### 6. Admin Panel (if you're admin)
- Click "Admin" in the header
- View all users and activity logs

## API Testing with Curl

### Test Health Check
```bash
curl http://localhost:3000/api/v1/healthcheck
```

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Project (with token)
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Get Projects
```bash
curl http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGO_URI in .env
- Default: `mongodb://localhost:27017/projectmanagement`

### CORS Error
- Make sure CORS_ORIGIN in backend .env includes your frontend URL
- Example: `http://localhost:5173`

### Token Expiration
- Access tokens expire after 7 days by default
- The app will automatically refresh using the refresh token
- If both expire, you'll need to login again

### Email Not Sending
- Get credentials from https://mailtrap.io/
- Update MAILTRAP settings in .env
- In development, you can ignore email errors

### Port Already in Use
- Backend default: 3000
- Frontend default: 5173
- Change PORT in .env (backend) or vite config (frontend)

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Make sure you ran `npm install`

### Issue: "MongoDB connection refused"
**Solution:** Start MongoDB service or update MONGO_URI

### Issue: Frontend can't connect to backend
**Solution:** Check VITE_API_BASE_URL in frontend .env

### Issue: Login not working
**Solution:** Clear browser localStorage and try again

### Issue: 401 Unauthorized
**Solution:** Your token might have expired, try logging out and in again

## Next Steps

1. Read the full [README.md](./README.md) for more details
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for all endpoints
3. Explore the codebase structure
4. Make your first project and task
5. Check the admin panel
6. Review activity logs

## Features to Try

- ✅ Register and login
- ✅ Create projects and invite members
- ✅ Create tasks within projects
- ✅ Update task status and priority
- ✅ View your profile and edit it
- ✅ Change password
- ✅ View activity logs
- ✅ Search and filter projects/tasks
- ✅ Pagination
- ✅ Logout

## Need Help?

- Check the documentation files
- Review the API endpoints
- Look at the example code
- Check browser console for errors
- Check backend logs for issues

Enjoy using Project Manager! 🚀
