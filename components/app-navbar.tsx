"use client"

import { Button } from "@/components/ui/button"

interface AppNavBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppNavBar({ activeTab, onTabChange }: AppNavBarProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-14 pt-8 pb-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-900">Approvals</h1>
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
              Needs my review opt. 1
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
              Needs my review opt. 2
            </span>
          </button>
          <div className="px-4 pb-1">
            <span className="text-sm text-gray-600">My requests</span>
          </div>
          <div className="px-4 pb-1">
            <span className="text-sm text-gray-600">Reviewed</span>
          </div>
          <div className="px-4 pb-1">
            <span className="text-sm text-gray-600">All requests</span>
          </div>
          <div className="px-4 pb-1">
            <span className="text-sm text-gray-600">Policies</span>
          </div>
        </div>
      </div>
    </div>
  )
}
