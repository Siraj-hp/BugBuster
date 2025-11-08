"use client"

import { useCallback, useRef } from "react"

// This is a stable event handler that doesn't change on re-renders
// It's a simple replacement for useEffectEvent which isn't available in React 18
export function useEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback)

  // Update the ref each render to avoid stale closures
  callbackRef.current = callback

  // Return a memoized function that delegates to the current callback
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return callbackRef.current(...args)
  }, []) as T
}
