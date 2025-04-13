"use client";

import React from "react"; // Added React import
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApexTimeline } from "@/components/pollers/apex-timeline";
import { FallbackTimeline } from "@/components/pollers/fallback-timeline";
// Import the new ResponseTimeChart component
import { ResponseTimeChart } from "@/components/pollers/response-time-chart";

// This would normally come from a database or API
const getPollerData = (id: string) => {
  // Generate response time history data
  const responseTimeHistory = [];
  const now = new Date();

  // Generate data points for the last hour
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000); // Every 5 minutes
    // Base value with some random variation
    const baseValue = 6.5;
    const variation = Math.random() * 2 - 1; // Random value between -1 and 1
    const value = Math.max(3, Math.min(10, baseValue + variation)).toFixed(2);

    responseTimeHistory.push({
      timestamp: time.toISOString(),
      value: Number.parseFloat(value),
      serviceName: "ping",
    });
  }

  return {
    id,
    name: `poller-${id}`,
    status: "healthy",
    responseTime: "6.55ms",
    totalServices: 8,
    healthyServices: 8,
    unhealthyServices: 0,
    lastUpdated: "12/04/2025, 12:08:43",
    services: [
      { name: "snmp", status: "healthy", type: "snmp" },
      { name: "SSH", status: "healthy", type: "port" },
      { name: "dusk", status: "healthy", type: "grpc" },
      { name: "serviceradar-agent", status: "healthy", type: "process" },
      { name: "rusk", status: "healthy", type: "process" },
      { name: "network_sweep", status: "healthy", type: "sweep" },
      { name: "rperf-checker", status: "healthy", type: "grpc" },
      { name: "ping", status: "healthy", type: "icmp", responseTime: "6.55ms" },
    ],
    availabilityData: [
      { timestamp: "08:00:00", status: "online", value: 100 },
      { timestamp: "09:15:30", status: "online", value: 95 },
      { timestamp: "10:30:45", status: "online", value: 100 },
      { timestamp: "12:00:00", status: "online", value: 98 },
      { timestamp: "13:20:15", status: "degraded", value: 60 },
      { timestamp: "14:05:30", status: "online", value: 90 },
      { timestamp: "15:45:15", status: "online", value: 100 },
      { timestamp: "17:10:00", status: "degraded", value: 50 },
      { timestamp: "17:45:30", status: "offline", value: 0 },
      { timestamp: "18:15:45", status: "online", value: 85 },
      { timestamp: "20:30:00", status: "online", value: 95 },
      { timestamp: "22:24:54", status: "online", value: 100 },
    ],
    responseTimeHistory,
  };
};

export default function PollerDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // Fix: Unwrap params with React.use() before accessing id
  const poller = getPollerData(React.use(params).id);

  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [timelineError, setTimelineError] = useState(false);
  const [apexChartsLoaded, setApexChartsLoaded] = useState(false);

  // Check if ApexCharts is available
  useEffect(() => {
    // Simple check to see if we're in the browser
    if (typeof window !== "undefined") {
      try {
        import("react-apexcharts")
          .then(() => {
            setApexChartsLoaded(true);
          })
          .catch((err) => {
            console.error("Error loading ApexCharts:", err);
            setTimelineError(true);
          });
      } catch (error) {
        console.error("Error checking ApexCharts availability:", error);
        setTimelineError(true);
      }
    }
  }, []);

  // Filter services based on search query
  const filteredServices = poller.services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Format and set the last updated timestamp
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setLastUpdated(`${formattedDate} ${formattedTime}`);
  }, []);

  // Function to refresh data and update timestamp
  const refreshData = () => {
    // In a real app, this would fetch new data
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    setLastUpdated(`${formattedDate} ${formattedTime}`);

    // Here you would typically fetch new data
    console.log("Data refreshed at:", `${formattedDate} ${formattedTime}`);
  };

  // Function to handle timeline errors
  const handleTimelineError = (error: any) => {
    console.error("Timeline error:", error);
    setTimelineError(true);
  };

  return (
    <div className="flex flex-col bg-[#111827] min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/pollers")}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1F32] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-white">
              {poller.name}
            </span>
            <span className="flex items-center text-emerald-500 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              Healthy
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            Last update: {poller.lastUpdated}
          </div>
        </div>
        <Button
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center gap-2"
          onClick={refreshData}
        >
          <RefreshCw size={16} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Services" value={poller.totalServices} />
        <SummaryCard
          title="Healthy Services"
          value={poller.healthyServices}
          valueColor="text-emerald-500"
        />
        <SummaryCard
          title="Unhealthy Services"
          value={poller.unhealthyServices}
        />
        <SummaryCard title="Avg Response Time" value={poller.responseTime} />
      </div>

      {/* Interactive Timeline */}
      {timelineError || !apexChartsLoaded ? (
        <FallbackTimeline data={poller.availabilityData} className="mb-6" />
      ) : (
        <ApexTimeline data={poller.availabilityData} className="mb-6" />
      )}

      {/* Response Time Chart */}
      <ResponseTimeChart data={poller.responseTimeHistory} className="mb-6" />

      {/* Services */}
      <div className="bg-[#171C2C] rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-white text-lg font-medium">Services</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 rounded-md border border-[#252A3D] bg-[#1A1F32] py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />
            </div>
            <Button
              variant="outline"
              className="border-[#252A3D] bg-[#1A1F32] text-white hover:bg-[#252A3D] flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              Filter: All
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  valueColor = "text-white",
}: {
  title: string;
  value: string | number;
  valueColor?: string;
}) {
  return (
    <div className="bg-[#171C2C] rounded-lg p-4">
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className={cn("text-3xl font-bold", valueColor)}>{value}</p>
    </div>
  );
}

function ServiceCard({ service }: { service: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1A1F32] rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#252A3D]">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="text-white font-medium">{service.name}</h3>
            <p className="text-gray-400 text-sm">{service.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {service.responseTime && (
            <div className="flex items-center gap-1">
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path
                  d="M0,10 C5,8 10,12 15,10 C20,8 25,12 30,10 C35,8 40,12 40,10"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-sm text-gray-400">
                {service.responseTime}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown
              size={20}
              className={cn(
                "transition-transform",
                isExpanded && "transform rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {/* Expanded content would go here */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#252A3D]">
          <div className="text-gray-400 text-sm">
            <p>Service details would appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
