import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'

// Mock the spark global
const mockSpark = {
  llmPrompt: vi.fn((strings, ...values) => strings.join('')),
  llm: vi.fn().mockResolvedValue('{}'),
  user: vi.fn().mockResolvedValue({ 
    avatarUrl: '', 
    email: '', 
    id: '', 
    isOwner: false, 
    login: '' 
  }),
  kv: {
    keys: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined)
  }
}

// Mock window.spark
Object.defineProperty(window, 'spark', {
  value: mockSpark,
  writable: true
})

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the app header', () => {
    render(<App />)
    expect(screen.getByText('LinkedIn Analytics & Growth Advisor')).toBeInTheDocument()
  })

  it('renders the profile analysis form', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/linkedin.com\/in\/username/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analyze profile/i })).toBeInTheDocument()
  })

  it('disables analyze button when input is empty', () => {
    render(<App />)
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })
    expect(analyzeButton).toBeDisabled()
  })

  it('enables analyze button when valid LinkedIn URL is entered', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/linkedin.com\/in\/username/i)
    const analyzeButton = screen.getByRole('button', { name: /analyze profile/i })

    fireEvent.change(input, { target: { value: 'https://linkedin.com/in/testuser' } })

    await waitFor(() => {
      expect(analyzeButton).not.toBeDisabled()
    })
  })

  it('shows error for invalid LinkedIn URL', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/linkedin.com\/in\/username/i)

    fireEvent.change(input, { target: { value: 'invalid-url' } })

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid linkedin/i)).toBeInTheDocument()
    })
  })
})