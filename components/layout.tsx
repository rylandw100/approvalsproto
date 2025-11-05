"use client"

import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { ApprovalsList } from "./approvals-list"
import { ApprovalsGrid } from "./approvals-grid"
import { ApprovalsGridWithSplit } from "./approvals-grid-split"
import { ApprovalDetail } from "./approval-detail"
import { AppNavBar } from "./app-navbar"
import { Drawer } from "./drawer"
import { useState, useRef, useEffect } from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<"approvals" | "tasks">("tasks")
  const [activeTab, setActiveTab] = useState<string>("opt1")
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [removedItems, setRemovedItems] = useState<Set<number>>(new Set())
  const [pinnedItems, setPinnedItems] = useState<Set<number>>(new Set([100])) // Payroll task (id: 100) pinned by default

  // Clear selectedItem when switching from opt1 to opt3
  const prevActiveTabRef = useRef(activeTab)
  useEffect(() => {
    if (prevActiveTabRef.current === "opt1" && activeTab === "opt3") {
      setSelectedItem(null)
    }
    prevActiveTabRef.current = activeTab
  }, [activeTab])

  const handleTogglePin = (id: number) => {
    setPinnedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerItem, setDrawerItem] = useState<number | null>(null)
  const [filteredIds, setFilteredIds] = useState<number[]>([])
  const opt3ViewModeChangeRef = useRef<((mode: "full-width" | "split") => void) | null>(null)

  const handleRemoveItem = (id: number) => {
    setRemovedItems(prev => new Set(prev).add(id))
    // Clear selection if the selected item is removed
    if (selectedItem === id) {
      setSelectedItem(null)
    }
    // Remove from selected items if it's selected
    if (selectedItems.has(id)) {
      setSelectedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleRemoveItems = (ids: number[]) => {
    setRemovedItems(prev => {
      const newSet = new Set(prev)
      ids.forEach(id => newSet.add(id))
      return newSet
    })
    // Clear selection if the selected item is removed
    if (selectedItem && ids.includes(selectedItem)) {
      setSelectedItem(null)
    }
    // Remove from selected items
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      ids.forEach(id => newSet.delete(id))
      return newSet
    })
  }

  const handleToggleItem = (id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = (filteredIds: number[]) => {
    setSelectedItems(new Set(filteredIds))
  }

  const handleClearSelection = () => {
    setSelectedItems(new Set())
  }

  const handleFilterChange = (ids: number[]) => {
    setFilteredIds(ids)
    // If current selection is not in filtered results, clear it
    if (selectedItem && !ids.includes(selectedItem)) {
      setSelectedItem(null)
    }
  }

  // Function to select the next item in the queue
  const handleSelectNextItem = () => {
    if (selectedItem && filteredIds.length > 0) {
      const currentIndex = filteredIds.indexOf(selectedItem)
      if (currentIndex !== -1 && currentIndex < filteredIds.length - 1) {
        // Select the next item
        const nextItem = filteredIds[currentIndex + 1]
        setSelectedItem(nextItem)
      } else if (currentIndex !== -1 && currentIndex === filteredIds.length - 1 && filteredIds.length > 1) {
        // If it's the last item, select the previous one (since current will be removed)
        const prevItem = filteredIds[currentIndex - 1]
        setSelectedItem(prevItem)
      } else {
        // No more items, clear selection
        setSelectedItem(null)
      }
    }
  }

  const handleOpenDrawer = (id: number) => {
    setDrawerItem(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    // Only clear selectedItem if we're actually closing a drawer (drawerOpen is true)
    // Don't clear if we're switching to split view with a selected item
    if (activeTab === "opt3" && drawerOpen) {
      setSelectedItem(null)
    }
    setDrawerOpen(false)
    setDrawerItem(null)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <div className="flex-1 flex flex-col">
          <AppNavBar activeTab={activeTab} onTabChange={setActiveTab} page={activePage} />
          <div className="flex-1 flex overflow-hidden">
            {activeTab === "opt1" ? (
              <>
                <div className="border-r border-border pl-6 flex flex-col overflow-hidden bg-card">
                  <ApprovalsList 
                    selectedItem={selectedItem} 
                    onSelectItem={setSelectedItem}
                    selectedItems={selectedItems}
                    onToggleItem={handleToggleItem}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                    onFilterChange={handleFilterChange}
                    removedItems={removedItems}
                    onRemoveItem={handleRemoveItem}
                    onRemoveItems={handleRemoveItems}
                    page={activePage}
                    pinnedItems={pinnedItems}
                    onTogglePin={handleTogglePin}
                  />
                </div>
                <div className="flex-1 bg-background">
                  <ApprovalDetail 
                    selectedItem={selectedItem} 
                    selectedItems={selectedItems}
                    onClearSelection={handleClearSelection}
                    removedItems={removedItems}
                    onRemoveItem={handleRemoveItem}
                    onRemoveItems={handleRemoveItems}
                    page={activePage}
                    onSelectNextItem={handleSelectNextItem}
                  />
                </div>
              </>
            ) : activeTab === "opt2" ? (
              <div className="flex-1 bg-background">
                <ApprovalsGrid
                  selectedItems={selectedItems}
                  onToggleItem={handleToggleItem}
                  onSelectAll={handleSelectAll}
                  onClearSelection={handleClearSelection}
                  onOpenDrawer={handleOpenDrawer}
                  removedItems={removedItems}
                  onRemoveItem={handleRemoveItem}
                  onRemoveItems={handleRemoveItems}
                  page={activePage}
                  pinnedItems={pinnedItems}
                  onTogglePin={handleTogglePin}
                />
              </div>
            ) : (
              <div className="flex-1">
                <ApprovalsGridWithSplit
                  selectedItem={selectedItem}
                  onSelectItem={(id) => {
                    setSelectedItem(id)
                  }}
                  selectedItems={selectedItems}
                  onToggleItem={handleToggleItem}
                  onSelectAll={handleSelectAll}
                  onClearSelection={handleClearSelection}
                  onFilterChange={handleFilterChange}
                  onOpenDrawer={handleOpenDrawer}
                  onCloseDrawer={handleCloseDrawer}
                  drawerViewModeChange={(handler) => {
                    opt3ViewModeChangeRef.current = handler
                  }}
                  drawerOpen={drawerOpen}
                  removedItems={removedItems}
                  onRemoveItem={handleRemoveItem}
                  onRemoveItems={handleRemoveItems}
                  page={activePage}
                  pinnedItems={pinnedItems}
                  onTogglePin={handleTogglePin}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        selectedItem={drawerItem}
        selectedItems={selectedItems}
        onClearSelection={handleClearSelection}
        removedItems={removedItems}
        onRemoveItem={handleRemoveItem}
        onRemoveItems={handleRemoveItems}
        page={activePage}
        onViewModeChange={(mode) => {
          // When collapsing from drawer, switch to split screen in opt3
          if (activeTab === "opt3" && mode === "split") {
            handleCloseDrawer()
            if (opt3ViewModeChangeRef.current) {
              opt3ViewModeChangeRef.current("split")
            }
          }
        }}
        onSelectNextItem={handleSelectNextItem}
      />
    </div>
  )
}


