/**
 * Error Handling Utilities
 * Standardized error responses and logging
 */

import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import { ApiResponse } from '../types'

// ============================================
// Custom Error Classes
// ============================================

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
  }
}

// ============================================
// Error Handler
// ============================================

export function handleError(error: unknown): ApiResponse<never> {
  console.error('[Error]:', error)

  // Zod Validation Errors
  if (error instanceof ZodError) {
    const messages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
    return {
      success: false,
      error: 'VALIDATION_ERROR',
      message: messages.join(', ')
    }
  }

  // Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          success: false,
          error: 'DUPLICATE_ERROR',
          message: 'A record with this value already exists (duplicate barcode or name)'
        }
      case 'P2025':
        return {
          success: false,
          error: 'NOT_FOUND',
          message: 'Record not found'
        }
      case 'P2003':
        return {
          success: false,
          error: 'FOREIGN_KEY_ERROR',
          message: 'Related record not found'
        }
      default:
        return {
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Database operation failed'
        }
    }
  }

  // Custom App Errors
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.code || 'APP_ERROR',
      message: error.message
    }
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      success: false,
      error: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred'
    }
  }

  // Unknown Error
  return {
    success: false,
    error: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  }
}

// ============================================
// Success Response Helper
// ============================================

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  }
}
