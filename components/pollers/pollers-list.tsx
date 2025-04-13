"use client"

import { useState } from "react"
import { PollerCard } from "./poller-card"

// Data for poller-01
const poller01 = {
  id: "poller-01",
  name: "Poller-01",
  status: "healthy",
  responseTime: "7.2ms",
  servicesHealthy: 8,
  servicesDegraded: 0,
  servicesCritical: 0,
  lastUpdated: "12/04/2025, 11:22:06",
  tags: ["healthy", "network services"],
  serviceGroups: [
    {
      name: "Applications",
      healthy: 3,
      total: 3,
      services: ["dusk", "rperf-checker", "rusk"],
    },
    {
      name: "Monitoring",
      healthy: 2,
      total: 2,
      services: ["serviceradar-agent", "snmp"],
    },
    {
      name: "Network",
      healthy: 2,
      total: 2,
      services: ["network_sweep", "ping"],
    },
    {
      name: "Other",
      healthy: 1,
      total: 1,
      services: ["SSH"],
    },
  ],
  services: [
    { name: "dusk", status: "healthy", type: "grpc" },
    { name: "network_sweep", status: "healthy", type: "sweep" },
    { name: "ping", status: "healthy", type: "icmp" },
    { name: "rperf-checker", status: "healthy", type: "grpc" },
    { name: "rusk", status: "healthy", type: "process" },
    { name: "serviceradar-agent", status: "healthy", type: "process" },
    { name: "snmp", status: "healthy", type: "snmp" },
    { name: "SSH", status: "healthy", type: "port" },
  ],
}

// First, let's modify the data generation functions to create more detailed and randomized poller data

// Replace the existing generateRandomPollerData function with this enhanced version:
const generateRandomPollerData = (name: string) => {
  // Randomly select status with weighted probabilities
  const statusRoll = Math.random()
  let randomStatus
  if (statusRoll < 0.6) {
    // 60% chance of healthy
    randomStatus = "healthy"
  } else if (statusRoll < 0.85) {
    // 25% chance of warning
    randomStatus = "warning"
  } else {
    // 15% chance of critical
    randomStatus = "critical"
  }

  // Generate random response time between 5-15ms with decimal precision
  const responseTime = (5 + Math.random() * 10).toFixed(1)

  // Generate random last updated time within the last 24 hours
  const now = new Date()
  const hoursAgo = Math.floor(Math.random() * 24)
  const minutesAgo = Math.floor(Math.random() * 60)
  const secondsAgo = Math.floor(Math.random() * 60)
  const lastUpdated = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000 - secondsAgo * 1000)
  const formattedDate = lastUpdated.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  const formattedTime = lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // Generate service counts based on status
  let servicesHealthy = 0
  let servicesDegraded = 0
  let servicesCritical = 0

  // Randomize total services between 5-15
  const totalServices = Math.floor(Math.random() * 11) + 5

  if (randomStatus === "healthy") {
    // For healthy status, most services are healthy with possibly a few degraded
    servicesHealthy = Math.floor(totalServices * (0.85 + Math.random() * 0.15))
    servicesDegraded = totalServices - servicesHealthy
  } else if (randomStatus === "warning") {
    // For warning status, mix of healthy and degraded with possibly a few critical
    servicesHealthy = Math.floor(totalServices * (0.4 + Math.random() * 0.3))
    servicesDegraded = Math.floor((totalServices - servicesHealthy) * (0.7 + Math.random() * 0.3))
    servicesCritical = totalServices - servicesHealthy - servicesDegraded
  } else {
    // For critical status, mix with emphasis on critical
    servicesHealthy = Math.floor(totalServices * (0.1 + Math.random() * 0.2))
    servicesDegraded = Math.floor((totalServices - servicesHealthy) * (0.3 + Math.random() * 0.3))
    servicesCritical = totalServices - servicesHealthy - servicesDegraded
  }

  // Generate tags based on status and random categories
  const tags = [randomStatus]
  const tagOptions = [
    "virtualization",
    "network services",
    "database",
    "storage",
    "monitoring",
    "security",
    "edge computing",
    "cloud",
    "kubernetes",
    "high availability",
    "backup",
  ]

  // Add 1-3 random tags
  const numTags = Math.floor(Math.random() * 3) + 1
  const shuffledTags = [...tagOptions].sort(() => 0.5 - Math.random())
  for (let i = 0; i < numTags && i < shuffledTags.length; i++) {
    tags.push(shuffledTags[i])
  }

  // Generate random service types with more variety
  const serviceTypes = [
    "grpc",
    "sweep",
    "icmp",
    "process",
    "snmp",
    "port",
    "http",
    "database",
    "dns",
    "smtp",
    "ftp",
    "ssh",
    "api",
    "cache",
    "queue",
  ]

  // Generate service groups with more variety
  const generateServiceGroups = () => {
    const groupNames = [
      "Applications",
      "Monitoring",
      "Network",
      "Storage",
      "Database",
      "Security",
      "Web Services",
      "Authentication",
      "Messaging",
      "Caching",
      "API Gateway",
      "Backup",
      "Logging",
    ]
    const selectedGroups = []

    // Select 2-5 random groups
    const numGroups = Math.floor(Math.random() * 4) + 2
    const shuffledGroups = [...groupNames].sort(() => 0.5 - Math.random())

    for (let i = 0; i < numGroups; i++) {
      if (i < shuffledGroups.length) {
        const groupName = shuffledGroups[i]
        const servicesInGroup = Math.floor(Math.random() * 3) + 1 // 1-3 services per group

        // Calculate healthy services based on overall poller status
        let healthy
        if (randomStatus === "healthy") {
          healthy = Math.floor(servicesInGroup * (0.8 + Math.random() * 0.2))
        } else if (randomStatus === "warning") {
          healthy = Math.floor(servicesInGroup * (0.4 + Math.random() * 0.4))
        } else {
          healthy = Math.floor(servicesInGroup * (0.0 + Math.random() * 0.3))
        }

        // Generate service names that reflect the group
        const groupServices = []
        for (let j = 0; j < servicesInGroup; j++) {
          const prefix = groupName.substring(0, 3).toLowerCase()
          const suffix = Math.floor(Math.random() * 100)
          const serviceName = `${prefix}_${suffix}`
          groupServices.push(serviceName)
        }

        selectedGroups.push({
          name: groupName,
          healthy: healthy,
          total: servicesInGroup,
          services: groupServices,
        })
      }
    }

    return selectedGroups
  }

  // Generate services with more realistic names and varied statuses
  const generateServices = (count: number) => {
    const services = []
    const serviceNamePrefixes = [
      "app",
      "db",
      "api",
      "auth",
      "cache",
      "queue",
      "log",
      "monitor",
      "backup",
      "storage",
      "web",
      "proxy",
      "dns",
      "mail",
      "search",
    ]

    for (let i = 0; i < count; i++) {
      const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
      const namePrefix = serviceNamePrefixes[Math.floor(Math.random() * serviceNamePrefixes.length)]
      const serviceName = `${namePrefix}_${serviceType}_${Math.floor(Math.random() * 100)}`

      // Determine service status based on poller status and position in the list
      let serviceStatus
      if (i < servicesHealthy) {
        serviceStatus = "healthy"
      } else if (i < servicesHealthy + servicesDegraded) {
        serviceStatus = "degraded"
      } else {
        serviceStatus = "critical"
      }

      services.push({
        name: serviceName,
        status: serviceStatus,
        type: serviceType,
      })
    }

    // Shuffle the services to avoid predictable patterns
    return services.sort(() => 0.5 - Math.random())
  }

  const serviceGroups = generateServiceGroups()
  const services = generateServices(totalServices)

  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    status: randomStatus,
    responseTime: `${responseTime}ms`,
    servicesHealthy,
    servicesDegraded,
    servicesCritical,
    lastUpdated: `${formattedDate}, ${formattedTime}`,
    tags,
    serviceGroups,
    services,
  }
}

// Now update the poller data generation
// Replace the existing proxmox variable declarations with:
const proxmox1 = generateRandomPollerData("Proxmox-1")
const proxmox3 = generateRandomPollerData("Proxmox-3")
const proxmox4 = generateRandomPollerData("Proxmox-4")

// First, let's add more randomized poller data instances
// Add these lines after the existing proxmox declarations:

const proxmox2 = generateRandomPollerData("Proxmox-2")
const datacenter1 = generateRandomPollerData("Datacenter-1")
const datacenter2 = generateRandomPollerData("Datacenter-2")
const edgeNode1 = generateRandomPollerData("EdgeNode-1")

// Update the PollersList component to ensure the "View Detailed Dashboard" button works for all pollers
// Replace the existing PollersList function with:
export function PollersList() {
  const [expandedPoller, setExpandedPoller] = useState<string | null>(null)

  const toggleExpand = (pollerId: string) => {
    if (expandedPoller === pollerId) {
      setExpandedPoller(null)
    } else {
      setExpandedPoller(pollerId)
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* First Column */}
        <div className="flex flex-col gap-6 w-full">
          <PollerCard
            poller={poller01}
            isExpanded={expandedPoller === poller01.id}
            onToggle={() => toggleExpand(poller01.id)}
          />
          <PollerCard
            poller={proxmox1}
            isExpanded={expandedPoller === proxmox1.id}
            onToggle={() => toggleExpand(proxmox1.id)}
          />
          <PollerCard
            poller={proxmox2}
            isExpanded={expandedPoller === proxmox2.id}
            onToggle={() => toggleExpand(proxmox2.id)}
          />
          <PollerCard
            poller={datacenter1}
            isExpanded={expandedPoller === datacenter1.id}
            onToggle={() => toggleExpand(datacenter1.id)}
          />
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-6 w-full">
          <PollerCard
            poller={proxmox3}
            isExpanded={expandedPoller === proxmox3.id}
            onToggle={() => toggleExpand(proxmox3.id)}
          />
          <PollerCard
            poller={proxmox4}
            isExpanded={expandedPoller === proxmox4.id}
            onToggle={() => toggleExpand(proxmox4.id)}
          />
          <PollerCard
            poller={datacenter2}
            isExpanded={expandedPoller === datacenter2.id}
            onToggle={() => toggleExpand(datacenter2.id)}
          />
          <PollerCard
            poller={edgeNode1}
            isExpanded={expandedPoller === edgeNode1.id}
            onToggle={() => toggleExpand(edgeNode1.id)}
          />
        </div>
      </div>
    </div>
  )
}
