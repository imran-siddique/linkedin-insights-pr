#!/bin/bash
# Docker deployment script for LinkedIn Analytics

set -euo pipefail

DOCKER_IMAGE="linkedin-analytics"
DOCKER_TAG="${DOCKER_TAG:-latest}"
CONTAINER_NAME="linkedin-analytics-app"
PORT="${PORT:-3000}"

echo "🐳 Building Docker image for LinkedIn Analytics..."

# Create Dockerfile if it doesn't exist
if [ ! -f "Dockerfile" ]; then
    cat > Dockerfile << 'EOF'
# Multi-stage build for LinkedIn Analytics
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
fi

# Create nginx config if it doesn't exist
if [ ! -f "nginx.conf" ]; then
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check
        location /health {
            try_files /health.json =404;
        }
        
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
EOF
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t $DOCKER_IMAGE:$DOCKER_TAG .

# Stop existing container
if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run new container
echo "🚀 Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:80 \
    $DOCKER_IMAGE:$DOCKER_TAG

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 5

# Health check
if curl -f "http://localhost:$PORT/health" > /dev/null 2>&1; then
    echo "✅ Container is healthy!"
else
    echo "⚠️  Health check failed, but container is running"
fi

echo ""
echo "🎉 LinkedIn Analytics deployed successfully!"
echo "🔗 Application URL: http://localhost:$PORT"
echo "🐳 Container name: $CONTAINER_NAME"
echo "📊 Image: $DOCKER_IMAGE:$DOCKER_TAG"

# Show container status
docker ps | grep $CONTAINER_NAME