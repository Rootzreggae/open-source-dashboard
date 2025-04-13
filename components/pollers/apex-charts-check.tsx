"use client"

import { useEffect, useState } from "react"

export function useApexChartsAvailable() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      // Check if ApexCharts is available
      import("react-apexcharts")
        .then(() => {
          setIsAvailable(true)
        })
        .catch((error) => {
          console.error("ApexCharts not available:", error)
          setIsAvailable(false)
        })
    } catch (error) {
      console.error("Error checking ApexCharts availability:", error)
      setIsAvailable(false)
    }
  }, [])

  return isAvailable
}
