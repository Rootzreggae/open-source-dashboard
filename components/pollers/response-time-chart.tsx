"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ResponseTimeChartProps {
  responseTime: string
  className?: string
}

export function ResponseTimeChart({ responseTime, className }: ResponseTimeChartProps) {
  const [chartMounted, setChartMounted] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  // Set chartMounted to true after component mounts to avoid SSR issues
  useEffect(() => {
    setChartMounted(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Extract numeric value from response time string (e.g., "7.2ms" -> 7.2)
  const value = useMemo(() => {
    return Number.parseFloat(responseTime) || 7.2
  }, [responseTime])

  // Generate sample data that matches the Figma design but with more points
  const generateChartData = () => {
    const baseValue = value * 0.8 // Base value is 80% of the current value
    const data = []

    // Create 12 data points for a smoother chart
    for (let i = 0; i < 12; i++) {
      // Create a natural variation pattern
      let pointValue

      if (i < 8) {
        // First 8 points have small variations
        const variation = Math.random() * 0.3 - 0.15 // Random value between -0.15 and 0.15
        pointValue = baseValue * (1 + variation)
      } else {
        // Last 4 points trend toward the current value
        const trendFactor = (i - 7) / 4 // Gradually increase influence
        const variation = Math.random() * 0.1 - 0.05 // Smaller random variation
        pointValue = baseValue * (1 - trendFactor) * (1 + variation) + value * trendFactor
      }

      data.push({
        x: i + 1,
        y: Number.parseFloat(pointValue.toFixed(2)),
      })
    }

    return data
  }

  const chartData = useMemo(() => generateChartData(), [value])

  // Determine chart height based on screen size
  const getChartHeight = () => {
    if (windowWidth < 640) return 60 // Small screens
    if (windowWidth < 768) return 70 // Medium screens
    return 80 // Large screens
  }

  // ApexCharts options
  const chartOptions = {
    chart: {
      type: "area" as const,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout" as const,
        speed: 800,
      },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#23c25c"], // Green color matching the Figma design
    stroke: {
      curve: "smooth" as const,
      width: 3,
      lineCap: "round",
      lineJoin: "round",
    },
    markers: {
      size: 0,
      colors: ["#23c25c"],
      strokeWidth: 0,
      hover: {
        size: 5,
        sizeOffset: 3,
      },
    },
    grid: {
      show: true,
      borderColor: "#252a3d",
      strokeDashArray: 3,
      padding: {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
      },
    },
    xaxis: {
      labels: {
        show: false,
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
        show: false,
      },
      min: Math.max(0, value * 0.7), // Set min to 70% of current value
      max: value * 1.3, // Set max to 130% of current value
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
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
    <div className={cn("bg-[#1a1f32] rounded-lg p-4 response-time-chart", className)}>
      <h4 className="text-sm font-medium text-gray-400 mb-4">Response Time</h4>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Current</span>
          <div className="text-2xl font-bold text-white">{responseTime}</div>
        </div>
        <div className="h-[120px] w-full">
          {chartMounted && (
            <Chart
              options={{
                ...chartOptions,
                tooltip: {
                  ...chartOptions.tooltip,
                  enabled: true,
                  theme: "dark",
                  x: {
                    show: true,
                    formatter: (val) => `Point ${val}`,
                  },
                  y: {
                    formatter: (val) => `${val.toFixed(2)}ms`,
                  },
                  marker: {
                    show: true,
                  },
                  style: {
                    fontSize: "12px",
                  },
                },
                chart: {
                  ...chartOptions.chart,
                  animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                    animateGradually: {
                      enabled: true,
                      delay: 150,
                    },
                    dynamicAnimation: {
                      enabled: true,
                      speed: 350,
                    },
                  },
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    shade: "dark",
                    type: "vertical",
                    shadeIntensity: 0.3,
                    gradientToColors: ["#1a1f32"],
                    inverseColors: false,
                    opacityFrom: 0.6,
                    opacityTo: 0.1,
                    stops: [0, 100],
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
              }}
              series={chartSeries}
              type="area"
              height="100%"
              width="100%"
              className="response-chart-animate"
            />
          )}
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#23c25c]"></span>
            <span className="text-xs text-gray-400">Avg: {(value * 0.9).toFixed(1)}ms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6]"></span>
            <span className="text-xs text-gray-400">Peak: {(value * 1.2).toFixed(1)}ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}
