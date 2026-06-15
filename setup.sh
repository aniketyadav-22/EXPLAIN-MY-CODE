#!/bin/bash

# Backend setup
echo "Setting up Backend..."
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
pip install -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please add your GROQ_API_KEY"
fi

# Run migrations
python manage.py migrate

echo "Backend setup complete!"
echo ""

# Frontend setup
echo "Setting up Frontend..."
cd ../frontend

# Install dependencies
npm install

echo "Frontend setup complete!"
echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev"
