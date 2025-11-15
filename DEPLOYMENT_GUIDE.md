# Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Building for Production](#building-for-production)
5. [Deployment Platforms](#deployment-platforms)
6. [Security Checklist](#security-checklist)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v18 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm** (v9 or higher)
  - Check: `npm --version`
  - Usually installed with Node.js

- **MongoDB** (v5 or higher)
  - Local: https://www.mongodb.com/try/download/community
  - Cloud: MongoDB Atlas (recommended for production)

- **Git** (optional but recommended)
  - Download: https://git-scm.com/

### Recommended Tools
- **Postman** - API testing
- **VS Code** - Code editor
- **MongoDB Compass** - Database management
- **Mailtrap** - Email testing

---

## Local Development Setup

### Step 1: Clone or Download Project
```bash
# If using git
git clone <repository-url>
cd Project-Management-API-with-Authentication-Node.js-Express-MongoDB-

# Or manually download and extract
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

**Expected packages:**
- express, mongoose, bcrypt, jsonwebtoken
- express-validator, nodemailer, mailgen
- cors, cookie-parser, morgan, winston
- dotenv

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

**Expected packages:**
- react, react-dom, react-router-dom
- axios, @reduxjs/toolkit, react-redux
- react-toastify, tailwindcss, postcss

### Step 4: Configure MongoDB

**Option A: Local MongoDB**
```bash
# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and select "Run MongoDB as a Windows Service"
# MongoDB will be available at mongodb://localhost:27017

# Mac (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
curl https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 free tier)
4. Create database user (username/password)
5. Get connection string
6. Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/projectmanagement?retryWrites=true&w=majority`

### Step 5: Configure Environment Variables

**Backend (.env)**
```bash
cd backend
# Create .env file
cp .env.example .env

# Edit .env with your values:
# - MONGO_URI
# - JWT_SECRET_KEY
# - REFRESH_TOKEN_SECRET
# - Mailtrap credentials
# - CORS_ORIGIN
```

**Frontend (.env)**
```bash
cd ../frontend
# Create .env file
cp .env.example .env

# Edit .env:
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Step 6: Start Development Servers

**Terminal 1: Backend**
```bash
cd backend
npm run dev
# Expected output:
# Server running on port 3000
# MongoDB connected
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
# Expected output:
# VITE v7.0.0 ready in 234 ms
# Local: http://localhost:5173
```

### Step 7: Test the Application
1. Open browser: http://localhost:5173
2. Click "Register"
3. Create test account
4. Login
5. Create a project
6. Create a task
7. Check Admin panel

---

## Environment Configuration

### Backend (.env)

```properties
# Database
MONGO_URI=mongodb://localhost:27017/projectmanagement
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/projectmanagement

# Server
PORT=3000
NODE_ENV=development  # development, staging, production

# JWT Secrets (use strong random values)
ACCESS_TOKEN_SECRET=your_strong_random_secret_key_here_min_32_chars
REFRESH_TOKEN_SECRET=your_strong_random_secret_key_here_min_32_chars
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://yourdomain.com

# Email (Mailtrap)
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=465
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASSWORD=your_mailtrap_password
MAILTRAP_FROM_EMAIL=noreply@projectmanagement.com
MAILTRAP_FROM_NAME=Project Management

# Redirects
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
EMAIL_VERIFICATION_REDIRECT_URL=http://localhost:5173/verify-email
```

### Frontend (.env)

```properties
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Production Environment Variables

**Backend:**
```properties
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/projectmanagement
ACCESS_TOKEN_SECRET=<generate_strong_key>
REFRESH_TOKEN_SECRET=<generate_strong_key>
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
MAILTRAP_SMTP_USER=<your_mailtrap_user>
MAILTRAP_SMTP_PASSWORD=<your_mailtrap_password>
MAILTRAP_FROM_EMAIL=noreply@yourdomain.com
```

**Frontend:**
```properties
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## Building for Production

### Backend Production Build

**No build step required for Node.js**
```bash
cd backend

# Install production dependencies only
npm install --production

# Verify it runs
npm start
# or
node src/index.js
```

**Optimization:**
```bash
# Set NODE_ENV to production
export NODE_ENV=production  # Linux/Mac
set NODE_ENV=production     # Windows PowerShell

# Start server
npm start
```

### Frontend Production Build

```bash
cd frontend

# Build production bundle
npm run build

# Output in: frontend/dist/
# Contains optimized HTML, CSS, JS

# Test production build locally
npm run preview
# Visit http://localhost:4173
```

**What gets generated:**
- Minified JavaScript (browser cache-friendly)
- Optimized CSS (only used styles)
- Chunked assets (lazy loading ready)
- Source maps (optional, for debugging)

---

## Deployment Platforms

### Option 1: Heroku (Easiest for Beginners)

**Prerequisites:**
- Heroku account (heroku.com)
- Heroku CLI installed

**Deployment Steps:**

**Step 1: Create Heroku App**
```bash
heroku login
heroku create your-app-name
```

**Step 2: Add MongoDB Atlas**
```bash
# In Heroku Dashboard:
# Settings → Add-ons → Heroku Postgres
# OR use MongoDB Atlas (recommended)
# Copy connection string and set as config variable:
heroku config:set MONGO_URI=<your_mongodb_atlas_uri>
```

**Step 3: Set Environment Variables**
```bash
heroku config:set ACCESS_TOKEN_SECRET=<your_secret>
heroku config:set REFRESH_TOKEN_SECRET=<your_secret>
heroku config:set MAILTRAP_SMTP_USER=<your_email>
heroku config:set MAILTRAP_SMTP_PASSWORD=<your_password>
```

**Step 4: Deploy**
```bash
git push heroku main
# or
heroku deploy --jar target/application.jar
```

**Step 5: View Logs**
```bash
heroku logs --tail
```

**Pros:**
- Easy setup
- Automatic scaling
- HTTPS included
- Simple database integration

**Cons:**
- Monthly cost ($7+)
- Slower for high-traffic apps
- Limited customization

---

### Option 2: AWS (Scalable)

**Backend Deployment:**

**Using EC2:**
1. Launch EC2 instance (t3.micro free tier)
2. Install Node.js and MongoDB or use RDS
3. Clone code
4. Install dependencies
5. Set environment variables
6. Start with PM2 process manager
7. Use Nginx as reverse proxy

```bash
# On EC2 instance
sudo apt update && sudo apt install -y nodejs npm git

git clone <your-repo>
cd backend
npm install
npm start

# Use PM2 for persistence
npm install -g pm2
pm2 start src/index.js --name "pm-api"
pm2 startup
pm2 save
```

**Using Elastic Beanstalk:**
1. Install EB CLI
2. Deploy with: `eb init` → `eb create` → `eb deploy`
3. Configure environment variables in EB console

**Frontend Deployment:**

**Using S3 + CloudFront:**
```bash
cd frontend
npm run build

# Upload dist/ to S3 bucket
# Set S3 bucket as public
# Create CloudFront distribution pointing to S3
# Result: Fast global CDN for React app
```

**Pros:**
- Highly scalable
- Pay-as-you-go
- Enterprise-grade
- Global reach with CloudFront

**Cons:**
- Steep learning curve
- More complex setup
- Potential high costs if not optimized

---

### Option 3: DigitalOcean (Good Balance)

**Droplet Deployment:**

```bash
# 1. Create Droplet ($6-12/month)
# 2. SSH into droplet
ssh root@your_droplet_ip

# 3. Install software
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb-org nginx

# 4. Clone and setup project
git clone <your-repo>
cd backend && npm install

# 5. Configure Nginx
# Create /etc/nginx/sites-available/default
upstream nodeapp {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://nodeapp;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}

# 6. Start services
sudo systemctl start mongodb
sudo systemctl start nginx
pm2 start src/index.js --name "pm-api"

# 7. Enable HTTPS with Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certify your-domain.com
```

**Frontend on DigitalOcean:**
```bash
# Build frontend
npm run build

# Copy dist to /var/www/html
# Nginx automatically serves static files
```

**Pros:**
- Affordable
- Simple setup
- Good documentation
- App Platform (similar to Heroku)

**Cons:**
- Less auto-scaling
- Manual server management

---

### Option 4: Vercel (Frontend Only)

Best for frontend deployment.

```bash
npm install -g vercel
cd frontend
vercel

# Configure with:
# - Framework Preset: Vite
# - Build Command: npm run build
# - Output Directory: dist
```

**Pros:**
- Instant deployment
- Auto-scaling
- Free for frontend
- Instant rollback

---

## Security Checklist

### Before Deploying

- [ ] **JWT Secrets**
  - [ ] Generate strong random secrets (min 32 characters)
  - [ ] Use different secrets for dev and prod
  - [ ] Never commit secrets to git

- [ ] **Database**
  - [ ] Enable MongoDB authentication
  - [ ] Create strong database password
  - [ ] Use MongoDB Atlas IP whitelist
  - [ ] Enable encryption at rest (Atlas M10+)
  - [ ] Regular backups configured

- [ ] **CORS**
  - [ ] Only allow your domain
  - [ ] Remove localhost from production
  - [ ] Verify CORS_ORIGIN matches frontend URL

- [ ] **API Security**
  - [ ] Enable rate limiting (future feature)
  - [ ] Validate all inputs
  - [ ] Use HTTPS only (SSL certificate)
  - [ ] Set secure HTTP headers

- [ ] **Email**
  - [ ] Use production email service (not Mailtrap)
  - [ ] Verify sender domain
  - [ ] Enable SPF, DKIM, DMARC

- [ ] **Frontend**
  - [ ] Remove console.logs in production
  - [ ] Disable source maps in production
  - [ ] Set CSP headers
  - [ ] Enable HTTPS redirect

### Production Environment

```bash
# Backend
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
# Use strong JWT secrets
# Use production MongoDB
# Use production email service

# Frontend
# Update API base URL to production domain
# Remove debug code
# Enable optimizations
```

---

## Monitoring & Logs

### Backend Logging

**Files location:**
```
backend/logs/
├── combined.log      # All logs
└── error.log         # Error logs only
```

**View logs:**
```bash
# Real-time logs
tail -f backend/logs/combined.log

# Last 100 lines
tail -100 backend/logs/combined.log

# Search for errors
grep "error" backend/logs/combined.log
```

### Application Performance

**Using PM2 Monitoring:**
```bash
npm install -g pm2
pm2 monitoring

# Start app with PM2
pm2 start src/index.js --name "pm-api" -i max

# Monitor
pm2 monit
```

**Key Metrics to Monitor:**
- Request response time
- Error rate
- Database query time
- Memory usage
- CPU usage

### External Monitoring

**Recommended Services:**
- **Sentry** - Error tracking
- **LogRocket** - Frontend monitoring
- **Datadog** - Full-stack monitoring
- **New Relic** - APM
- **Papertrail** - Log aggregation

---

## Troubleshooting

### Issue: MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Solutions:**
1. Check MongoDB is running: `mongosh`
2. Verify MONGO_URI in .env
3. Check MongoDB port (default 27017)
4. If using Atlas, whitelist IP address
5. Verify username/password

### Issue: Port 3000 Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Mac/Linux

# Kill process
taskkill /PID <pid> /F          # Windows
kill -9 <pid>                   # Mac/Linux

# Or use different port
PORT=3001 npm run dev
```

### Issue: CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Check frontend URL matches CORS_ORIGIN
2. Verify environment variable is set
3. Restart backend after changing CORS_ORIGIN
4. Check for typos in URL

### Issue: JWT Token Errors

```
Invalid token / JWT malformed
```

**Solutions:**
1. Clear localStorage in browser
2. Login again to get new token
3. Verify JWT secrets match between dev and prod
4. Check token hasn't expired
5. Verify Bearer prefix in Authorization header

### Issue: Email Not Sending

```
Error: EAUTH - Invalid credentials
```

**Solutions:**
1. Verify Mailtrap credentials
2. Check SMTP host/port correct
3. Enable less secure apps (if Gmail)
4. Check from email is verified
5. Verify NODE_ENV allows emails

### Issue: Frontend Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite

# Rebuild
npm run build
```

### Issue: Database Disk Space

```
MongoDB error: insufficient space
```

**Solutions:**
1. Delete old logs: `rm backend/logs/*.log`
2. Archive old activity logs
3. Implement data retention policy
4. Upgrade database storage
5. Enable compression in MongoDB

### Issue: Memory Leaks

```
Node process growing larger over time
```

**Solutions:**
1. Check for event listener leaks
2. Review async operations
3. Clear timers properly
4. Use heap snapshots to find leaks
5. Implement memory limits with PM2

### Getting Help

**Check logs first:**
```bash
# Backend logs
tail -f backend/logs/error.log

# Browser console
F12 → Console tab

# Network tab
F12 → Network tab
```

**Common locations for issues:**
- Backend: `src/app.js` (middleware order)
- Frontend: `src/api/client.js` (interceptors)
- Database: `.env` (connection string)
- Auth: `src/middlewares/auth.middleware.js`

**Debug mode:**
```bash
# Backend with verbose logging
DEBUG=* npm run dev

# Frontend with React DevTools
# Install: https://react-devtools-tutorial.vercel.app/
```

---

## Post-Deployment Checklist

- [ ] Test login with real credentials
- [ ] Verify all CRUD operations work
- [ ] Check email sending (if configured)
- [ ] Test admin panel
- [ ] Verify pagination works
- [ ] Test search/filters
- [ ] Check activity logging
- [ ] Monitor error logs
- [ ] Set up monitoring/alerts
- [ ] Create backup schedule
- [ ] Document custom configurations
- [ ] Set up SSL certificate renewal
- [ ] Configure automatic deployments (if possible)
- [ ] Test on mobile browsers
- [ ] Verify CORS headers
- [ ] Load testing

