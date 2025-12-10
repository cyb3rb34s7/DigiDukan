/**
 * Database Seed Script
 * Populates database with sample Kirana products
 */

import { PrismaClient, StockStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default settings
  console.log('Creating default settings...')
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      defaultMargin: 10.0,
      language: 'hi'
    }
  })

  // Sample Kirana products
  const products = [
    // Staples
    {
      name: 'Tata Salt',
      barcode: '8901058851625',
      aliases: ['namak', 'salt', 'iodine salt'],
      sizeValue: 1,
      sizeUnit: 'kg',
      buyingPrice: 20,
      sellingPrice: 22,
      stockStatus: 'OK' as StockStatus
    },
    {
      name: 'India Gate Basmati Rice',
      barcode: '8901491101219',
      aliases: ['chawal', 'rice', 'basmati'],
      sizeValue: 5,
      sizeUnit: 'kg',
      buyingPrice: 450,
      sellingPrice: 500,
      stockStatus: 'LOW' as StockStatus
    },
    {
      name: 'Fortune Sunflower Oil',
      barcode: '8901072001014',
      aliases: ['tel', 'oil', 'cooking oil'],
      sizeValue: 1,
      sizeUnit: 'L',
      buyingPrice: 120,
      sellingPrice: 135,
      stockStatus: 'OK' as StockStatus
    },
    {
      name: 'Toor Dal (Arhar)',
      aliases: ['dal', 'arhar', 'toor', 'pulses'],
      sizeValue: 1,
      sizeUnit: 'kg',
      buyingPrice: 95,
      sellingPrice: 110,
      stockStatus: 'EMPTY' as StockStatus
    },
    {
      name: 'Aashirvaad Atta',
      barcode: '8901725130503',
      aliases: ['atta', 'flour', 'wheat flour', 'gehun'],
      sizeValue: 5,
      sizeUnit: 'kg',
      buyingPrice: 185,
      sellingPrice: 205,
      stockStatus: 'OK' as StockStatus
    },

    // Snacks & Instant Food
    {
      name: 'Maggi 2-Minute Noodles',
      barcode: '8901058840094',
      aliases: ['maggi', 'noodles', 'instant noodles'],
      sizeValue: 280,
      sizeUnit: 'g',
      buyingPrice: 48,
      sellingPrice: 52,
      stockStatus: 'LOW' as StockStatus
    },
    {
      name: 'Parle-G Biscuits',
      barcode: '8901719106088',
      aliases: ['parle', 'biscuits', 'glucose biscuits'],
      sizeValue: 1,
      sizeUnit: 'kg',
      buyingPrice: 50,
      sellingPrice: 55,
      stockStatus: 'OK' as StockStatus
    },
    {
      name: 'Haldiram Bhujia',
      barcode: '8904063209214',
      aliases: ['bhujia', 'namkeen', 'snacks'],
      sizeValue: 400,
      sizeUnit: 'g',
      buyingPrice: 80,
      sellingPrice: 90,
      stockStatus: 'OK' as StockStatus
    },

    // Dairy & Beverages
    {
      name: 'Amul Taaza Milk',
      barcode: '8901088100201',
      aliases: ['milk', 'doodh', 'amul'],
      sizeValue: 500,
      sizeUnit: 'mL',
      buyingPrice: 28,
      sellingPrice: 30,
      stockStatus: 'EMPTY' as StockStatus
    },
    {
      name: 'Red Label Tea',
      barcode: '8901030714184',
      aliases: ['chai', 'tea', 'chai patti'],
      sizeValue: 500,
      sizeUnit: 'g',
      buyingPrice: 180,
      sellingPrice: 200,
      stockStatus: 'LOW' as StockStatus
    },
    {
      name: 'Bru Instant Coffee',
      barcode: '8901063006607',
      aliases: ['coffee', 'instant coffee'],
      sizeValue: 200,
      sizeUnit: 'g',
      buyingPrice: 240,
      sellingPrice: 265,
      stockStatus: 'OK' as StockStatus
    },

    // Personal Care
    {
      name: 'Colgate Toothpaste',
      barcode: '8901012101001',
      aliases: ['toothpaste', 'dant manjan', 'colgate'],
      sizeValue: 200,
      sizeUnit: 'g',
      buyingPrice: 95,
      sellingPrice: 105,
      stockStatus: 'OK' as StockStatus
    },
    {
      name: 'Clinic Plus Shampoo',
      barcode: '8901030676109',
      aliases: ['shampoo', 'hair wash'],
      sizeValue: 180,
      sizeUnit: 'mL',
      buyingPrice: 70,
      sellingPrice: 78,
      stockStatus: 'OK' as StockStatus
    },
    {
      name: 'Lux Soap',
      barcode: '8901030612510',
      aliases: ['soap', 'sabun', 'bathing soap'],
      sizeValue: 125,
      sizeUnit: 'g',
      buyingPrice: 32,
      sellingPrice: 35,
      stockStatus: 'OK' as StockStatus
    },

    // Household
    {
      name: 'Vim Dishwash Bar',
      barcode: '8901030611100',
      aliases: ['vim', 'dishwash', 'bartan soap'],
      sizeValue: 600,
      sizeUnit: 'g',
      buyingPrice: 45,
      sellingPrice: 50,
      stockStatus: 'LOW' as StockStatus
    },
    {
      name: 'Surf Excel Detergent',
      barcode: '8901030612527',
      aliases: ['surf', 'detergent', 'kapde dhone ka powder'],
      sizeValue: 1,
      sizeUnit: 'kg',
      buyingPrice: 150,
      sellingPrice: 165,
      stockStatus: 'OK' as StockStatus
    }
  ]

  console.log(`Creating ${products.length} sample products...`)

  for (const productData of products) {
    const { stockStatus, ...productFields } = productData
    
    await prisma.product.create({
      data: {
        ...productFields,
        stock: {
          create: {
            status: stockStatus
          }
        }
      }
    })
  }

  console.log('✅ Seed completed successfully!')
  
  // Summary
  const productCount = await prisma.product.count()
  const lowStock = await prisma.stock.count({ where: { status: 'LOW' } })
  const emptyStock = await prisma.stock.count({ where: { status: 'EMPTY' } })
  
  console.log('\n📊 Database Summary:')
  console.log(`   Total Products: ${productCount}`)
  console.log(`   🟡 Low Stock: ${lowStock}`)
  console.log(`   🔴 Empty Stock: ${emptyStock}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
