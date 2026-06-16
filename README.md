<div align="center">

# ⚡ Explain My Code Like I'm 5

### AI-Powered Code Explanations at Any Complexity Level

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-06b6d4?style=for-the-badge&logoColor=white)](https://explain-my-code-glg33qwdw-aniketyadav22work-6105s-projects.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

*Paste any code snippet and get instant AI explanations — from "like I'm 5" beginner analogies to expert-level code reviews. Built with a premium dark-mode glassmorphism UI.*

<br/>

[🚀 Live Demo](https://explain-my-code-glg33qwdw-aniketyadav22work-6105s-projects.vercel.app/) · [📖 Features](#-features) · [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) · [⚡ Quick Start](#-quick-start) · [📡 API Reference](#-api-reference)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧠 Core
- **AI Code Explanations** — Powered by Groq LLM API
- **3 Complexity Levels** — Beginner 👶 · Intermediate 👨‍💻 · Expert 🧠
- **12 Languages** — Python, JavaScript, Java, C++, Go, Rust, TypeScript, C#, PHP, SQL, HTML, CSS
- **Smart Caching** — SHA-256 hash deduplication; instant re-loads for already-explained code
- **Feedback Loop** — 👍/👎 with optional comments to rate explanations

</td>
<td width="50%">

### 🎨 UI / UX
- **Dark Mode Glassmorphism** — Premium frosted-glass cards with gradient accents
- **Animated Particle Background** — 30 floating CSS particles
- **Toast Notifications** — Slide-in success/error/info toasts
- **Micro-Animations** — Hover effects, shimmer loaders, staggered fade-ins
- **Fully Responsive** — Mobile-first design with hamburger nav

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Auth & Data
- **JWT Authentication** — Access + refresh token flow
- **Auto Token Refresh** — Transparent 401 retry with request queue
- **User Registration** — Sign up from the app, auto-login on success
- **History Dashboard** — Browse past snippets with search & language filter
- **Analytics Dashboard** — Stat cards, helpfulness charts, animated counters

</td>
<td width="50%">

### 🚀 Developer Experience
- **Vite** — Lightning-fast HMR and builds
- **API Proxy** — Vite dev proxy eliminates CORS in development
- **Docker Ready** — Dockerfile + docker-compose included
- **ESLint** — Code linting configured out of the box
- **Copy to Clipboard** — One-click copy on explanation text

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<th align="left">Layer</th>
<th align="left">Technology</th>
</tr>
<tr><td><strong>Frontend</strong></td><td>React 18 · Vite 5 · Tailwind CSS 3 · React Router v6</td></tr>
<tr><td><strong>Backend</strong></td><td>Django 4.2 · Django REST Framework · SimpleJWT</td></tr>
<tr><td><strong>AI Engine</strong></td><td>Groq API (LLM inference)</td></tr>
<tr><td><strong>Charts</strong></td><td>Recharts (Bar, Pie, Tooltip)</td></tr>
<tr><td><strong>HTTP Client</strong></td><td>Axios (with interceptors)</td></tr>
<tr><td><strong>Database</strong></td><td>SQLite (dev) · PostgreSQL (prod-ready)</td></tr>
<tr><td><strong>Deployment</strong></td><td>Vercel (frontend) · Docker + Gunicorn (backend)</td></tr>
<tr><td><strong>Fonts</strong></td><td>Inter · JetBrains Mono</td></tr>
</table>

---

## 📐 Architecture

```
explain-my-code/
├── backend/                    # Django REST API
│   ├── ecl5_backend/           # Project settings & root URLs
│   │   ├── settings.py         # JWT, CORS, Groq config
│   │   ├── urls.py             # Root URL routing → api/
│   │   └── wsgi.py
│   ├── api/                    # Main application
│   │   ├── models.py           # CodeSnippet, Explanation, Feedback (UUID PKs)
│   │   ├── views.py            # explain, feedback, history, analytics, register
│   │   ├── serializers.py      # DRF serializers + validation
│   │   ├── urls.py             # 8 API endpoints
│   │   └── admin.py            # Django admin config
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── components/         # 11 reusable components
    │   │   ├── Navbar.jsx      # Glassmorphism sticky nav
    │   │   ├── Layout.jsx      # Page wrapper + particles
    │   │   ├── Toast.jsx       # Toast notification system
    │   │   ├── CodeInput.jsx   # Code editor with language select
    │   │   ├── ComplexitySlider.jsx  # 3-level visual selector
    │   │   ├── ExplanationPanel.jsx  # AI response + copy button
    │   │   ├── FeedbackButtons.jsx   # 👍/👎 with inline success
    │   │   ├── AnalyticsChart.jsx    # Bar + Pie charts
    │   │   ├── AnimatedCounter.jsx   # Animated stat numbers
    │   │   ├── HistoryList.jsx       # Snippet cards + badges
    │   │   └── ParticleBackground.jsx # Floating particles
    │   ├── pages/              # 5 page components
    │   │   ├── HomePage.jsx    # Main explain interface
    │   │   ├── LoginPage.jsx   # JWT sign-in
    │   │   ├── RegisterPage.jsx # User registration
    │   │   ├── HistoryPage.jsx # Search + filter history
    │   │   └── AnalyticsPage.jsx # Dashboard + stat cards
    │   ├── api/client.js       # Axios + auto token refresh
    │   ├── App.jsx             # Router + providers
    │   ├── main.jsx            # Entry point
    │   └── index.css           # Dark mode design system
    ├── tailwind.config.js      # Custom theme + animations
    ├── vite.config.js          # Dev proxy + React plugin
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites

- **Python** 3.9+
- **Node.js** 18+
- **Groq API Key** → [Get one free at console.groq.com](https://console.groq.com/)

### 1️⃣ Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env → add your GROQ_API_KEY

# Setup database
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

> Backend runs at **http://localhost:8000** · Admin at **http://localhost:8000/admin/**

### 2️⃣ Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

> Frontend runs at **http://localhost:5173** with auto-proxy to the backend

---

## 📡 API Reference

All endpoints are prefixed with `/api/`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/explain/` | Optional | Submit code for AI explanation |
| `GET` | `/api/explanations/{id}/` | Public | Get all explanations for a snippet |
| `POST` | `/api/feedback/` | Optional | Submit 👍/👎 feedback |
| `POST` | `/api/auth/register/` | Public | Create new user account |
| `POST` | `/api/auth/token/` | Public | Login → JWT access + refresh |
| `POST` | `/api/auth/token/refresh/` | Public | Refresh access token |
| `GET` | `/api/history/` | 🔒 JWT | User's past snippets |
| `GET` | `/api/analytics/` | 🔒 JWT | Feedback analytics per level |

<details>
<summary><strong>Example — Explain Code</strong></summary>

```bash
curl -X POST http://localhost:8000/api/explain/ \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def greet(name):\n    return f\"Hello, {name}!\"",
    "language": "python",
    "level": "beginner"
  }'
```

**Response:**
```json
{
  "snippet_id": "a1b2c3d4-...",
  "explanation": {
    "id": "e5f6g7h8-...",
    "level": "beginner",
    "explanation_text": "Imagine you have a magic greeting card...",
    "model_used": "openai/gpt-oss-120b",
    "response_time_ms": 1234
  },
  "cached": false
}
```

</details>

<details>
<summary><strong>Example — Register</strong></summary>

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "message": "Account created successfully",
  "username": "newuser"
}
```

</details>

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | Dev key (change in prod) |
| `DEBUG` | Debug mode | `True` |
| `GROQ_API_KEY` | **Required** — Groq API key | — |
| `ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | SQLite (default) |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

---

## 🐳 Docker

```bash
cd backend
docker-compose up --build
```

This spins up Django + PostgreSQL. The frontend can be served via Vercel or any static host after `npm run build`.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ using React, Django & Groq AI**

[🚀 Try the Live Demo →](https://explain-my-code-glg33qwdw-aniketyadav22work-6105s-projects.vercel.app/)

</div>
