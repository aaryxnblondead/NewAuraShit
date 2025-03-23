"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  cancel?: React.ReactNode
  href?: string
  variant?: "default" | "destructive"
  duration?: number
}

const actionVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
}

interface ContextProps {
  toasts: Toast[]
  toast: ({ ...props }: Omit<Toast, "id">) => void
  dismiss: (toastId?: string) => void
  update: (toastId: string, options: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ContextProps>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  update: () => {},
})

function useToast() {
  return React.useContext(ToastContext)
}

interface ToastProviderProps {
  children: React.ReactNode
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const [count, setCount] = React.useState(0)
  const idRef = React.useRef(0)

  React.useEffect(() => {
    setToasts((t) => t.filter((t) => (typeof t.duration === "number" ? t.duration > 0 : true)))
  }, [count])

  const toast = React.useCallback(
    function toast({ ...props }: Omit<Toast, "id">) {
      const id = String(idRef.current++)

      if (toasts.length >= TOAST_LIMIT) {
        dismiss(toasts[0]?.id)
      }

      setToasts((prev) => [{ id, ...props }, ...prev])
      setCount((c) => c + 1)
    },
    [toasts, dismiss],
  )

  const dismiss = React.useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prev) => prev.map((t) => (t.id === toastId ? { ...t, duration: 0 } : t)))
    } else {
      setToasts([])
    }
  }, [])

  const update = React.useCallback((toastId: string, options: Omit<Toast, "id">) => {
    setToasts((prev) => prev.map((t) => (t.id === toastId ? { ...t, ...options } : t)))
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismiss, update }}>{children}</ToastContext.Provider>
}

type ToastViewportProps = React.HTMLAttributes<HTMLDivElement>

function ToastViewport({ ...props }: ToastViewportProps) {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-w-[368px]",
        props.className,
      )}
    />
  )
}

const ToastRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { dismiss } = useToast()
    const shouldReduceMotion = useReducedMotion()

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center overflow-hidden rounded-md border border-border bg-popover px-4 py-2 shadow-sm transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:!opacity-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-value)]",
            props.className,
          )}
          style={{
            "--radix-toast-swipe-end-value": "calc(var(--radix-toast-swipe-move-value) * -1)",
          }}
          {...props}
          onMouseEnter={(event) => {
            const toastId = (event.target as HTMLDivElement).id
            if (toastId) {
              dismiss(toastId)
            }
          }}
          variants={{
            hidden: { opacity: 0, transform: "translateX(50%)" },
            visible: { opacity: 1, transform: "translateX(0%)" },
            exit: {
              opacity: 0,
              transform: "translateX(50%)",
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.2,
          }}
        />
      </AnimatePresence>
    )
  },
)
ToastRoot.displayName = "ToastRoot"

const ToastTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("mb-1 font-bold text-foreground", className)} {...props} />
  },
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm opacity-70 [&:not(first-child)]:mt-1", className)} {...props} />
  },
)
ToastDescription.displayName = "ToastDescription"

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-transparent bg-secondary px-3 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:text-destructive-foreground group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive",
          className,
        )}
        {...props}
        variants={actionVariants}
      />
    )
  },
)
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary",
          className,
        )}
        {...props}
      />
    )
  },
)
ToastClose.displayName = "ToastClose"

// Create a Toast component that combines the other components
const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
    variant?: "default" | "success" | "error" | "warning" | "info"
    duration?: number
    onClose?: () => void
  }
>(({ title, description, variant = "default", duration = 5000, onClose, className, ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-900/50 border-green-600"
      case "error":
        return "bg-red-900/50 border-red-600"
      case "warning":
        return "bg-yellow-900/50 border-yellow-600"
      case "info":
        return "bg-blue-900/50 border-blue-600"
      default:
        return "bg-gray-800 border-gray-700"
    }
  }

  return (
    <ToastRoot ref={ref} className={cn(getVariantStyles(), className)} {...props}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
        </div>
        {onClose && (
          <ToastClose onClick={onClose}>
            <X size={16} />
          </ToastClose>
        )}
      </div>
    </ToastRoot>
  )
})
Toast.displayName = "Toast"

export { useToast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastAction, ToastClose, type Toast }

