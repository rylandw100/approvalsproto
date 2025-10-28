"use client"

import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { ApprovalsList } from "./approvals-list"
import { ApprovalDetail } from "./approval-detail"
import { AppNavBar } from "./app-navbar"
import { useState } from "react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

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

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden bg-[#FAF9F7]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <AppNavBar />
          <div className="flex-1 flex">
            <div className="w-[340px] border-r border-gray-200 pl-6">
              <ApprovalsList 
                selectedItem={selectedItem} 
                onSelectItem={setSelectedItem}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
              />
            </div>
            <div className="flex-1">
              <ApprovalDetail 
                selectedItem={selectedItem} 
                selectedItems={selectedItems}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


