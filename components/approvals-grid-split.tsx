"use client"

import { ApprovalsList } from "./approvals-list"
import { ApprovalsGrid } from "./approvals-grid"
import { ApprovalDetail } from "./approval-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Filter, LayoutGrid, List } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"

interface ApprovalsGridWithSplitProps {
  selectedItem: number | null
  onSelectItem: (id: number | null) => void
  selectedItems: Set<number>
  onToggleItem: (id: number) => void
  onSelectAll: (filteredIds: number[]) => void
  onClearSelection: () => void
  onFilterChange: (filteredIds: number[]) => void
  onOpenDrawer: (id: number) => void
  onCloseDrawer?: () => void
  drawerViewModeChange?: (handler: (mode: "full-width" | "split") => void) => void
  drawerOpen?: boolean
  removedItems?: Set<number>
  onRemoveItem?: (id: number) => void
  onRemoveItems?: (ids: number[]) => void
  page?: "approvals" | "tasks"
  pinnedItems?: Set<number>
  onTogglePin?: (id: number) => void
}

export function ApprovalsGridWithSplit({
  selectedItem,
  onSelectItem,
  selectedItems,
  onToggleItem,
  onSelectAll,
  onClearSelection,
  onFilterChange,
  onOpenDrawer,
  onCloseDrawer,
  drawerViewModeChange,
  drawerOpen = false,
  removedItems = new Set(),
  onRemoveItem,
  onRemoveItems,
  page = "approvals",
  pinnedItems = new Set(),
  onTogglePin
}: ApprovalsGridWithSplitProps) {
  const [viewMode, setViewMode] = useState<"full-width" | "split">("full-width")
  
  const handleExpandToDrawer = () => {
    if (selectedItem) {
      setViewMode("full-width")
      onOpenDrawer(selectedItem)
    }
  }
  
  const handleViewModeChange = (mode: "full-width" | "split") => {
    const prevMode = viewMode
    setViewMode(mode)
    
    // When switching from split to full-width, clear selectedItem so inline detail doesn't show
    if (prevMode === "split" && mode === "full-width") {
      onSelectItem(null)
    }
    
    // When collapsing from full-width to split, close drawer if open
    // But only close the drawer if there's actually a drawer open (not just inline detail)
    // We can tell if we're in inline detail mode because selectedItem is set but drawerOpen is false
    if (mode === "split" && onCloseDrawer && prevMode === "full-width" && drawerOpen) {
      // Only call onCloseDrawer if drawer is actually open (not inline detail)
      onCloseDrawer()
    }
    // When collapsing from full-width inline detail to split, preserve selectedItem
    // The selectedItem should remain set so it shows in the split view
    // Don't clear selectedItem when collapsing - it should be preserved
  }
  
  // Expose view mode change handler to parent (for drawer to call)
  useEffect(() => {
    if (drawerViewModeChange) {
      const handleDrawerModeChange = (mode: "full-width" | "split") => {
        if (mode === "split") {
          setViewMode("split")
          if (onCloseDrawer) {
            onCloseDrawer()
          }
        }
      }
      drawerViewModeChange(handleDrawerModeChange)
    }
  }, [drawerViewModeChange, onCloseDrawer])
  
  // When an item is selected in full-width mode, open the drawer
  // But only if we just switched to full-width from split AND an item was just selected
  // Don't auto-open when switching from split to full-width if item was already selected
  const prevViewModeRef = useRef(viewMode)
  const prevSelectedItemRef = useRef(selectedItem)
  
  useEffect(() => {
    const viewModeChanged = prevViewModeRef.current !== viewMode
    const itemSelected = prevSelectedItemRef.current !== selectedItem && selectedItem !== null
    const switchedFromSplitToFullWidth = prevViewModeRef.current === "split" && viewMode === "full-width"
    
    // Only open drawer if:
    // 1. Item was just selected (not just switching views)
    // 2. OR we're in full-width and item was just selected
    // Don't auto-open when just switching from split to full-width
    if (viewMode === "full-width" && selectedItem && itemSelected && !switchedFromSplitToFullWidth) {
      onOpenDrawer(selectedItem)
    }
    
    prevViewModeRef.current = viewMode
    prevSelectedItemRef.current = selectedItem
  }, [viewMode, selectedItem, onOpenDrawer])
  const [filteredIds, setFilteredIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [sortBy, setSortBy] = useState<"recency" | "dueDate">("recency")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isViewModeDropdownOpen, setIsViewModeDropdownOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const viewModeDropdownRef = useRef<HTMLDivElement>(null)

  // Track filtered IDs for bulk selection calculation
  const handleFilterChange = (ids: number[]) => {
    setFilteredIds(ids)
    onFilterChange(ids)
  }

  // Function to select the next item in the queue
  const handleSelectNextItem = () => {
    if (selectedItem && filteredIds.length > 0) {
      const currentIndex = filteredIds.indexOf(selectedItem)
      if (currentIndex !== -1 && currentIndex < filteredIds.length - 1) {
        // Select the next item
        const nextItem = filteredIds[currentIndex + 1]
        onSelectItem(nextItem)
      } else if (currentIndex !== -1 && currentIndex === filteredIds.length - 1 && filteredIds.length > 1) {
        // If it's the last item, select the previous one (since current will be removed)
        const prevItem = filteredIds[currentIndex - 1]
        onSelectItem(prevItem)
      } else {
        // No more items, clear selection
        onSelectItem(null)
      }
    }
  }

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false)
      }
      if (viewModeDropdownRef.current && !viewModeDropdownRef.current.contains(event.target as Node)) {
        setIsViewModeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isAllSelected = filteredIds.length > 0 && filteredIds.every(id => selectedItems.has(id))
  const isSomeSelected = filteredIds.some(id => selectedItems.has(id))

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      onClearSelection()
    } else {
      onSelectAll(filteredIds)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const categories = page === "tasks" 
    ? ["All", "Approvals", "HR Management", "Reimbursements", "Time and Attendance", "Training", "Documents", "Team Building", "Payroll"]
    : ["All", "HR Management", "Reimbursements", "Time and Attendance"]
  
  const getCategoryMatch = (category: string, selectedCategory: string) => {
    if (selectedCategory === "All") return true
    if (selectedCategory === "Approvals") {
      return category.startsWith("Approvals -")
    }
    if (selectedCategory === "HR Management" || selectedCategory === "Reimbursements" || selectedCategory === "Time and Attendance") {
      return category === `Approvals - ${selectedCategory}` || category === selectedCategory
    }
    return category === selectedCategory
  }

  const getCategoryDisplayName = (category: string) => {
    if (page === "approvals" && category.startsWith("Approvals - ")) {
      return category.replace("Approvals - ", "")
    }
    return category
  }

  // Alias variables to match ApprovalsGrid header structure
  const requestTypes = categories
  const requestTypeDropdownRef = filterDropdownRef
  const isRequestTypeDropdownOpen = isFilterDropdownOpen
  const setIsRequestTypeDropdownOpen = setIsFilterDropdownOpen
  const selectedRequestType = selectedCategory
  const getDisplayCategory = getCategoryDisplayName
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }
  
  const handleSortChange = (newSortBy: "recency" | "dueDate") => {
    setSortBy(newSortBy)
  }
  
  // For item count, use filteredIds.length
  const sortedApprovalsLength = filteredIds.length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content */}
      {viewMode === "full-width" ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden">
                    <ApprovalsGrid
                      selectedItems={selectedItems}
                      onToggleItem={onToggleItem}
                      onSelectAll={onSelectAll}
                      onClearSelection={onClearSelection}
                      onOpenDrawer={onOpenDrawer}
                      removedItems={removedItems}
                      onRemoveItem={onRemoveItem}
                      onRemoveItems={onRemoveItems}
                      page={page}
                      viewMode={viewMode}
                      onViewModeChange={handleViewModeChange}
                      externalSearchQuery={searchQuery}
                      externalSelectedCategory={selectedCategory}
                      onSearchChange={setSearchQuery}
                      onCategoryChange={setSelectedCategory}
                      selectedItem={selectedItem}
                      onSelectItem={onSelectItem}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      pinnedItems={pinnedItems}
                      onTogglePin={onTogglePin}
                    />
          </div>
          {selectedItem && (
            <div className="w-[800px] border-l border-gray-200 flex flex-col bg-[#FAF9F7] overflow-hidden">
              <div className="flex items-center justify-end p-2 border-b border-gray-200 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelectItem(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
                      <ApprovalDetail 
                        selectedItem={selectedItem} 
                        selectedItems={selectedItems}
                        onClearSelection={onClearSelection}
                        removedItems={removedItems}
                        onRemoveItem={onRemoveItem}
                        onRemoveItems={onRemoveItems}
                        page={page}
                        viewMode={viewMode}
                        onViewModeChange={handleViewModeChange}
                        onExpandToDrawer={handleExpandToDrawer}
                        onSelectNextItem={handleSelectNextItem}
                      />
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col bg-white overflow-hidden">
          <div className="overflow-hidden p-6 flex flex-col" style={{ height: '750px' }}>
            <div className="bg-white rounded-[16px] overflow-hidden min-w-full flex flex-col flex-1 min-h-0">
              {/* Header with bulk selection, search, filter, sort, and view mode - Inside the table frame */}
              <div className={`px-4 pt-3 flex-shrink-0 ${viewMode !== undefined ? 'pb-4' : 'pb-2'}`}>
                {/* Single row: Bulk Selection on left, Search, Filter, Sort, and View Mode on right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {viewMode === undefined && (
                      <h2 className="text-base font-semibold text-gray-900 mr-3">Needs my review</h2>
                    )}
                    <input
                      type="checkbox"
                      id="select-all-split"
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
                    <label htmlFor="select-all-split" className={`${viewMode !== undefined ? 'text-sm' : 'text-xs'} text-gray-600`}>
                      {sortedApprovalsLength} items
                    </label>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="relative max-w-[280px]">
                      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search..." 
                        className="w-full pl-9 pr-9 h-8 text-sm" 
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
                          onClick={() => handleSearchChange("")}
                        >
                          <X className="h-3.5 w-3.5 text-gray-400" />
                        </Button>
                      )}
                    </div>
                    <div className="relative" ref={requestTypeDropdownRef}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRequestTypeDropdownOpen(!isRequestTypeDropdownOpen)}
                        className="h-8 text-sm gap-2 px-3"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="text-sm">{getDisplayCategory(selectedRequestType)}</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    {isRequestTypeDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg z-20 min-w-[200px]">
                        {page === "tasks" ? (
                          <>
                            <button
                              onClick={() => {
                                handleCategoryChange("All")
                                setIsRequestTypeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                                selectedRequestType === "All" ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              All
                            </button>
                            {requestTypes.filter(type => type !== "All" && type !== "HR Management" && type !== "Reimbursements" && type !== "Time and Attendance").map((type) => (
                              type === "Approvals" ? (
                                <div key={type}>
                                  <button
                                    onClick={() => {
                                      handleCategoryChange(type)
                                      setIsRequestTypeDropdownOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium ${
                                      selectedRequestType === type ? 'bg-gray-50' : ''
                                    }`}
                                  >
                                    {type}
                                  </button>
                                  <div className="pl-4">
                                    <button
                                      onClick={() => {
                                        handleCategoryChange("HR Management")
                                        setIsRequestTypeDropdownOpen(false)
                                      }}
                                      className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                                        selectedRequestType === "HR Management" ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      HR Management
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleCategoryChange("Reimbursements")
                                        setIsRequestTypeDropdownOpen(false)
                                      }}
                                      className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                                        selectedRequestType === "Reimbursements" ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      Reimbursements
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleCategoryChange("Time and Attendance")
                                        setIsRequestTypeDropdownOpen(false)
                                      }}
                                      className={`w-full text-left px-4 py-2 hover:bg-muted text-sm rippling-text-sm transition-colors ${
                                        selectedRequestType === "Time and Attendance" ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      Time and Attendance
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  key={type}
                                  onClick={() => {
                                    handleCategoryChange(type)
                                    setIsRequestTypeDropdownOpen(false)
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                                    selectedRequestType === type ? 'bg-gray-50 font-medium' : ''
                                  }`}
                                >
                                  {type}
                                </button>
                              )
                            ))}
                          </>
                        ) : (
                          requestTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                handleCategoryChange(type)
                                setIsRequestTypeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${
                                selectedRequestType === type ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              {type}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    </div>
                    {page === "tasks" && (
                      <div className="relative" ref={sortDropdownRef}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                          className="h-8 text-sm gap-2 px-3"
                        >
                          Sort: {sortBy === "recency" ? "Recency" : "Due Date"}
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        {isSortDropdownOpen && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[200px]">
                            <button
                              onClick={() => {
                                handleSortChange("recency")
                                setIsSortDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                sortBy === "recency" ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              Recency
                            </button>
                            <button
                              onClick={() => {
                                handleSortChange("dueDate")
                                setIsSortDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                sortBy === "dueDate" ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              Due Date
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {viewMode !== undefined && handleViewModeChange && (
                      <div className="relative" ref={viewModeDropdownRef}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsViewModeDropdownOpen(!isViewModeDropdownOpen)}
                          className="h-8 text-sm gap-2 px-3"
                        >
                          View: {(viewMode as "full-width" | "split") === "full-width" ? "Full-width" : "Split screen"}
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        {isViewModeDropdownOpen && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[200px]">
                            <button
                              onClick={() => {
                                handleViewModeChange("full-width")
                                setIsViewModeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                (viewMode as "full-width" | "split") === "full-width" ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              Full-width
                            </button>
                            <button
                              onClick={() => {
                                handleViewModeChange("split")
                                setIsViewModeDropdownOpen(false)
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                (viewMode as "full-width" | "split") === "split" ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              Split screen
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

                {/* List and Detail View */}
                <div className="flex flex-1 min-h-0 overflow-hidden border border-gray-200 rounded-[8px]">
                  <div className="w-[340px] border-r border-gray-200 flex flex-col min-h-0">
                          <ApprovalsList
                            selectedItem={selectedItem}
                            onSelectItem={onSelectItem}
                            selectedItems={selectedItems}
                            onToggleItem={onToggleItem}
                            onSelectAll={onSelectAll}
                            onClearSelection={onClearSelection}
                            onFilterChange={handleFilterChange}
                            removedItems={removedItems}
                            onRemoveItem={onRemoveItem}
                            onRemoveItems={onRemoveItems}
                            page={page}
                            hideHeader={true}
                            externalSearchQuery={searchQuery}
                            externalSelectedCategory={selectedCategory}
                            onSearchChange={setSearchQuery}
                            onCategoryChange={setSelectedCategory}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            pinnedItems={pinnedItems}
                            onTogglePin={onTogglePin}
                          />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0">
                            <ApprovalDetail 
                              selectedItem={selectedItem} 
                              selectedItems={selectedItems}
                              onClearSelection={onClearSelection}
                              removedItems={removedItems}
                              onRemoveItem={onRemoveItem}
                              onRemoveItems={onRemoveItems}
                              page={page}
                              backgroundColor="white"
                              viewMode={viewMode}
                              onViewModeChange={handleViewModeChange}
                              onExpandToDrawer={handleExpandToDrawer}
                              onSelectNextItem={handleSelectNextItem}
                            />
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}

