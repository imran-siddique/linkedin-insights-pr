#!/bin/bash
set -euo pipefail

# LinkedIn Analytics Deployment Script
# Production-ready deployment with comprehensive checks and optimizations

echo "🚀 Starting LinkedIn Analytics deployment process..."

# Configuration
NODE_ENV=${NODE_ENV:-production}
BUILD_DIR="dist"
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
log_info "Running pre-deployment checks..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed"
    exit 1
fi

NODE_VERSION=$(node -v)
log_success "Node.js version: $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
log_success "npm version: $NPM_VERSION"

# Environment setup
log_info "Setting up environment for $NODE_ENV..."
export NODE_ENV=$NODE_ENV

# Clean previous builds
if [ -d "$BUILD_DIR" ]; then
    log_info "Creating backup of previous build..."
    cp -r "$BUILD_DIR" "$BACKUP_DIR"
    rm -rf "$BUILD_DIR"
    log_success "Previous build backed up to $BACKUP_DIR"
fi

# Install dependencies with production optimizations
log_info "Installing dependencies..."
npm ci --only=production --silent
log_success "Dependencies installed"

# Security audit
log_info "Running security audit..."
if npm audit --audit-level high; then
    log_success "Security audit passed"
else
    log_warning "Security audit found issues. Review before deploying."
fi

# Build application
log_info "Building application for production..."
npm run build

if [ $? -eq 0 ]; then
    log_success "Build completed successfully"
else
    log_error "Build failed"
    exit 1
fi

# Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build directory not found"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh $BUILD_DIR | cut -f1)
log_info "Build size: $BUILD_SIZE"

# Optimize build (compression, etc.)
log_info "Optimizing build for production..."

# Compress JavaScript files if gzip is available
if command -v gzip &> /dev/null; then
    find $BUILD_DIR -name "*.js" -exec gzip -9 -k {} \;
    find $BUILD_DIR -name "*.css" -exec gzip -9 -k {} \;
    log_success "Static assets compressed"
fi

# Generate deployment manifest
log_info "Generating deployment manifest..."
cat > $BUILD_DIR/deployment-info.json << EOF
{
  "deploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "buildSize": "$BUILD_SIZE",
  "nodeVersion": "$NODE_VERSION",
  "npmVersion": "$NPM_VERSION",
  "environment": "$NODE_ENV",
  "gitCommit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF
log_success "Deployment manifest created"

# Health check endpoint
log_info "Creating health check endpoint..."
cat > $BUILD_DIR/health.json << EOF
{
  "status": "healthy",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0.0",
  "service": "linkedin-analytics"
}
EOF

# Create deployment-ready package
log_info "Creating deployment package..."
tar -czf linkedin-analytics-deployment.tar.gz -C $BUILD_DIR .
log_success "Deployment package created: linkedin-analytics-deployment.tar.gz"

# Platform-specific deployment
case "${DEPLOY_PLATFORM:-}" in
    "netlify")
        log_info "Preparing for Netlify deployment..."
        # Netlify-specific optimizations
        ;;
    "vercel")
        log_info "Preparing for Vercel deployment..."
        # Vercel-specific optimizations
        ;;
    "aws-s3")
        log_info "Preparing for AWS S3 deployment..."
        # AWS S3 specific optimizations
        ;;
    *)
        log_info "Generic deployment preparation..."
        ;;
esac

# Final validation
log_info "Running final validation..."
if [ -f "$BUILD_DIR/index.html" ] && [ -d "$BUILD_DIR/assets" ]; then
    log_success "Build validation passed"
else
    log_error "Build validation failed - missing required files"
    exit 1
fi

log_success "🎉 Deployment preparation completed successfully!"
log_info "Build location: $BUILD_DIR"
log_info "Deployment package: linkedin-analytics-deployment.tar.gz"

# Cleanup old backups (keep last 5)
log_info "Cleaning up old backups..."
ls -dt backup_* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
log_success "Cleanup completed"

echo ""
log_success "🚀 LinkedIn Analytics is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Upload the build files from '$BUILD_DIR' to your hosting platform"
echo "2. Configure your web server to serve static files"
echo "3. Set up proper caching headers for assets"
echo "4. Configure HTTPS and security headers"
echo "5. Set up monitoring and health checks"
echo ""