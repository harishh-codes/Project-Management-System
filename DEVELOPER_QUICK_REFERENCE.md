# 🚀 Developer Quick Reference Card

## Start Here - 3 Commands to Run

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Open: http://localhost:5173
```

---

## 📋 First 5 Minutes Checklist

- [ ] Read PROJECT_COMPLETION_SUMMARY.md (2 min)
- [ ] Follow QUICK_START.md (15 min)
- [ ] Test login/registration (2 min)
- [ ] Create a project (1 min)

---

## 🔗 Documentation Quick Links

| What I need | Where | Time |
|-----------|-------|------|
| Setup locally | QUICK_START.md | 15 min |
| Understand project | README.md | 5 min |
| Find an endpoint | API_DOCUMENTATION.md | varies |
| Understand code | ARCHITECTURE.md | 10 min |
| Learn features | FEATURES_GUIDE.md | varies |
| Deploy to production | DEPLOYMENT_GUIDE.md | 30 min |
| Test everything | TESTING_GUIDE.md | varies |

---

## 🏗️ Project Structure at a Glance

```
backend/
├── controllers/ → Business logic
├── models/ → Database schemas
├── routes/ → API endpoints
├── middlewares/ → Auth, validation
└── utils/ → Helper functions

frontend/
├── pages/ → Page components
├── components/ → Reusable UI
├── api/ → API client
├── store/ → Redux state
└── router/ → Route guards
```

---

## 🔑 Key Features Quick Summary

### Authentication
- Register, Login, Logout
- Password Reset, Token Refresh
- JWT with auto-refresh
- Role-based access (user/admin)

### Projects
- Create, Read, Update, Delete
- Add/Remove Members
- Search, Paginate
- Soft delete

### Tasks
- Create, Read, Update, Delete
- Filter by status/priority
- Assign to users
- Soft delete

### Admin
- View all users
- View all activities
- User statistics

---

## 📡 Main Endpoints

### Auth (6)
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
```

### Projects (8)
```
POST   /projects
GET    /projects?page=1&limit=10&search=name
GET    /projects/:id
PUT    /projects/:id
DELETE /projects/:id
POST   /projects/:id/members
DELETE /projects/:id/members/:userId
GET    /projects/:id/tasks
```

### Tasks (6)
```
POST   /tasks
GET    /tasks?status=todo&priority=high
GET    /tasks/:id
PUT    /tasks/:id
DELETE /tasks/:id
GET    /tasks/project/:projectId
```

### Users (4)
```
GET    /users (admin)
GET    /users/:id (admin)
PUT    /users/profile
POST   /users/change-password
```

### Activity Logs (3)
```
GET    /activity-logs (admin)
GET    /activity-logs/user/my-activities
GET    /activity-logs/:resourceType/:resourceId
```

---

## 🔍 Finding Files

| What I need | File location |
|-----------|----------------|
| Login logic | `backend/src/controllers/auth.controller.js` |
| Login page | `frontend/src/pages/Login.jsx` |
| Project API | `backend/src/routes/project.router.js` |
| Project page | `frontend/src/pages/Projects.jsx` |
| Task API | `backend/src/routes/task.router.js` |
| Task page | `frontend/src/pages/Tasks.jsx` |
| Database models | `backend/src/models/` |
| API client | `frontend/src/api/` |
| Redux store | `frontend/src/store/` |

---

## ⚙️ Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/projectmanagement
PORT=3000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 🧪 Testing Quick Commands

```bash
# Manual testing
# 1. Open http://localhost:5173
# 2. Register new user
# 3. Login with credentials
# 4. Create project
# 5. Create task
# 6. Check admin panel

# Postman testing
# Import collection from API_DOCUMENTATION.md
# Run endpoints one by one
# Check responses and errors

# Browser testing
# F12 → Console: Check for errors
# F12 → Network: Check API calls
# F12 → Application: Check localStorage
```

---

## 🐛 Common Issues & Fixes

### "Cannot connect to MongoDB"
```
✓ Check MongoDB is running: mongosh
✓ Verify MONGO_URI in .env
✓ Check connection string format
```

### "Port 3000 already in use"
```
✓ Find process: netstat -ano | findstr :3000 (Windows)
✓ Kill process: taskkill /PID <pid> /F
✓ Or use different port: PORT=3001 npm run dev
```

### "CORS error"
```
✓ Check CORS_ORIGIN matches frontend URL
✓ Restart backend after changing .env
✓ Check for typos in CORS_ORIGIN
```

### "Token expired/invalid"
```
✓ Clear localStorage: F12 → Application → Clear
✓ Login again to get new token
✓ Check JWT_SECRET matches
```

### "API not responding"
```
✓ Check backend is running: npm run dev
✓ Check API base URL in frontend .env
✓ Check network tab (F12) for 404/500 errors
✓ Check backend logs in backend/logs/
```

---

## 📚 Code Patterns

### Backend Controller Pattern
```javascript
// backend/src/controllers/example.controller.js
export const exampleFunction = asyncHandler(async (req, res) => {
  try {
    // Validate input
    // Query database
    // Check permissions
    // Log activity
    // Return response
    return res.status(200).json(
      new ApiResponse(200, data, "Success message")
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});
```

### Frontend Page Pattern
```javascript
// frontend/src/pages/ExamplePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exampleAPI } from '../api';
import { showError, showSuccess } from '../utils/helpers';

export default function ExamplePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await exampleAPI.getAll();
      setData(response.data);
    } catch (error) {
      showError(error.response?.data?.message || 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* JSX here */}
    </div>
  );
}
```

### API Client Pattern
```javascript
// frontend/src/api/index.js
export const exampleAPI = {
  getAll: () => client.get('/example'),
  getById: (id) => client.get(`/example/${id}`),
  create: (data) => client.post('/example', data),
  update: (id, data) => client.put(`/example/${id}`, data),
  delete: (id) => client.delete(`/example/${id}`),
};
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT secrets to strong random values
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for production
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS for production domain only
- [ ] Set up email service (SendGrid, not Mailtrap)
- [ ] Enable database backups
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Enable rate limiting (future feature)
- [ ] Review all endpoints for authorization

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  },
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "statusCode": 400
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...items],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 🧩 Component API Reference

### Header Component
```jsx
<Header /> // Shows user info, logout, nav links
```

### Button Component
```jsx
<Button 
  variant="primary" // primary, secondary, danger, warning, outline, ghost
  size="md" // sm, md, lg
  loading={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

### Input Component
```jsx
<Input 
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Pagination Component
```jsx
<Pagination 
  currentPage={1}
  totalPages={5}
  onPageChange={(page) => handlePageChange(page)}
/>
```

### Card Component
```jsx
<Card>
  {/* Content here */}
</Card>
```

### Modal Component
```jsx
<Modal 
  isOpen={isOpen}
  title="Dialog Title"
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
>
  {/* Content here */}
</Modal>
```

---

## 🚀 Deployment Quick Steps

### To Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=<atlas_uri>
heroku config:set ACCESS_TOKEN_SECRET=<secret>
git push heroku main
```

### To DigitalOcean
```bash
# SSH to droplet
# Install Node.js and MongoDB
# Clone repo
# Configure .env
# pm2 start src/index.js
# Configure Nginx
# Enable SSL with Certbot
```

### To AWS
```bash
# Launch EC2 instance
# Install Node.js and MongoDB
# Clone repo
# Configure .env
# Start with PM2
# Or use Elastic Beanstalk
```

---

## 📝 Common Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm test              # Run tests

# Database
mongosh               # Open MongoDB shell
show dbs              # List databases
use projectmanagement # Switch database
db.users.find()       # Find documents

# Git
git status            # Check status
git add .             # Stage changes
git commit -m "msg"   # Commit
git push              # Push to remote

# Deployment
pm2 start src/index.js # Start with PM2
pm2 restart all        # Restart all apps
pm2 logs              # View logs
pm2 stop all          # Stop all apps
```

---

## 🎯 Development Workflow

```
1. Create Feature Branch
   git checkout -b feature/feature-name

2. Implement Feature
   - Backend: Add model, controller, routes
   - Frontend: Add page/component, API client
   - Test: Follow TESTING_GUIDE.md

3. Test Locally
   - Manual testing
   - API testing with Postman
   - Browser DevTools checking

4. Commit Code
   git add .
   git commit -m "feat: add feature description"

5. Push & Deploy
   git push origin feature/feature-name
   # Create pull request
   # Review and merge
   # Deploy to production
```

---

## 📚 Learning Resources

| Topic | Resource | Time |
|-------|----------|------|
| Node.js/Express | https://expressjs.com | varies |
| MongoDB/Mongoose | https://mongoosejs.com | varies |
| React | https://react.dev | varies |
| Redux Toolkit | https://redux-toolkit.js.org | varies |
| Tailwind CSS | https://tailwindcss.com | varies |
| JWT Auth | Auth0 docs | varies |

---

## 🆘 Getting Help

### Step 1: Check Docs
- Find relevant doc from DOCUMENTATION_INDEX.md
- Search (Ctrl+F) for keyword
- Read examples

### Step 2: Check Code
- Find similar feature in codebase
- Look at existing patterns
- Check comments

### Step 3: Debug
- Check console errors (F12)
- Check network requests (F12)
- Check backend logs (backend/logs/)
- Check .env configuration

### Step 4: Test
- Follow TESTING_GUIDE.md
- Run test case that matches issue
- Isolate the problem

---

## ✅ Ready Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB setup (local or Atlas)
- [ ] Project cloned/downloaded
- [ ] npm install run in both folders
- [ ] .env files created and configured
- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create project
- [ ] Can create task
- [ ] Read DOCUMENTATION_INDEX.md

**All checked? You're ready to go! 🎉**

---

## 📞 Quick Support Links

- **Setup Issues:** QUICK_START.md → Troubleshooting
- **API Issues:** API_DOCUMENTATION.md → Error Codes
- **Code Issues:** ARCHITECTURE.md → Relevant Diagram
- **Deployment:** DEPLOYMENT_GUIDE.md → Your Platform
- **Testing:** TESTING_GUIDE.md → Relevant Test Case
- **Features:** FEATURES_GUIDE.md → Feature Name
- **Everything:** DOCUMENTATION_INDEX.md

---

## 🎓 30-Minute Onboarding Plan

1. **Minutes 0-5:** Read this card
2. **Minutes 5-15:** Follow QUICK_START.md
3. **Minutes 15-20:** Test login/create project
4. **Minutes 20-25:** Read README.md
5. **Minutes 25-30:** Explore codebase with ARCHITECTURE.md

**After 30 minutes:** You'll understand the entire project!

---

**Version:** 1.0  
**Last Updated:** January 2024  
**Status:** Production Ready ✅

