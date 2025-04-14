"use client";
import { useEffect } from "react";
import { useSidebar } from "@/hooks/use-sidebar";

export function SidebarEffect() {
  const { isExpanded } = useSidebar();

  useEffect(() => {
    // Set CSS variable for sidebar width
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isExpanded ? "16rem" : "5rem",
    );

    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      if (window.innerWidth >= 768) {
        mainContent.style.marginLeft = isExpanded ? "16rem" : "5rem";
        mainContent.style.width = `calc(100% - ${isExpanded ? "16rem" : "5rem"})`;
      } else {
        mainContent.style.marginLeft = "0";
        mainContent.style.width = "100%";
      }

      // Force a reflow to fix any layout issues
      void mainContent.offsetWidth;
    }

    const handleResize = () => {
      if (mainContent) {
        if (window.innerWidth >= 768) {
          mainContent.style.marginLeft = isExpanded ? "16rem" : "5rem";
          mainContent.style.width = `calc(100% - ${isExpanded ? "16rem" : "5rem"})`;
        } else {
          mainContent.style.marginLeft = "0";
          mainContent.style.width = "100%";
        }

        // Force a reflow when resizing as well
        void mainContent.offsetWidth;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isExpanded]);

  return null;
}
