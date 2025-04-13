"use client"

import { Search } from "lucide-react"
import { MobileSidebar } from "./mobile-sidebar"
import { Breadcrumbs } from "./breadcrumbs"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center bg-[#171C2C] px-4">
      {/* Left side - Mobile sidebar trigger and Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MobileSidebar />
        </div>

        {/* Breadcrumbs - hidden on very small screens */}
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center/Right - Search bar */}
      <div className="flex flex-1 justify-end items-center">
        <div className="relative max-w-md w-full mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search pollers or services"
            className="w-full rounded-md border border-[#2E3447] bg-[#1A1F32] py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>
      </div>
    </header>
  )
}
