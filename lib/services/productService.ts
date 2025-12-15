/**
 * Product Service Layer
 * Business logic separated for easy backend extraction
 */

import { prisma } from '../prisma'
import { ProductWithStock, ProductSearchResult, PaginatedResponse } from '../types'
import { NotFoundError } from '../utils/errors'
import { StockStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class ProductService {
  /**
   * Create a new product with optional stock status
   */
  async createProduct(data: {
    name: string
    barcode?: string | null
    aliases?: string[]
    sizeValue: number
    sizeUnit: string
    buyingPrice: number
    sellingPrice: number
    stockStatus?: StockStatus
  }): Promise<ProductWithStock> {
    const { stockStatus, ...productData } = data

    const product = await prisma.product.create({
      data: {
        ...productData,
        sizeValue: new Decimal(productData.sizeValue),
        buyingPrice: new Decimal(productData.buyingPrice),
        sellingPrice: new Decimal(productData.sellingPrice),
        stock: {
          create: {
            status: stockStatus || 'OK'
          }
        }
      },
      include: {
        stock: true
      }
    })

    return product
  }

  /**
   * Get product by ID with stock information
   */
  async getProductById(id: string): Promise<ProductWithStock> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { stock: true }
    })

    if (!product) {
      throw new NotFoundError('Product')
    }

    // Convert Decimal fields to numbers for client serialization
    return {
      ...product,
      sizeValue: product.sizeValue.toNumber(),
      buyingPrice: product.buyingPrice.toNumber(),
      sellingPrice: product.sellingPrice.toNumber(),
    } as unknown as ProductWithStock
  }

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode: string): Promise<ProductWithStock> {
    const product = await prisma.product.findUnique({
      where: { barcode },
      include: { stock: true }
    })

    if (!product) {
      throw new NotFoundError('Product')
    }

    // Convert Decimal fields to numbers for client serialization
    return {
      ...product,
      sizeValue: product.sizeValue.toNumber(),
      buyingPrice: product.buyingPrice.toNumber(),
      sellingPrice: product.sellingPrice.toNumber(),
    } as unknown as ProductWithStock
  }

  /**
   * Get all products with pagination and optional filtering
   */
  async getAllProducts(params: {
    page?: number
    limit?: number
    stockStatus?: StockStatus
  }): Promise<PaginatedResponse<ProductWithStock>> {
    const { page = 1, limit = 20, stockStatus } = params
    const skip = (page - 1) * limit

    const where = stockStatus
      ? { stock: { status: stockStatus } }
      : {}

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { stock: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Convert Decimal fields to numbers for client serialization
    const serializedProducts = products.map(p => ({
      ...p,
      sizeValue: p.sizeValue.toNumber(),
      buyingPrice: p.buyingPrice.toNumber(),
      sellingPrice: p.sellingPrice.toNumber(),
    }))

    return {
      data: serializedProducts as unknown as ProductWithStock[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Search products (returns all for client-side Fuse.js)
   */
  async searchProducts(): Promise<ProductSearchResult[]> {
    const products = await prisma.product.findMany({
      include: { stock: true },
      orderBy: { name: 'asc' }
    })

    return products.map(p => ({
      id: p.id,
      name: p.name,
      barcode: p.barcode,
      sizeValue: p.sizeValue.toNumber(),
      sizeUnit: p.sizeUnit,
      buyingPrice: p.buyingPrice.toNumber(),
      sellingPrice: p.sellingPrice.toNumber(),
      margin: this.calculateMargin(p.buyingPrice.toNumber(), p.sellingPrice.toNumber()),
      stockStatus: p.stock?.status || null
    }))
  }

  /**
   * Update product
   */
  async updateProduct(
    id: string,
    data: Partial<{
      name: string
      barcode: string | null
      aliases: string[]
      sizeValue: number
      sizeUnit: string
      buyingPrice: number
      sellingPrice: number
    }>
  ): Promise<ProductWithStock> {
    // Check if product exists
    await this.getProductById(id)

    // Convert numeric fields to Decimal
    const updateData: Record<string, unknown> = { ...data }
    if (data.sizeValue !== undefined) {
      updateData.sizeValue = new Decimal(data.sizeValue)
    }
    if (data.buyingPrice !== undefined) {
      updateData.buyingPrice = new Decimal(data.buyingPrice)
    }
    if (data.sellingPrice !== undefined) {
      updateData.sellingPrice = new Decimal(data.sellingPrice)
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { stock: true }
    })

    return product
  }

  /**
   * Delete product (cascades to stock)
   */
  async deleteProduct(id: string): Promise<void> {
    await this.getProductById(id) // Check exists
    await prisma.product.delete({ where: { id } })
  }

  /**
   * Calculate profit margin percentage
   */
  private calculateMargin(buyingPrice: number, sellingPrice: number): number {
    if (buyingPrice === 0) return 0
    return ((sellingPrice - buyingPrice) / buyingPrice) * 100
  }
}
