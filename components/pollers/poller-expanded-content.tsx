"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ExpandedResponseTimeChart } from "./expanded-response-time-chart"

interface PollerExpandedContentProps {
  poller: any
}

export function PollerExpandedContent({ poller }: PollerExpandedContentProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Generate sample logs
  const generateLogs = () => {
    const logs = []
    const now = new Date()
    const logTypes = ["info", "warning", "error"]
    const logMessages = [
      "Service check completed",
      "Response time threshold exceeded",
      "Connection established",
      "Service restarted",
      "Timeout occurred",
      "Authentication successful",
      "Resource utilization high",
      "Configuration updated",
      "Backup completed",
      "Scheduled maintenance performed",
    ]

    for (let i = 0; i < 10; i++) {
      const time = new Date(now.getTime() - i * Math.floor(Math.random() * 60) * 60 * 1000)
      const type = logTypes[Math.floor(Math.random() * logTypes.length)]
      const message = logMessages[Math.floor(Math.random() * logMessages.length)]

      logs.push({
        timestamp: time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        date: time.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        type,
        message,
      })
    }

    return logs
  }

  // Generate service uptime data
  const generateUptimeData = () => {
    const data = []
    const now = new Date()

    for (let i = 0; i < poller.totalServices || 8; i++) {
      const serviceName = poller.services ? poller.services[i]?.name || `Service-${i + 1}` : `Service-${i + 1}`

      // Generate uptime percentage based on poller status
      let uptime
      if (poller.status === "healthy") {
        uptime = 99 + Math.random()
        if (uptime > 100) uptime = 100
      } else if (poller.status === "warning") {
        uptime = 90 + Math.random() * 9
      } else {
        uptime = 70 + Math.random() * 20
      }

      data.push({
        name: serviceName,
        uptime: uptime.toFixed(2),
        lastChecked: new Date(now.getTime() - Math.floor(Math.random() * 60) * 60 * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      })
    }

    return data
  }

  const logs = generateLogs()
  const uptimeData = generateUptimeData()

  return (
    <div className="border-t border-[#252a3d] p-4 animate-fadeIn">
      {/* Tabs */}
      <div className="flex border-b border-[#252a3d] mb-4 overflow-x-auto">
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === "overview"
              ? "text-white border-b-2 border-[#23c25c] -mb-px"
              : "text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === "services"
              ? "text-white border-b-2 border-[#23c25c] -mb-px"
              : "text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === "logs" ? "text-white border-b-2 border-[#23c25c] -mb-px" : "text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("logs")}
        >
          Logs
        </button>
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === "performance"
              ? "text-white border-b-2 border-[#23c25c] -mb-px"
              : "text-gray-400 hover:text-white",
          )}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Response Time Chart */}
            <ExpandedResponseTimeChart responseTime={poller.responseTime} />

            <div className="bg-[#1a1f32] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-6">Poller Details</h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={cn(
                      "font-medium",
                      poller.status === "healthy"
                        ? "text-[#23c25c]"
                        : poller.status === "warning"
                          ? "text-[#e4af0b]"
                          : "text-[#ef4444]",
                    )}
                  >
                    {poller.status === "healthy" ? "Healthy" : poller.status === "warning" ? "Warning" : "Critical"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address:</span>
                  <span className="text-white">192.168.1.{Math.floor(Math.random() * 254) + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Data Center {Math.floor(Math.random() * 3) + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-white">{Math.floor(Math.random() * 30) + 1} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Reboot:</span>
                  <span className="text-white">
                    {new Date(
                      Date.now() - (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1f32] rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-6">Resource Utilization</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">CPU</span>
                  <span className="text-white text-sm">{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="h-2 bg-[#252a3d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b82f6]" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Memory</span>
                  <span className="text-white text-sm">{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="h-2 bg-[#252a3d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8b5bf6]" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Disk</span>
                  <span className="text-white text-sm">{Math.floor(Math.random() * 100)}%</span>
                </div>
                <div className="h-2 bg-[#252a3d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ec4899]" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Network</span>
                  <span className="text-white text-sm">{Math.floor(Math.random() * 1000)} Mbps</span>
                </div>
                <div className="h-2 bg-[#252a3d] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981]" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="bg-[#1a1f32] rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-6">Service Uptime</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252a3d]">
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Service Name</th>
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Status</th>
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Uptime</th>
                  <th className="text-right py-2 px-4 text-gray-400 text-sm font-medium">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {uptimeData.map((service, index) => (
                  <tr key={index} className="border-b border-[#252a3d] last:border-0">
                    <td className="py-3 px-4 text-white">{service.name}</td>
                    <td className="py-3 px-4">
                      {Number.parseFloat(service.uptime) > 99 ? (
                        <span className="flex items-center text-[#23c25c]">
                          <CheckCircle size={16} className="mr-1" />
                          Healthy
                        </span>
                      ) : Number.parseFloat(service.uptime) > 90 ? (
                        <span className="flex items-center text-[#e4af0b]">
                          <AlertTriangle size={16} className="mr-1" />
                          Warning
                        </span>
                      ) : (
                        <span className="flex items-center text-[#ef4444]">
                          <XCircle size={16} className="mr-1" />
                          Critical
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-[#252a3d] rounded-full overflow-hidden mr-2">
                          <div
                            className={cn(
                              "h-full",
                              Number.parseFloat(service.uptime) > 99
                                ? "bg-[#23c25c]"
                                : Number.parseFloat(service.uptime) > 90
                                  ? "bg-[#e4af0b]"
                                  : "bg-[#ef4444]",
                            )}
                            style={{ width: `${service.uptime}%` }}
                          ></div>
                        </div>
                        <span className="text-white">{service.uptime}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-right">{service.lastChecked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-[#1a1f32] rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-medium text-white">Recent Logs</h4>
            <select className="bg-[#252a3d] border border-[#30374a] rounded text-white text-sm px-2 py-1">
              <option>All Logs</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Error</option>
            </select>
          </div>
          <div className="overflow-y-auto max-h-[300px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252a3d]">
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Time</th>
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Type</th>
                  <th className="text-left py-2 px-4 text-gray-400 text-sm font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} className="border-b border-[#252a3d] last:border-0">
                    <td className="py-2 px-4 text-gray-400 text-sm whitespace-nowrap">
                      {log.date} {log.timestamp}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs",
                          log.type === "info"
                            ? "bg-blue-500/20 text-blue-400"
                            : log.type === "warning"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400",
                        )}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-white text-sm">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpandedResponseTimeChart responseTime={poller.responseTime} />
            <div className="bg-[#1a1f32] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-6">Response Time Distribution</h4>
              <div className="flex flex-col h-[200px] justify-center">
                <div className="flex items-center justify-center h-full">
                  <div className="w-32 h-32 rounded-full border-8 border-[#23c25c] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{poller.responseTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" className="border-[#252a3d] bg-[#1a1f32] text-white hover:bg-[#252a3d]">
          View Details
        </Button>
        <Button className="bg-[#23c25c] hover:bg-[#1ca24c] text-white">Manage Poller</Button>
      </div>
    </div>
  )
}
