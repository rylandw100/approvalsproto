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
  removedItems?: Set<number>
  onRemoveItem?: (id: number) => void
  onRemoveItems?: (ids: number[]) => void
  page?: "approvals" | "tasks"
  onViewModeChange?: (mode: "full-width" | "split") => void
  onSelectNextItem?: () => void
}

export function Drawer({ isOpen, onClose, selectedItem, selectedItems, onClearSelection, removedItems = new Set(), onRemoveItem, onRemoveItems, page = "approvals", onViewModeChange, onSelectNextItem }: DrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[800px] bg-background shadow-xl z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card flex-shrink-0">
          <h2 className="rippling-text-lg text-foreground">Request Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rippling-btn-ghost h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ApprovalDetail
            selectedItem={selectedItem}
            selectedItems={selectedItems}
            onClearSelection={onClearSelection}
            removedItems={removedItems}
            onRemoveItem={onRemoveItem}
            onRemoveItems={onRemoveItems}
            page={page}
            viewMode="full-width"
            onViewModeChange={(mode) => {
              if (mode === "split") {
                // Don't call onClose here - let the parent handle closing and preserving selection
                if (onViewModeChange) {
                  onViewModeChange("split")
                }
              }
            }}
            onSelectNextItem={onSelectNextItem}
          />
        </div>
      </div>
    </>
  )
}

