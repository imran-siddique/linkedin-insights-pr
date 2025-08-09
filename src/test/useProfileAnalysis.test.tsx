import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProfileAnalysis } from '../hooks/useProfileAnalysis'

// Mock the spark global
const mockSpark = {
  llmPrompt: vi.fn((strings, ...values) => strings.join('')),
  llm: vi.fn().mockResolvedValue('{}'),
  kv: {
    get: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined)
  }
}

Object.defineProperty(window, 'spark', {
  value: mockSpark,
  writable: true
})

describe('useProfileAnalysis', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useProfileAnalysis())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('')
    expect(result.current.profileData).toBe(null)
    expect(result.current.recommendations).toEqual([])
  })

  it('handles invalid LinkedIn URL', async () => {
    const { result } = renderHook(() => useProfileAnalysis())

    await act(async () => {
      await result.current.analyzeProfile('invalid-url')
    })

    expect(result.current.error).toContain('Invalid')
  })

  it('processes valid LinkedIn URL format', async () => {
    const { result } = renderHook(() => useProfileAnalysis())

    await act(async () => {
      await result.current.analyzeProfile('https://linkedin.com/in/testuser')
    })

    // Should not have validation errors
    expect(result.current.error).not.toContain('Invalid')
  })
})