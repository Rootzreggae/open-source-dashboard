import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#111827]">
      <DashboardHeader />
      {children}
    </div>
  )
}
