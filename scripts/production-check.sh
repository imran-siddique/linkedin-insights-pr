#!/bin/bash

# LinkedIn Analytics Production Readiness Check
echo "🚀 LinkedIn Analytics Production Readiness Check"
echo "================================================"

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v | sed 's/v//')
required_version="18.0.0"
if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Node.js version $node_version is compatible"
else
    echo "❌ Node.js version $node_version is not compatible (requires >= $required_version)"
    exit 1
fi

# Check if all dependencies are installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Node modules are installed"
else
    echo "❌ Node modules not found - run 'npm install'"
    exit 1
fi

# Type check
echo "🔍 Running TypeScript type check..."
if npx tsc --noEmit; then
    echo "✅ TypeScript type check passed"
else
    echo "❌ TypeScript type check failed"
    exit 1
fi

# Build check
echo "🏗️  Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Production build successful"
else
    echo "❌ Production build failed"
    exit 1
fi

# Check for dist directory
if [ -d "dist" ]; then
    echo "✅ Build artifacts generated"
    echo "   📊 Build size: $(du -sh dist | cut -f1)"
else
    echo "❌ Build artifacts not found"
    exit 1
fi

# Security audit
echo "🔒 Running security audit..."
if npm audit --audit-level high --quiet; then
    echo "✅ No high severity security issues found"
else
    echo "⚠️  Security issues detected - review npm audit output"
fi

# Environment variables check
echo "🌍 Checking environment configuration..."
required_configs=("NODE_ENV" "APP_NAME" "APP_VERSION")
missing_configs=()

for config in "${required_configs[@]}"; do
    if [ -z "${!config}" ]; then
        missing_configs+=("$config")
    fi
done

if [ ${#missing_configs[@]} -eq 0 ]; then
    echo "✅ All required environment variables are set"
else
    echo "⚠️  Missing environment variables: ${missing_configs[*]}"
fi

# Performance budget check
echo "📈 Checking bundle size..."
main_js_size=$(find dist -name "*.js" -type f -exec du -b {} + | awk '{sum += $1} END {print sum}')
size_mb=$(echo "scale=2; $main_js_size / 1024 / 1024" | bc)
max_size=5

if (( $(echo "$size_mb < $max_size" | bc -l) )); then
    echo "✅ Bundle size (${size_mb}MB) is within budget (<${max_size}MB)"
else
    echo "⚠️  Bundle size (${size_mb}MB) exceeds budget (${max_size}MB)"
fi

echo ""
echo "🎉 Production readiness check completed!"
echo "Ready for deployment: ✅"