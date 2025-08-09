import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.spark globally for all tests
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

Object.defineProperty(window, 'spark', {
  value: mockSpark,
  writable: true
})

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn()
}