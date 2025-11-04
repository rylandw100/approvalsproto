"use client"

import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { ApprovalsList } from "./approvals-list"
import { ApprovalsGrid } from "./approvals-grid"
import { ApprovalsGridWithSplit } from "./approvals-grid-split"
import { ApprovalDetail } from "./approval-detail"
import { AppNavBar } from "./app-navbar"
import { Drawer } from "./drawer"
import { useState, useRef } from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<"approvals" | "tasks">("approvals")
  const [activeTab, setActiveTab] = useState<string>("opt1")
  const [selectedItem, setSelectedItem] = useState<number | null>(1) // Default to first item
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerItem, setDrawerItem] = useState<number | null>(null)
  const opt3ViewModeChangeRef = useRef<((mode: "full-width" | "split") => void) | null>(null)

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

  const handleFilterChange = (filteredIds: number[]) => {
    // If current selection is not in filtered results, clear it
    if (selectedItem && !filteredIds.includes(selectedItem)) {
      setSelectedItem(null)
    }
  }

  const handleOpenDrawer = (id: number) => {
    setDrawerItem(id)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
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
                <div className="w-[360px] border-r border-border pl-6 flex flex-col overflow-hidden bg-card">
                  <ApprovalsList 
                    selectedItem={selectedItem} 
                    onSelectItem={setSelectedItem}
                    selectedItems={selectedItems}
                    onToggleItem={handleToggleItem}
                    onSelectAll={handleSelectAll}
                    onClearSelection={handleClearSelection}
                    onFilterChange={handleFilterChange}
                    page={activePage}
                  />
                </div>
                <div className="flex-1 bg-background">
                  <ApprovalDetail 
                    selectedItem={selectedItem} 
                    selectedItems={selectedItems}
                    onClearSelection={handleClearSelection}
                    page={activePage}
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
                  page={activePage}
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
                  page={activePage}
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
      />
    </div>
  )
}


