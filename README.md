# 💭 Mental Health Companion

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.5-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive AI-powered mental health companion application that provides emotional support through sentiment analysis, mood tracking, and wellness tools. Built with Django REST Framework and React.

## 🌟 Features

### Core Features
- **AI-Powered Sentiment Analysis**: DistilBERT-based emotion detection for accurate mood analysis
- **Real-time Chat Interface**: Interactive chat UI with empathetic, context-aware responses
- **Mood History & Statistics**: Track emotional patterns over time with detailed analytics

### Wellness Tools
- **Daily Mood Check-ins**: Quick daily mood logging with calendar visualization
- **Goal Tracking**: Set and track personal wellness goals with progress visualization
- **Gratitude Journal**: Daily gratitude entries with streak tracking
- **Breathing Exercises**: Guided breathing exercises with visual animations (4-7-8, Box, Deep breathing)
- **Wellness Tips**: Personalized tips and resources based on current emotional state
- **Smart Reminders**: Customizable daily reminders with browser notifications

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 5.2.5 with Django REST Framework
- **ML Model**: DistilBERT (bhadresh-savani/distilbert-base-uncased-emotion)
- **Authentication**: JWT with SimpleJWT
- **Database**: SQLite (development) / PostgreSQL (production)
- **Rate Limiting**: 30 requests/minute per user

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM 7.8.1
- **HTTP Client**: Axios 1.11.0
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+ and npm
- Git

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend-drf
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `env.example.txt`):
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser (optional):
```bash
python manage.py createsuperuser
```

7. Start development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_BACKEND_BASE_API=http://localhost:8000/api/
VITE_BACKEND_ROOT=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/token/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token

### Mood & Sentiment
- `POST /api/analyze/` - Analyze text sentiment (requires auth)
- `GET /api/history/` - Get mood history (requires auth)
- `GET /api/stats/` - Get mood statistics (requires auth)

### Daily Check-ins
- `POST /api/checkin/` - Create today's mood check-in
- `GET /api/checkin/today/` - Get today's check-in
- `GET /api/checkin/calendar/` - Get check-ins for calendar view

### Goals
- `GET /api/goals/` - List user's goals
- `POST /api/goals/` - Create new goal
- `GET /api/goals/<id>/` - Get goal details
- `PATCH /api/goals/<id>/` - Update goal
- `DELETE /api/goals/<id>/` - Delete goal
- `POST /api/goals/<id>/complete/` - Mark goal as completed

### Gratitude
- `GET /api/gratitude/` - List gratitude entries
- `POST /api/gratitude/` - Create gratitude entry
- `GET /api/gratitude/stats/` - Get gratitude statistics

### Wellness
- `GET /api/wellness-tips/` - Get wellness tips (query param: ?emotion=sad)
- `GET /api/preferences/` - Get user preferences
- `PATCH /api/preferences/` - Update user preferences

## 🔒 Security Features

- JWT authentication with token refresh
- Rate limiting (30 requests/minute)
- Input sanitization with bleach
- CSRF protection
- SQL injection protection via Django ORM
- Secure password hashing
- CORS configuration for frontend

## 📊 Emotion Detection

The system detects 5 primary emotions:
- 😊 **Happy** (positive sentiment)
- 😢 **Sad** (negative sentiment)
- 😠 **Angry** (negative sentiment)
- 😰 **Anxious** (negative sentiment)
- 😐 **Neutral** (neutral sentiment)

## 🧪 Testing

### Backend Tests
```bash
cd backend-drf
python manage.py test
```

### Frontend Tests
```bash
cd frontend-react
npm run test
```

## 🐳 Docker Deployment

Run the entire application with Docker Compose:

```bash
docker-compose up --build
```

## 📁 Project Structure

```
mental-health-chatbot/
├── backend-drf/          # Django REST Framework backend
│   ├── api/             # Main API application
│   │   ├── models.py    # Database models
│   │   ├── views.py     # API endpoints
│   │   ├── serializers.py # Data serialization
│   │   └── sentiment_analyzer.py # ML model integration
│   └── accounts/        # User authentication
├── frontend-react/       # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── assets/      # CSS and static files
│       └── utils/       # Utility functions
└── README.md
```

## ⚠️ Important Notice

This application is designed to provide emotional support and is **not a replacement for professional mental health services**. If you're experiencing a mental health crisis, please contact:

- National Suicide Prevention Lifeline: 1-800-273-8255
- Crisis Text Line: Text HOME to 741741
- Or contact your local emergency services

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Yasin Ahmed Dema**

---

**Built with ❤️ for mental health awareness**