# API Documentation

This comprehensive API documentation covers all available endpoints, integration patterns, and usage examples for the LinkedIn Analytics & Growth Advisor application.

## 🎯 Overview

The LinkedIn Analytics API provides programmatic access to profile analysis, skills assessment, and growth recommendations. The API is designed for developers who want to integrate LinkedIn analytics capabilities into their own applications.

### Base URL
```
Production: https://api.linkedin-analytics.com
Development: http://localhost:3000/api
```

### Authentication
Currently, the API operates without authentication for public profile analysis. Future versions may include API key authentication for enhanced features.

### Response Format
All API responses follow a consistent JSON structure:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "processingTime": 1234,
    "version": "1.0.0"
  },
  "error": null
}
```

## 📋 Core Endpoints

### Profile Analysis

#### Analyze LinkedIn Profile
```http
POST /api/analyze
```

Analyzes a LinkedIn profile and returns comprehensive insights.

**Request Body:**
```json
{
  "username": "billgates",
  "options": {
    "includeSkills": true,
    "includeExperience": true,
    "generateRecommendations": true,
    "marketAnalysis": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "billgates",
      "fullName": "Bill Gates",
      "headline": "Co-chair, Bill & Melinda Gates Foundation",
      "location": "Seattle, Washington, United States",
      "profileScore": 95,
      "completeness": "high",
      "industry": "Philanthropy",
      "connections": "500+",
      "followers": "35M+",
      "profilePictureUrl": "https://media.licdn.com/...",
      "backgroundImageUrl": "https://media.licdn.com/...",
      "summary": "Co-chair of the Bill & Melinda Gates Foundation...",
      "skills": [
        {
          "name": "Strategic Planning",
          "endorsements": 150,
          "category": "leadership"
        }
      ],
      "experience": [
        {
          "title": "Co-chair",
          "company": "Bill & Melinda Gates Foundation",
          "startDate": "2000-01",
          "endDate": null,
          "current": true,
          "description": "Leading global health and education initiatives..."
        }
      ],
      "education": [
        {
          "school": "Harvard University",
          "degree": "Bachelor's degree",
          "field": "Mathematics and Computer Science",
          "startYear": 1973,
          "endYear": 1975
        }
      ]
    },
    "analysis": {
      "strengths": [
        "Exceptional leadership experience",
        "Strong industry recognition",
        "Comprehensive skill portfolio"
      ],
      "improvements": [
        "Add more recent project details",
        "Include specific metrics and achievements"
      ],
      "recommendations": [
        {
          "type": "skill",
          "priority": "high",
          "title": "Add AI/Machine Learning skills",
          "description": "Emerging trend in philanthropy sector",
          "timeToImplement": "2-3 months"
        }
      ]
    },
    "skillsAnalysis": {
      "currentSkills": [
        {
          "name": "Strategic Planning",
          "level": "expert",
          "marketDemand": "high",
          "salaryImpact": 15,
          "category": "leadership"
        }
      ],
      "missingSkills": [
        {
          "name": "Data Science",
          "priority": "medium",
          "timeToAcquire": 6,
          "salaryImpact": 20,
          "demandLevel": "very-high"
        }
      ],
      "skillGaps": [
        {
          "category": "technical",
          "gap": "moderate",
          "recommendations": ["Python", "Data Analysis", "AI/ML"]
        }
      ]
    },
    "marketIntelligence": {
      "industryBenchmark": {
        "averageScore": 72,
        "topSkills": ["Leadership", "Strategy", "Innovation"],
        "emergingSkills": ["AI/ML", "Data Science", "Digital Transformation"]
      },
      "salaryData": {
        "range": {
          "min": 150000,
          "max": 500000
        },
        "median": 250000,
        "percentile": 95
      },
      "demandMetrics": {
        "jobOpenings": 1234,
        "growthRate": 15,
        "competitionLevel": "high"
      }
    }
  },
  "metadata": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "processingTime": 2341,
    "version": "1.0.0",
    "source": "ai-enhanced",
    "confidence": 0.95
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "LinkedIn profile not found or not accessible",
    "details": {
      "username": "invaliduser",
      "suggestions": ["Check username spelling", "Verify profile is public"]
    }
  },
  "metadata": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "processingTime": 456
  }
}
```

### Skills Analysis

#### Get Skills Analysis
```http
GET /api/skills/{username}
```

Returns detailed skills analysis for a LinkedIn profile.

**Parameters:**
- `username` (string, required): LinkedIn username
- `industry` (string, optional): Filter by industry
- `level` (string, optional): Experience level (entry, mid, senior, executive)

**Example Request:**
```http
GET /api/skills/billgates?industry=technology&level=executive
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSkills": 45,
      "technicalSkills": 15,
      "softSkills": 20,
      "industrySkills": 10,
      "overallRating": "excellent"
    },
    "skillsByCategory": {
      "leadership": [
        {
          "name": "Strategic Planning",
          "level": "expert",
          "endorsements": 150,
          "marketDemand": "high",
          "salaryImpact": 15
        }
      ],
      "technical": [
        {
          "name": "Software Development",
          "level": "advanced",
          "endorsements": 89,
          "marketDemand": "very-high",
          "salaryImpact": 25
        }
      ]
    },
    "recommendations": [
      {
        "skill": "Artificial Intelligence",
        "priority": "high",
        "reasoning": "Emerging trend in industry",
        "timeToAcquire": 3,
        "resources": [
          {
            "type": "course",
            "name": "AI for Leaders",
            "provider": "Coursera",
            "duration": "4 weeks",
            "cost": "free"
          }
        ]
      }
    ],
    "marketTrends": {
      "topTrending": ["AI/ML", "Cloud Computing", "Data Science"],
      "declining": ["Legacy Systems", "Manual Processes"],
      "stable": ["Project Management", "Leadership", "Communication"]
    }
  }
}
```

### Market Intelligence

#### Get Market Data
```http
GET /api/market
```

Returns market intelligence data for specific industries and locations.

**Query Parameters:**
- `industry` (string, required): Industry name
- `location` (string, optional): Geographic location
- `skills` (array, optional): Specific skills to analyze
- `level` (string, optional): Experience level

**Example Request:**
```http
GET /api/market?industry=technology&location=san-francisco&skills=javascript,react,nodejs&level=senior
```

**Response:**
```json
{
  "success": true,
  "data": {
    "industry": "Technology",
    "location": "San Francisco, CA",
    "demandMetrics": {
      "jobOpenings": 15420,
      "averageSalary": 165000,
      "growthRate": 12.5,
      "competitionIndex": 8.2
    },
    "skillDemand": [
      {
        "skill": "JavaScript",
        "demandLevel": 9.5,
        "averageSalary": 145000,
        "jobCount": 3420,
        "growthRate": 15.2
      }
    ],
    "salaryRanges": {
      "entry": { "min": 85000, "max": 120000, "median": 102000 },
      "mid": { "min": 120000, "max": 180000, "median": 150000 },
      "senior": { "min": 180000, "max": 300000, "median": 225000 },
      "executive": { "min": 300000, "max": 500000, "median": 400000 }
    },
    "trends": {
      "emerging": ["AI/ML", "Blockchain", "IoT"],
      "growing": ["Cloud Computing", "DevOps", "React"],
      "stable": ["JavaScript", "Python", "Java"],
      "declining": ["Flash", "jQuery", "Legacy Systems"]
    },
    "topCompanies": [
      {
        "name": "Google",
        "averageSalary": 185000,
        "openPositions": 234,
        "difficulty": "high"
      }
    ]
  }
}
```

## 🔧 Integration Examples

### JavaScript/TypeScript Client

```typescript
class LinkedInAnalyticsClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL = 'https://api.linkedin-analytics.com') {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  async analyzeProfile(username: string, options?: AnalysisOptions): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseURL}/api/analyze`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify({ username, options })
    })

    if (!response.ok) {
      throw new APIError(`Analysis failed: ${response.statusText}`, response.status)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new APIError(result.error.message, result.error.code)
    }

    return result.data
  }

  async getSkillsAnalysis(username: string, filters?: SkillsFilters): Promise<SkillsAnalysis> {
    const params = new URLSearchParams()
    if (filters?.industry) params.append('industry', filters.industry)
    if (filters?.level) params.append('level', filters.level)

    const response = await fetch(`${this.baseURL}/api/skills/${username}?${params}`, {
      headers: this.defaultHeaders
    })

    if (!response.ok) {
      throw new APIError(`Skills analysis failed: ${response.statusText}`, response.status)
    }

    const result = await response.json()
    return result.data
  }

  async getMarketIntelligence(query: MarketQuery): Promise<MarketData> {
    const params = new URLSearchParams()
    params.append('industry', query.industry)
    if (query.location) params.append('location', query.location)
    if (query.skills) params.append('skills', query.skills.join(','))
    if (query.level) params.append('level', query.level)

    const response = await fetch(`${this.baseURL}/api/market?${params}`, {
      headers: this.defaultHeaders
    })

    if (!response.ok) {
      throw new APIError(`Market data failed: ${response.statusText}`, response.status)
    }

    const result = await response.json()
    return result.data
  }
}

class APIError extends Error {
  constructor(message: string, public code: string | number) {
    super(message)
    this.name = 'APIError'
  }
}

// Usage example
const client = new LinkedInAnalyticsClient()

async function example() {
  try {
    // Analyze a profile
    const analysis = await client.analyzeProfile('billgates', {
      includeSkills: true,
      generateRecommendations: true
    })

    console.log('Profile score:', analysis.profile.profileScore)
    console.log('Recommendations:', analysis.analysis.recommendations)

    // Get skills analysis
    const skills = await client.getSkillsAnalysis('billgates', {
      industry: 'technology',
      level: 'executive'
    })

    console.log('Top skills:', skills.skillsByCategory.technical)

    // Get market data
    const market = await client.getMarketIntelligence({
      industry: 'technology',
      location: 'san-francisco',
      skills: ['javascript', 'react', 'nodejs'],
      level: 'senior'
    })

    console.log('Average salary:', market.demandMetrics.averageSalary)

  } catch (error) {
    if (error instanceof APIError) {
      console.error('API Error:', error.message, error.code)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
```

### Python Client

```python
import requests
from typing import Dict, List, Optional
import json

class LinkedInAnalyticsClient:
    def __init__(self, base_url: str = "https://api.linkedin-analytics.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def analyze_profile(self, username: str, options: Optional[Dict] = None) -> Dict:
        """Analyze a LinkedIn profile"""
        payload = {'username': username}
        if options:
            payload['options'] = options

        response = self.session.post(
            f"{self.base_url}/api/analyze",
            json=payload
        )
        
        response.raise_for_status()
        result = response.json()
        
        if not result.get('success'):
            raise APIError(result.get('error', {}).get('message', 'Unknown error'))
        
        return result['data']

    def get_skills_analysis(self, username: str, **filters) -> Dict:
        """Get skills analysis for a profile"""
        params = {k: v for k, v in filters.items() if v is not None}
        
        response = self.session.get(
            f"{self.base_url}/api/skills/{username}",
            params=params
        )
        
        response.raise_for_status()
        result = response.json()
        return result['data']

    def get_market_intelligence(self, industry: str, **kwargs) -> Dict:
        """Get market intelligence data"""
        params = {'industry': industry}
        params.update({k: v for k, v in kwargs.items() if v is not None})
        
        response = self.session.get(
            f"{self.base_url}/api/market",
            params=params
        )
        
        response.raise_for_status()
        result = response.json()
        return result['data']

class APIError(Exception):
    pass

# Usage example
def main():
    client = LinkedInAnalyticsClient()
    
    try:
        # Analyze profile
        analysis = client.analyze_profile('billgates', {
            'includeSkills': True,
            'generateRecommendations': True
        })
        
        print(f"Profile score: {analysis['profile']['profileScore']}")
        print(f"Recommendations: {len(analysis['analysis']['recommendations'])}")
        
        # Get skills analysis
        skills = client.get_skills_analysis('billgates', 
            industry='technology',
            level='executive'
        )
        
        print(f"Total skills: {skills['overview']['totalSkills']}")
        
        # Get market data
        market = client.get_market_intelligence('technology',
            location='san-francisco',
            skills='javascript,react,nodejs',
            level='senior'
        )
        
        print(f"Average salary: ${market['demandMetrics']['averageSalary']:,}")
        
    except APIError as e:
        print(f"API Error: {e}")
    except requests.RequestException as e:
        print(f"Request Error: {e}")

if __name__ == "__main__":
    main()
```

## 🚦 Rate Limiting

### Current Limits
- **Profile Analysis**: 60 requests per hour per IP
- **Skills Analysis**: 100 requests per hour per IP  
- **Market Intelligence**: 200 requests per hour per IP

### Headers
Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### Handling Rate Limits

```typescript
async function handleRateLimit<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall()
  } catch (error) {
    if (error.status === 429) {
      const resetTime = error.headers['X-RateLimit-Reset']
      const waitTime = (parseInt(resetTime) * 1000) - Date.now()
      
      console.log(`Rate limited. Waiting ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
      
      return await apiCall() // Retry after rate limit reset
    }
    throw error
  }
}
```

## 📊 Response Codes

### Success Codes
- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `202` - Accepted: Request accepted for processing

### Client Error Codes
- `400` - Bad Request: Invalid request parameters
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Access denied
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `429` - Too Many Requests: Rate limit exceeded

### Server Error Codes
- `500` - Internal Server Error: Unexpected server error
- `502` - Bad Gateway: Upstream service error
- `503` - Service Unavailable: Service temporarily unavailable
- `504` - Gateway Timeout: Request timeout

## 🔐 Security

### Data Privacy
- No personal data is stored permanently
- All data encrypted in transit (HTTPS/TLS 1.3)
- Only public profile information is accessed
- GDPR and privacy law compliant

### Best Practices
- Use HTTPS for all requests
- Implement proper error handling
- Respect rate limits
- Cache responses appropriately
- Validate all input data

## 📈 Performance

### Response Times
- **Profile Analysis**: 2-5 seconds average
- **Skills Analysis**: 1-3 seconds average
- **Market Intelligence**: 0.5-2 seconds average

### Optimization Tips
- Cache responses when possible
- Use appropriate query parameters
- Implement pagination for large datasets
- Monitor rate limits
- Use compression (gzip/brotli)

## 🔄 Versioning

The API uses semantic versioning in the URL path:

```
Current: /api/v1/analyze
Future: /api/v2/analyze
```

Version-specific features and deprecation notices will be documented in release notes.

---

This API documentation provides comprehensive coverage for integrating with the LinkedIn Analytics & Growth Advisor. For additional examples and advanced use cases, see the [Examples section](Examples.md).