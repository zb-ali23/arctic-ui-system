// Simple validation utilities

export type ValidationRule = {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'uuid' | 'date' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
};

export type ValidationSchema = Record<string, ValidationRule>;

export function validate(
  data: Record<string, unknown>,
  schema: ValidationSchema
): Record<string, string> | null {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Skip further validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Type validation
    if (rules.type) {
      const typeError = validateType(value, rules.type, field);
      if (typeError) {
        errors[field] = typeError;
        continue;
      }
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} must be at most ${rules.maxLength} characters`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `${field} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors[field] = `${field} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        errors[field] = `${field} must be at most ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateType(value: unknown, type: string, field: string): string | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') return `${field} must be a string`;
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) return `${field} must be a number`;
      break;
    case 'boolean':
      if (typeof value !== 'boolean') return `${field} must be a boolean`;
      break;
    case 'email':
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return `${field} must be a valid email`;
      }
      break;
    case 'uuid':
      if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        return `${field} must be a valid UUID`;
      }
      break;
    case 'date':
      if (typeof value !== 'string' || isNaN(Date.parse(value))) {
        return `${field} must be a valid date`;
      }
      break;
    case 'array':
      if (!Array.isArray(value)) return `${field} must be an array`;
      break;
  }
  return null;
}

// Common validation schemas
export const emailSchema: ValidationSchema = {
  email: { required: true, type: 'email' },
};

export const uuidSchema: ValidationSchema = {
  id: { required: true, type: 'uuid' },
};

export const paginationSchema: ValidationSchema = {
  page: { type: 'number', min: 1 },
  limit: { type: 'number', min: 1, max: 100 },
};
