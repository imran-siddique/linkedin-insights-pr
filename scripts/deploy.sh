#!/bin/bash

# LinkedIn Analytics Deployment Script
echo "🚀 LinkedIn Analytics Deployment Script"
echo "========================================"

# Set default environment
ENVIRONMENT=${1:-production}
echo "🌍 Deploying to: $ENVIRONMENT"

# Production deployment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Production Deployment Steps:"
    
    # 1. Build the application
    echo "📦 Building application..."
    if npm run build; then
        echo "✅ Build completed"
    else
        echo "❌ Build failed"
        exit 1
    fi
    
    # 2. Build Docker image
    echo "🐳 Building Docker image..."
    docker build -t linkedin-analytics:latest .
    
    # 3. Tag for deployment
    docker tag linkedin-analytics:latest linkedin-analytics:v$(date +%Y%m%d-%H%M%S)
    
    echo "✅ Docker image built and tagged"
    
    # 4. Deploy with Docker Compose
    echo "🚀 Deploying with Docker Compose..."
    docker-compose up -d
    
    # 5. Health check
    echo "🏥 Waiting for application to be healthy..."
    sleep 30
    
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Application is healthy"
    else
        echo "❌ Health check failed"
        exit 1
    fi

# Development deployment
elif [ "$ENVIRONMENT" = "development" ]; then
    echo "🔧 Development Deployment:"
    echo "📦 Installing dependencies..."
    npm install
    
    echo "🔧 Starting development server..."
    npm run dev

# Staging deployment
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "🎭 Staging Deployment:"
    echo "📦 Building for staging..."
    npm run build:staging
    
    echo "🚀 Starting preview server..."
    npm run preview

else
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "Available environments: production, development, staging"
    exit 1
fi

echo "🎉 Deployment completed for $ENVIRONMENT!"