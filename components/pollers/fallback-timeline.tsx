"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface TimelineDataPoint {
  timestamp: string
  status: "online" | "offline" | "degraded"
  value: number
}

interface FallbackTimelineProps {
  data: TimelineDataPoint[]
  className?: string
}

export function FallbackTimeline({ data, className }: FallbackTimelineProps) {
  // Sort data by timestamp
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const timeA = a.timestamp.split(":").map(Number)
      const timeB = b.timestamp.split(":").map(Number)

      // Compare hours
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0]
      // Compare minutes
      if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1]
      // Compare seconds
      return timeA[2] - timeB[2]
    })
  }, [data])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-[#3b82f6]"
      case "degraded":
        return "bg-[#f59e0b]"
      case "offline":
        return "bg-[#ef4444]"
      default:
        return "bg-[#3b82f6]"
    }
  }

  return (
    <div className={cn("bg-[#171c2c] rounded-lg p-4", className)}>
      <h3 className="text-white text-base font-medium mb-3">Poller Availability Timeline</h3>

      <div className="h-[220px] relative">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#969da9] font-medium">
          <span>Online</span>
          <span>Degraded</span>
          <span>Offline</span>
        </div>

        <div className="ml-16 h-full bg-[#1a1f32] rounded-md p-2 relative">
          {/* Timeline visualization */}
          <div className="w-full h-full relative">
            {/* Time markers */}
            <div className="absolute top-0 left-0 w-full h-full flex">
              {sortedData.map((point, index) => {
                const position = `${(index / (sortedData.length - 1)) * 100}%`
                const height = point.status === "online" ? "20%" : point.status === "degraded" ? "50%" : "80%"

                return (
                  <div key={point.timestamp} className="absolute flex flex-col items-center" style={{ left: position }}>
                    <div
                      className={cn("w-1 rounded-full", getStatusColor(point.status))}
                      style={{ height, top: 0 }}
                    ></div>
                    <div className={cn("w-3 h-3 rounded-full mt-1", getStatusColor(point.status))}></div>
                  </div>
                )
              })}
            </div>

            {/* Status line */}
            <div className="absolute top-[20%] left-0 w-full border-t border-dashed border-[#3b82f6] opacity-30"></div>
            <div className="absolute top-[50%] left-0 w-full border-t border-dashed border-[#f59e0b] opacity-30"></div>
            <div className="absolute top-[80%] left-0 w-full border-t border-dashed border-[#ef4444] opacity-30"></div>
          </div>
        </div>
      </div>

      {/* X-axis time labels */}
      <div className="ml-16 mt-2 flex justify-between text-xs text-[#969da9] font-medium">
        {sortedData.map((point, index) => (
          <div key={`time-${index}`} className="text-center" style={{ width: `${100 / sortedData.length}%` }}>
            {point.timestamp}
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-[#969da9] text-center">
        <span>
          Showing timeline from {sortedData[0]?.timestamp || "08:00:00"} to{" "}
          {sortedData[sortedData.length - 1]?.timestamp || "22:24:54"}
        </span>
      </div>
    </div>
  )
}
