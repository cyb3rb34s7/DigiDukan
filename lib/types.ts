/**
 * Shared TypeScript Types & Interfaces
 * Extracted for easy backend separation later
 */

import { Product, Stock, StockStatus, Settings } from '@prisma/client'

// ============================================
// Product Types
// ============================================

export type ProductWithStock = Product & {
  stock: Stock | null
}

export type ProductSearchResult = {
  id: string
  name: string
  barcode: string | null
  sizeValue: number
  sizeUnit: string
  buyingPrice: number
  sellingPrice: number
  margin: number // Calculated: ((sellingPrice - buyingPrice) / buyingPrice) * 100
  stockStatus: StockStatus | null
}

export type ProductInput = {
  name: string
  barcode?: string | null
  aliases?: string[]
  sizeValue: number
  sizeUnit: string
  buyingPrice: number
  sellingPrice: number
  stockStatus?: StockStatus
}

export type ProductUpdateInput = Partial<ProductInput> & {
  id: string
}

// ============================================
// Stock Types
// ============================================

export type StockUpdateInput = {
  productId: string
  status: StockStatus
}

export type MandiListItem = {
  name: string
  size: string // e.g., "1 kg", "500 g"
  lastBuyingPrice: number
  status: StockStatus
}

// ============================================
// Settings Types
// ============================================

export type SettingsInput = {
  defaultMargin?: number
  language?: string
}

// ============================================
// API Response Types
// ============================================

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginationParams = {
  page?: number
  limit?: number
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// Re-export Prisma types
// ============================================

export { StockStatus, type Product, type Stock, type Settings }
