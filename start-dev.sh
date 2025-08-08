#!/bin/bash

# LinkedIn Analytics Development Startup Script

echo "🚀 Starting LinkedIn Analytics Development Environment"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed  
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "🏃‍♂️ Starting development server..."
echo "Application will run on http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="

npm run dev