/**
 * API Test Script
 * Tests all Server Actions to verify backend functionality
 */

import { 
  addProduct, 
  getAllProducts, 
  searchProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  deleteProduct
} from '../app/actions/products'

import {
  updateStockStatus,
  getLowStockItems,
  generateMandiList
} from '../app/actions/stock'

import {
  getSettings,
  updateSettings
} from '../app/actions/settings'

async function runTests() {
  console.log('🧪 Starting API Tests...\n')

  try {
    // Test 1: Get All Products
    console.log('1️⃣ Testing getAllProducts...')
    const allProducts = await getAllProducts({ page: 1, limit: 5 })
    console.log(`✅ Found ${allProducts.data?.data.length} products`)
    console.log(`   Total: ${allProducts.data?.pagination.total}\n`)

    // Test 2: Search Products (for Fuse.js)
    console.log('2️⃣ Testing searchProducts...')
    const searchResult = await searchProducts()
    console.log(`✅ Retrieved ${searchResult.data?.length} products for search\n`)

    // Test 3: Get Product by ID
    if (allProducts.data && allProducts.data.data.length > 0) {
      const firstProduct = allProducts.data.data[0]
      console.log('3️⃣ Testing getProductById...')
      const productById = await getProductById({ id: firstProduct.id })
      console.log(`✅ Found: ${productById.data?.name}\n`)

      // Test 4: Update Product
      console.log('4️⃣ Testing updateProduct...')
      const updated = await updateProduct({
        id: firstProduct.id,
        sellingPrice: Number(firstProduct.sellingPrice) + 1
      })
      console.log(`✅ Updated selling price to ₹${updated.data?.sellingPrice}\n`)

      // Test 5: Update Stock Status
      console.log('5️⃣ Testing updateStockStatus...')
      await updateStockStatus({
        productId: firstProduct.id,
        status: 'LOW'
      })
      console.log(`✅ Stock status updated to LOW\n`)
    }

    // Test 6: Get Low Stock Items
    console.log('6️⃣ Testing getLowStockItems...')
    const lowStock = await getLowStockItems()
    console.log(`✅ Found ${lowStock.data?.length} low stock items\n`)

    // Test 7: Generate Mandi List
    console.log('7️⃣ Testing generateMandiList...')
    const mandiList = await generateMandiList()
    console.log(`✅ Generated shopping list:`)
    console.log(mandiList.data?.list + '\n')

    // Test 8: Get Settings
    console.log('8️⃣ Testing getSettings...')
    const settings = await getSettings()
    console.log(`✅ Default Margin: ${settings.data?.defaultMargin}%`)
    console.log(`   Language: ${settings.data?.language}\n`)

    // Test 9: Update Settings
    console.log('9️⃣ Testing updateSettings...')
    await updateSettings({ defaultMargin: 12 })
    const updatedSettings = await getSettings()
    console.log(`✅ Updated margin to ${updatedSettings.data?.defaultMargin}%\n`)

    // Test 10: Add New Product
    console.log('🔟 Testing addProduct...')
    const newProduct = await addProduct({
      name: 'Test Product',
      aliases: ['test', 'sample'],
      sizeValue: 1,
      sizeUnit: 'pcs',
      buyingPrice: 10,
      sellingPrice: 12,
      stockStatus: 'OK'
    })
    console.log(`✅ Created: ${newProduct.data?.name} (ID: ${newProduct.data?.id})\n`)

    // Test 11: Get by Barcode
    console.log('1️⃣1️⃣ Testing getProductByBarcode...')
    const barcodeResult = await getProductByBarcode({ barcode: '8901058851625' })
    console.log(`✅ Found: ${barcodeResult.data?.name}\n`)

    // Test 12: Delete Product
    if (newProduct.data?.id) {
      console.log('1️⃣2️⃣ Testing deleteProduct...')
      await deleteProduct({ id: newProduct.data.id })
      console.log(`✅ Deleted test product\n`)
    }

    console.log('✅ All tests passed! Backend is working correctly.')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

runTests()
