# ECL5 Project - Complete Implementation Guide

## 📋 Overview

**Explain My Code Like I'm 5 (ECL5)** is a full-stack web application that uses AI to explain code snippets at three different complexity levels:
- 👶 **Beginner**: Everyday analogies, no jargon
- 👨‍💻 **Intermediate**: For junior developers
- 🧠 **Expert**: Code review format

Users provide feedback on explanations, and the app tracks helpfulness metrics over time.

## 🏗️ Architecture

### Frontend (React/Vite)
- Responsive UI with Tailwind CSS
- Real-time complexity level switching with client-side caching
- JWT-based authentication
- Analytics dashboard with interactive charts
- Modular component architecture

### Backend (Django/DRF)
- RESTful API with JWT authentication
- Groq AI integration for explanations
- PostgreSQL database
- Rate limiting per user tier
- Admin panel for data management

### Database Models
```
CodeSnippet
├── id (UUID)
├── user (ForeignKey → User)
├── language
├── code_text
├── code_hash (indexed for caching)
├── source (paste/github)
└── created_at

Explanation (unique per snippet+level)
├── id (UUID)
├── snippet (ForeignKey)
├── level (beginner/intermediate/expert)
├── explanation_text
├── model_used
├── response_time_ms
└── created_at

Feedback (many per explanation)
├── id (UUID)
├── explanation (ForeignKey)
├── is_helpful (Boolean)
├── comment (optional)
└── created_at
```

## 📁 Project Structure

```
explain-my-code/
│
├── backend/
│   ├── ecl5_backend/          # Django project
│   │   ├── settings.py        # Config, CORS, JWT, Groq
│   │   ├── urls.py            # URL routing
│   │   ├── wsgi.py            # WSGI app
│   │   └── __init__.py
│   │
│   ├── api/                   # Main app
│   │   ├── models.py          # CodeSnippet, Explanation, Feedback
│   │   ├── views.py           # API endpoints + AI logic
│   │   ├── serializers.py     # DRF serializers
│   │   ├── urls.py            # API routes
│   │   ├── admin.py           # Admin panel
│   │   ├── apps.py
│   │   └── __init__.py
│   │
│   ├── manage.py              # Django CLI
│   ├── Dockerfile             # Container image
│   ├── docker-compose.yml     # Local PostgreSQL setup
│   ├── requirements.txt       # Python dependencies
│   ├── requirements-dev.txt   # Dev dependencies
│   ├── .env.example           # Environment template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeInput.jsx          # Code editor + language
│   │   │   ├── ComplexitySlider.jsx   # Radio selector
│   │   │   ├── ExplanationPanel.jsx   # Display + feedback
│   │   │   ├── FeedbackButtons.jsx    # Like/dislike form
│   │   │   ├── AnalyticsChart.jsx     # Recharts bar chart
│   │   │   └── HistoryList.jsx        # Past snippets
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Main UI (state management)
│   │   │   ├── HistoryPage.jsx        # User history (auth)
│   │   │   ├── AnalyticsPage.jsx      # Dashboard (auth)
│   │   │   └── LoginPage.jsx          # JWT login form
│   │   │
│   │   ├── api/
│   │   │   └── client.js              # Axios + JWT interceptor
│   │   │
│   │   ├── App.jsx                    # React Router setup
│   │   ├── main.jsx                   # React entry
│   │   └── index.css                  # Tailwind imports
│   │
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite config
│   ├── tailwind.config.js     # Tailwind setup
│   ├── postcss.config.js      # PostCSS config
│   ├── .eslintrc.json         # Linting rules
│   ├── index.html             # HTML template
│   ├── .gitignore
│   └── .env.local             # Frontend env (git-ignored)
│
├── README.md                  # Quick start guide
├── DEVELOPMENT.md             # Dev setup & architecture
├── DEPLOYMENT.md              # Production deployment
├── setup.sh / setup.bat       # Auto-setup scripts
└── .gitignore                 # Root gitignore
```

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Add GROQ_API_KEY
python manage.py migrate
python manage.py runserver
```
✓ Runs on http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
✓ Runs on http://localhost:5173

### Admin Panel
http://localhost:8000/admin

## 🔗 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/explain/` | None | Get explanation (auto-caches) |
| GET | `/api/explanations/{id}/` | None | Get all explanations for snippet |
| POST | `/api/feedback/` | None | Submit feedback on explanation |
| GET | `/api/history/` | **JWT** | User's past snippets |
| GET | `/api/analytics/` | **JWT** | Helpfulness stats by level |
| POST | `/api/auth/token/` | None | Login → get JWT token |
| POST | `/api/auth/token/refresh/` | JWT | Refresh expired token |

## 🧠 AI Prompt Design

The magic happens in `backend/api/views.py` with three system prompts:

**Beginner:** "Use everyday analogies... no jargon... 150 words max"
**Intermediate:** "Explain patterns/idioms... flag gotchas... 250 words"
**Expert:** "Skip basics, focus on edge cases, security, performance, suggest 1 improvement"

Same model, different outputs—good interview talking point!

## 💾 Key Implementation Details

### Client-Side Caching Strategy
```javascript
// Explanations cached by (code_hash, level) in Frontend
cacheKey = `${hashCode(code)}-${level}`
// Slider toggling between levels is instant (no API call)
```

### JWT Authentication Flow
1. User logs in → receive `access_token` + `refresh_token`
2. Frontend stores tokens in `localStorage`
3. Axios interceptor adds `Authorization: Bearer {token}` header
4. Protected endpoints check token validity
5. Automatic token refresh before expiration

### Response Caching by Backend
```python
# In database: unique_together = ('snippet', 'level')
# Same code + level = returns cached explanation
```

### Rate Limiting
- Anonymous users: 10 requests/minute
- Authenticated users: 30 requests/minute
- Configured in DRF throttle classes

## 🔐 Environment Variables

### Backend Requirements
```env
SECRET_KEY=django-insecure-change-in-production
DEBUG=False
GROQ_API_KEY=gsk_xxxxx
DATABASE_URL=postgresql://user:pass@host/db
ALLOWED_HOSTS=localhost,yourdomain.com
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (Optional)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📦 Dependencies

### Backend
- Django 4.2
- djangorestframework 3.14
- django-cors-headers 4.3
- djangorestframework-simplejwt 5.3
- groq 0.4
- psycopg2 (PostgreSQL)
- gunicorn (production)

### Frontend
- React 18
- react-router-dom 6
- axios 1.6
- recharts 2.10
- tailwindcss 3.3
- vite 5

## 🎯 Key Features Implemented

✅ Code input with 12 language support
✅ 3-level complexity slider (debounced)
✅ AI explanations via Groq API
✅ Client-side caching by (code_hash, level)
✅ Feedback system (👍/👎 + optional comments)
✅ JWT authentication & authorization
✅ User history dashboard
✅ Analytics dashboard with recharts
✅ Admin panel for data inspection
✅ Rate limiting & throttling
✅ CORS properly configured
✅ Responsive Tailwind design
✅ Docker support
✅ Production-ready settings

## 🚀 Deployment

### Backend → Render.com
1. Docker-based deployment
2. Managed PostgreSQL database
3. Auto-scaling from free tier
4. Environment variables via dashboard

### Frontend → Vercel.com
1. Vite optimized build
2. Global CDN
3. Zero-config deployment
4. Custom domains supported

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Project Metrics

- **Lines of Code**: ~2,000 (backend), ~1,500 (frontend)
- **Components**: 7 frontend components
- **API Endpoints**: 7 main routes
- **Database Models**: 3 core models
- **Languages Supported**: 12 programming languages
- **Complexity Levels**: 3 difficulty tiers

## 🎓 Interview Talking Points

1. **Prompt Engineering**: Designed 3 system prompts that transform LLM output for different expertise levels
2. **Performance**: Client-side caching eliminates redundant API calls for repeated (code, level) pairs
3. **Full-Stack**: Single developer can own entire product from DB to UI
4. **Data-Driven**: Feedback system creates feedback loop for iterating on explanation quality
5. **Scalability**: Containerized backend with managed database, CDN-delivered frontend
6. **Production-Ready**: Rate limiting, error handling, JWT auth, CORS, admin panel

## 🔄 Build Order (MVP → Deployable)

1. ✅ Django models + `/api/explain/` endpoint (basic)
2. ✅ React code input + single "Explain" button
3. ✅ Add 3-level slider + prompt templates
4. ✅ Add feedback buttons + `/api/feedback/`
5. ✅ Add JWT auth + history page
6. ✅ Add analytics dashboard + recharts
7. Deploy to Render + Vercel
8. **Stretch**: GitHub integration, streaming, line annotations

## 📚 Next Steps

### To Run Locally
1. Get Groq API key (free) from https://groq.com
2. Follow Quick Start above
3. Test with sample code snippets

### To Deploy
1. Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. Get GitHub repo ready
3. Create Render + Vercel accounts
4. Connect repositories and deploy

### To Extend
- See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture & testing
- See stretch features in original spec for enhancement ideas

## 📞 Support Resources

- [Django Docs](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq API Docs](https://console.groq.com/docs)
- [Vite Guide](https://vitejs.dev/)

---

**Status**: ✅ Complete & Ready for Development  
**Last Updated**: 2024  
**Next Phase**: Deploy to production
