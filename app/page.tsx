import { DashboardHeader } from "@/components/dashboard-header"
import { SystemOverview } from "@/components/system-overview"
import { ServicesMonitor } from "@/components/services-monitor"
import { ActivityLog } from "@/components/activity-log"
import { NetworkServices } from "@/components/network-services"

export default function Dashboard() {
  return (
    <div className="flex flex-col bg-[#111827] min-h-screen">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-white">System Overview</h1>
          <div className="flex flex-wrap gap-2">
            <select className="rounded-md border border-[#2E3447] bg-[#1A1F32] px-4 py-2 text-sm text-white">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
            <select className="rounded-md border border-[#2E3447] bg-[#1A1F32] px-4 py-2 text-sm text-white">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
          </div>
        </div>
        <SystemOverview />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServicesMonitor />
          <ActivityLog />
        </div>

        {/* New Network Services Section */}
        <div className="mt-8">
          <NetworkServices />
        </div>
      </main>
    </div>
  )
}
