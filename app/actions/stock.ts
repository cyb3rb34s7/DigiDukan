'use server'

/**
 * Stock Server Actions
 * Inventory management (Traffic Light system)
 */

import { StockService } from '@/lib/services/stockService'
import { stockUpdateSchema } from '@/lib/validations'
import { handleError, successResponse } from '@/lib/utils/errors'
import { ApiResponse, MandiListItem } from '@/lib/types'

const stockService = new StockService()

/**
 * Update stock status for a product
 */
export async function updateStockStatus(
  input: unknown
): Promise<ApiResponse<{ message: string }>> {
  try {
    const { productId, status } = stockUpdateSchema.parse(input)
    await stockService.updateStockStatus(productId, status)
    return successResponse(
      { message: `Stock status updated to ${status}` },
      'Stock updated successfully'
    )
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Get all low stock items (LOW or EMPTY)
 */
export async function getLowStockItems(): Promise<ApiResponse<MandiListItem[]>> {
  try {
    const items = await stockService.getLowStockItems()
    return successResponse(items)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Generate Mandi (Shopping) List
 * Returns formatted text for WhatsApp sharing
 */
export async function generateMandiList(): Promise<ApiResponse<{ list: string }>> {
  try {
    const list = await stockService.generateMandiList()
    return successResponse({ list })
  } catch (error) {
    return handleError(error)
  }
}
