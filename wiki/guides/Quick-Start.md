# Quick Start Guide

Get the LinkedIn Analytics & Growth Advisor up and running in just 5 minutes! This guide will have you analyzing LinkedIn profiles and generating insights in no time.

## 🚀 5-Minute Setup

### Prerequisites Check

Before we begin, ensure you have:
- **Node.js 18.0.0 or higher** ([Download](https://nodejs.org/))
- **npm 8.0.0 or higher** (comes with Node.js)
- **Git** for cloning the repository

```bash
# Quick version check
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+
```

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/imran-siddique/linkedin-insights-pr.git
cd linkedin-insights-pr

# Install dependencies (this takes ~1-2 minutes)
npm install
```

### Step 2: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env.local

# Optional: Customize your settings
nano .env.local  # or use your preferred editor
```

**Basic `.env.local` configuration:**
```bash
# Application settings
VITE_APP_NAME=LinkedIn Analytics & Growth Advisor
VITE_APP_VERSION=1.0.0

# Feature flags
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=true

# Performance settings
VITE_MAX_REQUESTS_PER_MINUTE=60
VITE_CACHE_TTL=300000
```

### Step 3: Start Development Server

```bash
# Start the development server
npm run dev
```

🎉 **That's it!** Your application should now be running at `http://localhost:5173`

## 🎯 First Profile Analysis

### Using the Interface

1. **Open your browser** to `http://localhost:5173`
2. **Enter a LinkedIn username or URL** in the analysis form
   - Example: `billgates` or `https://linkedin.com/in/billgates`
3. **Click "Analyze Profile"** and wait for the AI-powered analysis
4. **Explore the results** including:
   - Profile completeness score
   - Skills analysis and recommendations
   - Industry insights and trends
   - Growth recommendations

### Sample Test Profiles

Try these public LinkedIn profiles for testing:
- `billgates` - Microsoft founder
- `jeffweiner08` - LinkedIn executive
- `guyoseary` - Music industry executive
- `reidhoffman` - LinkedIn founder

## 📊 Understanding the Dashboard

### Profile Analysis Overview
```
┌─────────────────────────────────────────┐
│ 📊 Profile Score: 85/100               │
│ ⭐ Completeness: High                   │
│ 🎯 Industry Alignment: Technology      │
│ 📈 Growth Potential: Significant       │
└─────────────────────────────────────────┘
```

### Key Sections

1. **Profile Summary** - Overall health and completeness
2. **Skills Analysis** - Skill gaps and learning opportunities
3. **Market Intelligence** - Industry trends and positioning
4. **Growth Recommendations** - Actionable improvement suggestions
5. **Content Strategy** - Publishing and engagement advice

## 🛠️ Development Workflow

### Essential Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build

# Quality Assurance
npm run type-check   # TypeScript validation
npm run test         # Run test suite
npm run test:coverage # Test coverage report

# Health & Maintenance
npm run health-check # Application health check
npm run clean        # Clean build artifacts
```

### Hot Reload Development

The development server includes:
- **Hot Module Replacement (HMR)** - Instant updates without page refresh
- **Error Overlay** - Helpful error messages in the browser
- **TypeScript Integration** - Real-time type checking

## 🔧 Common Configuration

### Debug Mode

Enable enhanced logging and development features:

```bash
# In .env.local
VITE_ENABLE_DEBUG_MODE=true
```

This enables:
- Detailed console logging
- Performance metrics
- API request/response logging
- Component render tracking

### Performance Tuning

Adjust rate limiting and caching:

```bash
# Requests per minute (default: 60)
VITE_MAX_REQUESTS_PER_MINUTE=30

# Cache time-to-live in ms (default: 5 minutes)
VITE_CACHE_TTL=600000

# Maximum cache entries (default: 100)
VITE_MAX_CACHE_SIZE=50
```

### Feature Flags

Control application features:

```bash
# Enable/disable analytics tracking
VITE_ENABLE_ANALYTICS=true

# Enable/disable error reporting
VITE_ENABLE_ERROR_REPORTING=true

# Scraping rate limit (requests per minute)
VITE_SCRAPING_RATE_LIMIT=5
```

## 🚀 Production Quick Start

### Local Production Build

```bash
# Build for production
npm run build

# Test the production build locally
npm run preview

# Verify everything works
npm run health-check
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] Health check passes
- [ ] No console errors in browser
- [ ] Profile analysis works correctly

## 📱 Mobile Development

### Responsive Testing

The application is fully responsive. Test on different screen sizes:

```bash
# Start dev server with network access
npm run dev -- --host

# Access from mobile devices on same network
# http://YOUR_IP_ADDRESS:5173
```

### Touch-Friendly Features

- Large tap targets (minimum 44px)
- Touch gestures for navigation
- Optimized mobile layouts
- Fast touch response times

## 🎨 Customization Quick Wins

### Theme Customization

Modify the design system in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color-50',
          500: '#your-brand-color',
          900: '#your-color-900',
        }
      }
    }
  }
}
```

### Component Customization

All UI components are in `src/components/ui/` and can be customized:

```typescript
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        // Add your custom variants
        brand: "bg-gradient-to-r from-blue-500 to-purple-600"
      }
    }
  }
)
```

## 🐛 Quick Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# If port 5173 is busy, specify a different port
npm run dev -- --port 3001
```

#### Cache Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Run type check to see all issues
npm run type-check

# Check for missing dependencies
npm install
```

#### Build Failures
```bash
# Clean previous builds
npm run clean

# Rebuild from scratch
npm run build
```

### Performance Issues

If the application feels slow:

1. **Check Node.js version** - Should be 18.0.0+
2. **Enable debug mode** - Set `VITE_ENABLE_DEBUG_MODE=true`
3. **Monitor console** - Look for warnings or errors
4. **Check network tab** - Verify API responses

### Getting Help

- **Check the console** - Browser developer tools often show helpful errors
- **Review logs** - Debug mode provides detailed logging
- **Test with sample profiles** - Use known working LinkedIn usernames
- **Check GitHub issues** - Common problems might already be documented

## 🎯 Next Steps

Now that you're up and running:

1. **Explore the [User Guide](../User-Guide.md)** - Learn all features in detail
2. **Read [Development Guide](Development.md)** - Understand the codebase
3. **Check [API Documentation](../API-Documentation.md)** - Integrate with other tools
4. **Review [Examples](../Examples.md)** - See real-world usage patterns

## 🚀 Production Deployment

Ready for production? Check out our deployment guides:

- **[GitHub Spark Deployment](GitHub-Spark-Deployment.md)** - Recommended platform
- **[Docker Deployment](Docker-Deployment.md)** - Containerized deployment
- **[Manual Deployment](Manual-Deployment.md)** - Traditional hosting

---

**Congratulations!** 🎉 You now have a fully functional LinkedIn Analytics & Growth Advisor application. Happy analyzing!