import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check, X, MessageCircle, Plane, Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface ApprovalsListProps {
  selectedItem: number | null
  onSelectItem: (id: number | null) => void
  selectedItems: Set<number>
  onToggleItem: (id: number) => void
  onSelectAll: (filteredIds: number[]) => void
  onClearSelection: () => void
  onFilterChange: (filteredIds: number[]) => void
}

export function ApprovalsList({ 
  selectedItem, 
  onSelectItem, 
  selectedItems, 
  onToggleItem, 
  onSelectAll, 
  onClearSelection,
  onFilterChange
}: ApprovalsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const approvals = [
    {
      id: 1,
      requestor: "Kristine Young",
      subject: "Request to update Stephanie Perkins' target annual bonus",
      category: "HR Management",
      time: "3 min ago",
      status: "pending",
      warning: "Exceeds the approved band",
      comments: [
        { id: 1, author: "John Smith", text: "This seems reasonable given the performance metrics.", timestamp: "2 hours ago" },
        { id: 2, author: "Sarah Wilson", text: "Need to verify the budget allocation first.", timestamp: "1 hour ago" }
      ]
    },
    {
      id: 2,
      requestor: "Thomas Bennett",
      subject: "Request to reimburse $72.41 for Uber",
      category: "Reimbursements",
      time: "5 min ago",
      status: "pending",
             warning: "Potential duplicate detected",
             comments: [
               { id: 1, author: "Mike Johnson", text: "I've seen similar Uber charges this month.", timestamp: "30 min ago" }
             ],
             trip: {
               name: "Conference in Phoenix",
               linked: true
             }
    },
    {
      id: 3,
      requestor: "Madeline Hernandez",
      subject: "Request to reimburse $595.49 for Hilton Hotel",
      category: "Reimbursements",
      time: "10 min ago",
      status: "pending"
    },
    {
      id: 4,
      requestor: "Sarah Johnson",
      subject: "Request to log 13h 57m from Oct 26 - 27",
      category: "Time and Attendance",
      time: "15 min ago",
      status: "pending",
             warning: "Exceeds 12 hours",
             comments: []
    },
    {
      id: 5,
      requestor: "Michael Chen",
      subject: "Request to update Jennifer Lee's salary",
      category: "HR Management",
      time: "20 min ago",
      status: "pending"
    },
    {
      id: 6,
      requestor: "Emily Rodriguez",
      subject: "Request to reimburse $45.20 for parking",
      category: "Reimbursements",
      time: "25 min ago",
      status: "pending"
    },
    {
      id: 7,
      requestor: "David Park",
      subject: "Request to log 8h 30m from Oct 25",
      category: "Time and Attendance",
      time: "30 min ago",
      status: "pending"
    },
    {
      id: 8,
      requestor: "Lisa Thompson",
      subject: "Request to update Robert Wilson's benefits",
      category: "HR Management",
      time: "35 min ago",
      status: "pending",
      warning: "Exceeds the approved band"
    }
  ]

  const categories = ["All", "HR Management", "Reimbursements", "Time and Attendance"]
  
  const filteredApprovals = approvals.filter(approval => {
    // Category filter
    const categoryMatch = selectedCategory === "All" || approval.category === selectedCategory
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      approval.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  // Notify parent of filtered IDs for smart selection handling
  useEffect(() => {
    onFilterChange(filteredApprovals.map(approval => approval.id))
  }, [filteredApprovals, onFilterChange])

  const isAllSelected = filteredApprovals.length > 0 && filteredApprovals.every(approval => selectedItems?.has(approval.id) || false)
  const isSomeSelected = filteredApprovals.some(approval => selectedItems?.has(approval.id) || false)

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      onClearSelection()
    } else {
      onSelectAll(filteredApprovals.map(approval => approval.id))
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-auto p-0 text-xl font-semibold text-gray-900 hover:bg-transparent"
            >
              {selectedCategory}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[200px]">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="select-all"
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                (el as HTMLInputElement).indeterminate = isSomeSelected && !isAllSelected
              }
            }}
            onChange={handleSelectAllClick}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="select-all" className="text-sm text-gray-600">
            {filteredApprovals.length} items
          </label>
        </div>
        
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input 
                 placeholder="Search approvals..." 
                 className="w-full pl-10 pr-10" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                 <Button
                   variant="ghost"
                   size="icon"
                   className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
                   onClick={() => setSearchQuery("")}
                 >
                   <X className="h-3 w-3 text-gray-400" />
                 </Button>
               )}
             </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-0 pb-4">
          {filteredApprovals.map((approval) => (
            <div
              key={approval.id}
              onClick={() => onSelectItem(approval.id)}
              onMouseEnter={() => setHoveredItem(approval.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer relative ${
                selectedItem === approval.id ? 'bg-[#E7E1DE]' : 'bg-[#FAF9F7]'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox 
                  className="mt-1" 
                  checked={selectedItems?.has(approval.id) || false}
                  onCheckedChange={() => onToggleItem(approval.id)}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{approval.requestor}</h3>
                  <p className="text-sm text-gray-600 mt-1">{approval.subject}</p>
                  {approval.warning && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {approval.warning}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{approval.category}</span>
                    <span className="text-xs text-gray-500">{approval.time}</span>
                  </div>
                </div>
              </div>
              
                     {hoveredItem === approval.id && (
                       <div className="absolute top-2 right-2 flex gap-1">
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6 hover:bg-green-100"
                           onClick={(e) => {
                             e.stopPropagation()
                             // Handle approve action
                           }}
                         >
                           <Check className="h-3 w-3 text-green-600" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6 hover:bg-red-100"
                           onClick={(e) => {
                             e.stopPropagation()
                             // Handle reject action
                           }}
                         >
                           <X className="h-3 w-3 text-red-600" />
                         </Button>
                       </div>
                     )}
                     
                     {approval.comments && approval.comments.length > 0 && (
                       <div className={`absolute top-4 right-4 ${hoveredItem === approval.id ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                         <MessageCircle className="h-4 w-4 text-gray-400" />
                       </div>
                     )}
                     
                     {approval.trip && approval.trip.linked && (
                       <div className={`absolute top-4 right-8 ${hoveredItem === approval.id ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                         <Plane className="h-4 w-4 text-gray-400" />
                       </div>
                     )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

