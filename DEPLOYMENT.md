# LinkedIn Analytics Deployment Guide

## Overview
This directory contains comprehensive deployment configurations for the LinkedIn Analytics application across multiple platforms and environments.

## Available Deployment Options

### 1. Local Development
```bash
npm run dev
```

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. Platform Deployments

#### Netlify
- Configuration: `netlify.toml`
- Auto-deploys from main branch
- Includes security headers, caching, and SPA routing

```bash
# Manual deployment
netlify deploy --prod --dir=dist
```

#### Vercel
- Configuration: `vercel.json`
- Zero-config deployment with optimizations
- Automatic HTTPS and global CDN

```bash
# Manual deployment
vercel --prod
```

#### AWS S3 + CloudFront
- Script: `deploy-aws.sh`
- Scalable static hosting with CDN

```bash
# Set environment variables
export AWS_BUCKET_NAME="your-bucket-name"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"
./deploy-aws.sh
```

#### Docker
- Script: `deploy-docker.sh`
- Containerized deployment with nginx

```bash
./deploy-docker.sh
```

#### GitHub Pages
- Workflow: `.github/workflows/deploy.yml`
- Automated CI/CD pipeline

## Environment Variables

Create a `.env.production` file:

```bash
# Application
NODE_ENV=production
VITE_APP_NAME="LinkedIn Analytics"
VITE_APP_VERSION="1.0.0"

# API Configuration
VITE_API_BASE_URL="https://api.your-domain.com"
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true

# Security
VITE_CSP_NONCE=""
VITE_CORS_ORIGINS="https://your-domain.com"

# External Services
VITE_LINKEDIN_CLIENT_ID="your-linkedin-client-id"
VITE_ANALYTICS_TRACKING_ID="your-analytics-id"
```

## Security Configuration

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https:;
">
```

### Security Headers
All deployment configurations include:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Performance Optimization

### Caching Strategy
- Static assets: 1 year cache (immutable)
- HTML files: No cache
- API responses: Short-term cache (5 minutes)

### Build Optimizations
- Tree shaking for unused code elimination
- Code splitting for lazy loading
- Asset compression (gzip/brotli)
- Image optimization
- CSS purging

## Monitoring & Health Checks

### Health Check Endpoints
- `/health` - Application health status
- `/health.json` - Detailed health information
- `/deployment-info.json` - Build and deployment details

### Monitoring Setup
1. **Application Performance Monitoring (APM)**
   - Error tracking with Sentry
   - Performance monitoring
   - User session recording

2. **Infrastructure Monitoring**
   - Uptime monitoring
   - Response time tracking
   - Resource utilization alerts

3. **Business Metrics**
   - User analytics
   - Feature usage tracking
   - Conversion funnel analysis

## Deployment Checklist

### Pre-deployment
- [ ] Run security audit (`npm audit`)
- [ ] Verify environment variables
- [ ] Test build locally (`npm run build && npm run preview`)
- [ ] Run end-to-end tests
- [ ] Check bundle size impact
- [ ] Verify HTTPS certificates

### Post-deployment
- [ ] Health check passes
- [ ] Performance metrics acceptable
- [ ] Error rates within threshold
- [ ] DNS propagation complete
- [ ] CDN cache warming
- [ ] Monitoring alerts configured

## Rollback Strategy

### Automatic Rollback Triggers
- Health check failures for > 5 minutes
- Error rate > 5%
- Response time > 3 seconds
- Memory usage > 90%

### Manual Rollback
```bash
# Netlify
netlify deploy --prod --dir=previous-build

# Vercel
vercel rollback [deployment-url]

# AWS
aws s3 sync backup-build/ s3://bucket-name/
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and retry
   npm run clean
   npm ci
   npm run build
   ```

2. **Routing Issues (SPA)**
   - Ensure redirect rules are configured
   - Check nginx/server configuration

3. **Performance Issues**
   - Review bundle analysis
   - Check network waterfall
   - Verify CDN configuration

4. **Security Errors**
   - Validate CSP headers
   - Check CORS configuration
   - Review SSL certificates

### Debug Commands
```bash
# View deployed version info
curl https://your-domain.com/deployment-info.json

# Check health status
curl https://your-domain.com/health

# Test gzip compression
curl -H "Accept-Encoding: gzip" -I https://your-domain.com/

# Validate security headers
curl -I https://your-domain.com/
```

## Support

For deployment issues:
1. Check application logs
2. Verify configuration files
3. Test locally first
4. Check platform-specific documentation
5. Review monitoring dashboards

## Contributing

When adding new deployment options:
1. Add configuration files
2. Update this documentation
3. Test deployment process
4. Add monitoring/health checks
5. Update CI/CD pipeline