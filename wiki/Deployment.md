# Deployment Guide

This comprehensive guide covers all deployment options for the LinkedIn Analytics & Growth Advisor application, from the recommended GitHub Spark platform to traditional hosting solutions.

## 🎯 Deployment Overview

The application supports multiple deployment strategies:

- **GitHub Spark** (Recommended) - Optimized for Spark applications
- **Docker Deployment** - Containerized for any platform
- **Static Site Hosting** - Netlify, Vercel, GitHub Pages
- **Traditional Server** - Node.js hosting providers
- **CDN Deployment** - Global content distribution

## 🚀 GitHub Spark Deployment (Recommended)

### Prerequisites

- GitHub account with Spark access
- Repository pushed to GitHub
- Node.js 18+ environment

### Deployment Steps

#### 1. Prepare the Application

```bash
# Ensure all dependencies are installed
npm install

# Run production build test
npm run build

# Verify build health
npm run health-check
```

#### 2. Configure Environment Variables

Create `.env.production` for production settings:

```bash
# Production configuration
NODE_ENV=production
VITE_APP_NAME=LinkedIn Analytics & Growth Advisor
VITE_APP_VERSION=1.0.0

# Performance optimizations
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# Rate limiting for production
VITE_MAX_REQUESTS_PER_MINUTE=100
VITE_SCRAPING_RATE_LIMIT=10
VITE_CACHE_TTL=600000
```

#### 3. Deploy to Spark

```bash
# Build the application
npm run build

# Deploy using Spark CLI (if available)
spark deploy

# Or push to GitHub (auto-deployment)
git add .
git commit -m "Production deployment"
git push origin main
```

#### 4. Verify Deployment

```bash
# Test the deployed application
curl -f https://your-spark-app.com/health

# Monitor deployment logs
spark logs --follow
```

### Spark-Specific Features

#### LLM Integration
```typescript
// Automatic LLM service integration
const insights = await spark.llm(`
  Analyze this LinkedIn profile: ${profileData}
  Provide improvement recommendations.
`, 'gpt-4o-mini', true)
```

#### Key-Value Storage
```typescript
// Built-in persistent storage
await spark.kv.set('user-preferences', preferences)
const cachedData = await spark.kv.get('analysis-cache')
```

### Production Configuration

```typescript
// Production-optimized Vite config
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', 'framer-motion'],
          analytics: ['@phosphor-icons/react']
        }
      }
    }
  }
})
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for optimal size
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  linkedin-analytics:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
      - VITE_ENABLE_ANALYTICS=true
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Optional: Add monitoring
  monitoring:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

### Deployment Commands

```bash
# Build and run with Docker
docker build -t linkedin-analytics .
docker run -p 3000:80 linkedin-analytics

# Or use Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f linkedin-analytics

# Health check
docker-compose ps
```

## 🌐 Static Site Hosting

### Netlify Deployment

#### netlify.toml Configuration

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

#### Deployment Steps

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

### Vercel Deployment

#### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Deployment Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_BASE_URL: /linkedin-insights-pr/
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🖥️ Traditional Server Hosting

### Node.js Express Server

```javascript
// server.js
const express = require('express')
const path = require('path')
const app = express()

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### PM2 Process Management

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'linkedin-analytics',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 status
pm2 logs linkedin-analytics

# Auto-restart on system boot
pm2 startup
pm2 save
```

## ⚡ CDN Deployment

### AWS CloudFront

```yaml
# cloudformation-template.yml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: linkedin-analytics-app
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.DomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        Enabled: true
        DefaultRootObject: index.html
```

### Deployment Script

```bash
#!/bin/bash
# deploy-cdn.sh

# Build the application
npm run build

# Upload to S3
aws s3 sync dist/ s3://linkedin-analytics-app --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

## 🔧 Environment-Specific Configurations

### Development

```bash
# .env.development
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_MAX_REQUESTS_PER_MINUTE=30
VITE_API_TIMEOUT=30000
```

### Staging

```bash
# .env.staging
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=true
VITE_MAX_REQUESTS_PER_MINUTE=60
VITE_API_TIMEOUT=15000
```

### Production

```bash
# .env.production
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_MAX_REQUESTS_PER_MINUTE=100
VITE_API_TIMEOUT=10000
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```typescript
// Health check implementation
export async function healthCheck(): Promise<HealthStatus> {
  const checks = await Promise.allSettled([
    checkMemoryUsage(),
    checkCacheHealth(),
    checkAPIResponsiveness()
  ])

  const allPassed = checks.every(check => check.status === 'fulfilled')

  return {
    status: allPassed ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: checks.map(formatCheckResult),
    version: CONFIG.APP_VERSION
  }
}
```

### Production Monitoring

```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

## 🚀 Deployment Best Practices

### Pre-Deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] Production build successful (`npm run build`)
- [ ] Health check passing (`npm run health-check`)
- [ ] Environment variables configured
- [ ] Security audit clean (`npm audit`)
- [ ] Performance benchmarks met

### Production Optimizations

```typescript
// Production build optimizations
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', 'framer-motion']
        }
      }
    }
  }
})
```

### Security Considerations

- Use HTTPS in production
- Configure proper CORS headers
- Implement rate limiting
- Sanitize all user inputs
- Keep dependencies updated
- Use environment variables for secrets

### Performance Monitoring

- Set up error tracking (Sentry, Bugsnag)
- Monitor Core Web Vitals
- Track user engagement metrics
- Set up alerts for downtime
- Monitor API response times

## 🎯 Platform-Specific Considerations

### GitHub Spark
- Automatic scaling
- Built-in LLM integration
- Optimized for Spark applications
- Simplified deployment process

### Docker
- Consistent environments
- Easy scaling
- Platform independence
- Container orchestration ready

### Static Hosting
- Fastest loading times
- Global CDN distribution
- Lowest cost option
- Limited server-side functionality

### Traditional Hosting
- Full server control
- Custom server logic
- Database integration
- More complex deployment

Choose the deployment option that best fits your infrastructure, scalability needs, and team expertise.