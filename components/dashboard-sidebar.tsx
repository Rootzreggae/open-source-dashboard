"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radio,
  Server,
  Bell,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-[#171C2C] transition-all duration-300 ease-in-out",
        isExpanded ? "w-[220px]" : "w-20",
      )}
    >
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00C853] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
            >
              <g clipPath="url(#clip0_410_3333)">
                <path
                  d="M25 12.9984C25 19.7167 19.4714 25.2452 12.7532 25.2452C6.03491 25.2452 0.506348 19.7167 0.506348 12.9984C0.506348 6.28015 6.03491 0.751583 12.7532 0.751583C13.0727 0.751583 13.3363 1.01518 13.3363 1.33477V10.7485C14.3627 11.0133 15.0859 11.9464 15.0859 13.0066C15.0859 14.2861 14.0327 15.3393 12.7532 15.3393C11.4737 15.3393 10.4204 14.2861 10.4204 13.0066C10.4204 11.9464 11.1436 11.0133 12.17 10.7485V6.61257C8.889 6.91582 6.34983 9.7011 6.34983 12.9949C6.34983 16.5115 9.24241 19.4041 12.759 19.4041C16.2744 19.4041 19.1682 16.5115 19.1682 12.9949C19.1682 10.3589 17.5423 7.98071 15.0859 7.02313V5.81127C18.1616 6.83184 20.2505 9.72559 20.2505 12.9669C20.2505 17.1028 16.8471 20.5063 12.7112 20.5063C8.57525 20.5063 5.1718 17.1028 5.1718 12.9669C5.1718 9.03394 8.2475 5.72846 12.17 5.4462V1.94711C6.36382 2.27952 1.76485 7.14793 1.76485 12.9634C1.76485 19.0169 6.74639 23.9984 12.7998 23.9984C18.8521 23.9984 23.8336 19.0169 23.8336 12.9634C23.8336 7.7696 20.1666 3.24527 15.0859 2.16872V1.33477C15.0824 1.22163 15.0719 1.10849 15.0521 0.99652C15.1022 0.989522 15.1524 0.989522 15.2025 0.99652C20.8769 2.16755 24.9883 7.20391 25 12.9984Z"
                  fill="#40FFB6"
                />
              </g>
              <defs>
                <clipPath id="clip0_410_3333">
                  <rect
                    width="24.4983"
                    height="24.4983"
                    fill="white"
                    transform="translate(0.5 0.750866)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          {isExpanded && (
            <span className="text-lg font-semibold text-white">
              ServiceRadar
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <NavItem
            href="/"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isActive={pathname === "/"}
            isExpanded={isExpanded}
          />
          <NavItem
            href="/pollers"
            icon={<Radio size={18} />}
            label="Pollers"
            isActive={pathname === "/pollers"}
            isExpanded={isExpanded}
          />
          <NavItem
            href="/services"
            icon={<Server size={18} />}
            label="Services"
            isActive={pathname === "/services"}
            isExpanded={isExpanded}
            disabled={true}
          />
          <NavItem
            href="/alerts"
            icon={<Bell size={18} />}
            label="Alerts"
            isActive={pathname === "/alerts"}
            isExpanded={isExpanded}
          />
          <NavItem
            href="/settings"
            icon={<Settings size={18} />}
            label="Settings"
            isActive={pathname === "/settings"}
            isExpanded={isExpanded}
          />
        </ul>
      </nav>

      <div className="border-t border-[#2E3447] p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-between text-gray-400 hover:bg-[#1A1F32] hover:text-white"
        >
          {isExpanded && <span>Collapse</span>}
          <ChevronLeft
            size={16}
            className={cn(
              "transition-transform duration-300",
              !isExpanded && "rotate-180",
            )}
          />
        </Button>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  disabled?: boolean;
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  isExpanded,
  disabled = false,
}: NavItemProps) {
  return (
    <li>
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[#1A1F32] text-white"
            : "text-gray-400 hover:bg-[#1A1F32] hover:text-white",
          disabled &&
            "opacity-60 cursor-not-allowed pointer-events-none text-gray-500 hover:bg-transparent",
        )}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        aria-disabled={disabled}
      >
        <span className={cn("mr-3", !isExpanded && "mr-0")}>{icon}</span>
        {isExpanded && (
          <>
            <span>{label}</span>
            {disabled && (
              <span className="ml-2 text-xs text-gray-500">(Disabled)</span>
            )}
          </>
        )}
      </Link>
    </li>
  );
}
