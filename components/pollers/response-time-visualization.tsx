"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResponseTimeVisualizationProps {
  responseTime: string
  className?: string
}

export function ResponseTimeVisualization({ responseTime, className }: ResponseTimeVisualizationProps) {
  // Extract numeric value from response time string (e.g., "7.2ms" -> 7.2)
  const value = Number.parseFloat(responseTime) || 0

  // Normalize value for visualization (assuming typical range is 0-20ms)
  // Values closer to 0 are better
  const normalizedValue = Math.min(value / 20, 1)

  // Determine color based on response time
  const getColor = () => {
    if (value < 10) return "#23c25c" // Green for good response times
    if (value < 50) return "#e4af0b" // Yellow for moderate response times
    return "#ef4444" // Red for slow response times
  }

  const color = getColor()

  return (
    <div className={cn("bg-[#1a1f32] rounded-lg p-4", className)}>
      <h4 className="text-sm font-medium text-gray-400 mb-3">Response Time</h4>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <span className="text-2xl font-bold text-white">{responseTime}</span>
        </div>
      </div>

      {/* Simple bar visualization */}
      <div className="h-2 bg-[#252a3d] rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${(1 - normalizedValue) * 100}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>

      {/* Response time trend visualization */}
      <div className="mt-4 flex h-6 items-end gap-1">
        {Array.from({ length: 7 }).map((_, i) => {
          // Create a simple trend visualization with varying heights
          const height = [5, 4, 3, 6, 5, 4, 5][i]
          return (
            <div
              key={i}
              className="bg-[#3b82f6] rounded-sm w-full transition-all duration-300"
              style={{ height: `${height * 4}px` }}
            ></div>
          )
        })}
      </div>
    </div>
  )
}
