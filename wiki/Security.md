# Security Guide

This comprehensive security guide covers all security aspects of the LinkedIn Analytics & Growth Advisor application, including data protection, input validation, secure coding practices, and compliance requirements.

## 🛡️ Security Overview

### Security Architecture

The LinkedIn Analytics application implements defense-in-depth security with multiple layers:

1. **Input Validation Layer** - Sanitizes and validates all user inputs
2. **Rate Limiting Layer** - Prevents abuse and DoS attacks
3. **Transport Security** - Encrypts data in transit
4. **Content Security** - Protects against XSS and injection attacks
5. **Privacy Protection** - Ensures GDPR and privacy compliance

### Security Principles

- **Least Privilege**: Only access necessary public data
- **Defense in Depth**: Multiple security layers
- **Zero Trust**: Validate everything, trust nothing
- **Privacy by Design**: Privacy built into the architecture
- **Fail Secure**: Secure defaults and failure modes

## 🔒 Input Validation & Sanitization

### LinkedIn Username Validation

```typescript
import DOMPurify from 'isomorphic-dompurify'

interface ValidationResult {
  isValid: boolean
  sanitized?: string
  error?: string
}

class InputValidator {
  private static readonly LINKEDIN_USERNAME_PATTERN = /^[a-zA-Z0-9\-_.]{1,100}$/
  private static readonly MAX_INPUT_LENGTH = 200

  static validateLinkedInUsername(input: string): ValidationResult {
    // Step 1: Basic input sanitization
    const trimmed = input.trim()
    if (!trimmed) {
      return { isValid: false, error: 'Username is required' }
    }

    // Step 2: Length validation
    if (trimmed.length > this.MAX_INPUT_LENGTH) {
      return { isValid: false, error: 'Username is too long' }
    }

    // Step 3: Extract username from various URL formats
    const username = this.extractUsername(trimmed)
    if (!username) {
      return { isValid: false, error: 'Invalid LinkedIn URL or username' }
    }

    // Step 4: Sanitize with DOMPurify
    const sanitized = DOMPurify.sanitize(username)
    if (sanitized !== username) {
      return { isValid: false, error: 'Username contains invalid characters' }
    }

    // Step 5: Pattern validation
    if (!this.LINKEDIN_USERNAME_PATTERN.test(sanitized)) {
      return { isValid: false, error: 'Invalid username format' }
    }

    // Step 6: Blacklist check
    if (this.isBlacklisted(sanitized)) {
      return { isValid: false, error: 'Username not allowed' }
    }

    return { isValid: true, sanitized }
  }

  private static extractUsername(input: string): string | null {
    // Handle direct username
    if (!input.includes('/')) {
      return input
    }

    // Handle various LinkedIn URL formats
    const urlPatterns = [
      /linkedin\.com\/in\/([^\/\?#]+)/i,
      /linkedin\.com\/pub\/([^\/\?#]+)/i,
      /linkedin\.com\/profile\/view\?id=([^&]+)/i
    ]

    for (const pattern of urlPatterns) {
      const match = input.match(pattern)
      if (match && match[1]) {
        return match[1].replace(/\/$/, '') // Remove trailing slash
      }
    }

    return null
  }

  private static isBlacklisted(username: string): boolean {
    const blacklist = [
      'admin', 'api', 'root', 'system', 'test', 'demo',
      'linkedin', 'help', 'support', 'security', 'privacy'
    ]
    
    return blacklist.includes(username.toLowerCase())
  }

  static validateSearchQuery(query: string): ValidationResult {
    const trimmed = query.trim()
    
    if (!trimmed) {
      return { isValid: false, error: 'Search query is required' }
    }

    if (trimmed.length > 500) {
      return { isValid: false, error: 'Search query is too long' }
    }

    // Remove potentially dangerous characters
    const sanitized = DOMPurify.sanitize(trimmed)
    
    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\b(script|javascript|vbscript|onload|onerror)\b)/i
    ]

    for (const pattern of sqlPatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, error: 'Invalid characters in search query' }
      }
    }

    return { isValid: true, sanitized }
  }
}

// Usage in components
export function useSecureInput() {
  const validateInput = useCallback((input: string, type: 'username' | 'search') => {
    switch (type) {
      case 'username':
        return InputValidator.validateLinkedInUsername(input)
      case 'search':
        return InputValidator.validateSearchQuery(input)
      default:
        return { isValid: false, error: 'Invalid input type' }
    }
  }, [])

  return { validateInput }
}
```

### Content Security Policy (CSP)

```html
<!-- Content Security Policy Headers -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://media.licdn.com https://static.licdn.com;
  connect-src 'self' https://api.linkedin.com https://linkedin.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
">
```

```typescript
// CSP configuration for Vite
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob:;
        connect-src 'self' ws: wss:;
      `.replace(/\s+/g, ' ').trim()
    }
  }
})
```

## 🚦 Rate Limiting & Abuse Prevention

### Advanced Rate Limiting

```typescript
interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

class AdvancedRateLimiter {
  private requestCounts = new Map<string, RequestWindow[]>()
  private blacklist = new Set<string>()
  private whitelist = new Set<string>()

  constructor(private configs: Map<string, RateLimitConfig>) {}

  async checkLimit(
    identifier: string, 
    endpoint: string, 
    request?: Request
  ): Promise<RateLimitResult> {
    // Check if identifier is blacklisted
    if (this.blacklist.has(identifier)) {
      return {
        allowed: false,
        reason: 'blacklisted',
        retryAfter: Infinity
      }
    }

    // Skip rate limiting for whitelisted identifiers
    if (this.whitelist.has(identifier)) {
      return { allowed: true }
    }

    const config = this.configs.get(endpoint)
    if (!config) {
      return { allowed: true } // No rate limit configured
    }

    const now = Date.now()
    const windowStart = now - config.windowMs
    
    // Get or create request window for this identifier
    if (!this.requestCounts.has(identifier)) {
      this.requestCounts.set(identifier, [])
    }

    const requests = this.requestCounts.get(identifier)!
    
    // Remove old requests outside the window
    const validRequests = requests.filter(req => req.timestamp > windowStart)
    this.requestCounts.set(identifier, validRequests)

    // Check if limit exceeded
    if (validRequests.length >= config.maxRequests) {
      // Calculate retry after time
      const oldestRequest = Math.min(...validRequests.map(r => r.timestamp))
      const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000)

      // Add to temporary blacklist if abuse is detected
      if (this.detectAbuse(identifier, validRequests)) {
        this.blacklist.add(identifier)
        setTimeout(() => this.blacklist.delete(identifier), 24 * 60 * 60 * 1000) // 24 hours
      }

      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        retryAfter,
        limit: config.maxRequests,
        remaining: 0,
        resetTime: oldestRequest + config.windowMs
      }
    }

    // Record this request
    validRequests.push({
      timestamp: now,
      endpoint,
      userAgent: request?.headers.get('user-agent') || 'unknown'
    })

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - validRequests.length,
      resetTime: now + config.windowMs
    }
  }

  private detectAbuse(identifier: string, requests: RequestWindow[]): boolean {
    // Detect rapid successive requests (potential bot)
    const rapidRequests = requests.filter((req, index) => {
      if (index === 0) return false
      const timeDiff = req.timestamp - requests[index - 1].timestamp
      return timeDiff < 100 // Less than 100ms between requests
    })

    // Abuse if more than 50% of requests are rapid
    return rapidRequests.length > requests.length * 0.5
  }

  addToWhitelist(identifier: string) {
    this.whitelist.add(identifier)
  }

  addToBlacklist(identifier: string, duration = 24 * 60 * 60 * 1000) {
    this.blacklist.add(identifier)
    setTimeout(() => this.blacklist.delete(identifier), duration)
  }
}

// Rate limiter configuration
const rateLimiter = new AdvancedRateLimiter(new Map([
  ['profile_analysis', {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5
  }],
  ['skills_analysis', {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  }],
  ['market_intelligence', {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20
  }]
]))

// Usage in API routes
async function handleProfileAnalysis(request: Request): Promise<Response> {
  const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitResult = await rateLimiter.checkLimit(clientIP, 'profile_analysis', request)

  if (!rateLimitResult.allowed) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      retryAfter: rateLimitResult.retryAfter
    }), {
      status: 429,
      headers: {
        'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
        'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '5',
        'X-RateLimit-Remaining': '0'
      }
    })
  }

  // Process request...
  return new Response(JSON.stringify({ success: true }))
}
```

## 🔐 Data Protection & Privacy

### Privacy Compliance

```typescript
class PrivacyManager {
  private static readonly DATA_RETENTION_DAYS = 30
  private static readonly GDPR_APPLICABLE_REGIONS = ['EU', 'UK', 'EEA']

  static isGDPRApplicable(request: Request): boolean {
    const country = request.headers.get('cf-ipcountry') || 
                   request.headers.get('x-country-code')
    
    return this.GDPR_APPLICABLE_REGIONS.includes(country || '')
  }

  static sanitizeProfileData(data: ProfileData): ProfileData {
    return {
      ...data,
      // Remove potentially sensitive information
      email: undefined,
      phone: undefined,
      address: undefined,
      // Keep only public profile URL, not internal IDs
      profileId: undefined,
      // Anonymize connection data
      connections: data.connections ? '500+' : undefined
    }
  }

  static async logDataProcessing(
    purpose: string,
    dataType: string,
    retention: number = this.DATA_RETENTION_DAYS
  ) {
    const log = {
      timestamp: new Date().toISOString(),
      purpose,
      dataType,
      retention,
      legalBasis: 'legitimate_interest', // For profile analysis
      processor: 'LinkedIn Analytics System'
    }

    // Store in compliance log
    await this.storeComplianceLog(log)
  }

  static async handleDataDeletionRequest(identifier: string) {
    // Remove all cached data for this identifier
    await this.deleteCachedData(identifier)
    
    // Log the deletion
    await this.logDataProcessing('deletion_request', 'all_data', 0)
  }

  static generatePrivacyReport(): PrivacyReport {
    return {
      dataCollected: [
        'Public LinkedIn profile information',
        'Skills and experience data',
        'Industry and location data'
      ],
      dataNotCollected: [
        'Private messages',
        'Email addresses',
        'Phone numbers',
        'Private connections',
        'Personal documents'
      ],
      purposes: [
        'Profile analysis and scoring',
        'Skills gap identification',
        'Career recommendations',
        'Market intelligence'
      ],
      legalBasis: 'Legitimate interest for career development services',
      retentionPeriod: `${this.DATA_RETENTION_DAYS} days`,
      dataProcessors: ['GitHub Spark Platform'],
      userRights: [
        'Access to processed data',
        'Data correction',
        'Data deletion',
        'Processing restriction',
        'Data portability'
      ]
    }
  }
}
```

### Secure Data Handling

```typescript
class SecureDataHandler {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  private static readonly HASH_SALT = process.env.HASH_SALT

  static async hashSensitiveData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(this.HASH_SALT + data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  static async encryptData(data: string): Promise<string> {
    if (!this.ENCRYPTION_KEY) {
      throw new Error('Encryption key not configured')
    }

    const encoder = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    )

    const encryptedArray = new Uint8Array(encrypted)
    const combined = new Uint8Array(iv.length + encryptedArray.length)
    combined.set(iv)
    combined.set(encryptedArray, iv.length)

    return btoa(String.fromCharCode(...combined))
  }

  static async decryptData(encryptedData: string): Promise<string> {
    if (!this.ENCRYPTION_KEY) {
      throw new Error('Encryption key not configured')
    }

    const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(this.ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )

    return new TextDecoder().decode(decrypted)
  }

  static sanitizeLogData(data: any): any {
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'email', 'phone']
    
    if (typeof data !== 'object' || data === null) {
      return data
    }

    const sanitized = { ...data }
    
    for (const key in sanitized) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeLogData(sanitized[key])
      }
    }

    return sanitized
  }
}
```

## 🔍 Security Monitoring

### Security Event Detection

```typescript
class SecurityMonitor {
  private events: SecurityEvent[] = []
  private alerts: SecurityAlert[] = []

  logSecurityEvent(event: SecurityEvent) {
    this.events.push({
      ...event,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    })

    // Check for security patterns
    this.analyzeSecurityPatterns()
  }

  private analyzeSecurityPatterns() {
    const recentEvents = this.events.filter(
      event => Date.now() - event.timestamp < 5 * 60 * 1000 // Last 5 minutes
    )

    // Multiple failed attempts from same IP
    const failedAttempts = recentEvents.filter(
      event => event.type === 'validation_failed'
    )
    
    const ipCounts = new Map<string, number>()
    failedAttempts.forEach(event => {
      const count = ipCounts.get(event.source) || 0
      ipCounts.set(event.source, count + 1)
    })

    for (const [ip, count] of ipCounts) {
      if (count >= 10) {
        this.createAlert({
          type: 'brute_force_attempt',
          severity: 'high',
          description: `${count} failed validation attempts from ${ip}`,
          source: ip,
          recommendation: 'Consider blocking this IP address'
        })
      }
    }

    // Unusual user agent patterns
    const userAgents = recentEvents.map(event => event.userAgent).filter(Boolean)
    const suspiciousUAs = userAgents.filter(ua => 
      ua.includes('bot') || 
      ua.includes('crawler') || 
      ua.includes('script') ||
      !ua.includes('Mozilla')
    )

    if (suspiciousUAs.length > 5) {
      this.createAlert({
        type: 'suspicious_user_agents',
        severity: 'medium',
        description: `${suspiciousUAs.length} requests from suspicious user agents`,
        recommendation: 'Review automated access patterns'
      })
    }
  }

  private createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>) {
    const newAlert: SecurityAlert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }

    this.alerts.push(newAlert)

    // Send alert if severity is high
    if (alert.severity === 'high') {
      this.sendSecurityAlert(newAlert)
    }
  }

  private async sendSecurityAlert(alert: SecurityAlert) {
    // In production, send to security team
    console.error('SECURITY ALERT:', alert)
    
    // Could integrate with alerting services:
    // - Email notifications
    // - Slack/Discord webhooks
    // - PagerDuty
    // - Security incident management systems
  }

  getSecurityReport(): SecurityReport {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000
    const recentEvents = this.events.filter(event => event.timestamp > last24Hours)
    const recentAlerts = this.alerts.filter(alert => alert.timestamp > last24Hours)

    return {
      period: '24h',
      totalEvents: recentEvents.length,
      eventsByType: this.groupEventsByType(recentEvents),
      alerts: recentAlerts,
      riskLevel: this.calculateRiskLevel(recentEvents, recentAlerts),
      recommendations: this.generateRecommendations(recentEvents, recentAlerts)
    }
  }

  private calculateRiskLevel(events: SecurityEvent[], alerts: SecurityAlert[]): RiskLevel {
    const highSeverityAlerts = alerts.filter(alert => alert.severity === 'high').length
    const mediumSeverityAlerts = alerts.filter(alert => alert.severity === 'medium').length
    const failedValidations = events.filter(event => event.type === 'validation_failed').length

    if (highSeverityAlerts > 0 || failedValidations > 100) {
      return 'high'
    } else if (mediumSeverityAlerts > 0 || failedValidations > 50) {
      return 'medium'
    } else {
      return 'low'
    }
  }
}

// Initialize security monitoring
const securityMonitor = new SecurityMonitor()

// Usage in validation functions
export function validateWithSecurity<T>(
  input: string,
  validator: (input: string) => ValidationResult,
  request?: Request
): ValidationResult {
  const result = validator(input)
  
  if (!result.isValid) {
    securityMonitor.logSecurityEvent({
      type: 'validation_failed',
      source: request?.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      input: input.slice(0, 100), // Log first 100 chars only
      error: result.error
    })
  }

  return result
}
```

## 🛠️ Security Testing

### Automated Security Testing

```typescript
// Security test suite
describe('Security Tests', () => {
  describe('Input Validation', () => {
    test('should reject SQL injection attempts', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users (username) VALUES ('hacker'); --",
        '<script>alert("xss")</script>',
        'javascript:alert("xss")'
      ]

      maliciousInputs.forEach(input => {
        const result = InputValidator.validateLinkedInUsername(input)
        expect(result.isValid).toBe(false)
      })
    })

    test('should sanitize HTML and JavaScript', () => {
      const maliciousInputs = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        'javascript:void(0)',
        'data:text/html,<script>alert(1)</script>'
      ]

      maliciousInputs.forEach(input => {
        const result = InputValidator.validateSearchQuery(input)
        expect(result.isValid).toBe(false)
      })
    })

    test('should handle extremely long inputs', () => {
      const longInput = 'a'.repeat(10000)
      const result = InputValidator.validateLinkedInUsername(longInput)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('too long')
    })
  })

  describe('Rate Limiting', () => {
    test('should block requests after limit exceeded', async () => {
      const rateLimiter = new AdvancedRateLimiter(new Map([
        ['test', { windowMs: 60000, maxRequests: 3 }]
      ]))

      // First 3 requests should be allowed
      for (let i = 0; i < 3; i++) {
        const result = await rateLimiter.checkLimit('test-ip', 'test')
        expect(result.allowed).toBe(true)
      }

      // 4th request should be blocked
      const blockedResult = await rateLimiter.checkLimit('test-ip', 'test')
      expect(blockedResult.allowed).toBe(false)
      expect(blockedResult.reason).toBe('rate_limit_exceeded')
    })
  })

  describe('Data Sanitization', () => {
    test('should remove sensitive data from profiles', () => {
      const profileData = {
        username: 'testuser',
        email: 'test@example.com',
        phone: '+1234567890',
        skills: ['JavaScript', 'React']
      }

      const sanitized = PrivacyManager.sanitizeProfileData(profileData)
      expect(sanitized.email).toBeUndefined()
      expect(sanitized.phone).toBeUndefined()
      expect(sanitized.skills).toEqual(['JavaScript', 'React'])
    })

    test('should sanitize log data', () => {
      const logData = {
        username: 'testuser',
        password: 'secret123',
        apiKey: 'key_123456',
        publicInfo: 'safe data'
      }

      const sanitized = SecureDataHandler.sanitizeLogData(logData)
      expect(sanitized.password).toBe('[REDACTED]')
      expect(sanitized.apiKey).toBe('[REDACTED]')
      expect(sanitized.publicInfo).toBe('safe data')
    })
  })
})
```

## 🔧 Security Configuration

### Environment Security

```bash
# .env.example - Security-focused environment variables
# Application Security
ENCRYPTION_KEY=your-32-character-encryption-key-here
HASH_SALT=your-unique-salt-for-hashing
SECURITY_HEADERS_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
RATE_LIMIT_SKIP_SUCCESSFUL=false

# Privacy & Compliance
GDPR_MODE=auto
DATA_RETENTION_DAYS=30
ANALYTICS_ENABLED=true
ERROR_REPORTING_ENABLED=true

# Content Security Policy
CSP_ENABLED=true
CSP_REPORT_URI=https://your-domain.com/csp-report

# Monitoring
SECURITY_MONITORING_ENABLED=true
ALERT_WEBHOOK_URL=https://hooks.slack.com/your-webhook
```

### Security Headers Middleware

```typescript
export function securityHeaders(): Response {
  const headers = new Headers()

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Enforce HTTPS
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  
  // Control referrer information
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Feature policy
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return new Response(null, { headers })
}
```

## 📋 Security Checklist

### Development Security Checklist

- [ ] All user inputs validated and sanitized
- [ ] Rate limiting implemented for all endpoints
- [ ] Content Security Policy configured
- [ ] Security headers implemented
- [ ] HTTPS enforced in production
- [ ] Sensitive data encrypted at rest
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies regularly updated
- [ ] Security tests included in test suite
- [ ] Privacy compliance implemented

### Production Security Checklist

- [ ] Security monitoring enabled
- [ ] Automated vulnerability scanning
- [ ] Regular security audits scheduled
- [ ] Incident response plan documented
- [ ] Security team contact information available
- [ ] Backup and recovery procedures tested
- [ ] Access logs reviewed regularly
- [ ] Security metrics monitored
- [ ] Compliance requirements met
- [ ] Security documentation up to date

This comprehensive security guide ensures your LinkedIn Analytics application is protected against common threats while maintaining privacy compliance and user trust.