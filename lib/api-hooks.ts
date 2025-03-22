"use client"

import { useState, useCallback } from "react"
import { formatApiError, type ApiError } from "@/lib/error-utils"
import { useToast } from "@/components/toast-provider"

interface UseApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useApi<T, P extends any[]>(apiFunction: (...args: P) => Promise<T>, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const { showToast } = useToast()

  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = "Operation completed successfully",
  } = options

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await apiFunction(...args)

        setData(result)

        if (showSuccessToast) {
          showToast({
            title: successMessage,
            variant: "success",
          })
        }

        return result
      } catch (err) {
        const formattedError = formatApiError(err)
        setError(formattedError)

        if (showErrorToast) {
          showToast({
            title: "Error",
            description: formattedError.message,
            variant: "error",
          })
        }

        return null
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction, showSuccessToast, showErrorToast, successMessage, showToast],
  )

  return { execute, data, isLoading, error, setData }
}

