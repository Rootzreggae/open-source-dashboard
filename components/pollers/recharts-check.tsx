"use client"

import { useEffect, useState } from "react"

export function useRechartsAvailable() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    try {
      // Check if Recharts is available
      import("recharts")
        .then((module) => {
          if (module && module.AreaChart) {
            setIsAvailable(true)
          } else {
            setIsAvailable(false)
          }
        })
        .catch((error) => {
          console.error("Recharts not available:", error)
          setIsAvailable(false)
        })
    } catch (error) {
      console.error("Error checking Recharts availability:", error)
      setIsAvailable(false)
    }
  }, [])

  return isAvailable
}
