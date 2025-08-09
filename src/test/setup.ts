import '@testing-library/jest-dom'

// Mock global spark API for tests
global.spark = {
  llmPrompt: (strings: string[], ...values: any[]) => 
    strings.reduce((result, string, index) => 
      result + string + (values[index] || ''), ''),
  llm: async (prompt: string, modelName?: string, jsonMode?: boolean) => 
    'Mock LLM response',
  user: async () => ({
    avatarUrl: 'https://example.com/avatar.jpg',
    email: 'test@example.com',
    id: 'test-user-id',
    isOwner: true,
    login: 'testuser'
  }),
  kv: {
    keys: async () => [],
    get: async (key: string) => undefined,
    set: async (key: string, value: any) => {},
    delete: async (key: string) => {}
  }
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}