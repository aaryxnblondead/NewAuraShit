"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Modal({ isOpen, onClose, title, children, className = "", showCloseButton = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEsc)
    document.addEventListener("mousedown", handleClickOutside)

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`bg-gray-900 rounded-xl border border-gray-800 shadow-lg max-w-lg w-full max-h-[90vh] overflow-hidden ${className}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">{title}</h2>
          {showCloseButton && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-5rem)]">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
}) {
  const getButtonClass = () => {
    return variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-accent hover:bg-accent/90 text-white"
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mb-6">
        <p className="text-gray-300">{message}</p>
      </div>
      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`px-4 py-2 rounded-lg transition-colors ${getButtonClass()}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  )
}

