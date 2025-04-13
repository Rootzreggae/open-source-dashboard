"use client";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Layers,
  Server,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface PollerCardProps {
  poller: any;
  isExpanded?: boolean;
  onToggle: () => void;
}

export function PollerCard({
  poller,
  isExpanded = false,
  onToggle,
}: PollerCardProps) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [statusText, setStatusText] = useState("Loading");

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setStatusText(getServiceStatusText());
  }, [
    poller.servicesHealthy,
    poller.servicesDegraded,
    poller.servicesCritical,
  ]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "#23c25c"; // Green
      case "warning":
        return "#e4af0b"; // Yellow
      case "critical":
        return "#ef4444"; // Red
      default:
        return "#23c25c";
    }
  };

  // Get status icon
  const StatusIcon = () => {
    if (poller.status === "healthy") {
      return <CheckCircle className="h-3.5 w-3.5 text-white" />;
    } else if (poller.status === "warning") {
      return <AlertTriangle className="h-3.5 w-3.5 text-white" />;
    } else {
      return <XCircle className="h-3.5 w-3.5 text-white" />;
    }
  };

  // Format service status text
  const getServiceStatusText = () => {
    const total =
      poller.servicesHealthy +
      poller.servicesDegraded +
      poller.servicesCritical;
    return `${poller.servicesHealthy} / ${total} Services Healthy`;
  };

  return (
    <div className="overflow-hidden rounded-lg bg-[#171c2c] border border-[#252a3d]/40 transition-all duration-200">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1a1f32] transition-colors duration-200"
        onClick={onToggle}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getStatusColor(poller.status) }}
          >
            <StatusIcon />
          </div>
          <h3 className="text-xl font-medium text-white">{poller.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-300 text-base">{statusText}</div>
          <div
            className="rounded-md p-1 text-gray-300 hover:text-white hover:bg-[#252a3d] transition-colors duration-200"
            aria-hidden="true"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      {/* Basic Info - Always visible */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Response Time Trend */}
          <div className="bg-[#1a1f32] rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">
              Response Time Trend
            </h4>
            <div className="flex items-center justify-between">
              <div className="w-1/2 h-[60px]">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,30 L20,28 L40,32 L60,10 L80,25 L100,20"
                    fill="none"
                    stroke="#23c25c"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">
                {poller.responseTime}
              </div>
            </div>
          </div>

          {/* Service Status */}
          <div className="bg-[#1a1f32] rounded-lg p-4 flex flex-col justify-between h-full">
            <h4 className="text-sm font-medium text-gray-400 mb-3">
              Services Status
            </h4>
            <div className="flex items-center gap-8 mt-auto">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-[#23c25c]"></div>
                <span className="text-xl font-medium text-white">
                  {poller.servicesHealthy}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-[#e4af0b]"></div>
                <span className="text-xl font-medium text-white">
                  {poller.servicesDegraded}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-[#ef4444]"></div>
                <span className="text-xl font-medium text-white">
                  {poller.servicesCritical}
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="bg-[#1a1f32] rounded-lg p-4 flex flex-col justify-between h-full">
            <h4 className="text-sm font-medium text-gray-400 mb-3">
              Last Updated
            </h4>
            <div className="flex items-center gap-3 mt-auto">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-base font-medium text-white">
                {poller.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {poller.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-4 py-1.5 text-sm bg-[#1e3a8a] text-[#b3cff6] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Content - Only shown when expanded */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {isExpanded && (
          <>
            {/* Service Groups Section */}
            <div className="border-t border-[#252a3d] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-gray-400" />
                <h4 className="text-base font-medium text-white">
                  Service Groups
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {poller.serviceGroups &&
                  poller.serviceGroups.map((group: any, index: number) => (
                    <div
                      key={group.name}
                      className="animate-slideUp"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="rounded-md bg-[#252a3d] p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h5 className="text-sm font-medium text-white">
                            {group.name}
                          </h5>
                          <span className="text-xs text-gray-400">
                            {group.healthy} / {group.total} healthy
                          </span>
                        </div>
                        <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#30374a]">
                          <div
                            className="h-full bg-emerald-500 animate-progressFill transition-all duration-500 ease-out"
                            style={{
                              width: `${(group.healthy / group.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.services.map((service: string) => (
                            <div
                              key={service}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-white">
                                {service}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Services Section */}
            <div className="border-t border-[#252a3d] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-400" />
                <h4 className="text-base font-medium text-white">Services</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {poller.services &&
                  poller.services.map((service: any, index: number) => (
                    <div
                      key={service.name}
                      className="animate-slideUp"
                      style={{ animationDelay: `${200 + index * 30}ms` }}
                    >
                      <div className="rounded-md bg-[#252a3d] p-3 transition-all duration-200 hover:bg-[#30374a] hover:shadow-md">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-white">
                            {service.name}
                          </span>
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="text-xs text-gray-400">
                          {service.type}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* View Detailed Dashboard Button */}
            <div
              className="border-t border-[#252a3d] p-4 flex justify-end animate-fadeIn"
              style={{ animationDelay: "300ms" }}
            >
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                onClick={() => router.push(`/pollers/${poller.id}/dashboard`)}
              >
                View Detailed Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
