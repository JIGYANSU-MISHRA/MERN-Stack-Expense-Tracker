/8# Quick Deployment Checklist

## Backend (Render) - Environment Variables
```
MONGO_URI=mongodb+srv://jigyansumishra6:2003_Mishra@cluster0.50pb6tj.mongodb.net/expense-tracker
PORT=5001
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
```

**Render Settings:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

---

## Frontend (Vercel) - Environment Variables
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

**Vercel Settings:**
- Root Directory: `frontend`
- Build Command: `npm run build` (auto)
- Output Directory: `build` (auto)

---

## Deployment Order
1. ✅ Deploy Backend to Render first
2. ✅ Copy Render backend URL
3. ✅ Deploy Frontend to Vercel with `REACT_APP_API_URL`
4. ✅ Copy Vercel frontend URL
5. ✅ Update Backend `CLIENT_URL` with Vercel URL
6. ✅ Test both endpoints

---

## Test URLs
- Backend: `https://your-backend.onrender.com/api/test`
- Frontend: `https://your-app.vercel.app`

