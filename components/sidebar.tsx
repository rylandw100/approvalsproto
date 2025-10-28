import { Button } from "@/components/ui/button"
import { Home, BarChart3, Users, FileText, Settings, ChevronRight } from "lucide-react"

export function Sidebar() {
  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BarChart3, label: "Analytics" },
    { icon: Users, label: "Approvals" },
    { icon: FileText, label: "Documents" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {navItems.map((item, index) => (
        <div key={index} className="mb-2">
          <Button 
            variant={item.active ? "default" : "ghost"}
            size="icon"
            className={`h-10 w-10 ${item.active ? 'bg-primary text-white' : ''}`}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  )
}

