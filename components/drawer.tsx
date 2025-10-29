"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApprovalDetail } from "./approval-detail"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedItem: number | null
  selectedItems: Set<number>
  onClearSelection: () => void
}

export function Drawer({ isOpen, onClose, selectedItem, selectedItems, onClearSelection }: DrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[800px] bg-[#FAF9F7] shadow-xl z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ApprovalDetail
            selectedItem={selectedItem}
            selectedItems={selectedItems}
            onClearSelection={onClearSelection}
          />
        </div>
      </div>
    </>
  )
}

