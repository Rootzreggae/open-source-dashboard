"use client"

import { CheckCircle, ChevronUp, Layers, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PollerCardExpandedProps {
  poller: any
  onToggle: () => void
}

export function PollerCardExpanded({ poller, onToggle }: PollerCardExpandedProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-[#1e2235] shadow-lg border border-[#30374a]">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-white">{poller.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-emerald-400 text-sm font-medium">
            {poller.servicesHealthy}/{poller.servicesHealthy + poller.servicesDegraded + poller.servicesCritical}{" "}
            Services Healthy
          </div>
          <button
            onClick={onToggle}
            className="rounded-md p-1 text-gray-400 hover:bg-[#252a3d] hover:text-white transition-colors duration-200"
            aria-label="Collapse card"
          >
            <ChevronUp className="h-5 w-5 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-4 px-4 pb-2">
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Response Time</h4>
          <p className="text-xl font-bold text-white">{poller.responseTime}</p>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Services Status</h4>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="text-white">{poller.servicesHealthy}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-orange-500"></span>
              <span className="text-white">{poller.servicesDegraded}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="text-white">{poller.servicesCritical}</span>
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Last Updated</h4>
          <p className="text-white">{poller.lastUpdated}</p>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="px-4 py-3">
        <div className="flex h-6 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "bg-emerald-500 rounded-sm w-full",
                i === 2 && "h-4 mt-2",
                i === 3 && "h-6 mt-0",
                i === 4 && "h-5 mt-1",
                i === 5 && "h-3 mt-3",
                (i === 0 || i === 1 || i === 6) && "h-5 mt-1",
              )}
            ></div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex flex-wrap gap-2">
          {poller.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 text-sm bg-[#2c3657] text-blue-300 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      <div className="border-t border-[#30374a] p-4 animate-fadeIn">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Poller Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#252a3d] rounded-md p-4">
              <h5 className="text-xs text-gray-400 uppercase mb-2">Status History</h5>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#30374a] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
                <span className="text-xs text-white">100%</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Last 24 hours</span>
                  <span className="text-emerald-400">No incidents</span>
                </div>
              </div>
            </div>
            <div className="bg-[#252a3d] rounded-md p-4">
              <h5 className="text-xs text-gray-400 uppercase mb-2">Response Time Trend</h5>
              <div className="flex items-end gap-1 h-10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-emerald-500 w-full rounded-sm"
                    style={{ height: `${Math.max(20, Math.min(100, 30 + Math.random() * 70))}%` }}
                  ></div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Average: 7.1ms</span>
                  <span>Peak: 8.3ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Groups Section */}
      {poller.serviceGroups && (
        <div className="border-t border-[#30374a] p-4 animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-white">Service Groups</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {poller.serviceGroups.map((group: any, index: number) => (
              <div key={group.name} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
                <ServiceGroup group={group} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Section */}
      {poller.services && (
        <div className="border-t border-[#30374a] p-4 animate-fadeIn" style={{ animationDelay: "150ms" }}>
          <div className="mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-white">Services</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {poller.services.map((service: any, index: number) => (
              <div key={service.name} className="animate-slideUp" style={{ animationDelay: `${200 + index * 30}ms` }}>
                <ServiceItem service={service} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Detailed Dashboard Button */}
      <div className="border-t border-[#30374a] p-4 text-center animate-fadeIn" style={{ animationDelay: "300ms" }}>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
          View Detailed Dashboard
        </Button>
      </div>
    </div>
  )
}

function ServiceGroup({ group }: { group: any }) {
  const percentage = (group.healthy / group.total) * 100

  return (
    <div className="rounded-md bg-[#252a3d] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h5 className="text-sm font-medium text-white">{group.name}</h5>
        <span className="text-xs text-gray-400">
          {group.healthy} / {group.total} healthy
        </span>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#30374a]">
        <div className="h-full bg-emerald-500 animate-progressFill" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.services.map((service: string) => (
          <div key={service} className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-white">{service}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServiceItem({ service }: { service: any }) {
  return (
    <div className="rounded-md bg-[#252a3d] p-3 transition-all duration-200 hover:bg-[#30374a] hover:shadow-md">
      <div className="mb-1 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium text-white">{service.name}</span>
      </div>
      <div className="text-xs text-gray-400">{service.type}</div>
    </div>
  )
}
