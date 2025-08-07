# Backend API Documentation

## Overview
The LinkedIn Analytics backend is a Node.js/Express RESTful API that provides comprehensive LinkedIn profile analysis, competitive benchmarking, and compensation insights.

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

## Authentication
All endpoints require an API key sent via:
- Header: `X-API-Key: your-api-key`
- Query parameter: `?apiKey=your-api-key`

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string,
  "timestamp": string
}
```

## Endpoints

### Health Check
#### GET /health
Check API server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Profile Analysis

### Analyze Profile
#### POST /api/profile/analyze
Analyze a LinkedIn profile and extract key metrics.

**Request Body:**
```json
{
  "linkedinUrl": "https://linkedin.com/in/username"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "headline": "Software Engineer | Full Stack Developer",
    "followers": 1500,
    "connections": 800,
    "posts": 75,
    "engagement": 6.2,
    "profileScore": 85,
    "industry": "Technology",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": 5,
    "location": "United States"
  }
}
```

### Get Profile Insights
#### GET /api/profile/:username/insights
Get detailed insights about a LinkedIn profile.

**Parameters:**
- `username` (string): LinkedIn username

**Response:**
```json
{
  "success": true,
  "data": {
    "strengths": ["Strong professional network", "Consistent posting"],
    "improvements": ["Increase posting frequency", "Add more skills"],
    "contentSuggestions": ["Share industry insights", "Post tutorials"],
    "networkingTips": ["Connect with peers", "Join groups"],
    "skillRecommendations": ["Learn AI/ML", "Get certified"]
  }
}
```

### Get Activity Metrics
#### GET /api/profile/:username/activity
Get activity and engagement metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "avgPostsPerWeek": 2,
    "engagementTrend": "increasing",
    "bestPostingDays": ["Tuesday", "Wednesday", "Thursday"],
    "bestPostingTimes": ["9:00 AM", "1:00 PM", "5:00 PM"],
    "audienceGrowth": 30,
    "contentTypes": [
      {
        "type": "Technical tutorials",
        "performance": "high"
      }
    ]
  }
}
```

### Analyze Visual Branding
#### GET /api/profile/:username/visual-branding
Analyze profile photo and banner.

**Response:**
```json
{
  "success": true,
  "data": {
    "hasPhoto": true,
    "hasBanner": false,
    "recommendations": [
      "Add a custom banner",
      "Ensure photo shows your face clearly"
    ]
  }
}
```

---

## Recommendations

### Generate Recommendations
#### POST /api/recommendations/generate
Generate personalized growth recommendations.

**Request Body:**
```json
{
  "profileData": {
    "name": "John Doe",
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "experience": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec-1",
      "category": "content",
      "title": "Share Weekly Industry Insights",
      "description": "Position yourself as a thought leader...",
      "priority": "high",
      "action": "Post 2-3 insights per week",
      "relatedSkills": ["JavaScript", "React"],
      "impactScore": 8
    }
  ]
}
```

### Get Skill Insights
#### POST /api/recommendations/skill-insights
Analyze market value of specific skills.

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 5,
  "industry": "Technology"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "skill": "JavaScript",
      "marketDemand": "high",
      "growth": "growing",
      "salary_impact": "high",
      "demandScore": 85,
      "averageSalaryIncrease": "15%",
      "learning_resources": ["JavaScript Masterclass", "Advanced JS Course"],
      "related_opportunities": ["JS Consultant", "Senior JS Developer"]
    }
  ]
}
```

### Get Trending Topics
#### POST /api/recommendations/trending-topics
Get trending topics relevant to profile.

**Request Body:**
```json
{
  "profileData": {
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "experience": 5
  }
}
```

### Get Content Strategy
#### GET /api/recommendations/content-strategy/:industry
Get content strategy recommendations.

**Parameters:**
- `industry` (string): Industry name
- `experience` (query): Experience level (entry/mid/senior/executive)

---

## Competitive Analysis

### Perform Competitive Analysis
#### POST /api/competitive/analyze
Comprehensive competitive analysis against industry peers.

**Request Body:**
```json
{
  "profileData": {
    "name": "John Doe",
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "experience": 5,
    "followers": 1500
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userProfile": { /* profile data */ },
    "competitors": [ /* competitor profiles */ ],
    "industryBenchmarks": {
      "avgFollowers": 2500,
      "avgEngagement": 4.5,
      "avgPostsPerMonth": 8
    },
    "userRanking": {
      "followers": { "rank": 5, "percentile": 65 },
      "engagement": { "rank": 3, "percentile": 80 }
    },
    "gapAnalysis": [
      {
        "category": "followers",
        "currentValue": 1500,
        "benchmarkValue": 2500,
        "gap": -1000,
        "recommendation": "Increase content frequency",
        "priority": "medium"
      }
    ]
  }
}
```

### Generate Competitive Profiles
#### POST /api/competitive/profiles
Generate competitive profiles for benchmarking.

**Request Body:**
```json
{
  "profileData": { /* profile data */ },
  "sampleSize": 10
}
```

### Get Industry Benchmarks
#### GET /api/competitive/benchmarks/:industry
Get industry-specific benchmarks.

---

## Compensation Analysis

### Analyze Compensation
#### POST /api/compensation/analyze
Comprehensive salary and compensation analysis.

**Request Body:**
```json
{
  "profileData": {
    "industry": "Technology",
    "skills": ["JavaScript", "React"],
    "experience": 5,
    "location": "United States"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentMarketPosition": {
      "estimatedSalaryRange": {
        "min": 90000,
        "median": 110000,
        "max": 135000
      },
      "percentileRanking": 75,
      "skillPremium": 15
    },
    "skillImpact": [
      {
        "skill": "React",
        "salaryPremium": 12,
        "demandLevel": "very-high",
        "avgSalaryIncrease": 18000,
        "topPayingCompanies": ["Google", "Meta", "Netflix"]
      }
    ]
  }
}
```

### Get Salary Benchmarks
#### GET /api/compensation/benchmarks
Get salary benchmarks by criteria.

**Query Parameters:**
- `industry` (required): Industry name
- `role`: Specific role
- `experience`: Experience level
- `location`: Geographic location

### Analyze Skill Impact
#### POST /api/compensation/skill-impact
Analyze salary impact of specific skills.

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "industry": "Technology",
  "experience": "mid"
}
```

### Get Salary Trends
#### GET /api/compensation/trends/:industry
Get salary trends for an industry.

**Parameters:**
- `industry` (string): Industry name
- `timeframe` (query): Time period in months (default: 12)

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Additional limits may apply to specific endpoints

## Caching
Responses are cached for performance:
- Profile data: 5 minutes
- Competitive analysis: 10 minutes  
- Salary data: 15 minutes
- Industry benchmarks: 30 minutes

## Development
Start the development server:
```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`