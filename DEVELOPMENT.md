# Development Guide

## Project Architecture

### Backend (Django REST Framework)

**Stack:**
- Django 4.2
- Django REST Framework
- PostgreSQL (SQLite for dev)
- Groq API for AI explanations
- JWT authentication via simplejwt

**Key Models:**
- `CodeSnippet`: Stores user code with language and source
- `Explanation`: AI-generated explanations at different complexity levels
- `Feedback`: User feedback on explanations

**API Design:**
- All endpoints at `/api/`
- JWT authentication for user-specific endpoints
- Rate limiting: 10 req/min for anonymous, 30 req/min for authenticated users
- Response caching by code hash + level to minimize API calls

### Frontend (React + Vite)

**Stack:**
- React 18
- Vite for fast development
- Tailwind CSS for styling
- Recharts for analytics visualization
- Axios for HTTP requests
- React Router for navigation

**Component Structure:**
```
src/
├── components/
│   ├── CodeInput.jsx      - Code editor + language selector
│   ├── ComplexitySlider.jsx - 3-level radio selector
│   ├── ExplanationPanel.jsx - Display explanation + feedback
│   ├── FeedbackButtons.jsx  - Like/dislike + comment form
│   ├── AnalyticsChart.jsx   - Bar chart with recharts
│   └── HistoryList.jsx      - Past snippets list
├── pages/
│   ├── HomePage.jsx         - Main explain flow
│   ├── HistoryPage.jsx      - User history (auth required)
│   ├── AnalyticsPage.jsx    - Analytics dashboard (auth required)
│   └── LoginPage.jsx        - JWT login
├── api/
│   └── client.js            - Axios instance with JWT interceptor
```

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- Groq API key (free tier available at groq.com)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your Groq API key
cp .env.example .env
# Edit .env and add GROQ_API_KEY

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Server runs at http://localhost:8000

**Admin panel:** http://localhost:8000/admin

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at http://localhost:5173

## Key Features Implementation Details

### 1. Complexity Levels

Three system prompts in `backend/api/views.py`:

**Beginner:** Uses everyday analogies (cooking, traffic, mail)
**Intermediate:** Explains patterns and idioms for junior devs
**Expert:** Code review format with edge cases and suggestions

### 2. Client-Side Caching

In `frontend/src/pages/HomePage.jsx`:
```javascript
const cacheKey = (hash, level) => `${hash}-${level}`;
// Explanations cached by (code_hash, level) pair
// Slider toggling between levels is instant with no API call
```

### 3. AI Integration

Uses Groq API (`mixtral-8x7b-32768` model):
- Free tier with good performance
- ~1-2 second response times
- Fallback to cheaper models available

### 4. JWT Authentication Flow

1. User logs in via `/api/auth/token/` → gets access + refresh tokens
2. Frontend stores tokens in localStorage
3. Axios interceptor adds `Authorization: Bearer {token}` to requests
4. Protected endpoints check token validity
5. Refresh endpoint for expired tokens

### 5. Feedback System

- Anonymous feedback on any explanation
- Optional comment when clicking 👎
- Stored in database for analytics
- Analytics endpoint aggregates helpful % by level

## Testing

### Backend Tests

```bash
cd backend
python manage.py test

# Or with pytest
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Database

### Local Development

Default uses SQLite (`db.sqlite3`). For PostgreSQL:

```bash
# Install dj-database-url
pip install dj-database-url

# Set DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost/ecl5_db
```

### Creating Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Common Tasks

### Add a New Field to a Model

1. Edit the model in `backend/api/models.py`
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`
4. Update serializers if needed

### Add a New API Endpoint

1. Create view function in `backend/api/views.py`
2. Add route in `backend/api/urls.py`
3. Create serializer if needed in `backend/api/serializers.py`
4. Test with curl or Postman

### Add a New React Component

1. Create `.jsx` file in `src/components/`
2. Import in parent component
3. Style with Tailwind classes

## Environment Variables

### Backend (.env)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| SECRET_KEY | Yes | - | Django secret key |
| DEBUG | No | True | Debug mode |
| DATABASE_URL | No | sqlite:///db.sqlite3 | Database connection |
| GROQ_API_KEY | Yes | - | Groq API key |
| ALLOWED_HOSTS | No | localhost,127.0.0.1 | Allowed domains |
| CORS_ALLOWED_ORIGINS | No | http://localhost:5173 | CORS origins |

### Frontend (.env.local)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| VITE_API_BASE_URL | No | http://localhost:8000/api | Backend API URL |

## Deployment

### Backend on Render

1. Fork repo on GitHub
2. Create Render account
3. New Web Service → Connect repo
4. Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
5. Start command: `gunicorn ecl5_backend.wsgi:application`
6. Add environment variables in Render dashboard
7. Create PostgreSQL database add DATABASE_URL

### Frontend on Vercel

1. Fork repo on GitHub
2. Create Vercel account
3. Import project → Connect repo
4. Root directory: `frontend`
5. Build command: `npm run build`
6. Add environment variable: `VITE_API_BASE_URL=https://your-render-backend.com/api`
7. Deploy

## Troubleshooting

### Backend Issues

**Import error for Groq:**
```bash
pip install groq
```

**Database errors:**
```bash
python manage.py migrate --run-syncdb
```

**CORS errors:**
- Check `CORS_ALLOWED_ORIGINS` in settings.py
- Frontend URL must match exactly

### Frontend Issues

**API calls failing:**
- Check `VITE_API_BASE_URL` environment variable
- Verify backend is running on http://localhost:8000
- Check browser console for exact error

**Styling not working:**
```bash
npm install tailwindcss postcss autoprefixer
```

## Next Steps for Enhancement

1. **GitHub Integration** - Fetch files from GitHub repo
2. **Streaming Responses** - Token-by-token explanation display
3. **Line Annotations** - Inline code comments
4. **Reading Level Analysis** - Flesch-Kincaid score
5. **Rate Limiting UI** - Show user their quota
6. **Dark Mode** - Tailwind dark mode support
7. **Export Explanations** - PDF/Markdown download
8. **Explanation History** - Timeline of explanations

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq API Docs](https://console.groq.com/docs/speech-text)
- [Vite Documentation](https://vitejs.dev/)
