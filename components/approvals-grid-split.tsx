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
  page?: "approvals" | "tasks"
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
  page = "approvals"
}: ApprovalsGridWithSplitProps) {
  const [viewMode, setViewMode] = useState<"full-width" | "split">("full-width")
  
  const handleExpandToDrawer = () => {
    if (selectedItem) {
      setViewMode("full-width")
      onOpenDrawer(selectedItem)
    }
  }
  
  const handleViewModeChange = (mode: "full-width" | "split") => {
    setViewMode(mode)
    // When collapsing from full-width to split, close drawer if open
    if (mode === "split" && onCloseDrawer) {
      onCloseDrawer()
    }
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
  // But only if we just switched to full-width or if item was just selected
  const prevViewModeRef = useRef(viewMode)
  const prevSelectedItemRef = useRef(selectedItem)
  
  useEffect(() => {
    const viewModeChanged = prevViewModeRef.current !== viewMode
    const itemSelected = prevSelectedItemRef.current !== selectedItem && selectedItem !== null
    
    if (viewMode === "full-width" && selectedItem && (viewModeChanged || itemSelected)) {
      onOpenDrawer(selectedItem)
    }
    
    prevViewModeRef.current = viewMode
    prevSelectedItemRef.current = selectedItem
  }, [viewMode, selectedItem, onOpenDrawer])
  const [filteredIds, setFilteredIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Track filtered IDs for bulk selection calculation
  const handleFilterChange = (ids: number[]) => {
    setFilteredIds(ids)
    onFilterChange(ids)
  }

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
    ? ["All", "Approvals", "HR Management", "Reimbursements", "Time and Attendance", "Training", "Documents", "Team Building"]
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
              page={page}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              externalSearchQuery={searchQuery}
              externalSelectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              selectedItem={selectedItem}
              onSelectItem={onSelectItem}
            />
          </div>
          {selectedItem && (
            <div className="w-[800px] border-l border-gray-200 flex flex-col bg-[#FAF9F7] overflow-hidden">
              <ApprovalDetail 
                selectedItem={selectedItem} 
                selectedItems={selectedItems}
                onClearSelection={onClearSelection}
                page={page}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onExpandToDrawer={handleExpandToDrawer}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col bg-white overflow-hidden">
          <div className="overflow-hidden p-6 flex flex-col" style={{ height: '750px' }}>
            <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden min-w-full flex flex-col flex-1 min-h-0">
              {/* Header with title, bulk selection, and search - Inside the table frame */}
              <div className="px-4 pt-3 pb-2 border-b border-gray-200 flex-shrink-0">
                  {/* Top row: Title and View Mode Buttons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-gray-900">Needs my review</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {page === "tasks" && (
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1.5 px-2"
                            disabled
                          >
                            Sort: Recency
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setViewMode("full-width")}
                        >
                          Full-width
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-7 px-2 text-xs bg-[rgb(231,225,222)] text-black hover:bg-[rgb(231,225,222)]"
                          onClick={() => setViewMode("split")}
                        >
                          Split screen
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom row: Bulk Selection on left, Search and Filter on right */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
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
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="select-all-split" className="text-xs text-gray-600">
                        {filteredIds.length} items
                      </label>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="relative max-w-[280px]">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input 
                          placeholder="Search..." 
                          className="w-full pl-8 pr-8 h-7 text-xs" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 hover:bg-gray-100"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="h-3 w-3 text-gray-400" />
                          </Button>
                        )}
                      </div>
                      <div className="relative" ref={filterDropdownRef}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 px-2"
                          onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        >
                          <Filter className="h-3.5 w-3.5" />
                          <span className="text-xs">{getCategoryDisplayName(selectedCategory)}</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        {isFilterDropdownOpen && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[160px]">
                          {page === "tasks" ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedCategory("All")
                                  setIsFilterDropdownOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                  selectedCategory === "All" ? 'bg-gray-50 font-medium' : ''
                                }`}
                              >
                                All
                              </button>
                              {categories.filter(cat => cat !== "All" && cat !== "HR Management" && cat !== "Reimbursements" && cat !== "Time and Attendance").map((category) => (
                                category === "Approvals" ? (
                                  <div key={category}>
                                    <button
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setIsFilterDropdownOpen(false)
                                      }}
                                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs font-medium ${
                                        selectedCategory === category ? 'bg-gray-50' : ''
                                      }`}
                                    >
                                      {category}
                                    </button>
                                    <div className="pl-3">
                                      <button
                                        onClick={() => {
                                          setSelectedCategory("HR Management")
                                          setIsFilterDropdownOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs text-gray-600 ${
                                          selectedCategory === "HR Management" ? 'bg-gray-50' : ''
                                        }`}
                                      >
                                        HR Management
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedCategory("Reimbursements")
                                          setIsFilterDropdownOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs text-gray-600 ${
                                          selectedCategory === "Reimbursements" ? 'bg-gray-50' : ''
                                        }`}
                                      >
                                        Reimbursements
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedCategory("Time and Attendance")
                                          setIsFilterDropdownOpen(false)
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs text-gray-600 ${
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
                                      setSelectedCategory(category)
                                      setIsFilterDropdownOpen(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
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
                                  setSelectedCategory(category)
                                  setIsFilterDropdownOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-xs ${
                                  selectedCategory === category ? 'bg-gray-50 font-medium' : ''
                                }`}
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
              </div>

                {/* List and Detail View */}
                <div className="flex flex-1 min-h-0 overflow-hidden">
                  <div className="w-[340px] border-r border-gray-200 flex flex-col min-h-0">
                    <ApprovalsList 
                      selectedItem={selectedItem} 
                      onSelectItem={onSelectItem}
                      selectedItems={selectedItems}
                      onToggleItem={onToggleItem}
                      onSelectAll={onSelectAll}
                      onClearSelection={onClearSelection}
                      onFilterChange={handleFilterChange}
                      page={page}
                      hideHeader={true}
                      externalSearchQuery={searchQuery}
                      externalSelectedCategory={selectedCategory}
                      onSearchChange={setSearchQuery}
                      onCategoryChange={setSelectedCategory}
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-h-0">
                    <ApprovalDetail 
                      selectedItem={selectedItem} 
                      selectedItems={selectedItems}
                      onClearSelection={onClearSelection}
                      page={page}
                      backgroundColor="white"
                      viewMode={viewMode}
                      onViewModeChange={handleViewModeChange}
                      onExpandToDrawer={handleExpandToDrawer}
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

