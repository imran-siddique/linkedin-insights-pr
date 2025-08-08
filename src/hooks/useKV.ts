import { useState, useEffect, useCallback } from 'react'

// Declare global spark interface
declare global {
  interface Window {
    spark: {
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
        if (typeof window !== 'undefined' && window.spark?.kv) {
          const stored = await window.spark.kv.get<T>(key)
          if (stored !== undefined) {
            setValue(stored)
          }
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
      
      if (typeof window !== 'undefined' && window.spark?.kv) {
        await window.spark.kv.set(key, valueToSet)
      }
    } catch (error) {
      console.error(`Failed to set value for key "${key}":`, error)
    }
  }, [key, value])

  // Delete value function
  const deleteKVValue = useCallback(async () => {
    try {
      setValue(defaultValue)
      
      if (typeof window !== 'undefined' && window.spark?.kv) {
        await window.spark.kv.delete(key)
      }
    } catch (error) {
      console.error(`Failed to delete value for key "${key}":`, error)
    }
  }, [key, defaultValue])

  return [value, setKVValue, deleteKVValue]
}