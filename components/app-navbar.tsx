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

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-14 pt-8 pb-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
              Help docs
            </Button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => onTabChange("opt1")}
            className={`px-4 pb-1 border-b-2 transition-colors ${
              activeTab === "opt1"
                ? "border-[#512f3e]"
                : "border-transparent"
            }`}
          >
            <span className={`text-sm ${
              activeTab === "opt1"
                ? "font-medium text-[#512f3e]"
                : "text-gray-600"
            }`}>
              {tab1Label}
            </span>
          </button>
          <button
            onClick={() => onTabChange("opt2")}
            className={`px-4 pb-1 border-b-2 transition-colors ${
              activeTab === "opt2"
                ? "border-[#512f3e]"
                : "border-transparent"
            }`}
          >
            <span className={`text-sm ${
              activeTab === "opt2"
                ? "font-medium text-[#512f3e]"
                : "text-gray-600"
            }`}>
              {tab2Label}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
