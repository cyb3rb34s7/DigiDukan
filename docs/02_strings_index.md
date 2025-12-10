---
title: UI Strings Index
version: 1.0
status: complete
created: 2025-01-10
updated: 2025-01-10
---

# UI Strings Index

All visible strings in the application, organized by screen. Format: `key: "Hindi (English)"`

## Navigation

```yaml
nav.home: "होम (Home)"
nav.inventory: "माल (Maal)"
nav.add: "जोड़ें (Add)"
nav.settings: "सेटिंग्स (Settings)"
```

## Header

```yaml
header.title: "मेरी दुकान"
header.online: "Online"
header.offline: "Offline"
```

## Home/Search Page

```yaml
home.search.placeholder: "खोजें... (Search product)"
home.recent.title: "हाल ही में देखे गए (Recently Checked)"
home.results.search: "खोज परिणाम (Search Results)"
home.results.all: "सभी उत्पाद (All Products)"
home.empty: "कोई उत्पाद नहीं मिला (No products found)"
home.price.buy: "खरीद:"
```

## Inventory Page

```yaml
inventory.title: "इन्वेंटरी (Inventory)"
inventory.filter.all: "सभी"
inventory.filter.low: "कम"
inventory.filter.empty: "खाली"
inventory.mandi.title: "मंडी सूची (Mandi List)"
inventory.mandi.button: "Mandi List"
inventory.mandi.copy: "Copy"
inventory.mandi.copied: "Copied!"
inventory.mandi.header: "🛒 मंडी सूची (Mandi List)"
inventory.mandi.total: "कुल:"
inventory.mandi.items: "items"
inventory.mandi.allInStock: "सभी उत्पाद स्टॉक में हैं (All products in stock)"
inventory.mandi.needsRestock: "items need restocking"
inventory.empty.title: "No products found"
inventory.empty.all: "Add your first product to get started"
inventory.empty.filtered: "No {status} stock items"
inventory.label.buy: "खरीद"
```

## Add Product Page

```yaml
add.title: "नया उत्पाद जोड़ें (Add New Product)"
add.form.name: "उत्पाद का नाम (Product Name)"
add.form.name.placeholder: "जैसे: Tata Salt 1kg"
add.form.barcode: "बारकोड (Barcode) - Optional"
add.form.barcode.placeholder: "Scan or enter barcode"
add.form.quantity: "मात्रा (Quantity)"
add.form.unit: "इकाई (Unit)"
add.form.buyPrice: "खरीद मूल्य (Buying Price)"
add.form.sellPrice: "बिक्री मूल्य (Selling Price)"
add.form.margin: "मार्जिन (Margin)"
add.button.submit: "उत्पाद जोड़ें (Add Product)"
add.button.submitting: "Adding..."
add.success: "Product added successfully!"
add.error: "Failed to add product"
```

## Product Detail Page

```yaml
detail.loading: "Loading..."
detail.notFound: "Product not found"
detail.label.size: "Size:"
detail.label.barcode: "Barcode:"
detail.label.buyPrice: "खरीद मूल्य (Buying Price)"
detail.label.sellPrice: "बिक्री मूल्य (Selling Price)"
detail.label.margin: "लाभ (Profit Margin)"
detail.label.aliases: "खोज शब्द (Search Keywords)"
detail.stock.title: "स्टॉक स्थिति (Stock Status)"
detail.stock.ok: "ठीक है (OK)"
detail.stock.low: "कम है (Low)"
detail.stock.empty: "खाली (Empty)"
detail.button.edit: "Edit"
detail.button.back: "Back"
detail.button.delete: "Delete"
detail.success.stock: "Stock updated"
detail.error.stock: "Failed to update stock"
```

## Edit Product Page

```yaml
edit.title: "उत्पाद संपादित करें (Edit Product)"
edit.button.save: "सेव करें (Save Changes)"
edit.button.saving: "Saving..."
edit.button.cancel: "रद्द करें (Cancel)"
edit.success: "Product updated successfully!"
edit.error: "Failed to update product"
```

## Settings Page

```yaml
settings.title: "सेटिंग्स (Settings)"
settings.margin.title: "डिफ़ॉल्ट मार्जिन (Default Margin)"
settings.margin.description: "नए उत्पादों के लिए"
settings.margin.example: "Example: ₹100 → ₹{price}"
settings.language.title: "भाषा (Language)"
settings.language.hindi: "हिन्दी"
settings.language.english: "English"
settings.info.title: "ऐप जानकारी (App Info)"
settings.info.name: "DigiDukan"
settings.info.version: "Version 1.0"
settings.info.builtFor: "Built for Kirana stores"
settings.button.save: "Save"
settings.success: "Settings saved!"
```

## Units

```yaml
unit.kg: "kg"
unit.g: "g"
unit.L: "L"
unit.mL: "mL"
unit.pcs: "pcs"
unit.packet: "packet"
```

## Stock Status

```yaml
stock.ok.label: "ठीक है"
stock.ok.english: "OK"
stock.low.label: "कम है"
stock.low.english: "Low"
stock.empty.label: "खाली"
stock.empty.english: "Empty"
```

## Common/Shared

```yaml
common.currency: "₹"
common.loading: "Loading..."
common.error: "Something went wrong"
common.retry: "Try again"
common.cancel: "Cancel"
common.save: "Save"
common.delete: "Delete"
common.edit: "Edit"
common.back: "Back"
common.close: "Close"
```

## Toast Messages

```yaml
toast.success.default: "Success!"
toast.error.default: "An error occurred"
toast.info.default: "Info"
toast.warning.default: "Warning"
```

---

## i18n Implementation Notes

For Phase 1, strings will be extracted to:
- `locales/hi.json` — Hindi (primary)
- `locales/en.json` — English
- `locales/hinglish.json` — Mixed (optional)

Current implementation uses inline bilingual strings like:
```
"होम (Home)"
```

Migration will separate these into proper i18n keys.
