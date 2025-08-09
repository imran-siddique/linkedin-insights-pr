import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScrapingManager from '../components/ScrapingManager'

// Mock the scraping service
vi.mock('../lib/scraping', () => ({
  scrapingService: {
    scrapeProfile: vi.fn(),
    isScrapingInProgress: vi.fn(() => false),
    cancelScraping: vi.fn(),
    getScrapingQueue: vi.fn(() => []),
    getScrapingHistory: vi.fn(() => [])
  }
}))

const mockProps = {
  identifier: 'testuser',
  onScrapingComplete: vi.fn(),
  onScrapingError: vi.fn(),
  autoStart: false
}

describe('ScrapingManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders scraping manager interface', () => {
    render(<ScrapingManager {...mockProps} />)
    
    expect(screen.getByText(/linkedin profile scraper/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start scraping/i })).toBeInTheDocument()
  })

  it('starts scraping when button is clicked', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    vi.mocked(scrapingService.scrapeProfile).mockResolvedValue({
      success: true,
      data: {
        name: 'Test User',
        followers: 1000,
        skills: ['JavaScript']
      },
      source: 'api',
      confidence: 0.9,
      timestamp: Date.now()
    })
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    expect(scrapingService.scrapeProfile).toHaveBeenCalledWith('testuser')
  })

  it('shows progress during scraping', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    // Mock in-progress scraping
    vi.mocked(scrapingService.isScrapingInProgress).mockReturnValue(true)
    vi.mocked(scrapingService.scrapeProfile).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: { name: 'Test', followers: 100, skills: [] },
        source: 'api',
        confidence: 0.8,
        timestamp: Date.now()
      }), 1000))
    )
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    expect(screen.getByText(/scraping in progress/i)).toBeInTheDocument()
  })

  it('calls onScrapingComplete when successful', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    const mockResult = {
      success: true,
      data: { name: 'Test User', followers: 1000, skills: ['React'] },
      source: 'api' as const,
      confidence: 0.9,
      timestamp: Date.now()
    }
    
    vi.mocked(scrapingService.scrapeProfile).mockResolvedValue(mockResult)
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    await waitFor(() => {
      expect(mockProps.onScrapingComplete).toHaveBeenCalledWith(mockResult)
    })
  })

  it('calls onScrapingError when failed', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    const mockError = {
      success: false,
      error: 'Profile not found',
      source: 'api' as const,
      timestamp: Date.now()
    }
    
    vi.mocked(scrapingService.scrapeProfile).mockResolvedValue(mockError)
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    await waitFor(() => {
      expect(mockProps.onScrapingError).toHaveBeenCalledWith('Profile not found')
    })
  })

  it('auto-starts scraping when autoStart is true', () => {
    const { scrapingService } = vi.mocked(require('../lib/scraping'))
    
    render(<ScrapingManager {...mockProps} autoStart={true} />)
    
    expect(scrapingService.scrapeProfile).toHaveBeenCalledWith('testuser')
  })

  it('allows cancelling ongoing scraping', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    vi.mocked(scrapingService.isScrapingInProgress).mockReturnValue(true)
    
    render(<ScrapingManager {...mockProps} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)
    
    expect(scrapingService.cancelScraping).toHaveBeenCalled()
  })

  it('displays scraping queue information', () => {
    const { scrapingService } = vi.mocked(require('../lib/scraping'))
    
    vi.mocked(scrapingService.getScrapingQueue).mockReturnValue([
      { identifier: 'user1', priority: 1 },
      { identifier: 'user2', priority: 2 }
    ])
    
    render(<ScrapingManager {...mockProps} />)
    
    expect(screen.getByText(/queue: 2 items/i)).toBeInTheDocument()
  })

  it('shows scraping history', () => {
    const { scrapingService } = vi.mocked(require('../lib/scraping'))
    
    vi.mocked(scrapingService.getScrapingHistory).mockReturnValue([
      {
        identifier: 'user1',
        timestamp: Date.now() - 60000,
        success: true,
        source: 'api' as const
      },
      {
        identifier: 'user2',
        timestamp: Date.now() - 120000,
        success: false,
        source: 'fallback' as const,
        error: 'Rate limited'
      }
    ])
    
    render(<ScrapingManager {...mockProps} />)
    
    expect(screen.getByText(/recent scraping activity/i)).toBeInTheDocument()
    expect(screen.getByText(/user1/i)).toBeInTheDocument()
    expect(screen.getByText(/user2/i)).toBeInTheDocument()
  })

  it('handles rate limiting gracefully', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    vi.mocked(scrapingService.scrapeProfile).mockRejectedValue(
      new Error('Rate limit exceeded')
    )
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText(/rate limit/i)).toBeInTheDocument()
    })
  })

  it('provides retry functionality after failure', async () => {
    const user = userEvent.setup()
    const { scrapingService } = await import('../lib/scraping')
    
    // First attempt fails
    vi.mocked(scrapingService.scrapeProfile)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        success: true,
        data: { name: 'Test', followers: 100, skills: [] },
        source: 'fallback',
        confidence: 0.7,
        timestamp: Date.now()
      })
    
    render(<ScrapingManager {...mockProps} />)
    
    const startButton = screen.getByRole('button', { name: /start scraping/i })
    await user.click(startButton)
    
    await waitFor(() => {
      expect(screen.getByText(/retry/i)).toBeInTheDocument()
    })
    
    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)
    
    await waitFor(() => {
      expect(scrapingService.scrapeProfile).toHaveBeenCalledTimes(2)
    })
  })
})