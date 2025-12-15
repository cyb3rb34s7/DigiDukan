/**
 * LocalStorage Hook with SSR safety
 */

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Check if we're on client side
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern for SSR
    setIsClient(true);
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional hydration pattern for SSR
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  // Return a wrapped version of useState's setter function that persists
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
