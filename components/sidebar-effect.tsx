"use client"

import { useEffect } from "react"
import { useSidebar } from "@/hooks/use-sidebar"

export function SidebarEffect() {
  const { isExpanded } = useSidebar()

  useEffect(() => {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      if (window.innerWidth >= 768) {
        mainContent.style.marginLeft = isExpanded ? "16rem" : "5rem"
      } else {
        mainContent.style.marginLeft = "0"
      }
    }

    const handleResize = () => {
      if (mainContent) {
        if (window.innerWidth >= 768) {
          mainContent.style.marginLeft = isExpanded ? "16rem" : "5rem"
        } else {
          mainContent.style.marginLeft = "0"
        }
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isExpanded])

  return null
}
