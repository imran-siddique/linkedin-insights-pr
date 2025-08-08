#!/bin/bash

# Production readiness build test
echo "🔍 Running production readiness checks..."

# Check if all required files exist
echo "📁 Checking required files..."
if [ ! -f "package.json" ]; then
  echo "❌ Missing package.json"
  exit 1
fi

if [ ! -f "vite.config.ts" ]; then
  echo "❌ Missing vite.config.ts"
  exit 1
fi

if [ ! -f "src/App.tsx" ]; then
  echo "❌ Missing src/App.tsx"
  exit 1
fi

echo "✅ Required files present"

# Check dependencies
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "⚠️  No node_modules found, installing dependencies..."
  npm install
fi

echo "✅ Dependencies ready"

# Type check
echo "🔍 Running TypeScript check..."
npx tsc --noEmit || {
  echo "❌ TypeScript errors found"
  exit 1
}

echo "✅ TypeScript check passed"

# Build test
echo "🏗️  Testing build..."
npm run build || {
  echo "❌ Build failed"
  exit 1
}

echo "✅ Build successful"

# Clean up
echo "🧹 Cleaning up build files..."
rm -rf dist

echo "🎉 All production readiness checks passed!"