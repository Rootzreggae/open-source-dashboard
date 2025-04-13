import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for the services table (v61 compatible)
const services = [
  {
    name: "API Gateway v61",
    status: "healthy",
    response: "42ms",
    lastCheck: "12:08:43",
    version: "v61.0.3",
    compatibility: "100%",
  },
  {
    name: "Database Cluster",
    status: "healthy",
    response: "56ms",
    lastCheck: "12:08:42",
    version: "v61.2.1",
    compatibility: "100%",
  },
  {
    name: "Load Balancer",
    status: "degraded",
    response: "187ms",
    lastCheck: "12:08:40",
    version: "v61.0.5",
    compatibility: "98%",
  },
  {
    name: "Authentication Service",
    status: "healthy",
    response: "63ms",
    lastCheck: "12:08:39",
    version: "v61.1.0",
    compatibility: "100%",
  },
  {
    name: "Message Queue",
    status: "healthy",
    response: "28ms",
    lastCheck: "12:08:38",
    version: "v61.0.7",
    compatibility: "100%",
  },
  {
    name: "Storage Service",
    status: "critical",
    response: "timeout",
    lastCheck: "12:08:35",
    version: "v61.0.2",
    compatibility: "95%",
  },
  {
    name: "CDN",
    status: "healthy",
    response: "18ms",
    lastCheck: "12:08:32",
    version: "v61.3.0",
    compatibility: "100%",
  },
  {
    name: "Logging Service",
    status: "healthy",
    response: "45ms",
    lastCheck: "12:08:30",
    version: "v61.1.2",
    compatibility: "100%",
  },
]

export function ServicesMonitor() {
  return (
    <div className="bg-[#171C2C] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#252A3D] flex justify-between items-center">
        <h2 className="text-white text-lg font-medium">Services Monitor</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1A1F32]">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Version
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Response
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Check
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252A3D]">
            {services.map((service, index) => (
              <tr key={index} className="hover:bg-[#1A1F32] transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{service.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-white mr-2">{service.version}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        service.compatibility === "100%"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : service.compatibility === "98%"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {service.compatibility}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div
                    className={cn(
                      "text-sm",
                      service.status === "critical"
                        ? "text-red-400"
                        : service.status === "degraded"
                          ? "text-yellow-400"
                          : "text-gray-300",
                    )}
                  >
                    {service.response}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-400 text-right">{service.lastCheck}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex items-center">
      {status === "healthy" ? (
        <>
          <CheckCircle className="h-4 w-4 text-emerald-500 mr-1.5" />
          <span className="text-sm text-emerald-500">Healthy</span>
        </>
      ) : status === "degraded" ? (
        <>
          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1.5" />
          <span className="text-sm text-yellow-500">Degraded</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-red-500 mr-1.5" />
          <span className="text-sm text-red-500">Critical</span>
        </>
      )}
    </div>
  )
}
