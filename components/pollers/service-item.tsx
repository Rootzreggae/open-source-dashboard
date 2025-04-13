import { CheckCircle } from "lucide-react"

interface ServiceItemProps {
  service: {
    name: string
    status: string
    type: string
  }
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <div className="rounded-md bg-[#252e47] p-3 transition-all duration-200 hover:bg-[#30374a] hover:shadow-md">
      <div className="mb-1 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">{service.name}</span>
      </div>
      <div className="text-xs text-gray-400">{service.type}</div>
    </div>
  )
}
