"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Reset error state when children change
    setHasError(false)
  }, [children])

  if (hasError) {
    return <>{fallback}</>
  }

  try {
    return <>{children}</>
  } catch (error) {
    if (onError) {
      onError(error as Error, { componentStack: "" })
    }
    setHasError(true)
    return <>{fallback}</>
  }
}
