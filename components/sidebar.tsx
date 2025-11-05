"use client"

import { Button } from "@/components/ui/button"
import { Stamp, CheckSquare } from "lucide-react"

interface SidebarProps {
  activePage: "approvals" | "tasks"
  onPageChange: (page: "approvals" | "tasks") => void
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-16 rippling-sidebar flex flex-col items-center py-6 space-y-4">
      <div className="w-full flex justify-center">
        <Button 
          variant="ghost"
          size="icon"
          className={`h-12 w-12 rounded-xl transition-all duration-200 ${
            activePage === "tasks" 
              ? 'bg-[rgb(231,225,222)]' 
              : 'rippling-btn-ghost hover:bg-muted'
          }`}
          onClick={() => onPageChange("tasks")}
        >
          <CheckSquare className={`h-6 w-6 ${activePage === "tasks" ? "text-black" : ""}`} />
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <Button 
          variant="ghost"
          size="icon"
          className={`h-12 w-12 rounded-xl transition-all duration-200 ${
            activePage === "approvals" 
              ? 'bg-[rgb(231,225,222)]' 
              : 'rippling-btn-ghost hover:bg-muted'
          }`}
          onClick={() => onPageChange("approvals")}
        >
          <Stamp className={`h-6 w-6 ${activePage === "approvals" ? "text-black" : ""}`} />
        </Button>
      </div>
    </div>
  )
}

