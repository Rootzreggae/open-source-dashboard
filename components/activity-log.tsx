import { AlertCircle, CheckCircle, Clock, Settings, RefreshCw, Server, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for the activity log
const activities = [
  {
    id: 1,
    type: "alert",
    message: "Storage Service is experiencing high latency",
    timestamp: "12:08:35",
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: 2,
    type: "recovery",
    message: "Load Balancer performance has improved",
    timestamp: "12:05:22",
    icon: RefreshCw,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: 3,
    type: "status",
    message: "Database Cluster health check passed",
    timestamp: "12:00:18",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 4,
    type: "maintenance",
    message: "Scheduled maintenance on CDN completed",
    timestamp: "11:45:03",
    icon: Settings,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 5,
    type: "security",
    message: "Authentication Service security patch applied",
    timestamp: "11:30:47",
    icon: Shield,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 6,
    type: "status",
    message: "API Gateway performance metrics updated",
    timestamp: "11:15:12",
    icon: Server,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 7,
    type: "alert",
    message: "Message Queue approaching capacity limit",
    timestamp: "11:00:05",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: 8,
    type: "status",
    message: "Logging Service retention policy updated",
    timestamp: "10:45:33",
    icon: Clock,
    iconColor: "text-gray-400",
    bgColor: "bg-gray-500/10",
  },
]

export function ActivityLog() {
  return (
    <div className="bg-[#171C2C] rounded-lg overflow-hidden h-full">
      <div className="p-4 border-b border-[#252A3D] flex justify-between items-center">
        <h2 className="text-white text-lg font-medium">Activity Log</h2>
        <span className="text-xs text-gray-400">Today, April 12, 2025</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 57px)" }}>
        <ul className="divide-y divide-[#252A3D]">
          {activities.map((activity) => (
            <li key={activity.id} className="p-4 hover:bg-[#1A1F32] transition-colors">
              <div className="flex items-start">
                <div
                  className={cn(
                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3",
                    activity.bgColor,
                  )}
                >
                  <activity.icon className={cn("h-4 w-4", activity.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
