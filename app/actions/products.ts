'use server'

/**
 * Product Server Actions
 * Next.js Server Actions wrapping ProductService
 */

import { ProductService } from '@/lib/services/productService'
import { 
  productInputSchema, 
  productUpdateSchema, 
  productIdSchema,
  barcodeSchema,
  paginationSchema
} from '@/lib/validations'
import { handleError, successResponse } from '@/lib/utils/errors'
import { ApiResponse, ProductWithStock, ProductSearchResult, PaginatedResponse } from '@/lib/types'
import { StockStatus } from '@prisma/client'

const productService = new ProductService()

/**
 * Create a new product
 */
export async function addProduct(
  input: unknown
): Promise<ApiResponse<ProductWithStock>> {
  try {
    const validated = productInputSchema.parse(input)
    const product = await productService.createProduct(validated)
    return successResponse(product, 'Product created successfully')
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Get product by ID
 */
export async function getProductById(
  input: unknown
): Promise<ApiResponse<ProductWithStock>> {
  try {
    const { id } = productIdSchema.parse(input)
    const product = await productService.getProductById(id)
    return successResponse(product)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Get product by barcode
 */
export async function getProductByBarcode(
  input: unknown
): Promise<ApiResponse<ProductWithStock>> {
  try {
    const { barcode } = barcodeSchema.parse(input)
    const product = await productService.getProductByBarcode(barcode)
    return successResponse(product)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Get all products with pagination
 */
export async function getAllProducts(
  params?: { page?: number; limit?: number; stockStatus?: StockStatus }
): Promise<ApiResponse<PaginatedResponse<ProductWithStock>>> {
  try {
    const { page, limit } = paginationSchema.parse(params || {})
    const result = await productService.getAllProducts({
      page,
      limit,
      stockStatus: params?.stockStatus
    })
    return successResponse(result)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Search products (for Fuse.js client-side search)
 */
export async function searchProducts(): Promise<ApiResponse<ProductSearchResult[]>> {
  try {
    const products = await productService.searchProducts()
    return successResponse(products)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Update product
 */
export async function updateProduct(
  input: unknown
): Promise<ApiResponse<ProductWithStock>> {
  try {
    const validated = productUpdateSchema.parse(input)
    const { id, stockStatus, ...updateData } = validated
    
    const product = await productService.updateProduct(id, updateData)
    
    // Update stock status if provided
    if (stockStatus && product.stock) {
      const { StockService } = await import('@/lib/services/stockService')
      const stockService = new StockService()
      await stockService.updateStockStatus(product.id, stockStatus)
    }
    
    return successResponse(product, 'Product updated successfully')
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Delete product
 */
export async function deleteProduct(
  input: unknown
): Promise<ApiResponse<{ id: string }>> {
  try {
    const { id } = productIdSchema.parse(input)
    await productService.deleteProduct(id)
    return successResponse({ id }, 'Product deleted successfully')
  } catch (error) {
    return handleError(error)
  }
}
