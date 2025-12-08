/**
 * Zod Validation Schemas
 * Centralized validation for all inputs
 */

import { z } from 'zod'
import { StockStatus } from '@prisma/client'

// ============================================
// Product Validation Schemas
// ============================================

export const productInputSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(200, 'Product name too long'),
  
  barcode: z.string()
    .optional()
    .nullable()
    .refine((val) => !val || val.length >= 3, {
      message: 'Barcode must be at least 3 characters'
    }),
  
  aliases: z.array(z.string())
    .optional()
    .default([]),
  
  sizeValue: z.number()
    .positive('Size value must be positive')
    .max(100000, 'Size value too large'),
  
  sizeUnit: z.enum(['kg', 'g', 'L', 'mL', 'pcs'], {
    errorMap: () => ({ message: 'Invalid unit. Use: kg, g, L, mL, pcs' })
  }),
  
  buyingPrice: z.number()
    .positive('Buying price must be positive')
    .max(1000000, 'Buying price too large'),
  
  sellingPrice: z.number()
    .positive('Selling price must be positive')
    .max(1000000, 'Selling price too large'),
  
  stockStatus: z.nativeEnum(StockStatus).optional().default('OK')
})

export const productUpdateSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
  name: z.string().min(1).max(200).optional(),
  barcode: z.string().nullable().optional(),
  aliases: z.array(z.string()).optional(),
  sizeValue: z.number().positive().optional(),
  sizeUnit: z.enum(['kg', 'g', 'L', 'mL', 'pcs']).optional(),
  buyingPrice: z.number().positive().optional(),
  sellingPrice: z.number().positive().optional(),
  stockStatus: z.nativeEnum(StockStatus).optional()
})

export const productIdSchema = z.object({
  id: z.string().uuid('Invalid product ID')
})

export const barcodeSchema = z.object({
  barcode: z.string().min(3, 'Barcode must be at least 3 characters')
})

// ============================================
// Stock Validation Schemas
// ============================================

export const stockUpdateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  status: z.nativeEnum(StockStatus, {
    errorMap: () => ({ message: 'Invalid status. Use: OK, LOW, or EMPTY' })
  })
})

// ============================================
// Settings Validation Schemas
// ============================================

export const settingsUpdateSchema = z.object({
  defaultMargin: z.number()
    .min(0, 'Margin cannot be negative')
    .max(100, 'Margin cannot exceed 100%')
    .optional(),
  
  language: z.enum(['hi', 'en'], {
    message: 'Invalid language. Use: hi or en'
  }).optional()
})

// ============================================
// Pagination Validation
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20)
})

// ============================================
// Type Inference
// ============================================

export type ProductInputSchema = z.infer<typeof productInputSchema>
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>
export type StockUpdateSchema = z.infer<typeof stockUpdateSchema>
export type SettingsUpdateSchema = z.infer<typeof settingsUpdateSchema>
export type PaginationSchema = z.infer<typeof paginationSchema>
