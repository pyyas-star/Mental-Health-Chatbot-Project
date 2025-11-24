# 🚀 Deployment Guide - Mental Health Chatbot

This guide walks you through deploying the Mental Health Chatbot to free hosting platforms.

## Architecture Overview

- **Backend**: Django REST Framework on Render (Free Tier)
- **Frontend**: React + Vite on Netlify or Vercel (Free Tier)
- **Database**: PostgreSQL on Render (Free Tier)

## Prerequisites

1. GitHub account with your repository pushed
2. Render account (free): https://render.com
3. Netlify account (free): https://netlify.com OR Vercel account (free): https://vercel.com

---

## Part 1: Backend Deployment on Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended) or email
3. Verify your email if required

### Step 2: Create PostgreSQL Database
1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `mental-health-db`
   - **Database**: `mental_health_db`
   - **User**: `mental_health_user`
   - **Region**: Choose closest to you
   - **Plan**: **Free**
3. Click **"Create Database"**
4. **Important**: Copy the **"Internal Database URL"** (you'll need it later)

### Step 3: Deploy Backend Web Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `pyyas-star/Mental-Health-Chatbot-Project`
3. Configure the service:
   - **Name**: `mental-health-chatbot-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend-drf`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn mental_health_main.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Plan**: **Free**

### Step 4: Set Environment Variables
In the Render dashboard, go to your web service → **"Environment"** tab, add:

```
SECRET_KEY=<generate-a-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=mental-health-chatbot-backend.onrender.com
DATABASE_URL=<paste-the-internal-database-url-from-step-2>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.netlify.app
MODEL_CACHE_DIR=/tmp/model_cache
RATELIMIT_ENABLE=False
```

**To generate SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Deploy and Run Migrations
1. Click **"Create Web Service"**
2. Wait for build to complete (first build takes 5-10 minutes)
3. Once deployed, go to **"Shell"** tab in Render dashboard
4. Run migrations:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
5. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

### Step 6: Get Your Backend URL
After deployment, your backend will be available at:
```
https://mental-health-chatbot-backend.onrender.com
```

**Note**: Free tier services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.

---

## Part 2: Frontend Deployment on Netlify

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub (recommended)

### Step 2: Deploy from GitHub
1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub and select: `pyyas-star/Mental-Health-Chatbot-Project`
3. Configure build settings:
   - **Base directory**: `frontend-react`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend-react/dist`
4. Click **"Deploy site"**

### Step 3: Set Environment Variables
1. Go to **"Site settings"** → **"Environment variables"**
2. Add:
   ```
   VITE_BACKEND_BASE_API=https://mental-health-chatbot-backend.onrender.com/api/
   VITE_BACKEND_ROOT=https://mental-health-chatbot-backend.onrender.com
   ```
3. Click **"Save"**
4. Go to **"Deploys"** tab → **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Update CORS Settings
1. Go back to Render dashboard → Your backend service → **"Environment"**
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-site-name.netlify.app
   ```
3. Save and redeploy backend

### Step 5: Get Your Frontend URL
Your frontend will be available at:
```
https://your-site-name.netlify.app
```

---

## Part 2 Alternative: Frontend Deployment on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Deploy from GitHub
1. Click **"Add New Project"**
2. Import: `pyyas-star/Mental-Health-Chatbot-Project`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-react`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **"Deploy"**

### Step 3: Set Environment Variables
1. Go to **"Settings"** → **"Environment Variables"**
2. Add:
   ```
   VITE_BACKEND_BASE_API=https://mental-health-chatbot-backend.onrender.com/api/
   VITE_BACKEND_ROOT=https://mental-health-chatbot-backend.onrender.com
   ```
3. Go to **"Deployments"** → Redeploy with new variables

### Step 4: Update CORS Settings
Same as Netlify Step 4, but use your Vercel domain:
```
CORS_ALLOWED_ORIGINS=https://your-site-name.vercel.app
```

---

## Part 3: Post-Deployment Checklist

### ✅ Backend Verification
- [ ] Backend URL is accessible: `https://your-backend.onrender.com/api/`
- [ ] Health check: `https://your-backend.onrender.com/api/wellness-tips/`
- [ ] Database migrations completed
- [ ] Static files collected
- [ ] CORS configured correctly

### ✅ Frontend Verification
- [ ] Frontend URL is accessible
- [ ] Can register new user
- [ ] Can login
- [ ] Can send chat messages
- [ ] API calls work (check browser console)

### ✅ Security Checklist
- [ ] `DEBUG=False` in production
- [ ] `SECRET_KEY` is strong and secret
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] CORS only allows your frontend domain
- [ ] HTTPS enabled (automatic on Render/Netlify/Vercel)

---

## Troubleshooting

### Backend Issues

**Problem**: Build fails with "psycopg2-binary not found"
- **Solution**: Ensure `requirements.txt` includes `psycopg2-binary>=2.9.0`

**Problem**: Database connection error
- **Solution**: Check `DATABASE_URL` is set correctly (use Internal Database URL from Render)

**Problem**: CORS errors in browser
- **Solution**: Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL (with `https://`)

**Problem**: First request is very slow
- **Solution**: Normal on free tier. The model downloads on first request (~500MB). Subsequent requests are faster.

### Frontend Issues

**Problem**: Blank page after deployment
- **Solution**: Check `VITE_BACKEND_BASE_API` is set correctly in environment variables

**Problem**: API calls fail with 404
- **Solution**: Verify backend URL ends with `/api/` in `VITE_BACKEND_BASE_API`

**Problem**: Build fails
- **Solution**: Check Node.js version (Vite requires Node 18+). Netlify/Vercel auto-detect this.

---

## Free Tier Limitations

### Render (Backend)
- ✅ 750 hours/month free
- ⚠️ Spins down after 15 min inactivity (cold start ~30s)
- ⚠️ 512MB RAM (enough for Django + DistilBERT)
- ⚠️ Limited CPU (first request slow due to model loading)

### Render (PostgreSQL)
- ✅ 90 days free trial, then $7/month
- ⚠️ 1GB storage limit
- ⚠️ No automatic backups on free tier

### Netlify/Vercel (Frontend)
- ✅ Unlimited builds
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ CDN included

---

## Upgrading to Paid Tiers (Optional)

If you need better performance:

1. **Render**: Upgrade to Starter ($7/month) for:
   - No spin-downs
   - More RAM (512MB → 1GB)
   - Better CPU

2. **Database**: Keep PostgreSQL on Render ($7/month) or migrate to:
   - Railway PostgreSQL (free tier available)
   - Supabase (free tier with 500MB)

---

## Monitoring & Maintenance

### Check Backend Logs
- Render dashboard → Your service → **"Logs"** tab

### Check Frontend Logs
- Netlify: **"Deploys"** → Click deployment → **"Deploy log"**
- Vercel: **"Deployments"** → Click deployment → **"Build Logs"**

### Database Backups
- Free tier: Manual exports via Render dashboard → Database → **"Connect"** → Export
- Paid tier: Automatic daily backups

---

## Support

If you encounter issues:
1. Check logs in Render/Netlify/Vercel dashboards
2. Verify environment variables are set correctly
3. Ensure all URLs use `https://` (not `http://`)
4. Check browser console for frontend errors
5. Verify CORS settings match your frontend domain exactly

---

**Deployment completed!** 🎉

Your Mental Health Chatbot is now live and accessible to users worldwide.

