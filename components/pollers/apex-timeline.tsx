"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface TimelineDataPoint {
  timestamp: string
  status: "online" | "offline" | "degraded"
  value: number
}

interface ApexTimelineProps {
  data: TimelineDataPoint[]
  className?: string
}

// Helper function to parse time string to Date object
function parseTimeString(timeStr: string): Date {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, seconds, 0)
  return date
}

export function ApexTimeline({ data, className }: ApexTimelineProps) {
  const [chartMounted, setChartMounted] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomStart, setZoomStart] = useState<number | null>(null)
  const [zoomEnd, setZoomEnd] = useState<number | null>(null)

  // Process data for ApexCharts
  const processedData = useMemo(() => {
    if (!data || data.length === 0) {
      // Create default data if none provided
      return {
        timestamps: [parseTimeString("08:00:00").getTime(), parseTimeString("22:24:54").getTime()],
        values: [100, 100],
        statuses: ["online", "online"],
      }
    }

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => {
      return parseTimeString(a.timestamp).getTime() - parseTimeString(b.timestamp).getTime()
    })

    return {
      timestamps: sortedData.map((item) => parseTimeString(item.timestamp).getTime()),
      values: sortedData.map((item) =>
        typeof item.value === "number"
          ? item.value
          : item.status === "online"
            ? 100
            : item.status === "degraded"
              ? 50
              : 0,
      ),
      statuses: sortedData.map((item) => item.status),
    }
  }, [data])

  // Get time domain from data
  const timeDomain = useMemo(() => {
    if (processedData.timestamps.length === 0) {
      return [parseTimeString("08:00:00").getTime(), parseTimeString("22:24:54").getTime()]
    }
    return [Math.min(...processedData.timestamps), Math.max(...processedData.timestamps)]
  }, [processedData])

  // Calculate current zoom domain
  const currentDomain = useMemo(() => {
    if (zoomStart !== null && zoomEnd !== null) {
      return [zoomStart, zoomEnd]
    }
    return timeDomain
  }, [timeDomain, zoomStart, zoomEnd])

  // Zoom in function
  const zoomIn = () => {
    const [start, end] = currentDomain
    const middle = (start + end) / 2
    const range = end - start
    const newRange = range * 0.5 // Zoom in by 50%

    setZoomStart(middle - newRange / 2)
    setZoomEnd(middle + newRange / 2)
    setZoomLevel(zoomLevel + 1)
  }

  // Zoom out function
  const zoomOut = () => {
    if (zoomStart === null || zoomEnd === null) return

    const [start, end] = currentDomain
    const middle = (start + end) / 2
    const range = end - start
    const newRange = range * 2 // Zoom out by 100%

    const newStart = Math.max(timeDomain[0], middle - newRange / 2)
    const newEnd = Math.min(timeDomain[1], middle + newRange / 2)

    // If we've zoomed out beyond the original domain, reset to full view
    if (newStart <= timeDomain[0] && newEnd >= timeDomain[1]) {
      resetZoom()
    } else {
      setZoomStart(newStart)
      setZoomEnd(newEnd)
      setZoomLevel(zoomLevel - 1)
    }
  }

  // Reset zoom
  const resetZoom = () => {
    setZoomStart(null)
    setZoomEnd(null)
    setZoomLevel(1)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#8b5bf6"
      case "degraded":
        return "#f59e0b"
      case "offline":
        return "#ef4444"
      default:
        return "#8b5bf6"
    }
  }

  // Format time for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  // ApexCharts options
  const chartOptions = {
    chart: {
      id: "poller-timeline",
      type: "area" as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
        type: "x" as const,
      },
      animations: {
        enabled: true,
        easing: "easeinout" as const,
        speed: 300,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      background: "#1a1f32",
      dropShadow: {
        enabled: true,
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.08, // Reduced from 0.15 to maintain visual harmony
        color: "#8b5bf6",
      },
      events: {
        zoomed: (chartContext: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
          setZoomStart(xaxis.min)
          setZoomEnd(xaxis.max)
        },
        scrolled: (chartContext: any, { xaxis }: { xaxis: { min: number; max: number } }) => {
          setZoomStart(xaxis.min)
          setZoomEnd(xaxis.max)
        },
      },
    },
    colors: ["#8b5bf6"],
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 0.6, // Reduced from 0.8 to maintain visual harmony
        gradientToColors: ["#3b82f6"],
        inverseColors: false,
        opacityFrom: 0.4, // Reduced from 0.8 (50% of original)
        opacityTo: 0.1, // Reduced from 0.2 (50% of original)
        stops: [0, 65, 100],
        colorStops: [
          {
            offset: 0,
            color: "#8b5bf6",
            opacity: 0.4, // Reduced from 0.8 (50% of original)
          },
          {
            offset: 50,
            color: "#3b82f6",
            opacity: 0.25, // Reduced from 0.5 (50% of original)
          },
          {
            offset: 100,
            color: "#252a3d",
            opacity: 0.05, // Reduced from 0.1 (50% of original)
          },
        ],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
      lineCap: "round",
      colors: ["#8b5bf6"],
    },
    grid: {
      borderColor: "#252a3d",
      strokeDashArray: 3,
      padding: {
        top: 10,
        right: 10,
        bottom: 0,
        left: 10,
      },
      xaxis: {
        lines: {
          show: true,
          opacity: 0.1,
        },
      },
      yaxis: {
        lines: {
          show: true,
          opacity: 0.1,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.05,
      },
    },
    markers: {
      size: 5,
      colors: processedData.statuses.map(getStatusColor),
      strokeWidth: 1,
      strokeColors: "#171c2c",
      hover: {
        size: 7,
        sizeOffset: 3,
      },
    },
    xaxis: {
      type: "datetime" as const,
      min: zoomStart || undefined,
      max: zoomEnd || undefined,
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
        datetimeFormatter: {
          hour: "HH:mm",
          minute: "HH:mm",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
      },
      title: {
        text: "Status",
        style: {
          color: "#969da9",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      x: {
        formatter: (val: number) => formatTime(val),
      },
      y: {
        formatter: (val: number, { dataPointIndex }: { dataPointIndex: number }) => {
          const status = processedData.statuses[dataPointIndex]
          return `${val} (${status})`
        },
      },
      theme: "dark",
      style: {
        fontSize: "12px",
      },
      marker: {
        show: true,
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
        const timestamp = w.globals.seriesX[seriesIndex][dataPointIndex]
        const value = series[seriesIndex][dataPointIndex]
        const status = processedData.statuses[dataPointIndex]
        const statusColor = getStatusColor(status)

        return `
      <div style="background: #1a1f32; padding: 8px; border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); border: 1px solid ${statusColor};">
        <div style="font-weight: 500; color: #ffffff; margin-bottom: 4px;">${formatTime(timestamp)}</div>
        <div style="font-size: 12px; display: flex; align-items: center; margin-bottom: 2px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; margin-right: 6px;"></span>
          <span style="color: #ffffff;">Status: <span style="color: ${statusColor}; font-weight: 500;">${status}</span></span>
        </div>
        <div style="font-size: 12px; color: #969da9;">Value: <span style="color: #ffffff; font-weight: 500;">${value}</span></div>
      </div>
    `
      },
    },
    annotations: {
      points: processedData.timestamps.map((timestamp, index) => ({
        x: timestamp,
        y: processedData.values[index],
        marker: {
          size: 4,
          fillColor: getStatusColor(processedData.statuses[index]),
          strokeColor: "#fff",
          strokeWidth: 1,
          radius: 2,
        },
        label: {
          borderColor: getStatusColor(processedData.statuses[index]),
          style: {
            color: "#fff",
            background: getStatusColor(processedData.statuses[index]),
          },
          text: processedData.statuses[index],
        },
      })),
    },
  }

  // Chart series data
  const chartSeries = [
    {
      name: "Status",
      data: processedData.timestamps.map((timestamp, index) => [timestamp, processedData.values[index]]),
    },
  ]

  // Set chartMounted to true after component mounts to avoid SSR issues
  useEffect(() => {
    setChartMounted(true)
  }, [])

  return (
    <div className={cn("bg-[#171c2c] rounded-lg p-4", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-base font-medium">Poller Availability Timeline</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-[#252a3d] bg-[#1a1f32] text-white hover:bg-[#252a3d]"
            onClick={zoomIn}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-[#252a3d] bg-[#1a1f32] text-white hover:bg-[#252a3d]"
            onClick={zoomOut}
            disabled={zoomStart === null}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-[#252a3d] bg-[#1a1f32] text-white hover:bg-[#252a3d]"
            onClick={resetZoom}
            disabled={zoomStart === null}
            aria-label="Reset zoom"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <div className="h-[220px] w-full">
        {chartMounted && <Chart options={chartOptions} series={chartSeries} type="area" height="100%" width="100%" />}
      </div>

      <div className="mt-3 text-xs text-[#969da9] text-center flex justify-center items-center">
        <div className="bg-[#1a1f32] px-3 py-1.5 rounded-full border border-[#252a3d] inline-flex items-center">
          {zoomStart !== null && zoomEnd !== null ? (
            <>
              <span className="text-[#8b5bf6] font-medium mr-1">Viewing:</span>
              <span>
                {formatTime(zoomStart)} to {formatTime(zoomEnd)} — Drag to pan, use buttons to zoom
              </span>
            </>
          ) : (
            <>
              <span className="text-[#8b5bf6] font-medium mr-1">Timeline:</span>
              <span>
                {formatTime(timeDomain[0])} to {formatTime(timeDomain[1])} — Drag to zoom
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
