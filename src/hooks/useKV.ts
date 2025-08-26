import { useState, useEffect, useCallback } from 'react'

type KVSetter<T> = (value: T | ((currentValue: T) => T)) => void
type KVDeleter = () => void

/**
 * A React hook for persistent key-value storage using the Spark runtime
 * 
 * @param key - Unique key for the stored value
 * @param defaultValue - Default value to use if key doesn't exist
 * @returns [value, setValue, deleteValue] tuple
 */
export function useKV<T>(
  key: string, 
  defaultValue: T
): [T, KVSetter<T>, KVDeleter] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial value from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        // Check if spark is available
        if (typeof window !== 'undefined' && window.spark?.kv) {
          const storedValue = await window.spark.kv.get<T>(key)
          if (storedValue !== undefined) {
            setValue(storedValue)
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

  // Setter function that updates both state and storage
  const setStoredValue: KVSetter<T> = useCallback(async (newValue) => {
    try {
      const resolvedValue = typeof newValue === 'function' 
        ? (newValue as (current: T) => T)(value)
        : newValue

      setValue(resolvedValue)

      // Persist to storage if spark is available
      if (typeof window !== 'undefined' && window.spark?.kv) {
        await window.spark.kv.set(key, resolvedValue)
      }
    } catch (error) {
      console.error(`Failed to set value for key "${key}":`, error)
    }
  }, [key, value])

  // Delete function that removes from both state and storage
  const deleteStoredValue: KVDeleter = useCallback(async () => {
    try {
      setValue(defaultValue)

      // Remove from storage if spark is available
      if (typeof window !== 'undefined' && window.spark?.kv) {
        await window.spark.kv.delete(key)
      }
    } catch (error) {
      console.error(`Failed to delete value for key "${key}":`, error)
    }
  }, [key, defaultValue])

  return [value, setStoredValue, deleteStoredValue]
}