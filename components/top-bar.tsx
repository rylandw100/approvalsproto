import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, Settings, HelpCircle } from "lucide-react"

export function TopBar() {
  return (
    <div className="bg-card border-b border-border h-14 flex items-center justify-between px-5">
      <div className="flex items-center gap-5 w-[266px]">
        <div className="flex items-center justify-center h-14 px-2.5">
          <div className="h-10 w-10 rounded-md bg-primary relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white font-bold text-xl">A</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-6 rotate-90 bg-gray-300 opacity-20" />
          <div className="flex items-center h-8 px-2.5 py-0 rounded-md">
            <span className="rippling-text-base text-foreground font-semibold">Spend</span>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-0.5 w-6 rotate-90 bg-gray-300 opacity-20" />
        </div>
      </div>
      
      <div className="flex items-center justify-between flex-1 h-full">
        <div className="bg-muted relative w-[600px] rounded-lg px-3 py-2 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search or jump to..."
            className="rippling-input border-0 bg-transparent text-sm placeholder:text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center gap-2 pr-4">
          <Button variant="ghost" size="icon" className="rippling-btn-ghost h-10 w-10">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rippling-btn-ghost h-10 w-10">
            <Settings className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="rippling-btn-ghost h-10 w-10">
            <HelpCircle className="h-6 w-6" />
          </Button>
          
          <div className="h-0.5 w-6 rotate-90 bg-primary opacity-20" />
          
          <div className="flex items-center gap-3 px-4 py-1">
            <span className="rippling-text-sm text-foreground font-semibold">Acme, Inc.</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
              {/* Avatar placeholder */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

