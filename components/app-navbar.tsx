"use client"

import { Button } from "@/components/ui/button"

interface AppNavBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  page?: "approvals" | "tasks"
}

export function AppNavBar({ activeTab, onTabChange, page = "approvals" }: AppNavBarProps) {
  const title = page === "tasks" ? "Inbox" : "Approvals"
  const tab1Label = page === "tasks" ? "Pending opt. 1" : "Needs my review opt. 1"
  const tab2Label = page === "tasks" ? "Pending opt. 2" : "Needs my review opt. 2"
  const tab3Label = page === "tasks" ? "Pending opt. 3" : "Needs my review opt. 3"

  return (
    <div className="bg-card border-b border-border">
      <div className="px-16 pt-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="rippling-text-2xl text-foreground">{title}</h1>
            <Button variant="outline" size="sm" className="rippling-btn-outline h-7 px-3 text-xs font-medium">
              Help docs
            </Button>
          </div>
        </div>
        
        <div className="flex border-b border-border">
          <button
            onClick={() => onTabChange("opt1")}
            className={`px-6 pb-3 border-b-2 transition-all duration-200 ${
              activeTab === "opt1"
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <span className={`rippling-text-sm transition-colors ${
              activeTab === "opt1"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}>
              {tab1Label}
            </span>
          </button>
          <button
            onClick={() => onTabChange("opt2")}
            className={`px-6 pb-3 border-b-2 transition-all duration-200 ${
              activeTab === "opt2"
                ? "border-primary"
                : "border-transparent hover:border-muted-foreground/30"
            }`}
          >
            <span className={`rippling-text-sm transition-colors ${
              activeTab === "opt2"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}>
              {tab2Label}
            </span>
          </button>
          <button
            onClick={() => onTabChange("opt3")}
            className={`px-4 pb-1 border-b-2 transition-colors ${
              activeTab === "opt3"
                ? "border-[#512f3e]"
                : "border-transparent"
            }`}
          >
            <span className={`text-sm ${
              activeTab === "opt3"
                ? "font-medium text-[#512f3e]"
                : "text-gray-600"
            }`}>
              {tab3Label}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
