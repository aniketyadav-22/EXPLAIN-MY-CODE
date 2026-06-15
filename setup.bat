@echo off
REM Windows setup script

echo Setting up Backend...
cd backend

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Create .env if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please add your GROQ_API_KEY
)

REM Run migrations
python manage.py migrate

echo Backend setup complete!
echo.

REM Frontend setup
echo Setting up Frontend...
cd ..\frontend

REM Install dependencies
npm install

echo Frontend setup complete!
echo.
echo Setup complete!
echo.
echo To start the app:
echo 1. Backend: cd backend && venv\Scripts\activate.bat && python manage.py runserver
echo 2. Frontend: cd frontend && npm run dev
