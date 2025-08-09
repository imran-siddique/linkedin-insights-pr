# LinkedIn Analytics & Growth Advisor

A production-ready React application that provides comprehensive LinkedIn profile analysis, competitive benchmarking, salary insights, and personalized growth recommendations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue)

## ✨ Features

- **Real-time Profile Analysis** - Accurate LinkedIn profile data extraction
- **AI-Powered Recommendations** - Personalized growth strategies based on your skills
- **Competitive Analysis** - Compare against industry peers and top performers  
- **Salary Benchmarking** - Market compensation analysis for your role and skills
- **Skill Market Insights** - Understand demand and growth potential for your skills
- **Industry Trend Analysis** - Stay ahead with relevant trending topics
- **Visual Branding Review** - Profile optimization recommendations
- **Content Strategy** - Data-driven posting and engagement recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd linkedin-analytics-spark

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start development server
npm run dev
```

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Run health check
npm run health-check
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ScrapingManager.tsx
├── lib/                # Core utilities and services
│   ├── config.ts       # Application configuration
│   ├── errorHandling.ts # Error management system
│   ├── security.ts     # Validation and rate limiting
│   ├── cache.ts        # Caching system
│   ├── monitoring.ts   # Health monitoring
│   ├── linkedin-api.ts # LinkedIn service integration
│   └── linkedin-scraper.ts # Data scraping utilities
├── types/              # TypeScript type definitions
└── styles/             # CSS and theme files
```

## ⚙️ Configuration

The application uses environment variables for configuration:

```bash
# Required
NODE_ENV=production
VITE_APP_NAME=LinkedIn Analytics & Growth Advisor
VITE_APP_VERSION=1.0.0

# Optional
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_MAX_REQUESTS_PER_MINUTE=60
VITE_CACHE_TTL=300000
```

See `.env.example` for all available options.

## 🛡️ Production Features

### Security
- **Input Validation** - All user inputs are sanitized and validated
- **Rate Limiting** - Prevents abuse with configurable request limits
- **Error Boundaries** - Graceful error handling and recovery
- **XSS Protection** - Input sanitization and content security

### Performance
- **Smart Caching** - Multi-level caching with TTL and LRU eviction
- **Code Splitting** - Optimized bundle loading for faster initial load
- **Memory Management** - Automatic cleanup and memory monitoring
- **Lazy Loading** - Components loaded on demand

### Monitoring
- **Health Checks** - Built-in application health monitoring
- **Error Tracking** - Centralized error logging and reporting  
- **Performance Metrics** - Memory usage and response time tracking
- **Cache Analytics** - Hit rates and optimization metrics

## 📊 Health Monitoring

The application includes comprehensive health monitoring:

```javascript
import { healthMonitor } from '@/lib/monitoring'

// Get current health status
const status = healthMonitor.getHealthStatus()

// Check if application is healthy
const isHealthy = healthMonitor.isHealthy()

// Get uptime information
const uptime = healthMonitor.getUptimeString()
```

### Health Status Indicators

- **Healthy** - All systems operational (< 70% memory, < 10 queued errors)
- **Degraded** - Some performance issues (70-90% memory, 10-50 queued errors)
- **Unhealthy** - Critical issues requiring attention (> 90% memory, > 50 errors)

## 🚀 Deployment

### GitHub Spark Platform

This application is designed for deployment on GitHub Spark. Follow these steps:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Verify the build**:
   ```bash
   npm run preview
   npm run health-check
   ```

3. **Deploy to Spark platform** following platform-specific instructions

### Manual Deployment

For manual deployment to other platforms:

1. Build the application
2. Upload the `dist/` folder to your hosting provider
3. Configure environment variables
4. Set up HTTPS and proper headers
5. Configure monitoring and error tracking

See `DEPLOYMENT_CHECKLIST.md` for comprehensive deployment guidelines.

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Build validation
npm run build

# Health check
npm run health-check
```

## 📝 API Integration

The application integrates with LinkedIn data through:
- **Real-time scraping** with rate limiting and caching
- **AI-powered analysis** using Spark's LLM integration
- **Competitive benchmarking** with industry data
- **Salary analysis** with market compensation data

All data processing respects privacy and follows LinkedIn's terms of service.

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

**Memory Issues**
```bash
# Check health status
node -e "console.log(require('./dist/index.html'))"
```

**Performance Issues**
- Check cache hit rates in health status
- Monitor memory usage trends  
- Review error logs for bottlenecks

### Debug Mode

Enable debug mode for detailed logging:
```bash
VITE_ENABLE_DEBUG_MODE=true npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Run the build: `npm run build`
6. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [troubleshooting section](#troubleshooting)
- Review health monitoring data
- Check error logs in debug mode
- Contact the development team

## 🗺️ Roadmap

- [ ] Enhanced mobile experience
- [ ] Batch profile analysis
- [ ] Advanced analytics dashboard
- [ ] Integration with more professional platforms
- [ ] Real-time collaboration features

---

**Built with ❤️ using React, TypeScript, and GitHub Spark**