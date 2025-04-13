"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilityTimelineProps {
  data: Array<{
    timestamp: string
    status: "online" | "offline" | "degraded"
    value?: number
  }>
  className?: string
}

// Helper function to parse time string to minutes since midnight
function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number)
  return hours * 60 + minutes + seconds / 60
}

// Helper function to format minutes back to time string
function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  const secs = Math.floor((minutes % 1) * 60)
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export function AvailabilityTimeline({ data, className }: AvailabilityTimelineProps) {
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100])
  const [isDragging, setIsDragging] = useState<null | "left" | "right" | "slider">(null)
  const [isChartAnimating, setIsChartAnimating] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [timelineWidth, setTimelineWidth] = useState(0)

  // Calculate time range from data
  const timeRange = useMemo(() => {
    if (data.length === 0) return { start: 480, end: 1344 } // Default 08:00 to 22:24 in minutes

    const times = data.map((item) => parseTimeToMinutes(item.timestamp))
    const start = Math.min(...times)
    const end = Math.max(...times)

    return { start, end }
  }, [data])

  // Update timeline width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Generate time stamps based on zoom range and timeline width
  const timeStamps = useMemo(() => {
    const { start, end } = timeRange
    const totalMinutes = end - start

    // Calculate visible time range based on zoom
    const visibleStart = start + (totalMinutes * zoomRange[0]) / 100
    const visibleEnd = start + (totalMinutes * zoomRange[1]) / 100
    const visibleMinutes = visibleEnd - visibleStart

    // Determine how many time stamps to show based on timeline width
    // Aim for approximately one timestamp every 100-150px
    const targetCount = Math.max(2, Math.min(10, Math.floor(timelineWidth / 120)))
    const interval = Math.ceil(visibleMinutes / (targetCount - 1))

    // Round interval to a nice number (15, 30, 60 minutes, etc.)
    let roundedInterval
    if (interval <= 15) roundedInterval = 15
    else if (interval <= 30) roundedInterval = 30
    else if (interval <= 60) roundedInterval = 60
    else if (interval <= 120) roundedInterval = 120
    else if (interval <= 180) roundedInterval = 180
    else roundedInterval = 240

    // Generate time stamps
    const stamps = []
    // Round the start time down to the nearest interval
    const firstStamp = Math.floor(visibleStart / roundedInterval) * roundedInterval

    for (let time = firstStamp; time <= visibleEnd; time += roundedInterval) {
      if (time >= visibleStart) {
        const position = ((time - visibleStart) / visibleMinutes) * 100
        stamps.push({
          time: formatMinutesToTime(time),
          position,
          minutes: time,
        })
      }
    }

    return stamps
  }, [timeRange, zoomRange, timelineWidth])

  // Filter data based on zoom range
  const filteredData = useMemo(() => {
    return data.filter((item, index) => {
      const position = (index / (data.length - 1)) * 100
      return position >= zoomRange[0] && position <= zoomRange[1]
    })
  }, [data, zoomRange])

  // Handle mouse down on slider elements
  const handleMouseDown = (e: React.MouseEvent, handle: "left" | "right" | "slider") => {
    e.preventDefault()
    setIsDragging(handle)
    // Start animation immediately when dragging begins
    setIsChartAnimating(true)
  }

  // Handle mouse move for slider dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return

      const sliderRect = sliderRef.current.getBoundingClientRect()
      const sliderWidth = sliderRect.width
      const offsetX = e.clientX - sliderRect.left
      const percentage = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100))

      if (isDragging === "left") {
        setZoomRange([Math.min(percentage, zoomRange[1] - 5), zoomRange[1]])
      } else if (isDragging === "right") {
        setZoomRange([zoomRange[0], Math.max(percentage, zoomRange[0] + 5)])
      } else if (isDragging === "slider") {
        const rangeWidth = zoomRange[1] - zoomRange[0]
        const newLeft = Math.max(0, Math.min(100 - rangeWidth, percentage - rangeWidth / 2))
        setZoomRange([newLeft, newLeft + rangeWidth])
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        // End animation when dragging stops
        setTimeout(() => setIsChartAnimating(false), 150)
      }
      setIsDragging(null)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, zoomRange])

  // Zoom in function
  const zoomIn = () => {
    const rangeWidth = zoomRange[1] - zoomRange[0]
    if (rangeWidth <= 20) return // Limit zoom level

    // Trigger chart animation
    setIsChartAnimating(true)

    const newWidth = rangeWidth * 0.8
    const center = (zoomRange[0] + zoomRange[1]) / 2
    const newLeft = Math.max(0, center - newWidth / 2)
    const newRight = Math.min(100, center + newWidth / 2)

    setZoomRange([newLeft, newRight])

    // End animation after a short delay
    setTimeout(() => setIsChartAnimating(false), 150)
  }

  // Zoom out function
  const zoomOut = () => {
    const rangeWidth = zoomRange[1] - zoomRange[0]
    if (rangeWidth >= 100) return // Limit zoom level

    // Trigger chart animation
    setIsChartAnimating(true)

    const newWidth = Math.min(100, rangeWidth * 1.2)
    const center = (zoomRange[0] + zoomRange[1]) / 2
    const newLeft = Math.max(0, center - newWidth / 2)
    const newRight = Math.min(100, center + newWidth / 2)

    setZoomRange([newLeft, newRight])

    // End animation after a short delay
    setTimeout(() => setIsChartAnimating(false), 150)
  }

  return (
    <div className={cn("bg-[#171c2c] rounded-lg p-4", className)}>
      <h3 className="text-white text-base font-medium mb-3">Poller Availability Timeline</h3>

      {/* Zoom Slider */}
      <div className="mb-6 relative h-10">
        <div className="absolute left-0 top-2">
          <button
            className="w-6 h-6 flex items-center justify-center bg-transparent rounded-full text-white hover:text-[#3B82F6] transition-colors"
            onClick={zoomOut}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
        </div>

        <div ref={sliderRef} className="absolute top-3 left-10 right-10 h-1.5 bg-[#252a3d] rounded-full cursor-pointer">
          {/* Slider active area */}
          <div
            className="absolute h-full bg-[#3B82F6] rounded-full"
            style={{
              left: `${zoomRange[0]}%`,
              width: `${zoomRange[1] - zoomRange[0]}%`,
            }}
          ></div>

          {/* Left handle */}
          <div
            className={cn(
              "absolute w-5 h-5 bg-white rounded-full -ml-2.5 -mt-1.5 cursor-ew-resize shadow-md",
              isDragging === "left" && "ring-2 ring-[#3B82F6]",
            )}
            style={{ left: `${zoomRange[0]}%` }}
            onMouseDown={(e) => handleMouseDown(e, "left")}
          ></div>

          {/* Right handle */}
          <div
            className={cn(
              "absolute w-5 h-5 bg-white rounded-full -mr-2.5 -mt-1.5 cursor-ew-resize shadow-md",
              isDragging === "right" && "ring-2 ring-[#3B82F6]",
            )}
            style={{ left: `${zoomRange[1]}%` }}
            onMouseDown={(e) => handleMouseDown(e, "right")}
          ></div>

          {/* Slider bar (for dragging the entire range) */}
          <div
            className={cn("absolute h-full cursor-move", isDragging === "slider" && "bg-[#3B82F6]")}
            style={{
              left: `${zoomRange[0]}%`,
              width: `${zoomRange[1] - zoomRange[0]}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "slider")}
          ></div>
        </div>

        <div className="absolute right-0 top-2">
          <button
            className="w-6 h-6 flex items-center justify-center bg-transparent rounded-full text-white hover:text-[#3B82F6] transition-colors"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="h-[220px] relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#969da9] font-medium">
          <span>Online</span>
          <span>Offline</span>
        </div>

        {/* Main visualization area */}
        <div ref={timelineRef} className="ml-16 h-full rounded relative overflow-hidden">
          {/* SVG Chart */}
          <svg
            className={cn(
              "chart-svg w-full h-full",
              isChartAnimating && "chart-animation",
              "transition-transform duration-150 ease-out",
            )}
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
            style={{
              transform: isChartAnimating ? "scale(0.995)" : "scale(1)",
            }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="timelineLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="40%" stopColor="#8b5bf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              <linearGradient id="timelineAreaGradientLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1a1f32" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="timelineAreaGradientMiddle" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5bf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1a1f32" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="timelineAreaGradientRight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1a1f32" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="1000" height="200" fill="#1a1f32" />

            {/* Area fills */}
            <path
              className={cn(
                "chart-path transition-all duration-150 ease-out",
                isChartAnimating && "chart-path-animate",
              )}
              d="M0,30 L100,40 L200,20 L300,120 L400,30 L500,40 L600,30 L700,20 L800,30 L900,20 L1000,10 L1000,200 L0,200 Z"
              fill="url(#timelineAreaGradientLeft)"
              opacity="0.8"
            />

            <path
              className={cn(
                "chart-path transition-all duration-150 ease-out",
                isChartAnimating && "chart-path-animate",
              )}
              d="M300,120 L400,30 L500,40 L600,30 L700,20 L1000,10 L1000,200 L300,200 Z"
              fill="url(#timelineAreaGradientMiddle)"
              opacity="0.8"
            />

            <path
              className={cn(
                "chart-path transition-all duration-150 ease-out",
                isChartAnimating && "chart-path-animate",
              )}
              d="M700,20 L800,30 L900,20 L1000,10 L1000,200 L700,200 Z"
              fill="url(#timelineAreaGradientRight)"
              opacity="0.8"
            />

            {/* Vertical time markers */}
            {timeStamps.map((stamp, index) => {
              const position = (stamp.position / 100) * 1000
              return (
                <line
                  key={`marker-${index}`}
                  x1={position}
                  y1="0"
                  x2={position}
                  y2="200"
                  stroke="#252a3d"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              )
            })}

            {/* Main line */}
            <path
              className={cn(
                "chart-line transition-all duration-150 ease-out",
                isChartAnimating && "chart-line-animate",
              )}
              d="M0,30 L100,40 L200,20 L300,120 L400,30 L500,40 L600,30 L700,20 L800,30 L900,20 L1000,10"
              fill="none"
              stroke="url(#timelineLineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            <circle
              cx="0"
              cy="30"
              r="5"
              fill="#3b82f6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="100"
              cy="40"
              r="5"
              fill="#3b82f6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="200"
              cy="20"
              r="5"
              fill="#3b82f6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="300"
              cy="120"
              r="5"
              fill="#3b82f6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="400"
              cy="30"
              r="5"
              fill="#8b5bf6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="500"
              cy="40"
              r="5"
              fill="#8b5bf6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="600"
              cy="30"
              r="5"
              fill="#8b5bf6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="700"
              cy="20"
              r="5"
              fill="#8b5bf6"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="800"
              cy="30"
              r="5"
              fill="#ec4899"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="900"
              cy="20"
              r="5"
              fill="#ec4899"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
            <circle
              cx="1000"
              cy="10"
              r="5"
              fill="#ec4899"
              className={cn(
                "chart-point transition-all duration-150 ease-out",
                isChartAnimating && "chart-point-animate",
              )}
            />
          </svg>
        </div>
      </div>

      {/* X-axis time labels */}
      <div className="ml-16 mt-2 flex relative text-xs text-[#969da9] font-medium">
        {timeStamps.map((stamp, index) => (
          <div
            key={`time-${index}`}
            className="absolute whitespace-nowrap transform -translate-x-1/2"
            style={{ left: `${stamp.position}%` }}
          >
            {stamp.time}
          </div>
        ))}
      </div>
    </div>
  )
}
