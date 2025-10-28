import { Button } from "@/components/ui/button"

export function AppNavBar() {
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
          <div className="border-b-2 border-[#512f3e] pb-1 px-4">
            <span className="text-sm font-medium text-[#512f3e]">Needs my review</span>
          </div>
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
