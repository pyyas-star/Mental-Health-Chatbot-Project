#!/bin/bash

# Mental Health Chatbot - Quick Start Script
# This script automates the setup process

set -e  # Exit on any error

echo "🚀 Mental Health Chatbot - Quick Start Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend-drf" ] || [ ! -d "frontend-react" ]; then
    echo -e "${RED}❌ Error: Please run this script from the mental-health-chatbot directory${NC}"
    echo "Current directory: $(pwd)"
    exit 1
fi

# Check Python venv support
echo "Checking Python venv support..."
if ! python3 -m venv --help > /dev/null 2>&1; then
    echo ""
    echo -e "${RED}❌ Error: python3-venv is not installed${NC}"
    echo ""
    PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
    echo "You need to install python3-venv first:"
    echo ""
    echo -e "${YELLOW}Run this command:${NC}"
    echo "  sudo apt install python3.${PYTHON_VERSION##*.}-venv"
    echo ""
    echo "Or for Python 3.12:"
    echo "  sudo apt install python3.12-venv"
    echo ""
    echo "After installing, run this script again."
    echo ""
    echo "For more information, see: INSTALL_PYTHON_VENV.md"
    exit 1
fi
echo -e "${GREEN}✅ Python venv support is available${NC}"
echo ""

# ========================================
# BACKEND SETUP
# ========================================
echo -e "${YELLOW}📦 Setting up Backend...${NC}"
cd backend-drf

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
if [ ! -f ".deps_installed" ]; then
    echo "Installing Python dependencies (this may take a few minutes)..."
    pip install --upgrade pip > /dev/null 2>&1
    pip install -r requirements.txt
    touch .deps_installed
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo "Dependencies already installed (skip with: rm .deps_installed)"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp env.example.txt .env
    
    # Generate secret key
    SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    
    # Update SECRET_KEY in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/SECRET_KEY=.*/SECRET_KEY=$SECRET_KEY/" .env
    else
        # Linux
        sed -i "s/SECRET_KEY=.*/SECRET_KEY=$SECRET_KEY/" .env
    fi
    
    echo -e "${GREEN}✅ .env file created with generated SECRET_KEY${NC}"
    echo -e "${YELLOW}⚠️  Please review backend-drf/.env if you need to change settings${NC}"
else
    echo ".env file already exists"
fi

# Create required directories
echo "Creating required directories..."
mkdir -p logs media staticfiles model_cache

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations --noinput > /dev/null 2>&1 || echo "No new migrations"
python manage.py migrate --noinput

# Check if superuser exists
echo ""
echo -e "${YELLOW}Superuser creation:${NC}"
if python manage.py shell -c "from django.contrib.auth.models import User; exit(0 if User.objects.filter(is_superuser=True).exists() else 1)" 2>/dev/null; then
    echo -e "${GREEN}✅ Superuser already exists${NC}"
else
    echo -e "${YELLOW}No superuser found. Creating one...${NC}"
    echo "Username: admin"
    echo "Email: admin@example.com"
    echo "Password: admin123 (CHANGE THIS IN PRODUCTION!)"
    python manage.py shell << EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser created!")
else:
    print("Admin user already exists")
EOF
fi

cd ..

# ========================================
# FRONTEND SETUP
# ========================================
echo ""
echo -e "${YELLOW}📦 Setting up Frontend...${NC}"
cd frontend-react

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies (this may take a few minutes)..."
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo "Node modules already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cat > .env << EOF
VITE_BACKEND_BASE_API=http://localhost:8000/api/
VITE_BACKEND_ROOT=http://localhost:8000
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo ".env file already exists"
fi

cd ..

# ========================================
# SUMMARY
# ========================================
echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "=============================================="
echo "📋 Next Steps:"
echo "=============================================="
echo ""
echo "1️⃣  Start Backend Server (Terminal 1):"
echo "   cd backend-drf"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "2️⃣  Start Frontend Server (Terminal 2):"
echo "   cd frontend-react"
echo "   npm run dev"
echo ""
echo "3️⃣  Open Browser:"
echo "   http://localhost:5173"
echo ""
echo "4️⃣  Login Credentials (for testing):"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "   • First sentiment analysis will download DistilBERT model (~250MB)"
echo "   • Change admin password in production!"
echo "   • Backend runs on: http://localhost:8000"
echo "   • Frontend runs on: http://localhost:5173"
echo ""
echo -e "${GREEN}🎉 Happy Chatting! 💭✨${NC}"
echo ""

