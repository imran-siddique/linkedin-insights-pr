import { describe, it, expect } from 'vitest'

describe('Test Environment', () => {
  it('should have testing environment set up correctly', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
    expect(typeof global).toBe('object')
  })

  it('should have spark mock available', () => {
    expect(window.spark).toBeDefined()
    expect(window.spark.llm).toBeDefined()
    expect(window.spark.kv).toBeDefined()
  })

  it('should handle basic assertions', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toContain('ell')
    expect([1, 2, 3]).toHaveLength(3)
  })
})