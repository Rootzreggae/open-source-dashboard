"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { RefreshCw, Clock, Wifi, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Sample network data
const generateNetworkData = () => {
  // Generate 24 hours of data points (hourly)
  const now = new Date();
  const timestamps = [];
  const bandwidth = { upload: [], download: [] };
  const latency = [];
  const packetLoss = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    timestamps.push(time.getTime());

    // Generate realistic bandwidth data (in Mbps)
    const baseUpload = 25 + Math.random() * 15;
    const baseDownload = 85 + Math.random() * 35;

    // Add time-of-day pattern (higher during day, lower at night)
    const hour = time.getHours();
    const timeMultiplier =
      hour >= 8 && hour <= 22
        ? 1 + Math.sin(((hour - 8) * Math.PI) / 14) * 0.5
        : 0.7;

    bandwidth.upload.push(baseUpload * timeMultiplier);
    bandwidth.download.push(baseDownload * timeMultiplier);

    // Generate latency data (in ms)
    latency.push(15 + Math.random() * 10 * timeMultiplier);

    // Generate packet loss data (percentage)
    packetLoss.push(Math.random() * 0.8 * timeMultiplier);
  }

  return { timestamps, bandwidth, latency, packetLoss };
};

export function NetworkServices() {
  const [chartMounted, setChartMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("bandwidth");
  const [networkData, setNetworkData] = useState(generateNetworkData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Loading...");

  // Set chartMounted to true after component mounts to avoid SSR issues
  useEffect(() => {
    setChartMounted(true);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  // Function to refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNetworkData(generateNetworkData());
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 800);
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Bandwidth Chart Options
  const bandwidthOptions = {
    chart: {
      id: "bandwidth-chart",
      type: "area" as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout" as const,
        speed: 800,
      },
      background: "#1a1f32",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#3b82f6", "#8b5bf6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
      width: 2,
    },
    grid: {
      borderColor: "#252a3d",
      strokeDashArray: 3,
      padding: {
        top: 10,
        right: 10,
        bottom: 0,
        left: 10,
      },
      xaxis: {
        lines: {
          show: true,
          opacity: 0.1,
        },
      },
      yaxis: {
        lines: {
          show: true,
          opacity: 0.1,
        },
      },
    },
    markers: {
      size: 0,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
        datetimeFormatter: {
          hour: "HH:mm",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#969da9",
          fontSize: "12px",
        },
        formatter: (val: number) => `${val.toFixed(0)} Mbps`,
      },
    },
    tooltip: {
      x: {
        formatter: (val: number) => formatTime(val),
      },
      theme: "dark",
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      position: "top" as const,
      horizontalAlign: "right" as const,
      labels: {
        colors: "#969da9",
      },
    },
  };

  // Latency Chart Options
  const latencyOptions = {
    ...bandwidthOptions,
    chart: {
      ...bandwidthOptions.chart,
      id: "latency-chart",
      type: "line" as const,
    },
    colors: ["#8b5bf6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0.0,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    markers: {
      size: 3,
      colors: ["#8b5bf6"],
      strokeWidth: 0,
      hover: {
        size: 5,
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(1)} ms`,
      },
    },
  };

  // Packet Loss Chart Options
  const packetLossOptions = {
    ...bandwidthOptions,
    chart: {
      ...bandwidthOptions.chart,
      id: "packet-loss-chart",
      type: "bar" as const,
    },
    colors: ["#ec4899"],
    fill: {
      opacity: 0.8,
      type: "solid",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
  };

  // Chart Series Data
  const bandwidthSeries = [
    {
      name: "Download",
      data: networkData.timestamps.map((timestamp, index) => [
        timestamp,
        networkData.bandwidth.download[index],
      ]),
    },
    {
      name: "Upload",
      data: networkData.timestamps.map((timestamp, index) => [
        timestamp,
        networkData.bandwidth.upload[index],
      ]),
    },
  ];

  const latencySeries = [
    {
      name: "Latency",
      data: networkData.timestamps.map((timestamp, index) => [
        timestamp,
        networkData.latency[index],
      ]),
    },
  ];

  const packetLossSeries = [
    {
      name: "Packet Loss",
      data: networkData.timestamps.map((timestamp, index) => [
        timestamp,
        networkData.packetLoss[index],
      ]),
    },
  ];

  // Calculate current metrics (average of last 3 data points)
  const currentMetrics = {
    download:
      networkData.bandwidth.download.slice(-3).reduce((a, b) => a + b, 0) / 3,
    upload:
      networkData.bandwidth.upload.slice(-3).reduce((a, b) => a + b, 0) / 3,
    latency: networkData.latency.slice(-3).reduce((a, b) => a + b, 0) / 3,
    packetLoss: networkData.packetLoss.slice(-3).reduce((a, b) => a + b, 0) / 3,
  };

  return (
    <div className="bg-[#171C2C] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#252A3D] flex justify-between items-center">
        <h2 className="text-white text-lg font-medium">Network Services</h2>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-[#252a3d] bg-[#1a1f32] text-white hover:bg-[#252a3d] flex items-center gap-2"
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Chart Tabs */}
      <div className="px-4 border-b border-[#252A3D]">
        <div className="flex space-x-4">
          <button
            className={cn(
              "py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "bandwidth"
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-400 hover:text-white",
            )}
            onClick={() => setActiveTab("bandwidth")}
          >
            <div className="flex items-center gap-2">
              <Wifi size={16} />
              Bandwidth
            </div>
          </button>
          <button
            className={cn(
              "py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "latency"
                ? "border-purple-500 text-purple-500"
                : "border-transparent text-gray-400 hover:text-white",
            )}
            onClick={() => setActiveTab("latency")}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Latency
            </div>
          </button>
          <button
            className={cn(
              "py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "packetLoss"
                ? "border-pink-500 text-pink-500"
                : "border-transparent text-gray-400 hover:text-white",
            )}
            onClick={() => setActiveTab("packetLoss")}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              Packet Loss
            </div>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="px-6 pt-6 pb-4">
        <div className="h-[300px] w-full">
          {chartMounted && activeTab === "bandwidth" && (
            <Chart
              options={bandwidthOptions}
              series={bandwidthSeries}
              type="area"
              height="100%"
              width="100%"
            />
          )}
          {chartMounted && activeTab === "latency" && (
            <Chart
              options={latencyOptions}
              series={latencySeries}
              type="line"
              height="100%"
              width="100%"
            />
          )}
          {chartMounted && activeTab === "packetLoss" && (
            <Chart
              options={packetLossOptions}
              series={packetLossSeries}
              type="bar"
              height="100%"
              width="100%"
            />
          )}
        </div>
      </div>

      {/* Chart Footer */}
      <div className="px-6 py-4 border-t border-[#252A3D] text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <span>Showing data for the last 24 hours</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
