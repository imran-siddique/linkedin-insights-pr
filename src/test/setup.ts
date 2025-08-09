import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock the global spark object
global.window = Object.create(window)
Object.defineProperty(window, 'spark', {
  value: {
    llmPrompt: vi.fn((strings, ...values) => strings.join('')),
    llm: vi.fn().mockResolvedValue('Mock LLM response'),
    user: vi.fn().mockResolvedValue({
      avatarUrl: 'https://example.com/avatar.jpg',
      email: 'test@example.com',
      id: 'test-user-id',
      isOwner: true,
      login: 'testuser'
    }),
    kv: {
      keys: vi.fn().mockResolvedValue([]),
      get: vi.fn().mockResolvedValue(undefined),
      set: vi.fn().mockResolvedValue(),
      delete: vi.fn().mockResolvedValue()
    }
  },
  writable: true
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
}