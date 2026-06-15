# Explain My Code Like I'm 5 (ECL5)

A full-stack web app where users paste code snippets and get AI-powered explanations at adjustable complexity levels with a feedback loop.

## Project Structure

```
explain-my-code/
├── backend/          # Django REST Framework API
│   ├── ecl5_backend/ # Django project config
│   ├── api/          # Main API app with models, serializers, views
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/         # React + Vite + Tailwind
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── pages/          # Page components
    │   ├── api/            # Axios API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

## Quick Start

### Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Server runs at `http://localhost:8000`

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional)
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env.local

# Start dev server
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

- `POST /api/explain/` - Get code explanation
- `GET /api/explanations/{snippet_id}/` - Get all explanations for a snippet
- `POST /api/feedback/` - Submit feedback
- `GET /api/history/` - Get user's history (auth required)
- `GET /api/analytics/` - Get analytics dashboard (auth required)
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh JWT token

## Features

- ✅ Code input with language selection
- ✅ 3-level complexity slider (Beginner/Intermediate/Expert)
- ✅ AI explanations via Groq API
- ✅ Client-side caching by (code_hash, level)
- ✅ Feedback system (helpful/not helpful + comments)
- ✅ JWT authentication
- ✅ History dashboard
- ✅ Analytics with recharts
- ✅ Responsive UI with Tailwind CSS

## Environment Variables

### Backend (.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DATABASE_URL` - PostgreSQL connection (optional)
- `GROQ_API_KEY` - Groq API key
- `ALLOWED_HOSTS` - Comma-separated list
- `CORS_ALLOWED_ORIGINS` - CORS origins

### Frontend (.env.local)
- `VITE_API_BASE_URL` - Backend API URL

