# Performance & Monitoring

This guide covers performance optimization strategies, monitoring setup, and best practices for maintaining optimal performance in the LinkedIn Analytics & Growth Advisor application.

## 🎯 Performance Overview

### Key Performance Metrics

#### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds  
- **Cumulative Layout Shift (CLS)**: < 0.1

#### Application-Specific Metrics
- **Time to Interactive (TTI)**: < 3.5 seconds
- **Profile Analysis Time**: < 5 seconds
- **API Response Time**: < 2 seconds
- **Bundle Size**: < 1MB gzipped

### Current Performance Baseline

```javascript
// Performance benchmarks (production environment)
const performanceBaseline = {
  lighthouse: {
    performance: 95,
    accessibility: 98,
    bestPractices: 92,
    seo: 90
  },
  loadTimes: {
    initial: 1.2,      // seconds
    analysis: 3.8,     // seconds
    navigation: 0.3    // seconds
  },
  bundleSizes: {
    main: 245,         // KB gzipped
    vendor: 180,       // KB gzipped
    total: 425         // KB gzipped
  }
}
```

## 🚀 Performance Optimization

### Frontend Optimizations

#### Code Splitting
```typescript
// Route-based code splitting
const ProfileAnalysis = lazy(() => import('./components/ProfileAnalysis'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Settings = lazy(() => import('./components/Settings'))

// Component-based splitting for heavy components
const AdvancedChart = lazy(() => 
  import('./components/AdvancedChart').then(module => ({
    default: module.AdvancedChart
  }))
)

// Dynamic imports for libraries
const loadChartLibrary = async () => {
  const [
    { Chart },
    { CategoryScale, LinearScale, PointElement, LineElement }
  ] = await Promise.all([
    import('chart.js/auto'),
    import('chart.js')
  ])
  
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement)
  return Chart
}
```

#### Bundle Optimization
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
          analytics: ['framer-motion', '@phosphor-icons/react'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info']
      },
      mangle: {
        safari10: true
      }
    }
  }
})
```

#### React Performance Patterns
```typescript
// Memoization for expensive components
const ExpensiveAnalysisComponent = memo(({ data, options }) => {
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data, options)
  }, [data, options])

  return <AnalysisDisplay data={processedData} />
})

// Callback memoization
const ProfileAnalyzer = ({ onAnalysisComplete }) => {
  const handleAnalysis = useCallback(async (username: string) => {
    const result = await analyzeProfile(username)
    onAnalysisComplete(result)
  }, [onAnalysisComplete])

  return <AnalysisForm onSubmit={handleAnalysis} />
}

// Virtualization for large lists
import { FixedSizeList as List } from 'react-window'

const SkillsList = ({ skills }) => {
  const SkillItem = ({ index, style }) => (
    <div style={style}>
      <SkillCard skill={skills[index]} />
    </div>
  )

  return (
    <List
      height={400}
      itemCount={skills.length}
      itemSize={60}
    >
      {SkillItem}
    </List>
  )
}
```

### Caching Strategy

#### Multi-Level Caching
```typescript
class CacheManager {
  private memoryCache = new Map<string, CacheEntry>()
  private readonly TTL = {
    profile: 24 * 60 * 60 * 1000,     // 24 hours
    skills: 6 * 60 * 60 * 1000,       // 6 hours  
    market: 60 * 60 * 1000,           // 1 hour
    insights: 12 * 60 * 60 * 1000     // 12 hours
  }

  async get<T>(key: string, type: keyof typeof this.TTL): Promise<T | null> {
    // 1. Check memory cache first
    const memoryEntry = this.memoryCache.get(key)
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      return memoryEntry.data
    }

    // 2. Check localStorage
    const stored = localStorage.getItem(key)
    if (stored) {
      const entry = JSON.parse(stored) as CacheEntry
      if (!this.isExpired(entry)) {
        // Promote to memory cache
        this.memoryCache.set(key, entry)
        return entry.data
      }
    }

    // 3. Check IndexedDB for large data
    if (type === 'profile' || type === 'skills') {
      const dbEntry = await this.getFromIndexedDB(key)
      if (dbEntry && !this.isExpired(dbEntry)) {
        return dbEntry.data
      }
    }

    return null
  }

  async set<T>(key: string, value: T, type: keyof typeof this.TTL): Promise<void> {
    const entry: CacheEntry = {
      data: value,
      timestamp: Date.now(),
      expiry: Date.now() + this.TTL[type]
    }

    // Store in memory cache
    this.memoryCache.set(key, entry)

    // Store in localStorage for small data
    if (this.getDataSize(value) < 5 * 1024) { // < 5KB
      localStorage.setItem(key, JSON.stringify(entry))
    }

    // Store in IndexedDB for large data
    if (type === 'profile' || type === 'skills') {
      await this.setInIndexedDB(key, entry)
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiry
  }

  private getDataSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size
  }
}
```

#### HTTP Caching
```typescript
// Service Worker for aggressive caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open('api-cache').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // Return cached response
            const cacheDate = new Date(response.headers.get('date'))
            const now = new Date()
            const age = now.getTime() - cacheDate.getTime()
            
            // Cache for 5 minutes for API calls
            if (age < 5 * 60 * 1000) {
              return response
            }
          }
          
          // Fetch and cache new response
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          })
        })
      })
    )
  }
})
```

### Image Optimization

```typescript
// Responsive image component with lazy loading
const OptimizedImage = ({ src, alt, sizes, className }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">Failed to load</span>
        </div>
      )}
    </div>
  )
}
```

## 📊 Monitoring Setup

### Application Performance Monitoring

#### Performance Observer API
```typescript
class PerformanceMonitor {
  private metrics = new Map<string, number[]>()

  init() {
    // Monitor paint metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric(entry.name, entry.startTime)
      }
    }).observe({ entryTypes: ['paint'] })

    // Monitor navigation metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordNavigationMetrics(entry as PerformanceNavigationTiming)
      }
    }).observe({ entryTypes: ['navigation'] })

    // Monitor custom metrics
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric(entry.name, entry.duration)
      }
    }).observe({ entryTypes: ['measure'] })
  }

  recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      'dns-lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'tcp-connection': entry.connectEnd - entry.connectStart,
      'request': entry.responseStart - entry.requestStart,
      'response': entry.responseEnd - entry.responseStart,
      'dom-processing': entry.domComplete - entry.responseEnd,
      'load-complete': entry.loadEventEnd - entry.loadEventStart
    }

    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(name, value)
    })
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    
    return fn().finally(() => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
    })
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  getMetrics() {
    const result = {}
    
    this.metrics.forEach((values, name) => {
      result[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p95: this.percentile(values, 95),
        p99: this.percentile(values, 99)
      }
    })
    
    return result
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index]
  }
}

// Initialize monitoring
const performanceMonitor = new PerformanceMonitor()
performanceMonitor.init()
```

#### Error Tracking
```typescript
class ErrorTracker {
  private errorQueue: ErrorReport[] = []
  private reportingEndpoint = '/api/errors'

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    })

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href
      })
    })

    // React error boundary integration
    this.setupReactErrorBoundary()
  }

  reportError(error: ErrorReport) {
    this.errorQueue.push(error)
    
    // Batch send errors every 10 seconds
    this.throttledSend()
  }

  private throttledSend = debounce(() => {
    if (this.errorQueue.length === 0) return

    const errors = [...this.errorQueue]
    this.errorQueue = []

    fetch(this.reportingEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ errors })
    }).catch(() => {
      // Re-queue errors if sending fails
      this.errorQueue.unshift(...errors)
    })
  }, 10000)

  private setupReactErrorBoundary() {
    const originalComponentDidCatch = React.Component.prototype.componentDidCatch
    
    React.Component.prototype.componentDidCatch = function(error, errorInfo) {
      this.reportError({
        type: 'react',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: Date.now(),
        url: window.location.href
      })
      
      if (originalComponentDidCatch) {
        originalComponentDidCatch.call(this, error, errorInfo)
      }
    }
  }
}
```

### Health Monitoring

#### Application Health Checks
```typescript
class HealthMonitor {
  private checks: HealthCheck[] = []
  private status: HealthStatus = 'healthy'

  registerCheck(name: string, check: () => Promise<boolean | HealthCheckResult>) {
    this.checks.push({ name, check })
  }

  async runHealthChecks(): Promise<HealthReport> {
    const results = await Promise.allSettled(
      this.checks.map(async ({ name, check }) => {
        const start = performance.now()
        
        try {
          const result = await check()
          const duration = performance.now() - start
          
          return {
            name,
            status: result === true || result.status === 'healthy' ? 'healthy' : 'unhealthy',
            duration,
            details: typeof result === 'object' ? result.details : undefined
          }
        } catch (error) {
          return {
            name,
            status: 'unhealthy' as const,
            duration: performance.now() - start,
            error: error.message
          }
        }
      })
    )

    const healthChecks = results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        name: 'unknown',
        status: 'unhealthy' as const,
        duration: 0,
        error: 'Health check failed'
      }
    )

    const overallStatus = healthChecks.every(check => check.status === 'healthy') 
      ? 'healthy' : 'unhealthy'

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      uptime: performance.now()
    }
  }
}

// Setup health checks
const healthMonitor = new HealthMonitor()

// Memory usage check
healthMonitor.registerCheck('memory', async () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
    
    return {
      status: usedRatio < 0.9 ? 'healthy' : 'unhealthy',
      details: {
        used: memory.usedJSHeapSize,
        total: memory.jsHeapSizeLimit,
        ratio: usedRatio
      }
    }
  }
  
  return true
})

// API connectivity check
healthMonitor.registerCheck('api', async () => {
  try {
    const response = await fetch('/api/health', { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
})

// Cache health check
healthMonitor.registerCheck('cache', async () => {
  try {
    const testKey = 'health-check'
    localStorage.setItem(testKey, 'test')
    const value = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    return value === 'test'
  } catch {
    return false
  }
})
```

### Real-time Monitoring Dashboard

```tsx
const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>()
  const [health, setHealth] = useState<HealthReport>()
  const [errors, setErrors] = useState<ErrorReport[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      // Update metrics
      setMetrics(performanceMonitor.getMetrics())
      
      // Update health status
      const healthReport = await healthMonitor.runHealthChecks()
      setHealth(healthReport)
      
      // Update error log
      const recentErrors = await getRecentErrors()
      setErrors(recentErrors)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="space-y-3">
              <MetricRow 
                label="Page Load"
                value={`${metrics['load-complete']?.avg?.toFixed(0)}ms`}
                status={metrics['load-complete']?.avg < 3000 ? 'good' : 'warning'}
              />
              <MetricRow 
                label="API Response"
                value={`${metrics['api-request']?.avg?.toFixed(0)}ms`}
                status={metrics['api-request']?.avg < 2000 ? 'good' : 'warning'}
              />
              <MetricRow 
                label="Analysis Time"
                value={`${metrics['profile-analysis']?.avg?.toFixed(1)}s`}
                status={metrics['profile-analysis']?.avg < 5 ? 'good' : 'warning'}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          {health && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Overall Status</span>
                <Badge variant={health.status === 'healthy' ? 'success' : 'destructive'}>
                  {health.status}
                </Badge>
              </div>
              
              {health.checks.map(check => (
                <div key={check.name} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{check.name}</span>
                  <Badge 
                    variant={check.status === 'healthy' ? 'secondary' : 'destructive'}
                    size="sm"
                  >
                    {check.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="text-sm p-2 bg-muted rounded">
                <div className="font-medium text-red-600">{error.type}</div>
                <div className="text-muted-foreground">{error.message}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {errors.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent errors</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🎯 Performance Best Practices

### Development Guidelines

1. **Measure First**: Always measure before optimizing
2. **Profile Regularly**: Use React Developer Tools Profiler
3. **Monitor Bundle Size**: Keep track of dependency additions
4. **Test on Slower Devices**: Use Chrome DevTools device emulation
5. **Optimize Images**: Use next-gen formats (WebP, AVIF)
6. **Lazy Load Everything**: Components, images, and data
7. **Cache Aggressively**: But invalidate correctly
8. **Minimize Re-renders**: Use React.memo and useMemo wisely

### Production Checklist

- [ ] Bundle analyzer run and optimized
- [ ] Lighthouse score > 90 in all categories
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Health checks implemented
- [ ] CDN configured for static assets
- [ ] Caching headers set correctly
- [ ] Service worker implemented
- [ ] Critical CSS inlined
- [ ] Images optimized and served in modern formats

This performance and monitoring setup ensures your LinkedIn Analytics application runs smoothly and provides excellent user experience while giving you visibility into system health and performance metrics.