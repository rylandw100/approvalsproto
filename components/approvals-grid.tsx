"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X, MessageCircle, Plane, AlertTriangle, ChevronRight, Info, Search, ChevronDown, Filter } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface ApprovalsGridProps {
  selectedItems: Set<number>
  onToggleItem: (id: number) => void
  onSelectAll: (filteredIds: number[]) => void
  onClearSelection: () => void
  onOpenDrawer: (id: number) => void
}

export function ApprovalsGrid({
  selectedItems,
  onToggleItem,
  onSelectAll,
  onClearSelection,
  onOpenDrawer
}: ApprovalsGridProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [tooltipData, setTooltipData] = useState<{id: number | null, type: string | null, x: number, y: number}>({id: null, type: null, x: 0, y: 0})
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedRequestType, setSelectedRequestType] = useState<string>("All")
  const [isRequestTypeDropdownOpen, setIsRequestTypeDropdownOpen] = useState(false)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const requestTypeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (requestTypeDropdownRef.current && !requestTypeDropdownRef.current.contains(event.target as Node)) {
        setIsRequestTypeDropdownOpen(false)
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
      requestedOn: "Oct 28, 2024",
      status: "pending",
      warning: "Exceeds the approved band",
      employee: {
        name: "Stephanie Perkins",
        role: "Account Executive",
        status: "Full Time",
        location: "United States"
      },
      fieldName: "Target annual bonus",
      changes: {
        current: "$100,000",
        new: "$110,000",
        amount: "+$10,000"
      },
      comments: [
        { id: 2, author: "Sarah Wilson", text: "Need to verify the budget allocation first.", timestamp: "1 hour ago" },
        { id: 1, author: "John Smith", text: "This seems reasonable given the performance metrics.", timestamp: "2 hours ago" }
      ]
    },
    {
      id: 2,
      requestor: "Thomas Bennett",
      subject: "Request to reimburse $72.41 for Uber",
      category: "Reimbursements",
      time: "5 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      warning: "Potential duplicate detected",
      vendor: { name: "Uber" },
      entity: "Acme Corp",
      purchaseDate: "Oct 25, 2024",
      changes: { current: "$0", new: "$72.41", amount: "$72.41" },
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
      requestedOn: "Oct 28, 2024",
      status: "pending",
      vendor: { name: "Hilton Hotel" },
      entity: "Acme Corp",
      purchaseDate: "Oct 20, 2024",
      changes: { current: "$0", new: "$595.49", amount: "$595.49" }
    },
    {
      id: 4,
      requestor: "Sarah Johnson",
      subject: "Request to log 13h 57m from Oct 26 - 27",
      category: "Time and Attendance",
      time: "15 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      warning: "Exceeds 12 hours",
      startTime: "9:00 AM",
      endTime: "10:57 PM",
      officeLocation: "Seattle Office",
      numberOfBreaks: "2",
      changes: { current: "0h 0m", new: "13h 57m", amount: "13h 57m" },
      comments: []
    },
    {
      id: 5,
      requestor: "Michael Chen",
      subject: "Request to update Jennifer Lee's salary",
      category: "HR Management",
      time: "20 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      employee: {
        name: "Jennifer Lee",
        role: "Product Manager",
        status: "Full Time",
        location: "San Francisco, USA"
      },
      fieldName: "Salary",
      changes: { current: "$85,000", new: "$92,000", amount: "+$7,000" }
    },
    {
      id: 6,
      requestor: "Emily Rodriguez",
      subject: "Request to reimburse $45.20 for parking",
      category: "Reimbursements",
      time: "25 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      vendor: { name: "Downtown Parking" },
      entity: "Acme Corp",
      purchaseDate: "Oct 28, 2024",
      changes: { current: "$0", new: "$45.20", amount: "$45.20" },
      comments: [
        { id: 1, author: "Lisa Chen", text: "Client meeting was productive, expense justified.", timestamp: "15 min ago" }
      ]
    },
    {
      id: 7,
      requestor: "David Park",
      subject: "Request to log 8h 30m from Oct 25",
      category: "Time and Attendance",
      time: "30 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      startTime: "9:00 AM",
      endTime: "5:30 PM",
      officeLocation: "Austin Office",
      numberOfBreaks: "1",
      changes: { current: "0h 0m", new: "8h 30m", amount: "8h 30m" }
    },
    {
      id: 8,
      requestor: "Lisa Thompson",
      subject: "Request to update Robert Wilson's benefits",
      category: "HR Management",
      time: "35 min ago",
      requestedOn: "Oct 28, 2024",
      status: "pending",
      warning: "Exceeds the approved band",
      employee: {
        name: "Robert Wilson",
        role: "Senior Developer",
        status: "Full Time",
        location: "Denver, USA"
      },
      fieldName: "Health insurance benefits",
      changes: { current: "Standard", new: "Premium", amount: "+$200/month" }
    }
  ]

  const requestTypes = ["All", "HR Management", "Reimbursements", "Time and Attendance"]

  const filteredApprovals = approvals.filter(approval => {
    const searchMatch = searchQuery === "" || 
      approval.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.category.toLowerCase().includes(searchQuery.toLowerCase())
    const typeMatch = selectedRequestType === "All" || approval.category === selectedRequestType
    return searchMatch && typeMatch
  })

  const isAllSelected = filteredApprovals.length > 0 && filteredApprovals.every(approval => selectedItems.has(approval.id))
  const isSomeSelected = filteredApprovals.some(approval => selectedItems.has(approval.id))
  const hasSelectedItems = selectedItems.size > 0

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      onClearSelection()
    } else {
      onSelectAll(filteredApprovals.map(approval => approval.id))
    }
  }

  const handleIconMouseEnter = (e: React.MouseEvent<HTMLDivElement>, approvalId: number, type: string) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    const target = e.currentTarget
    if (!target) return
    
    tooltipTimeoutRef.current = setTimeout(() => {
      // Check if element still exists and is in the DOM
      if (!target || !document.body.contains(target)) {
        return
      }
      try {
        const rect = target.getBoundingClientRect()
        setTooltipData({
          id: approvalId,
          type: type,
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        })
      } catch (error) {
        // Element was removed, silently fail
        return
      }
    }, 100) // Show tooltip after 100ms
  }

  const handleIconMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
    setTooltipData({ id: null, type: null, x: 0, y: 0 })
  }

  const getDetailsTooltipContent = (approval: any) => {
    if (approval.category === "HR Management" && approval.changes) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">{approval.fieldName}</div>
          <div className="text-xs"><span className="font-medium">Current:</span> {approval.changes.current}</div>
          <div className="text-xs"><span className="font-medium">New:</span> {approval.changes.new}</div>
          {approval.changes.amount && (
            <div className="text-xs"><span className="font-medium">Change:</span> {approval.changes.amount}</div>
          )}
        </div>
      )
    } else if (approval.category === "Reimbursements" && approval.changes) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">Expense Details</div>
          <div className="text-xs"><span className="font-medium">Amount:</span> {approval.changes.new}</div>
          {approval.vendor && <div className="text-xs"><span className="font-medium">Vendor:</span> {approval.vendor.name}</div>}
          {approval.purchaseDate && <div className="text-xs"><span className="font-medium">Date:</span> {approval.purchaseDate}</div>}
          {approval.entity && <div className="text-xs"><span className="font-medium">Entity:</span> {approval.entity}</div>}
        </div>
      )
    } else if (approval.category === "Time and Attendance" && approval.changes) {
      return (
        <div className="space-y-1">
          <div className="font-semibold">Time Details</div>
          <div className="text-xs"><span className="font-medium">Duration:</span> {approval.changes.new}</div>
          {approval.startTime && <div className="text-xs"><span className="font-medium">Start:</span> {approval.startTime}</div>}
          {approval.endTime && <div className="text-xs"><span className="font-medium">End:</span> {approval.endTime}</div>}
          {approval.officeLocation && <div className="text-xs"><span className="font-medium">Location:</span> {approval.officeLocation}</div>}
        </div>
      )
    }
    return null
  }

  const getCommentsTooltipContent = (approval: any) => {
    if (!approval.comments || approval.comments.length === 0) return null
    
    const sortedComments = [...approval.comments].sort((a, b) => {
      const timeA = parseInt(a.timestamp)
      const timeB = parseInt(b.timestamp)
      return timeB - timeA
    })
    const mostRecent = sortedComments[0]
    const hasMore = approval.comments.length > 1

    return (
      <div className="space-y-2 max-w-xs">
        <div className="font-semibold text-sm">Most recent comment</div>
        <div className="text-xs">
          <div className="font-medium">{mostRecent.author}</div>
          <div className="text-gray-400">{mostRecent.timestamp}</div>
          <div className="mt-1">{mostRecent.text}</div>
        </div>
        {hasMore && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDrawer(approval.id)
            }}
            className="text-xs text-[#106A63] hover:underline font-medium"
          >
            See more ({approval.comments.length - 1} more)
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-auto relative">
        <div className="p-6">
          <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden min-w-full">
            {/* Header with title, bulk selection, and search - Inside the table frame */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              {/* Top row: Title and Bulk Selection */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">All</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="select-all-grid"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) {
                          (el as HTMLInputElement).indeterminate = isSomeSelected && !isAllSelected
                        }
                      }}
                      onChange={handleSelectAllClick}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="select-all-grid" className="text-sm text-gray-600">
                      {filteredApprovals.length} items
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Bottom row: Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-[280px]">
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
                <div className="relative" ref={requestTypeDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRequestTypeDropdownOpen(!isRequestTypeDropdownOpen)}
                    className="h-8 gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="text-sm">{selectedRequestType}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  {isRequestTypeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[200px]">
                      {requestTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setSelectedRequestType(type)
                            setIsRequestTypeDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                            selectedRequestType === type ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Table Header */}
            <div className="grid grid-cols-[50px_130px_160px_160px_minmax(200px,1fr)_100px_140px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div></div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Requested on</div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Requested by</div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Request type</div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Details</div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Attributes</div>
              <div className="text-xs font-semibold text-gray-700 uppercase">Actions</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-gray-200">
              {filteredApprovals.map((approval) => {
                const hasWarning = !!approval.warning
                const hasComments = approval.comments && approval.comments.length > 0
                const hasTrip = approval.trip && approval.trip.linked
                const detailsContent = getDetailsTooltipContent(approval)
                const commentsContent = getCommentsTooltipContent(approval)
                
                return (
                  <div
                    key={approval.id}
                    onMouseEnter={() => setHoveredItem(approval.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="grid grid-cols-[50px_130px_160px_160px_minmax(200px,1fr)_100px_140px] gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Bulk Selection */}
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedItems.has(approval.id)}
                        onCheckedChange={() => onToggleItem(approval.id)}
                      />
                    </div>

                    {/* Requested on */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{approval.requestedOn}</span>
                    </div>

                    {/* Requested by */}
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{approval.requestor}</span>
                    </div>

                    {/* Request type */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{approval.category}</span>
                    </div>

                    {/* Details */}
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 line-clamp-1">{approval.subject}</span>
                    </div>

                    {/* Attributes - Always show all icons */}
                    <div className="flex items-center gap-2 relative">
                      <div
                        className="cursor-pointer relative"
                        onMouseEnter={(e) => hasWarning && handleIconMouseEnter(e, approval.id, 'warning')}
                        onMouseLeave={handleIconMouseLeave}
                      >
                        <AlertTriangle 
                          className="h-4 w-4" 
                          style={{ color: hasWarning ? '#106A63' : '#F2F2F2' }}
                        />
                      </div>
                      <div
                        className="cursor-pointer relative"
                        onMouseEnter={(e) => detailsContent && handleIconMouseEnter(e, approval.id, 'details')}
                        onMouseLeave={handleIconMouseLeave}
                      >
                        <Info 
                          className="h-4 w-4" 
                          style={{ color: detailsContent ? '#106A63' : '#F2F2F2' }}
                        />
                      </div>
                      <div
                        className="cursor-pointer relative"
                        onMouseEnter={(e) => hasComments && handleIconMouseEnter(e, approval.id, 'comments')}
                        onMouseLeave={handleIconMouseLeave}
                      >
                        <MessageCircle 
                          className="h-4 w-4" 
                          style={{ color: hasComments ? '#106A63' : '#F2F2F2' }}
                        />
                      </div>
                      <div
                        className="cursor-pointer relative"
                        onMouseEnter={(e) => hasTrip && handleIconMouseEnter(e, approval.id, 'trip')}
                        onMouseLeave={handleIconMouseLeave}
                      >
                        <Plane 
                          className="h-4 w-4" 
                          style={{ color: hasTrip ? '#106A63' : '#F2F2F2' }}
                        />
                      </div>
                    </div>

                    {/* Actions - Always visible */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-green-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle approve action
                        }}
                        title="Approve"
                      >
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle reject action
                        }}
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          onOpenDrawer(approval.id)
                        }}
                        title="View details"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Custom Tooltip */}
        {tooltipData.id !== null && tooltipData.type !== null && (
          <div
            className="fixed bg-gray-900 text-white text-xs rounded-lg shadow-lg p-3 z-50 pointer-events-none"
            style={{
              left: `${tooltipData.x}px`,
              top: `${tooltipData.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltipData.type === 'warning' && (
              <div>{approvals.find(a => a.id === tooltipData.id)?.warning}</div>
            )}
            {tooltipData.type === 'details' && (
              <div>{getDetailsTooltipContent(approvals.find(a => a.id === tooltipData.id))}</div>
            )}
            {tooltipData.type === 'comments' && (
              <div>{getCommentsTooltipContent(approvals.find(a => a.id === tooltipData.id))}</div>
            )}
            {tooltipData.type === 'trip' && (
              <div>Linked to trip: {approvals.find(a => a.id === tooltipData.id)?.trip?.name}</div>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      {hasSelectedItems && (
        <div className="fixed bottom-[75px] left-1/2 transform -translate-x-1/2 w-[350px] bg-[#512f3e] text-white p-4 rounded-lg shadow-lg flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedItems.size}</span>
              <span className="text-sm">selected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 h-8 px-3"
            >
              Approve
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 h-8 px-3"
            >
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
