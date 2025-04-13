"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ExpandedResponseTimeChartProps {
  responseTime: string
  className?: string
}

export function ExpandedResponseTimeChart({ responseTime, className }: ExpandedResponseTimeChartProps) {
  const [chartMounted, setChartMounted] = useState(false)

  // Set chartMounted to true after component mounts to avoid SSR issues
  useEffect(() => {
    setChartMounted(true)
  }, [])

  // Extract numeric value from response time string (e.g., "7.2ms" -> 7.2)
  const value = useMemo(() => {
    return Number.parseFloat(responseTime) || 7.2
  }, [responseTime])

  // Generate sample data for a more detailed chart
  const generateChartData = () => {
    const baseValue = value * 0.8 // Base value is 80% of the current value
    const data = []

    // Create 24 data points for a more detailed view (last 24 hours)
    for (let i = 0; i < 24; i++) {
      // Create some natural variation
      const variation = Math.random() * 0.4 - 0.2 // Random value between -0.2 and 0.2
      let pointValue = baseValue * (1 + variation)

      // Add a trend towards the end to match the current value
      if (i > 18) {
        const trendFactor = (i - 18) / 5 // Gradually increase influence
        pointValue = pointValue * (1 - trendFactor) + value * trendFactor
      }

      const time = new Date()
      time.setHours(time.getHours() - (23 - i))

      data.push({
        x: time.getTime(),
        y: Number.parseFloat(pointValue.toFixed(2)),
      })
    }

    return data
  }

  const chartData = useMemo(() => generateChartData(), [value])

  // ApexCharts options for expanded view
  const chartOptions = {
    chart: {
      type: "line" as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout" as const,
        speed: 800,
      },
      background: "transparent",
    },
    colors: ["#23c25c"], // Green color matching the Figma design
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#23c25c"],
      strokeWidth: 0,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: "#252a3d",
      strokeDashArray: 3,
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
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
        datetimeFormatter: {
          hour: "HH:mm",
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
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
        formatter: (val: number) => `${val.toFixed(1)}ms`,
      },
      min: Math.max(0, value * 0.5), // Set min to 0 or 50% of current value, whichever is higher
      max: value * 1.5, // Set max to 150% of current value
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "HH:mm",
      },
      y: {
        formatter: (val: number) => `${val.toFixed(2)}ms`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  }

  // Chart series data
  const chartSeries = [
    {
      name: "Response Time",
      data: chartData,
    },
  ]

  return (
    <div className={cn("bg-[#1a1f32] rounded-lg p-4", className)}>
      <h4 className="text-sm font-medium text-white mb-6">Response Time History</h4>
      <div className="h-[200px]">
        {chartMounted && <Chart options={chartOptions} series={chartSeries} type="line" height="100%" width="100%" />}
      </div>
      <div className="mt-6 text-xs text-gray-400 flex justify-between">
        <span>Last 24 hours</span>
        <span>Current: {responseTime}</span>
      </div>
    </div>
  )
}
