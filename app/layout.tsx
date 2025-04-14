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
              <div className="flex min-h-screen bg-[#111827]">
                <div className="hidden md:block">
                  <DashboardSidebar />
                </div>
                <div id="main-content" className="flex-1">
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
