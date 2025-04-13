"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") {
    return null
  }

  // Split the pathname into segments and remove empty strings
  const segments = pathname.split("/").filter(Boolean)

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    // Create the path for this breadcrumb item
    const href = `/${segments.slice(0, index + 1).join("/")}`

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

    // Check if this is the last segment (current page)
    const isCurrentPage = index === segments.length - 1

    return {
      href,
      label,
      isCurrentPage,
    }
  })

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center space-x-1 text-sm">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Separator after home */}
        <li className="text-gray-500">
          <ChevronRight className="h-4 w-4" />
        </li>

        {/* Dynamic breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {item.isCurrentPage ? (
              <span className="text-white font-medium">{item.label}</span>
            ) : (
              <>
                <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
                {/* Add separator if not the last item */}
                {index < breadcrumbItems.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-gray-500" />}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
