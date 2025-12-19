# Deployment Guide: MERN Stack Expense Tracker

This guide will help you deploy your Expense Tracker application:
- **Frontend** → Vercel
- **Backend** → Render

---

## 📋 Prerequisites

1. GitHub account with your code pushed
2. Vercel account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (or your MongoDB connection string)

---

## 🚀 Step 1: Deploy Backend to Render

### 1.1 Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `MERN-Stack-Expense-Tracker`

### 1.2 Configure Backend Settings

**Service Settings:**
- **Name**: `expense-tracker-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 1.3 Add Environment Variables

Click on **"Environment"** tab and add these variables:

```
MONGO_URI=mongodb+srv://jigyansumishra6:2003_Mishra@cluster0.50pb6tj.mongodb.net/expense-tracker
PORT=5001
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Important Notes:**
- Replace `your-vercel-app.vercel.app` with your actual Vercel URL (you'll get this after Step 2)
- You can update `CLIENT_URL` later after deploying the frontend

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. **Copy your backend URL** (e.g., `https://expense-tracker-backend.onrender.com`)

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create a New Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `MERN-Stack-Expense-Tracker`

### 2.2 Configure Frontend Settings

**Project Settings:**
- **Framework Preset**: `Create React App` (auto-detected)
- **Root Directory**: `frontend` (click "Edit" and set to `frontend`)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `build` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Note:** The project includes a `vercel.json` file that configures API rewrites. If you're using `REACT_APP_API_URL`, the rewrites in `vercel.json` are optional. The `REACT_APP_API_URL` method is recommended for production.

### 2.3 Add Environment Variables

Click on **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

**Important:**
- Replace `your-render-backend-url.onrender.com` with your actual Render backend URL from Step 1.4
- Make sure to include `https://` in the URL
- **Do NOT** include a trailing slash (e.g., use `https://backend.onrender.com` not `https://backend.onrender.com/`)
- After setting the variable, you may need to redeploy for changes to take effect

### 2.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (usually 1-3 minutes)
4. **Copy your frontend URL** (e.g., `https://mern-expense-tracker.vercel.app`)

---

## 🔄 Step 3: Update Environment Variables

### 3.1 Update Backend CLIENT_URL

1. Go back to Render Dashboard
2. Navigate to your backend service
3. Go to **"Environment"** tab
4. Update `CLIENT_URL` to your Vercel frontend URL:
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy with the new environment variable

### 3.2 Verify Frontend API URL

1. Go to Vercel Dashboard
2. Navigate to your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Verify `REACT_APP_API_URL` is set to your Render backend URL
5. If you need to update it, make the change and redeploy

---

## ✅ Step 4: Test Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.onrender.com/api/test`
   - Should return: `{"message":"Backend is running!"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try adding an expense
   - Check if data is being saved and retrieved

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check your `MONGO_URI` in Render environment variables
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Render's IP

**Problem**: CORS errors
- **Solution**: Update `CLIENT_URL` in Render to match your Vercel URL exactly

**Problem**: Backend crashes on startup
- **Solution**: Check Render logs for errors
- Verify all environment variables are set correctly

### Frontend Issues

**Problem**: API calls failing
- **Solution**: 
  - Verify `REACT_APP_API_URL` is set correctly in Vercel
  - Make sure the URL includes `https://` and doesn't have a trailing slash
  - Check browser console for CORS errors

**Problem**: Build fails on Vercel
- **Solution**: 
  - Check build logs in Vercel dashboard
  - Ensure `package.json` has correct build script
  - Verify all dependencies are listed in `package.json`

---

## 🐛 Debugging Guide

This application includes comprehensive debugging logs to help you identify and fix issues. All debugging information is logged to the browser console.

### How to Access Debug Logs

1. **Open Browser Developer Tools:**
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Safari**: Press `Cmd+Option+I` (Mac)

2. **Go to Console Tab:**
   - Click on the "Console" tab in Developer Tools
   - All debug logs will appear here

### Understanding Debug Logs

The application uses emoji-prefixed logs for easy identification:

- 🔵 **Blue Circle**: Request started
- 📤 **Outbox**: Request payload being sent
- ✅ **Checkmark**: Successful response
- ❌ **Red X**: Error occurred
- ⚠️ **Warning**: Warning message
- 🔐 **Lock**: Request with authentication token
- 📥 **Inbox**: Server response received
- 📡 **Satellite**: Network request error
- 💾 **Floppy Disk**: Data saved to localStorage
- 🔒 **Locked**: 401 Unauthorized error

### Common Debug Scenarios

#### 1. Authentication Failed Error

**What to look for in console:**

```
[AuthContext] 🔵 Signup request started: {...}
[axios] 📤 Request without token: {...}
[axios] ❌ Response error: {...}
[AuthContext] ❌ Signup error details: {...}
[AuthPage] ❌ Authentication error: {...}
```

**Check these details:**

1. **API Base URL:**
   - Look for `apiBaseURL` in the logs
   - Should show your Render backend URL in production
   - If it shows `'using proxy'` in production, `REACT_APP_API_URL` is not set

2. **Full URL:**
   - Check `fullURL` in error logs
   - Should be: `https://your-backend.onrender.com/api/auth/signup`
   - If incorrect, verify `REACT_APP_API_URL` in Vercel

3. **Response Status:**
   - `status: 400` → Invalid input (check email/password format)
   - `status: 401` → Invalid credentials
   - `status: 409` → User already exists
   - `status: 422` → Validation error
   - `status: 500` → Server error
   - `No response` → Network/CORS issue

4. **Network Errors:**
   - `ERR_NETWORK` → Cannot reach server
   - `ECONNABORTED` → Request timeout
   - `No response received` → Server down or CORS issue

#### 2. CORS Errors

**Symptoms:**
- Console shows: `Access to XMLHttpRequest has been blocked by CORS policy`
- Error logs show: `No response received`

**Debug steps:**

1. Check `CLIENT_URL` in Render:
   ```
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
   - Must match your Vercel URL exactly (including `https://`)
   - No trailing slash

2. Check backend logs in Render:
   - Go to Render Dashboard → Your Service → Logs
   - Look for CORS-related errors

3. Verify frontend URL:
   - Check what URL you're accessing
   - Must match `CLIENT_URL` in backend

#### 3. Network Connection Issues

**Symptoms:**
- `ERR_NETWORK` in console
- `Request was made but no response received`

**Debug steps:**

1. **Check if backend is running:**
   - Visit: `https://your-backend.onrender.com/api/test`
   - Should return: `{"message":"Backend is running!"}`
   - If not, backend might be sleeping (Render free tier)

2. **Check backend URL:**
   - In console, look for `fullURL` in error logs
   - Verify it matches your Render backend URL

3. **Check environment variable:**
   - In Vercel: Settings → Environment Variables
   - Verify `REACT_APP_API_URL` is set correctly
   - Must include `https://` prefix
   - No trailing slash

4. **Wait for backend to wake up:**
   - Render free tier services sleep after 15 minutes
   - First request may take 30-60 seconds
   - Subsequent requests are faster

#### 4. Token Issues

**Symptoms:**
- `No token in response!` in console
- `No user data in response!` in console

**Debug steps:**

1. Check response data:
   - Look for `responseData` in console logs
   - Should contain `token` and `user` fields

2. Check backend authentication route:
   - Verify backend is returning correct format:
     ```json
     {
       "token": "jwt-token-here",
       "user": { "id": "...", "email": "..." }
     }
     ```

#### 5. Request/Response Tracking

**All requests are logged with:**
- Request ID (unique identifier)
- Timestamp
- Method (GET, POST, etc.)
- Full URL
- Duration (response time)

**Example log:**
```
[axios] 📤 Request without token: {
  method: "POST",
  url: "/api/auth/signup",
  baseURL: "https://your-backend.onrender.com",
  fullURL: "https://your-backend.onrender.com/api/auth/signup",
  requestId: "req-1234567890-abc123"
}

[axios] ✅ Response received: {
  status: 200,
  duration: "245ms",
  requestId: "req-1234567890-abc123"
}
```

### Debugging Checklist

When troubleshooting authentication errors, check:

- [ ] Browser console is open (F12)
- [ ] Console shows debug logs with emoji prefixes
- [ ] `REACT_APP_API_URL` is set in Vercel environment variables
- [ ] Backend URL is correct (no trailing slash, includes `https://`)
- [ ] Backend is accessible: `https://your-backend.onrender.com/api/test`
- [ ] `CLIENT_URL` in Render matches your Vercel URL exactly
- [ ] MongoDB connection is working (check Render logs)
- [ ] No CORS errors in browser console
- [ ] Network tab shows the request (check status code)

### Quick Debug Commands

**Test backend directly:**
```bash
curl https://your-backend.onrender.com/api/test
```

**Test authentication endpoint:**
```bash
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","confirmPassword":"test123"}'
```

**Check environment variables:**
- In browser console, type:
  ```javascript
  console.log('API URL:', process.env.REACT_APP_API_URL);
  ```
  (Note: This only works in development. In production, check Vercel settings)

### Getting Help

When asking for help, provide:

1. **Console logs**: Copy all logs from browser console (especially error logs)
2. **Network tab**: Screenshot of failed request in Network tab
3. **Environment variables**: (Don't share sensitive values, just confirm they're set)
4. **Backend URL**: Your Render backend URL
5. **Frontend URL**: Your Vercel frontend URL
6. **Error message**: The exact error message shown to user

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Render free tier: Services spin down after 15 minutes of inactivity (takes ~30 seconds to wake up)
   - Vercel free tier: Unlimited deployments, but with some bandwidth limits

2. **Environment Variables:**
   - Never commit `.env` files to GitHub (already in `.gitignore`)
   - Always set environment variables in the deployment platform

3. **MongoDB Atlas:**
   - Make sure your MongoDB Atlas cluster allows connections from anywhere
   - Network Access: Add IP `0.0.0.0/0` (allow all) or add Render's IP addresses

4. **Auto-Deploy:**
   - Both Vercel and Render auto-deploy on every push to `main` branch
   - Make sure your code is pushed to GitHub before deploying

---

## 🎉 You're Done!

Your MERN Stack Expense Tracker is now live! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

---

## 🔄 Updating Your App

1. Make changes to your code locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
4. Vercel and Render will automatically redeploy!

---

## 📞 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

