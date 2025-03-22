export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export function formatApiError(error: any): ApiError {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    const { status, data } = error.response

    return {
      status,
      message: data.message || "An error occurred while processing your request",
      errors: data.errors,
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: "No response received from server. Please check your internet connection.",
    }
  } else {
    // Something else happened while setting up the request
    return {
      status: 500,
      message: error.message || "An unexpected error occurred",
    }
  }
}

export function handleFormErrors(
  apiError: ApiError,
  setErrors: (errors: Record<string, string>) => void,
  setGeneralError: (error: string) => void,
): void {
  if (apiError.errors) {
    // Extract the first error message from each field
    const formErrors: Record<string, string> = {}

    for (const [field, errorMessages] of Object.entries(apiError.errors)) {
      if (errorMessages && errorMessages.length > 0) {
        formErrors[field] = errorMessages[0]
      }
    }

    setErrors(formErrors)
  } else {
    // If no specific field errors, set a general error
    setGeneralError(apiError.message)
  }
}

export function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return "The request was invalid. Please check your input and try again."
    case 401:
      return "You must be logged in to perform this action."
    case 403:
      return "You do not have permission to perform this action."
    case 404:
      return "The requested resource was not found."
    case 409:
      return "A conflict occurred. The resource might have been modified."
    case 422:
      return "Validation failed. Please check your input."
    case 429:
      return "Too many requests. Please try again later."
    case 500:
      return "An internal server error occurred. Please try again later."
    case 503:
      return "Service unavailable. Please try again later."
    default:
      return "An unexpected error occurred. Please try again."
  }
}

