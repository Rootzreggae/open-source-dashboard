import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function PollersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#111827] w-full">
      <DashboardHeader />
      <div className="w-full">{children}</div>
    </div>
  )
}
