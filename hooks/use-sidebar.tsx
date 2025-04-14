"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type SidebarContextType = {
  isExpanded: boolean;
  toggleSidebar: () => void;
  setIsExpanded: (value: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem("sidebar-expanded");
    if (savedState !== null) {
      setIsExpanded(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    if (isMounted) {
      localStorage.setItem("sidebar-expanded", String(newState));
    }
  };

  return (
    <SidebarContext.Provider
      value={{ isExpanded, toggleSidebar, setIsExpanded }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
