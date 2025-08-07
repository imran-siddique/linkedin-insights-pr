# LinkedIn Analytics & Growth Advisor

A comprehensive LinkedIn analytics platform split into separate backend and frontend applications.

## Project Structure

```
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application  
├── src/             # Original monolithic application (deprecated)
└── README.md        # This file
```

## Architecture Overview

This application has been refactored into a proper client-server architecture:

### Backend (Node.js/Express)
- RESTful API with comprehensive LinkedIn analytics endpoints
- Profile analysis and competitive benchmarking
- Salary and compensation insights
- AI-powered recommendations
- Rate limiting and security middleware
- Comprehensive error handling and logging

### Frontend (React/TypeScript)
- Modern React application with TypeScript
- React Query for efficient API state management
- Tailwind CSS for styling
- Responsive design optimized for all devices
- Toast notifications and loading states

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Documentation

### Authentication
All API endpoints require an API key sent via the `X-API-Key` header or `apiKey` query parameter.

### Endpoints

#### Profile Analysis
- `POST /api/profile/analyze` - Analyze a LinkedIn profile
- `GET /api/profile/:username/insights` - Get profile insights
- `GET /api/profile/:username/activity` - Get activity metrics
- `GET /api/profile/:username/visual-branding` - Analyze visual branding

#### Recommendations
- `POST /api/recommendations/generate` - Generate personalized recommendations
- `POST /api/recommendations/skill-insights` - Get skill market insights
- `POST /api/recommendations/trending-topics` - Get trending topics
- `GET /api/recommendations/content-strategy/:industry` - Get content strategy

#### Competitive Analysis
- `POST /api/competitive/analyze` - Perform competitive analysis
- `POST /api/competitive/profiles` - Generate competitive profiles
- `GET /api/competitive/benchmarks/:industry` - Get industry benchmarks

#### Compensation Analysis
- `POST /api/compensation/analyze` - Generate compensation analysis
- `GET /api/compensation/benchmarks` - Get salary benchmarks
- `POST /api/compensation/skill-impact` - Analyze skill impact on salary
- `GET /api/compensation/trends/:industry` - Get salary trends

## Features

### Core Analytics
- **Profile Analysis**: Comprehensive LinkedIn profile scoring and optimization recommendations
- **Competitive Benchmarking**: Compare against industry peers and top performers
- **Skill Market Analysis**: Understand market demand and salary impact of specific skills
- **Trending Topics**: Discover relevant content opportunities based on your expertise
- **Compensation Insights**: Detailed salary analysis and negotiation guidance

### AI-Powered Insights
- Personalized growth recommendations
- Industry-specific content strategy
- Competitive intelligence
- Market positioning analysis
- Career progression guidance

### Technical Features
- **Real-time Analysis**: Fast, efficient processing of LinkedIn data
- **Caching**: Smart caching to improve performance and reduce API calls
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: API key authentication and secure CORS configuration

## Development

### Backend Development
```bash
cd backend
npm run dev    # Start development server with hot reload
npm run build  # Build for production
npm start      # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### Environment Variables

#### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `API_KEYS` - Comma-separated list of valid API keys
- `FRONTEND_URL` - Frontend URL for CORS
- `OPENAI_API_KEY` - OpenAI API key (optional)

#### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_API_KEY` - API key for backend requests

## Deployment

### Backend Deployment
1. Set environment variables for production
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment
1. Set production API URL in environment variables
2. Build the application: `npm run build`
3. Serve the `dist` folder using a static file server

### Production Considerations
- Use a process manager like PM2 for the backend
- Set up reverse proxy with Nginx
- Use environment-specific API keys
- Enable HTTPS in production
- Set up monitoring and logging
- Configure database for persistent storage (future enhancement)

## API Integration

The frontend uses React Query for efficient API state management:

```typescript
import { useAnalyzeProfile } from './hooks/useLinkedInAPI'

const MyComponent = () => {
  const analyzeProfile = useAnalyzeProfile({
    onSuccess: (data) => {
      console.log('Profile analyzed:', data)
    }
  })

  const handleAnalyze = () => {
    analyzeProfile.mutate('linkedin-username')
  }

  return (
    <button onClick={handleAnalyze} disabled={analyzeProfile.isLoading}>
      {analyzeProfile.isLoading ? 'Analyzing...' : 'Analyze Profile'}
    </button>
  )
}
```

## Future Enhancements

1. **Database Integration**: Add PostgreSQL for persistent data storage
2. **Real LinkedIn API**: Integrate with official LinkedIn API
3. **User Authentication**: Add user accounts and saved analyses
4. **Advanced Analytics**: Time-series analysis and historical tracking
5. **Export Features**: PDF reports and data export
6. **Team Features**: Multi-user organizations and team analytics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or create an issue on GitHub.