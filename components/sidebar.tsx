"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, CheckSquare } from "lucide-react"

interface SidebarProps {
  activePage: "approvals" | "tasks"
  onPageChange: (page: "approvals" | "tasks") => void
}

export function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      <div className="mb-2">
        <Button 
          variant={activePage === "approvals" ? "default" : "ghost"}
          size="icon"
          className={`h-10 w-10 ${activePage === "approvals" ? 'bg-primary text-white' : ''}`}
          onClick={() => onPageChange("approvals")}
        >
          <CheckCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="mb-2">
        <Button 
          variant={activePage === "tasks" ? "default" : "ghost"}
          size="icon"
          className={`h-10 w-10 ${activePage === "tasks" ? 'bg-primary text-white' : ''}`}
          onClick={() => onPageChange("tasks")}
        >
          <CheckSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

