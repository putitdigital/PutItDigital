#!/bin/bash
# Setup script for Email Client

echo "Email Client Setup"
echo "=================="

# Backend
echo "Installing backend dependencies..."
cd backend
npm install

# Frontend
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 - Backend (Docker):"
echo "  cd desktop"
echo "  docker-compose up -d"
echo ""
echo "Terminal 2 - Desktop App:"
echo "  cd desktop/frontend"
echo "  npm start"
echo ""
echo "This will start:"
echo "  - Express backend on http://localhost:5001"
echo "  - React dev server on http://localhost:3000"
echo "  - Electron desktop app"
echo ""
