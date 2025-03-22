interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  isEmail?: boolean
  isNumeric?: boolean
  min?: number
  max?: number
  custom?: (value: any) => boolean
}

interface ValidationErrors {
  [key: string]: string
}

export function validateField(name: string, value: any, rules: ValidationRules, customMessage?: string): string | null {
  // Required check
  if (rules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
    return customMessage || `${name} is required`
  }

  // For non-required fields that are empty
  if (!rules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
    return null
  }

  // String checks
  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      return customMessage || `${name} must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return customMessage || `${name} must be no more than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return customMessage || `${name} format is invalid`
    }

    if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return customMessage || `${name} must be a valid email address`
    }

    if (rules.isNumeric && !/^\d+$/.test(value)) {
      return customMessage || `${name} must be a number`
    }
  }

  // Numeric checks
  if (typeof value === "number" || (rules.isNumeric && !isNaN(Number(value)))) {
    const numValue = typeof value === "number" ? value : Number(value)

    if (rules.min !== undefined && numValue < rules.min) {
      return customMessage || `${name} must be at least ${rules.min}`
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return customMessage || `${name} must be no more than ${rules.max}`
    }
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return customMessage || `${name} is invalid`
  }

  return null
}

export function validateForm(
  values: { [key: string]: any },
  validationRules: { [key: string]: ValidationRules },
  customMessages?: { [key: string]: string },
): ValidationErrors {
  const errors: ValidationErrors = {}

  for (const key in validationRules) {
    if (Object.prototype.hasOwnProperty.call(validationRules, key)) {
      const error = validateField(key, values[key], validationRules[key], customMessages?.[key])

      if (error) {
        errors[key] = error
      }
    }
  }

  return errors
}

