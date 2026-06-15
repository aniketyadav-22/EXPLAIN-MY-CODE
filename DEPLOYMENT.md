# Deployment Guide

## Pre-Deployment Checklist

- [ ] Update `SECRET_KEY` in production settings
- [ ] Set `DEBUG = False` in production
- [ ] Ensure all environment variables are set
- [ ] Run `python manage.py collectstatic` for static files
- [ ] Test with production settings locally
- [ ] Set up PostgreSQL database
- [ ] Create superuser for admin access
- [ ] Update CORS_ALLOWED_ORIGINS for your domain

## Backend Deployment (Render.com)

### 1. Prepare Repository

Ensure you have these files:
- `backend/Dockerfile` ✓
- `backend/requirements.txt` ✓
- `backend/manage.py` ✓

### 2. Create PostgreSQL Database

1. On Render dashboard: Create → PostgreSQL
2. Note the connection string
3. You'll use this for `DATABASE_URL`

### 3. Deploy Web Service

1. On Render: Create → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Name**: ecl5-backend
   - **Environment**: Docker
   - **Region**: Choose closest to users
   - **Branch**: main

4. Set Environment Variables:
   ```
   SECRET_KEY=<generate a long random string>
   DEBUG=False
   DATABASE_URL=<from PostgreSQL database>
   GROQ_API_KEY=<your Groq API key>
   ALLOWED_HOSTS=ecl5-backend.render.com,yourdomain.com
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://your-frontend.vercel.app
   ```

5. Build Command:
   ```bash
   pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
   ```

6. Start Command:
   ```bash
   gunicorn ecl5_backend.wsgi:application --bind 0.0.0.0:$PORT
   ```

7. Deploy and wait for build to complete

### 4. Create Superuser

After deployment:
```bash
render exec ecl5-backend python manage.py createsuperuser
```

Or use Render Shell to run Django commands.

## Frontend Deployment (Vercel.com)

### 1. Prepare Repository

Ensure your repo structure is:
```
explain-my-code/
├── backend/
├── frontend/
└── README.md
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. New Project → Import Git Repo
3. Select your repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Environment Variables:
   ```
   VITE_API_BASE_URL=https://ecl5-backend.render.com/api
   ```

6. Deploy

### 3. Custom Domain (Optional)

1. In Vercel Dashboard: Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to generate

## Frontend Deployment (Netlify.com)

### 1. Configure Build

Create `frontend/netlify.toml`:
```toml
[build]
command = "npm run build"
publish = "dist"

[env]
  VITE_API_BASE_URL = "https://ecl5-backend.render.com/api"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### 2. Deploy

1. Go to [netlify.com](https://netlify.com)
2. New site from Git → Connect repo
3. Configure as Vite project
4. Set environment variable
5. Deploy

## Environment Variables Reference

### Backend Production (.env)

```env
# Security
SECRET_KEY=your-super-secret-key-at-least-50-chars-random
DEBUG=False

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# API Keys
GROQ_API_KEY=gsk_your_groq_key

# Allowed hosts
ALLOWED_HOSTS=ecl5-backend.render.com,yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://your-app.vercel.app

# Server
ENVIRONMENT=production
```

### Frontend Production (.env.production)

```env
VITE_API_BASE_URL=https://ecl5-backend.render.com/api
```

## Database Migrations in Production

### First Time Deployment

Migrations run automatically in the build command.

### Future Migrations

If you add new models:

1. Locally:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   git push
   ```

2. On Render:
   - New version will auto-rebuild
   - Migrations run automatically
   - Monitor deployment logs

## Monitoring & Logs

### Backend Logs (Render)

1. Dashboard → Services → ecl5-backend
2. Logs tab shows real-time logs
3. Issues tab shows errors

### Frontend Logs (Vercel)

1. Dashboard → Deployments
2. Click deployment to see build logs
3. Analytics tab shows traffic

## Custom Domain Setup

### For Both Services

1. Register domain (GoDaddy, Namecheap, etc.)
2. Backend: Point to Render service
   - Render provides DNS records to add
3. Frontend: Point to Vercel
   - Vercel provides DNS records to add
4. Update CORS and ALLOWED_HOSTS
5. Redeploy both services

## Scaling Considerations

### Database

- Render managed PostgreSQL auto-scales
- Monitor connections with:
  ```bash
  # In Render Shell
  psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
  ```

### API Rate Limiting

Currently set to:
- 10 req/min for anonymous users
- 30 req/min for authenticated users

Adjust in `backend/ecl5_backend/settings.py` if needed:
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',  # Increase if needed
        'user': '1000/hour'
    }
}
```

### Caching

Add Redis for caching (optional):
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

## Troubleshooting Deployment

### Backend won't start

Check logs for:
- `ModuleNotFoundError`: Missing package → add to requirements.txt
- `DatabaseError`: PostgreSQL connection → verify DATABASE_URL
- `CommandError`: Migration issue → check migrations directory

### Frontend won't load

- Check browser console for 404 errors
- Verify VITE_API_BASE_URL is correct
- Ensure CORS is configured properly

### API calls failing from frontend

1. Check frontend logs for error details
2. Verify VITE_API_BASE_URL in deployment settings
3. Check backend CORS_ALLOWED_ORIGINS includes frontend domain
4. Test API directly: `curl https://backend-url/api/explain/`

## Continuous Deployment

Both Render and Vercel support auto-deploy on git push:

1. Configure webhook in GitHub
2. Any push to main branch triggers deploy
3. Monitor deployment status in dashboard
4. Rollback to previous version if needed

## Cost Optimization

### Free Tier Options

- **Render**: Free tier for web services (sleeps after 15 min inactivity)
- **Vercel**: Free tier for frontend
- **PostgreSQL**: Starter tier on Render ($7/month)
- **Groq API**: Free tier with good rate limits

### Cost Estimates (Monthly)

- Basic: ~$10-20 (free tiers + small database)
- Production: ~$30-50 (upgraded tiers)
- Scalable: ~$100+ (as traffic grows)

## Post-Deployment

1. Test all features in production
2. Set up monitoring alerts
3. Create backup strategy for database
4. Plan for scaling as traffic grows
5. Document any custom configurations
6. Set up automated backups
