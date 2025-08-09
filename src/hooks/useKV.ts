import { useState, useEffect, useCallback } from 'react'

// Fallback KV implementation using localStorage
const fallbackKV = {
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const item = localStorage.getItem(`kv-${key}`)
      return item ? JSON.parse(item) : undefined
    } catch {
      return undefined
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(`kv-${key}`, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(`kv-${key}`)
    } catch (error) {
      console.warn('Failed to delete from localStorage:', error)
    }
  },

  async keys(): Promise<string[]> {
    try {
      const keys = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('kv-')) {
          keys.push(key.substring(3))
        }
      }
      return keys
    } catch {
      return []
    }
  }
}

// Get KV implementation (prefer spark if available, fallback to localStorage)
function getKV() {
  if (typeof window !== 'undefined' && window.spark?.kv) {
    return window.spark.kv
  }
  return fallbackKV
}

// Declare global spark interface
declare global {
  interface Window {
    spark?: {
      kv: {
        keys: () => Promise<string[]>
        get: <T>(key: string) => Promise<T | undefined>
        set: <T>(key: string, value: T) => Promise<void>
        delete: (key: string) => Promise<void>
      }
    }
  }
}

export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        const kv = getKV()
        const stored = await kv.get<T>(key)
        if (stored !== undefined) {
          setValue(stored)
        }
      } catch (error) {
        console.warn(`Failed to load value for key "${key}":`, error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadValue()
  }, [key])

  // Set value function
  const setKVValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToSet = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue
      setValue(valueToSet)
      
      const kv = getKV()
      await kv.set(key, valueToSet)
    } catch (error) {
      console.error(`Failed to set value for key "${key}":`, error)
    }
  }, [key, value])

  // Delete value function
  const deleteKVValue = useCallback(async () => {
    try {
      setValue(defaultValue)
      
      const kv = getKV()
      await kv.delete(key)
    } catch (error) {
      console.error(`Failed to delete value for key "${key}":`, error)
    }
  }, [key, defaultValue])

  return [value, setKVValue, deleteKVValue]
}