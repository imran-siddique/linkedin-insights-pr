# Troubleshooting Guide

This comprehensive troubleshooting guide helps you resolve common issues with the LinkedIn Analytics & Growth Advisor application. Follow the step-by-step solutions to get back up and running quickly.

## 🚨 Common Issues

### Profile Analysis Issues

#### 1. "Profile Not Found" Error

**Symptoms:**
- Error message: "LinkedIn profile not found"
- Analysis fails immediately
- Username appears to be correct

**Possible Causes:**
- Profile is set to private
- LinkedIn username is incorrect
- Profile has been deleted or suspended
- Temporary LinkedIn restrictions

**Solutions:**

**Step 1: Verify Profile Accessibility**
```bash
# Test these variations of the username:
billgates
bill-gates
williamgates
```

**Step 2: Check Profile Privacy Settings**
1. Go to the LinkedIn profile directly in your browser
2. Verify you can see the profile without logging in
3. If private, the profile cannot be analyzed

**Step 3: URL Format Verification**
```
✅ Try these formats:
- username-only: billgates
- full URL: https://linkedin.com/in/billgates
- without protocol: linkedin.com/in/billgates
- with www: https://www.linkedin.com/in/billgates/

❌ Avoid these formats:
- Company pages: /company/microsoft
- Posts: /posts/activity-123456
- With extra parameters: /in/billgates?trk=...
```

**Step 4: Advanced Diagnostics**
```typescript
// Test profile accessibility programmatically
async function testProfileAccess(username: string) {
  const testUrls = [
    `https://linkedin.com/in/${username}`,
    `https://www.linkedin.com/in/${username}`,
    `https://linkedin.com/in/${username}/`
  ]
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      console.log(`${url}: ${response.status}`)
    } catch (error) {
      console.log(`${url}: Failed - ${error.message}`)
    }
  }
}
```

#### 2. "Analysis Failed" Error

**Symptoms:**
- Analysis starts but fails partway through
- Generic error message
- Inconsistent behavior across different profiles

**Diagnostic Steps:**

**Step 1: Check System Status**
```bash
# Test application health
curl -f http://localhost:5173/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

**Step 2: Browser Console Check**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Note any network failures or JavaScript errors

**Step 3: Network Analysis**
1. Open Developer Tools → Network tab
2. Retry the analysis
3. Look for failed requests (red status codes)
4. Check response times (should be < 30 seconds)

**Step 4: Clear Application Data**
```bash
# Clear browser cache
# Chrome: Settings → Privacy → Clear browsing data
# Firefox: Settings → Privacy → Clear Data
# Safari: Develop → Empty Caches

# Or programmatically:
localStorage.clear()
sessionStorage.clear()
```

#### 3. Slow Analysis Performance

**Symptoms:**
- Analysis takes longer than 60 seconds
- Browser becomes unresponsive
- Partial results displayed

**Performance Optimization:**

**Step 1: System Requirements Check**
```bash
# Minimum requirements:
# - RAM: 4GB available
# - CPU: 2 cores
# - Network: 5 Mbps download
# - Browser: Chrome 90+, Firefox 88+, Safari 14+

# Check current resources:
# Task Manager (Windows) / Activity Monitor (macOS)
```

**Step 2: Browser Optimization**
```javascript
// Close unnecessary tabs
// Disable browser extensions temporarily
// Restart browser
// Try incognito/private mode

// Check available memory:
if ('memory' in performance) {
  console.log('Used memory:', performance.memory.usedJSHeapSize)
  console.log('Total memory:', performance.memory.totalJSHeapSize)
}
```

**Step 3: Network Optimization**
```bash
# Test network speed
curl -o /dev/null -s -w "%{time_total}\n" https://linkedin.com

# Should be < 2 seconds for good performance

# Check DNS resolution
nslookup linkedin.com

# Try different network (mobile hotspot, different WiFi)
```

### Application Loading Issues

#### 4. Blank White Screen

**Symptoms:**
- Application loads but shows only white screen
- No error messages visible
- URL is correct

**Solutions:**

**Step 1: JavaScript Error Check**
```javascript
// Open browser console and look for errors like:
// - "Uncaught SyntaxError"
// - "Cannot read property of undefined"
// - "Module not found"

// Common fixes:
// 1. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
// 2. Clear cache completely
// 3. Try different browser
```

**Step 2: Environment Variable Check**
```bash
# For development environment:
# Check .env.local file exists and has required variables

# Required variables:
VITE_APP_NAME=LinkedIn Analytics & Growth Advisor
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG_MODE=true
```

**Step 3: Build Verification**
```bash
# If running in development:
npm run dev

# Check for build errors:
npm run build

# Test production build:
npm run preview
```

#### 5. Stuck Loading State

**Symptoms:**
- Loading spinner never disappears
- Analysis appears to start but never completes
- No error messages

**Solutions:**

**Step 1: Check Request Status**
```javascript
// Open Network tab in browser dev tools
// Look for pending requests
// Check if any requests are stuck or timing out

// Force refresh the stuck request:
window.location.reload()
```

**Step 2: Rate Limiting Check**
```typescript
// Rate limits (default configuration):
// - 60 requests per minute
// - 5 scraping requests per minute
// - 800 requests per day

// If hitting limits, wait and retry:
const rateLimitStatus = await getRateLimitStatus()
console.log('Requests this minute:', rateLimitStatus.requestsThisMinute)
```

**Step 3: Service Availability**
```bash
# Check if external services are available:
curl -I https://linkedin.com
curl -I https://api.linkedin.com

# All should return 200 or 3xx status codes
```

### Development Environment Issues

#### 6. Installation Problems

**Symptoms:**
- `npm install` fails
- Dependency conflicts
- Module not found errors

**Solutions:**

**Step 1: Node.js Version Check**
```bash
# Check current version
node --version

# Should be 18.0.0 or higher
# If not, install from https://nodejs.org/

# Check npm version
npm --version

# Should be 8.0.0 or higher
```

**Step 2: Clean Installation**
```bash
# Remove existing installation
rm -rf node_modules
rm package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# If still failing, try:
npm install --legacy-peer-deps
```

**Step 3: Dependency Issues**
```bash
# Check for security vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix

# For peer dependency warnings:
npm install --save-dev @types/react @types/react-dom
```

#### 7. Build Failures

**Symptoms:**
- `npm run build` fails
- TypeScript compilation errors
- Missing dependencies

**Solutions:**

**Step 1: TypeScript Errors**
```bash
# Run type checking separately
npm run type-check

# Common errors and fixes:
# - Property does not exist: Check type definitions
# - Cannot find module: Check import paths
# - Type mismatch: Update interface definitions
```

**Step 2: Import Path Issues**
```typescript
// Check path aliases in vite.config.ts
resolve: {
  alias: {
    '@': resolve(projectRoot, 'src')
  }
}

// Verify imports use correct paths:
import { Button } from '@/components/ui/button'  // ✅ Correct
import { Button } from '../components/ui/button' // ❌ Relative path
```

**Step 3: Missing Environment Variables**
```bash
# Check required environment variables for build:
NODE_ENV=production
VITE_APP_NAME=LinkedIn Analytics & Growth Advisor
VITE_APP_VERSION=1.0.0

# Create .env.production file if needed
```

## 🔧 Advanced Troubleshooting

### Performance Issues

#### Memory Leaks

**Detection:**
```javascript
// Monitor memory usage
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Memory usage:', entry.name, entry.size)
  }
})

observer.observe({ entryTypes: ['memory'] })

// Check for growing heap size
setInterval(() => {
  if ('memory' in performance) {
    console.log('Heap size:', performance.memory.usedJSHeapSize)
  }
}, 5000)
```

**Solutions:**
```typescript
// Ensure proper cleanup in React components
useEffect(() => {
  const timer = setInterval(() => {
    // Some recurring task
  }, 1000)

  return () => {
    clearInterval(timer) // ✅ Cleanup
  }
}, [])

// Avoid memory leaks in event listeners
useEffect(() => {
  const handler = (event) => { /* handler */ }
  window.addEventListener('resize', handler)
  
  return () => {
    window.removeEventListener('resize', handler) // ✅ Cleanup
  }
}, [])
```

#### Large Bundle Sizes

**Analysis:**
```bash
# Analyze bundle size
npm run build:analyze

# Check specific chunks
ls -la dist/assets/

# Bundle should be:
# - Main chunk: < 500KB gzipped
# - Vendor chunk: < 300KB gzipped
# - Total: < 1MB gzipped
```

**Optimization:**
```typescript
// Implement code splitting
const ProfileAnalysis = lazy(() => import('./ProfileAnalysis'))
const Dashboard = lazy(() => import('./Dashboard'))

// Use dynamic imports for large libraries
const loadChartLibrary = async () => {
  const { Chart } = await import('chart.js')
  return Chart
}
```

### API Integration Issues

#### CORS Errors

**Symptoms:**
- "CORS policy blocked" errors in console
- Failed API requests
- Network errors

**Solutions:**
```typescript
// Development: Configure Vite proxy
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// Production: Ensure proper CORS headers
// Server should include:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, OPTIONS
// Access-Control-Allow-Headers: Content-Type, Authorization
```

#### Rate Limiting

**Detection:**
```typescript
// Monitor rate limit headers
const checkRateLimit = (response: Response) => {
  const remaining = response.headers.get('X-RateLimit-Remaining')
  const reset = response.headers.get('X-RateLimit-Reset')
  
  if (remaining && parseInt(remaining) < 10) {
    console.warn('Rate limit approaching:', remaining, 'requests remaining')
  }
}
```

**Handling:**
```typescript
// Implement exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      const delay = baseDelay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('Max retries exceeded')
}
```

## 🐛 Debugging Tools

### Browser Developer Tools

#### Console Debugging
```javascript
// Enable debug mode
localStorage.setItem('debug', 'true')

// View application state
console.log('App state:', {
  currentProfile: window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.currentProfile,
  cache: localStorage.getItem('analyzed-profiles'),
  config: window.__APP_CONFIG__
})

// Monitor network requests
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('Fetch request:', args[0])
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Fetch response:', response.status, args[0])
      return response
    })
}
```

#### React Developer Tools
```bash
# Install React Developer Tools browser extension
# Available for Chrome, Firefox, and Edge

# Features:
# - Component tree inspection
# - Props and state viewing
# - Performance profiling
# - Hook debugging
```

### Application-Specific Debugging

#### Enable Debug Mode
```bash
# Set environment variable
VITE_ENABLE_DEBUG_MODE=true

# Or in browser console
localStorage.setItem('enableDebugMode', 'true')
window.location.reload()
```

#### Health Monitoring
```typescript
// Check application health
const healthCheck = async () => {
  try {
    const response = await fetch('/health')
    const health = await response.json()
    console.log('Health status:', health)
    return health
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 'unhealthy', error: error.message }
  }
}

// Monitor continuously
setInterval(healthCheck, 60000) // Every minute
```

## 📞 Getting Help

### Self-Diagnosis Checklist

Before reaching out for help, try this checklist:

- [ ] Browser console checked for errors
- [ ] Network tab examined for failed requests
- [ ] Cache and cookies cleared
- [ ] Different browser tested
- [ ] Internet connection verified
- [ ] Profile URL format confirmed
- [ ] Rate limits checked
- [ ] Application health status verified

### Reporting Issues

#### Information to Include

**Environment Details:**
```bash
# System information
OS: macOS 13.0 / Windows 11 / Ubuntu 20.04
Browser: Chrome 120.0 / Firefox 119.0 / Safari 16.0
Node.js: 18.0.0 (for development issues)
App Version: 1.0.0
```

**Error Details:**
```bash
# Error message (exact text)
# Steps to reproduce
# Expected vs actual behavior
# Console errors (screenshot or text)
# Network errors (screenshot of network tab)
```

**Reproduction Steps:**
```markdown
1. Navigate to application
2. Enter username "testuser"
3. Click "Analyze Profile"
4. Error occurs after 30 seconds
```

### Support Channels

- **GitHub Issues**: Technical bugs and feature requests
- **GitHub Discussions**: Questions and community help
- **Documentation**: Check wiki for detailed guides
- **Code Review**: Implementation-specific questions

### Quick Reference

#### Emergency Fixes
```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build

# Browser reset
# Clear all data for the site
# Restart browser
# Try incognito mode
```

#### Common Commands
```bash
# Development
npm run dev
npm run type-check
npm run build
npm run preview

# Debugging
npm run health-check
curl -f http://localhost:5173/health
```

Remember: Most issues can be resolved by clearing cache, restarting the browser, or waiting a few minutes for temporary service issues to resolve.