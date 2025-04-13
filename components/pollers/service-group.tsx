import { CheckCircle } from "lucide-react"

interface ServiceGroupProps {
  group: {
    name: string
    healthy: number
    total: number
    services: string[]
  }
}

export function ServiceGroup({ group }: ServiceGroupProps) {
  const percentage = (group.healthy / group.total) * 100

  return (
    <div className="rounded-md bg-[#252e47] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h5 className="text-sm font-medium text-white">{group.name}</h5>
        <span className="text-xs text-gray-400">
          {group.healthy} / {group.total} healthy
        </span>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#30374a]">
        <div
          className="h-full bg-emerald-500 animate-progressFill transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.services.map((service) => (
          <div key={service} className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-white">{service}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
