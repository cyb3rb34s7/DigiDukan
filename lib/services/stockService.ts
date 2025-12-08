/**
 * Stock Service Layer
 * Manages inventory status (Traffic Light system)
 */

import { prisma } from '../prisma'
import { StockStatus } from '@prisma/client'
import { MandiListItem } from '../types'
import { NotFoundError } from '../utils/errors'

export class StockService {
  /**
   * Update stock status for a product
   */
  async updateStockStatus(productId: string, status: StockStatus): Promise<void> {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { stock: true }
    })

    if (!product) {
      throw new NotFoundError('Product')
    }

    if (product.stock) {
      // Update existing stock
      await prisma.stock.update({
        where: { id: product.stock.id },
        data: {
          status,
          lastChecked: new Date()
        }
      })
    } else {
      // Create stock record if missing
      await prisma.stock.create({
        data: {
          productId,
          status
        }
      })
    }
  }

  /**
   * Get all low stock items (LOW or EMPTY)
   */
  async getLowStockItems(): Promise<MandiListItem[]> {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          status: {
            in: ['LOW', 'EMPTY']
          }
        }
      },
      include: { stock: true },
      orderBy: { name: 'asc' }
    })

    return products.map(p => ({
      name: p.name,
      size: `${p.sizeValue} ${p.sizeUnit}`,
      lastBuyingPrice: p.buyingPrice.toNumber(),
      status: p.stock!.status
    }))
  }

  /**
   * Generate Mandi (Shopping) List
   * Returns formatted text for WhatsApp sharing
   */
  async generateMandiList(): Promise<string> {
    const items = await this.getLowStockItems()

    if (items.length === 0) {
      return '✅ सब कुछ स्टॉक में है! (Everything is in stock!)'
    }

    const header = '🛒 *खरीदारी की लिस्ट (Shopping List)*\n\n'
    const urgentItems = items.filter(i => i.status === 'EMPTY')
    const lowItems = items.filter(i => i.status === 'LOW')

    let list = header

    if (urgentItems.length > 0) {
      list += '🔴 *तुरंत चाहिए (Urgent):*\n'
      urgentItems.forEach((item, idx) => {
        list += `${idx + 1}. ${item.name} (${item.size}) - ₹${item.lastBuyingPrice}\n`
      })
      list += '\n'
    }

    if (lowItems.length > 0) {
      list += '🟡 *जल्दी खरीदें (Buy Soon):*\n'
      lowItems.forEach((item, idx) => {
        list += `${idx + 1}. ${item.name} (${item.size}) - ₹${item.lastBuyingPrice}\n`
      })
    }

    list += `\n📅 ${new Date().toLocaleDateString('hi-IN')}`

    return list
  }
}
