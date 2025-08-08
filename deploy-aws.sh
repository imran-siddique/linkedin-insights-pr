#!/bin/bash
# AWS S3 + CloudFront Deployment Script

set -euo pipefail

# Configuration
BUCKET_NAME="${AWS_BUCKET_NAME:-linkedin-analytics-app}"
CLOUDFRONT_DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="dist"

echo "🚀 Deploying to AWS S3 + CloudFront..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    exit 1
fi

# Verify AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured"
    exit 1
fi

echo "✅ AWS credentials verified"

# Build the application
echo "📦 Building application..."
npm run build

# Sync to S3 with optimized settings
echo "📤 Uploading to S3..."

# HTML files (no cache)
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --exclude "*" \
    --include "*.html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --metadata-directive REPLACE \
    --region $AWS_REGION

# Static assets (long cache)
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --exclude "*.html" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE \
    --region $AWS_REGION

# Set up website configuration
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html \
    --region $AWS_REGION

echo "✅ Upload completed"

# Invalidate CloudFront cache
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --region $AWS_REGION
    echo "✅ Cache invalidation requested"
fi

# Output URLs
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo ""
echo "🎉 Deployment completed!"
echo "📍 S3 Website URL: $WEBSITE_URL"

if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    CLOUDFRONT_URL=$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION_ID --query 'Distribution.DomainName' --output text --region $AWS_REGION)
    echo "🌐 CloudFront URL: https://$CLOUDFRONT_URL"
fi

echo ""
echo "Health check:"
curl -s -o /dev/null -w "%{http_code}" $WEBSITE_URL/health || echo "Health check endpoint may not be ready yet"