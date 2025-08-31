# Contributing Guide

Welcome to the LinkedIn Analytics & Growth Advisor project! We're excited to have you contribute. This guide will help you get started with contributing to our codebase, whether you're fixing bugs, adding features, or improving documentation.

## 🎯 Ways to Contribute

### Code Contributions
- **Bug fixes** - Help resolve issues and improve stability
- **Feature development** - Add new functionality and capabilities
- **Performance improvements** - Optimize existing code and features
- **Testing** - Increase test coverage and improve test quality
- **Refactoring** - Improve code structure and maintainability

### Non-Code Contributions
- **Documentation** - Improve guides, API docs, and examples
- **Design** - UI/UX improvements and design system enhancements
- **Translation** - Help make the app accessible in multiple languages
- **Community** - Help with issues, discussions, and code reviews
- **Testing** - Manual testing and bug reporting

## 🚀 Getting Started

### 1. Development Environment Setup

#### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git for version control
- Code editor (VS Code recommended)

#### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/linkedin-insights-pr.git
cd linkedin-insights-pr

# Add upstream remote
git remote add upstream https://github.com/imran-siddique/linkedin-insights-pr.git

# Install dependencies
npm install
```

#### Verify Setup

```bash
# Run type checking
npm run type-check

# Run tests
npm run test

# Start development server
npm run dev
```

### 2. Development Workflow

#### Create a Feature Branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

#### Make Your Changes

1. **Follow the coding standards** (see [Code Style Guide](#code-style-guide))
2. **Write tests** for new functionality
3. **Update documentation** as needed
4. **Test your changes** thoroughly

#### Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add LinkedIn profile validation

- Add comprehensive profile URL validation
- Include support for various LinkedIn URL formats
- Add unit tests for validation logic
- Update documentation with examples"
```

### 3. Pull Request Process

#### Before Submitting

```bash
# Ensure all tests pass
npm run test

# Run type checking
npm run type-check

# Build the project
npm run build

# Run health check
npm run health-check
```

#### Submit Pull Request

1. **Push your branch** to your fork
2. **Create a pull request** on GitHub
3. **Fill out the PR template** completely
4. **Link related issues** using keywords (fixes #123)
5. **Request review** from maintainers

#### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] All new and existing tests pass locally
- [ ] I have tested the changes manually

## Checklist
- [ ] My code follows the project's code style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Fixes #(issue number)
```

## 📝 Code Style Guide

### TypeScript Standards

#### File Organization
```typescript
// 1. Import statements (external libraries first)
import React from 'react'
import { useState, useEffect } from 'react'

// 2. Internal imports (grouped by type)
import { Button } from '@/components/ui/button'
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis'
import { ProfileData } from '@/types/linkedin'

// 3. Type definitions
interface ComponentProps {
  username: string
  onAnalysisComplete: (data: ProfileData) => void
}

// 4. Component implementation
export function ProfileAnalyzer({ username, onAnalysisComplete }: ComponentProps) {
  // Component logic
}
```

#### Naming Conventions

```typescript
// Use PascalCase for components and types
interface ProfileData { }
class LinkedInService { }
function ProfileAnalyzer() { }

// Use camelCase for variables and functions
const userData = {}
const fetchProfileData = async () => {}

// Use SCREAMING_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3
const API_ENDPOINTS = {
  PROFILE: '/api/profile'
}

// Use kebab-case for file names
// profile-analyzer.tsx
// linkedin-service.ts
// user-dashboard.tsx
```

#### Component Patterns

```typescript
// Preferred: Functional components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Export types for reuse
export type { ButtonProps }
```

#### Custom Hooks

```typescript
// Use 'use' prefix and return object with descriptive names
export function useProfileAnalysis() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const analyzeProfile = useCallback(async (username: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await linkedInService.getProfileData(username)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  const resetAnalysis = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    analyzeProfile,
    resetAnalysis
  }
}
```

### CSS and Styling

#### Tailwind Classes
```tsx
// Group related classes and use consistent ordering
<div className={cn(
  // Layout
  "flex items-center justify-between",
  // Spacing
  "p-4 mb-6",
  // Appearance
  "bg-white rounded-lg shadow-sm",
  // States
  "hover:shadow-md transition-shadow",
  // Responsive
  "sm:p-6 md:mb-8"
)}>
```

#### Component Variants
```typescript
// Use class-variance-authority for consistent variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Error Handling

```typescript
// Use specific error types
class ProfileAnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ProfileAnalysisError'
  }
}

// Handle errors gracefully
async function analyzeProfile(username: string): Promise<ProfileData> {
  try {
    const response = await fetch(`/api/profile/${username}`)
    
    if (!response.ok) {
      throw new ProfileAnalysisError(
        'Failed to fetch profile data',
        'FETCH_ERROR',
        response.status
      )
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ProfileAnalysisError) {
      throw error
    }
    
    throw new ProfileAnalysisError(
      'Unexpected error during profile analysis',
      'UNKNOWN_ERROR'
    )
  }
}
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
// Use descriptive test names
describe('ProfileAnalyzer', () => {
  describe('when username is provided', () => {
    it('should fetch and display profile data', async () => {
      // Arrange
      const mockProfileData = createMockProfileData()
      jest.spyOn(linkedInService, 'getProfileData').mockResolvedValue(mockProfileData)
      
      // Act
      render(<ProfileAnalyzer username="testuser" />)
      fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Profile Analysis Complete')).toBeInTheDocument()
      })
    })

    it('should display error message when analysis fails', async () => {
      // Arrange
      jest.spyOn(linkedInService, 'getProfileData').mockRejectedValue(
        new Error('Network error')
      )
      
      // Act
      render(<ProfileAnalyzer username="testuser" />)
      fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText(/error occurred/i)).toBeInTheDocument()
      })
    })
  })

  describe('when username is empty', () => {
    it('should show validation error', () => {
      render(<ProfileAnalyzer username="" />)
      fireEvent.click(screen.getByRole('button', { name: /analyze/i }))
      
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Utilities

```typescript
// Create reusable test utilities
export function createMockProfileData(overrides?: Partial<ProfileData>): ProfileData {
  return {
    username: 'testuser',
    fullName: 'Test User',
    headline: 'Software Engineer',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'TypeScript'],
    experience: [],
    education: [],
    ...overrides
  }
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AppProvider>
      <ErrorBoundary fallback={<div>Error</div>}>
        {ui}
      </ErrorBoundary>
    </AppProvider>
  )
}
```

### Test Coverage

Aim for:
- **Unit tests**: 90%+ coverage for utilities and services
- **Integration tests**: Critical user flows
- **Component tests**: All interactive components
- **E2E tests**: Key user journeys

```bash
# Check test coverage
npm run test:coverage

# Target coverage thresholds in vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

## 📚 Documentation Standards

### Code Comments

```typescript
/**
 * Analyzes a LinkedIn profile and generates insights
 * 
 * @param username - LinkedIn username or profile URL
 * @param options - Analysis configuration options
 * @returns Promise resolving to analysis results
 * 
 * @example
 * ```typescript
 * const analysis = await analyzeProfile('billgates', {
 *   includeSkills: true,
 *   generateRecommendations: true
 * })
 * ```
 * 
 * @throws {ProfileAnalysisError} When profile cannot be accessed
 * @throws {ValidationError} When username format is invalid
 */
export async function analyzeProfile(
  username: string,
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  // Implementation
}
```

### README Updates

When adding new features:

1. Update the main README.md
2. Add examples to the Examples section
3. Update the API documentation
4. Add troubleshooting notes if needed

### Component Documentation

```tsx
/**
 * ProfileAnalyzer - Main component for LinkedIn profile analysis
 * 
 * Features:
 * - Real-time profile analysis
 * - AI-powered insights generation
 * - Interactive results display
 * - Error handling and recovery
 * 
 * @example
 * ```tsx
 * <ProfileAnalyzer
 *   username="billgates"
 *   onAnalysisComplete={(data) => console.log(data)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
interface ProfileAnalyzerProps {
  /** LinkedIn username or profile URL */
  username: string
  /** Callback fired when analysis completes successfully */
  onAnalysisComplete?: (data: ProfileData) => void
  /** Callback fired when an error occurs */
  onError?: (error: Error) => void
  /** Additional CSS classes */
  className?: string
}
```

## 🐛 Issue Reporting

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 95.0]
- Node.js version: [e.g. 18.0.0]
- App version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

### Feature Requests

```markdown
**Feature Summary**
Brief description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Other solutions you've considered.

**Implementation Ideas**
Any thoughts on implementation.

**Additional Context**
Screenshots, mockups, or examples.
```

## 🔍 Code Review Process

### For Contributors

- **Self-review** your code before submitting
- **Write descriptive** PR descriptions
- **Respond promptly** to review feedback
- **Keep PRs focused** on a single feature/fix
- **Update tests** and documentation

### For Reviewers

- **Be constructive** and helpful in feedback
- **Focus on** code quality, performance, and maintainability
- **Check for** proper testing and documentation
- **Approve quickly** for minor changes
- **Request changes** for issues that need addressing

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed
- [ ] Error handling is appropriate

## 🏆 Recognition

### Contributors

We recognize contributors in:
- GitHub contributors list
- Release notes for significant contributions
- Special mentions in documentation
- Community shout-outs

### Becoming a Maintainer

Regular contributors may be invited to become maintainers based on:
- **Quality contributions** over time
- **Community involvement** and helpfulness
- **Understanding** of project goals and architecture
- **Reliability** in reviews and responses

## 📞 Getting Help

### Where to Ask Questions

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Code Reviews** - Implementation-specific questions
- **Documentation** - Check existing docs first

### Response Times

- **Bug reports**: 1-3 business days
- **Feature requests**: 1-week for initial response
- **Pull requests**: 2-5 business days for review
- **Questions**: 1-2 business days

## 🎯 Project Priorities

### Current Focus Areas

1. **Performance optimization** - Faster loading and analysis
2. **Enhanced AI insights** - More accurate recommendations
3. **Mobile experience** - Better responsive design
4. **Accessibility** - WCAG 2.1 AA compliance
5. **Testing coverage** - Comprehensive test suite

### Future Roadmap

- Batch profile analysis
- Advanced analytics dashboard
- Real-time collaboration features
- Integration with more platforms
- Multi-language support

Thank you for contributing to the LinkedIn Analytics & Growth Advisor! Your contributions help make professional growth more accessible to everyone. 🚀