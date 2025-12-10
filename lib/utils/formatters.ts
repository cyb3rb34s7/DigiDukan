/**
 * Formatting Utilities
 * Currency, numbers, dates for Indian context
 */

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return "₹0";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format number with Indian numbering system
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Calculate margin percentage
 */
export function calculateMargin(buying: number, selling: number): number {
  if (buying === 0) return 0;
  return ((selling - buying) / buying) * 100;
}

/**
 * Calculate selling price from buying price and margin %
 */
export function calculateSellingPrice(buying: number, marginPercent: number): number {
  return buying + (buying * marginPercent) / 100;
}

/**
 * Format date in DD/MM/YYYY format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "अभी (Just now)";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} मिनट पहले`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} घंटे पहले`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} दिन पहले`;
  
  return formatDate(d);
}

/**
 * Format product size with unit
 */
export function formatSize(value: number, unit: string): string {
  return `${value} ${unit}`;
}

/**
 * Parse decimal input (handles both . and ,)
 */
export function parseDecimal(value: string): number {
  return parseFloat(value.replace(",", "."));
}
