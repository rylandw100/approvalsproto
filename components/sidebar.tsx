"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, CheckSquare } from "lucide-react"

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
            activePage === "approvals" 
              ? 'rippling-btn-primary shadow-lg' 
              : 'rippling-btn-ghost hover:bg-primary-light'
          }`}
          onClick={() => onPageChange("approvals")}
        >
          <CheckCircle className="h-6 w-6" />
        </Button>
      </div>
      <div className="w-full flex justify-center">
        <Button 
          variant="ghost"
          size="icon"
          className={`h-12 w-12 rounded-xl transition-all duration-200 ${
            activePage === "tasks" 
              ? 'rippling-btn-primary shadow-lg' 
              : 'rippling-btn-ghost hover:bg-primary-light'
          }`}
          onClick={() => onPageChange("tasks")}
        >
          <CheckSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

