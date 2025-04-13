import type React from "react"
import { Activity, Monitor, Heart, Clock } from "lucide-react"

export function SystemOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="OVERALL HEALTH"
        value="100%"
        subtitle="Last updated: April 12, 2025 - 10:37:45"
        icon={<Activity className="text-emerald-500" />}
        progressValue={100}
        progressColor="bg-emerald-500"
      />
      <MetricCard
        title="TOTAL POLLERS"
        value="8"
        subtitle="8 healthy · 0 degraded · 0 critical"
        icon={<Monitor className="text-blue-500" />}
      />
      <MetricCard
        title="ACTIVE SERVICES"
        value="29"
        subtitle="29 operational · 0 offline"
        icon={<Heart className="text-purple-500" />}
      />
      <MetricCard
        title="AVG RESPONSE TIME"
        value="6.97ms"
        subtitle="Average across all pollers"
        icon={<Clock className="text-emerald-500" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  progressValue?: number
  progressColor?: string
}

function MetricCard({ title, value, subtitle, icon, progressValue, progressColor }: MetricCardProps) {
  return (
    <div className="bg-[#1A1F32] rounded-lg p-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex flex-col h-full">
          <h3 className="text-gray-400 text-xs font-medium mb-4">{title}</h3>
          <p className="text-4xl font-bold text-white">{value}</p>
          <p className="text-gray-400 text-xs mt-auto">{subtitle}</p>
        </div>
        <div className="bg-[#252A3D] p-3 rounded-full">{icon}</div>
      </div>
      {progressValue !== undefined && (
        <div className="mt-6 bg-[#252A3D] h-2 rounded-full overflow-hidden">
          <div className={`h-full ${progressColor}`} style={{ width: `${progressValue}%` }}></div>
        </div>
      )}
    </div>
  )
}
