import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check, X, MessageCircle, Plane, Search, AlertTriangle, Archive } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface ApprovalsListProps {
  selectedItem: number | null
  onSelectItem: (id: number | null) => void
  selectedItems: Set<number>
  onToggleItem: (id: number) => void
  onSelectAll: (filteredIds: number[]) => void
  onClearSelection: () => void
  onFilterChange: (filteredIds: number[]) => void
  page?: "approvals" | "tasks"
  hideHeader?: boolean
  externalSearchQuery?: string
  externalSelectedCategory?: string
  onSearchChange?: (query: string) => void
  onCategoryChange?: (category: string) => void
}

export function ApprovalsList({ 
  selectedItem, 
  onSelectItem, 
  selectedItems, 
  onToggleItem, 
  onSelectAll, 
  onClearSelection, 
  onFilterChange,
  page = "approvals",
  hideHeader = false,
  externalSearchQuery,
  externalSelectedCategory,
  onSearchChange,
  onCategoryChange
}: ApprovalsListProps) {
  // Helper function to get display category name
  const getDisplayCategory = (category: string) => {
    if (page === "approvals" && category.startsWith("Approvals - ")) {
      return category.replace("Approvals - ", "")
    }
    return category
  }
  const [selectedCategory, setSelectedCategory] = useState<string>(externalSelectedCategory || "All")
  const [sortBy, setSortBy] = useState<"recency" | "dueDate">("recency")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery || "")
  
  // Update internal state when external props change
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery)
    }
  }, [externalSearchQuery])

  useEffect(() => {
    if (externalSelectedCategory !== undefined) {
      setSelectedCategory(externalSelectedCategory)
    }
  }, [externalSelectedCategory])

  // Handle search change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (onSearchChange) {
      onSearchChange(query)
    }
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (onCategoryChange) {
      onCategoryChange(category)
    }
  }
  const dropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const approvalData = [
    {
      id: 1,
      requestor: "Kristine Young",
      subject: "Request to update Stephanie Perkins' target annual bonus",
      category: "Approvals - HR Management",
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
      category: "Approvals - Reimbursements",
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
      category: "Approvals - Reimbursements",
      time: "10 min ago",
      status: "pending"
    },
    {
      id: 4,
      requestor: "Sarah Johnson",
      subject: "Request to log 13h 57m from Oct 26 - 27",
      category: "Approvals - Time and Attendance",
      time: "15 min ago",
      status: "pending",
             warning: "Exceeds 12 hours",
             comments: []
    },
    {
      id: 5,
      requestor: "Michael Chen",
      subject: "Request to update Jennifer Lee's salary",
      category: "Approvals - HR Management",
      time: "20 min ago",
      status: "pending"
    },
    {
      id: 6,
      requestor: "Emily Rodriguez",
      subject: "Request to reimburse $45.20 for parking",
      category: "Approvals - Reimbursements",
      time: "25 min ago",
      status: "pending"
    },
    {
      id: 7,
      requestor: "David Park",
      subject: "Request to log 8h 30m from Oct 25",
      category: "Approvals - Time and Attendance",
      time: "30 min ago",
      status: "pending"
    },
    {
      id: 8,
      requestor: "Lisa Thompson",
      subject: "Request to update Robert Wilson's benefits",
      category: "Approvals - HR Management",
      time: "35 min ago",
      status: "pending",
      warning: "Exceeds the approved band"
    }
  ]

  const taskData = [
    {
      id: 100,
      requestor: "Payroll Team",
      subject: "Run payroll",
      category: "Payroll",
      time: "just now",
      status: "pending",
      isCritical: true,
      pinned: true
    },
    {
      id: 101,
      requestor: "HR Team",
      subject: "Take required cybersecurity course for Q4 certification",
      category: "Training",
      time: "2 hours ago",
      status: "pending",
      courseName: "Cybersecurity Fundamentals",
      dueDate: "Nov 15, 2024",
      estimatedDuration: "3 hours"
    },
    {
      id: 102,
      requestor: "Legal Department",
      subject: "Sign updated company policy document",
      category: "Documents",
      time: "5 hours ago",
      status: "pending",
      documentName: "Employee Handbook 2024",
      dueDate: "Oct 30, 2024"
    },
    {
      id: 103,
      requestor: "Onboarding Team",
      subject: "Take new hire Alex Martinez out to lunch",
      category: "Team Building",
      time: "1 day ago",
      status: "pending",
      newHireName: "Alex Martinez",
      newHireRole: "Software Engineer",
      suggestedDate: "This week",
      dueDate: "Nov 12, 2024"
    },
    {
      id: 104,
      requestor: "HR Team",
      subject: "Complete leadership development course",
      category: "Training",
      time: "2 days ago",
      status: "pending",
      courseName: "Leadership Essentials",
      dueDate: "Dec 1, 2024",
      estimatedDuration: "8 hours"
    },
    {
      id: 105,
      requestor: "Legal Department",
      subject: "Sign non-disclosure agreement for new project",
      category: "Documents",
      time: "3 days ago",
      status: "pending",
      documentName: "NDA - Project Phoenix",
      dueDate: "Nov 5, 2024"
    },
    {
      id: 106,
      requestor: "Onboarding Team",
      subject: "Take new hire Sarah Kim out to lunch",
      category: "Team Building",
      time: "4 days ago",
      status: "pending",
      newHireName: "Sarah Kim",
      newHireRole: "Product Designer",
      suggestedDate: "This week",
      dueDate: "Nov 8, 2024"
    }
  ]

  // For tasks page, show both approvals and tasks. For approvals page, only show approvals.
  const approvals = page === "tasks" ? [...approvalData, ...taskData] : approvalData

  const categories = page === "tasks" 
    ? ["All", "Approvals", "HR Management", "Reimbursements", "Time and Attendance", "Training", "Documents", "Team Building"]
    : ["All", "HR Management", "Reimbursements", "Time and Attendance"]
  
  // For tasks page, handle hierarchical category filtering
  const getCategoryMatch = (approval: any, selectedCategory: string) => {
    if (selectedCategory === "All") return true
    if (selectedCategory === "Approvals") {
      return approval.category.startsWith("Approvals -")
    }
    if (selectedCategory === "HR Management" || selectedCategory === "Reimbursements" || selectedCategory === "Time and Attendance") {
      return approval.category === `Approvals - ${selectedCategory}` || approval.category === selectedCategory
    }
    return approval.category === selectedCategory
  }
  
  const filteredApprovals = approvals.filter(approval => {
    // Category filter
    const categoryMatch = page === "tasks" 
      ? getCategoryMatch(approval, selectedCategory)
      : selectedCategory === "All" || approval.category === `Approvals - ${selectedCategory}`
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      approval.requestor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  // Sort filtered approvals
  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    // Critical/pinned items always go to the top
    const aIsCritical = (a as any).isCritical || (a as any).pinned
    const bIsCritical = (b as any).isCritical || (b as any).pinned
    if (aIsCritical && !bIsCritical) return -1
    if (!aIsCritical && bIsCritical) return 1
    if (aIsCritical && bIsCritical) return 0 // Keep critical items in their original order
    
    if (page === "tasks" && sortBy === "dueDate") {
      // Sort by due date (items without due date go to the end)
      const aHasDueDate = 'dueDate' in a && a.dueDate
      const bHasDueDate = 'dueDate' in b && b.dueDate
      if (!aHasDueDate && !bHasDueDate) return 0
      if (!aHasDueDate) return 1
      if (!bHasDueDate) return -1
      
      // Parse dates and compare (format: "Nov 15, 2024")
      const dateA = new Date(a.dueDate as string)
      const dateB = new Date(b.dueDate as string)
      return dateA.getTime() - dateB.getTime()
    } else {
      // Sort by recency (time string - most recent first)
      // Parse time strings to relative timestamps
      const parseTime = (timeStr: string) => {
        if (timeStr.includes("just now")) {
          return 0
        } else if (timeStr.includes("min ago")) {
          return parseInt(timeStr) * 60000
        } else if (timeStr.includes("hour") || timeStr.includes("hours ago")) {
          const hours = parseInt(timeStr)
          return hours * 3600000
        } else if (timeStr.includes("day") || timeStr.includes("days ago")) {
          const days = parseInt(timeStr)
          return days * 86400000
        }
        return Infinity
      }
      return parseTime(a.time) - parseTime(b.time)
    }
  })

  // Notify parent of filtered IDs for smart selection handling
  useEffect(() => {
    onFilterChange(sortedApprovals.map(approval => approval.id))
  }, [sortedApprovals, onFilterChange])

  const isAllSelected = sortedApprovals.length > 0 && sortedApprovals.every(approval => selectedItems?.has(approval.id) || false)
  const isSomeSelected = sortedApprovals.some(approval => selectedItems?.has(approval.id) || false)

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      onClearSelection()
    } else {
      onSelectAll(sortedApprovals.map(approval => approval.id))
    }
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {!hideHeader && (
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rippling-btn-ghost h-auto p-0 rippling-text-xl text-foreground hover:bg-transparent"
              >
                {selectedCategory}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[200px] rippling-card-elevated">
                {page === "tasks" ? (
                  <>
                    <button
                      onClick={() => {
                        handleCategoryChange("All")
                        setIsDropdownOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                        selectedCategory === "All" ? 'bg-muted font-semibold' : ''
                      }`}
                    >
                      All
                    </button>
                    {categories.filter(cat => cat !== "All" && cat !== "HR Management" && cat !== "Reimbursements" && cat !== "Time and Attendance").map((category) => (
                      category === "Approvals" ? (
                        <div key={category}>
                          <button
                            onClick={() => {
                              handleCategoryChange(category)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium ${
                              selectedCategory === category ? 'bg-gray-50' : ''
                            }`}
                          >
                            {category}
                          </button>
                          <div className="pl-4">
                            <button
                              onClick={() => {
                                handleCategoryChange("HR Management")
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 ${
                                selectedCategory === "HR Management" ? 'bg-gray-50' : ''
                              }`}
                            >
                              HR Management
                            </button>
                            <button
                              onClick={() => {
                                handleCategoryChange("Reimbursements")
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 ${
                                selectedCategory === "Reimbursements" ? 'bg-gray-50' : ''
                              }`}
                            >
                              Reimbursements
                            </button>
                            <button
                              onClick={() => {
                                handleCategoryChange("Time and Attendance")
                                setIsDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 ${
                                selectedCategory === "Time and Attendance" ? 'bg-gray-50' : ''
                              }`}
                            >
                              Time and Attendance
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategoryChange(category)
                            setIsDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                            selectedCategory === category ? 'bg-gray-50 font-medium' : ''
                          }`}
                        >
                          {category}
                        </button>
                      )
                    ))}
                  </>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        handleCategoryChange(category)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      {category}
                    </button>
                  ))
                )}
              </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              className="h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
              style={{
                accentColor: isAllSelected ? '#7A005D' : '#A3A3A5',
                borderColor: isAllSelected ? '#7A005D' : '#A3A3A5'
              }}
            />
            <label htmlFor="select-all" className="text-sm text-gray-600">
              {sortedApprovals.length} items
            </label>
          </div>
          {page === "tasks" && (
            <div className="relative" ref={sortDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="rippling-btn-outline h-8 gap-2 rippling-text-sm"
              >
                Sort: {sortBy === "recency" ? "Recency" : "Due Date"}
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isSortDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[160px] rippling-card-elevated">
                  <button
                    onClick={() => {
                      setSortBy("recency")
                      setIsSortDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                      sortBy === "recency" ? 'bg-muted font-semibold' : ''
                    }`}
                  >
                    Recency
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("dueDate")
                      setIsSortDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                      sortBy === "dueDate" ? 'bg-muted font-semibold' : ''
                    }`}
                  >
                    Due Date
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="rippling-input w-full pl-10 pr-10" 
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="rippling-btn-ghost absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => handleSearchChange("")}
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
      )}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-0 pb-4">
          {sortedApprovals.map((approval) => (
            <div
              key={approval.id}
              onClick={() => onSelectItem(approval.id)}
              onMouseEnter={() => setHoveredItem(approval.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`p-4 border-b border-border hover:bg-muted cursor-pointer relative transition-colors ${
                selectedItem === approval.id ? 'bg-[#E3E3E3]' : 'bg-card'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems?.has(approval.id) || false}
                  onChange={() => onToggleItem(approval.id)}
                  className="h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
                  style={{
                    accentColor: selectedItems?.has(approval.id) ? '#7A005D' : '#A3A3A5',
                    borderColor: selectedItems?.has(approval.id) ? '#7A005D' : '#A3A3A5'
                  }}
                />
                <div className="flex-1">
                  <h3 className="rippling-text-sm text-foreground font-semibold">{approval.requestor}</h3>
                  <p className="rippling-text-sm text-muted-foreground mt-1 font-normal">{approval.subject}</p>
                  {'warning' in approval && approval.warning && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {approval.warning}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="rippling-text-xs text-muted-foreground truncate max-w-[200px]">{getDisplayCategory(approval.category)}</span>
                    <div className="flex items-center gap-2 ml-3">
                      {'dueDate' in approval && approval.dueDate && (
                        <span className="rippling-text-xs text-muted-foreground whitespace-nowrap">Due: {approval.dueDate}</span>
                      )}
                      <span className="rippling-text-xs text-muted-foreground whitespace-nowrap">{approval.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {hoveredItem === approval.id && (
                <div className="absolute top-2 right-2 flex gap-1">
                  {(approval.category === "Training" || approval.category === "Documents" || approval.category === "Team Building") ? (
                    <Button
                      variant="ghost"
                      size="icon"
                            className="rippling-btn-ghost h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle archive action
                      }}
                      title="Archive"
                    >
                      <Archive className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rippling-btn-ghost h-6 w-6 hover:bg-success/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle approve action
                        }}
                      >
                        <Check className="h-3 w-3 text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rippling-btn-ghost h-6 w-6 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle reject action
                        }}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              )}
              
              {'comments' in approval && approval.comments && approval.comments.length > 0 && (
                <div className={`absolute top-4 right-4 ${hoveredItem === approval.id ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                         <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              
              {'trip' in approval && approval.trip && approval.trip.linked && (
                <div className={`absolute top-4 right-8 ${hoveredItem === approval.id ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                         <Plane className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

