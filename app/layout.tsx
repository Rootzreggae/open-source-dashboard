import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { SidebarEffect } from "@/components/sidebar-effect";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex min-h-screen bg-[#111827] overflow-hidden">
                <div className="hidden md:block fixed left-0 top-0 h-full z-40">
                  <DashboardSidebar />
                </div>
                <div
                  id="main-content"
                  className="flex-1 relative box-border overflow-x-hidden"
                  style={{
                    marginLeft: "5rem", // Default margin, will be updated by SidebarEffect
                    width: "calc(100% - 5rem)", // Default width, will be updated by SidebarEffect
                    minHeight: "100vh",
                    transition:
                      "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
                  }}
                >
                  {children}
                </div>
              </div>
              <SidebarEffect />
            </SidebarProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
