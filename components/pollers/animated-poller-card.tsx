"use client"

import { useState, useRef, useEffect } from "react"
import { PollerCard } from "./poller-card"
import { PollerCardExpanded } from "./poller-card-expanded"
import { cn } from "@/lib/utils"

interface AnimatedPollerCardProps {
  poller: any
  isExpanded: boolean
  onToggle: () => void
}

export function AnimatedPollerCard({ poller, isExpanded, onToggle }: AnimatedPollerCardProps) {
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showExpanded, setShowExpanded] = useState(false)
  const regularRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)

  // Handle expansion/collapse animation
  useEffect(() => {
    if (regularRef.current) {
      if (isExpanded !== showExpanded) {
        setIsAnimating(true)

        // If expanding, show expanded view immediately
        if (isExpanded) {
          setShowExpanded(true)
        }

        // Calculate target height for animation
        const targetRef = isExpanded ? expandedRef.current : regularRef.current
        if (targetRef) {
          setHeight(targetRef.offsetHeight)
        }

        // After animation completes, reset height to auto and update state
        const timer = setTimeout(() => {
          setHeight(undefined)
          setIsAnimating(false)

          // If collapsing, hide expanded view after animation
          if (!isExpanded) {
            setShowExpanded(false)
          }
        }, 300) // Match with CSS transition duration

        return () => clearTimeout(timer)
      }
    } else {
      // On initial render, just set state without animation
      setShowExpanded(isExpanded)
    }
  }, [isExpanded, showExpanded])

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out",
        isAnimating && "pointer-events-none",
      )}
      style={height !== undefined ? { height } : {}}
    >
      {/* Collapsed card view */}
      <div
        ref={regularRef}
        className={cn(
          "transition-all duration-300 ease-in-out",
          showExpanded ? "opacity-0 scale-98 absolute inset-0" : "opacity-100 scale-100",
        )}
        style={{ visibility: showExpanded && !isAnimating ? "hidden" : "visible" }}
      >
        <PollerCard poller={poller} onToggle={onToggle} isExpanded={isExpanded} />
      </div>

      {/* Expanded card view - only render when needed */}
      {(showExpanded || isAnimating) && (
        <div
          ref={expandedRef}
          className={cn(
            "transition-all duration-300 ease-in-out",
            !showExpanded ? "opacity-0 scale-102" : "opacity-100 scale-100",
          )}
        >
          <PollerCardExpanded poller={poller} onToggle={onToggle} />
        </div>
      )}
    </div>
  )
}
