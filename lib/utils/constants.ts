/**
 * App Constants
 * Units, brands, and other fixed data
 */

export const UNITS = [
  { value: "kg", label: "Kg", labelHi: "किलो" },
  { value: "g", label: "g", labelHi: "ग्राम" },
  { value: "L", label: "L", labelHi: "लीटर" },
  { value: "mL", label: "mL", labelHi: "मि.ली" },
  { value: "pcs", label: "Pcs", labelHi: "पीस" },
] as const;

export const POPULAR_BRANDS = [
  "Tata",
  "Amul",
  "Parle",
  "Britannia",
  "ITC",
  "Nestle",
  "Dabur",
  "Patanjali",
  "Haldiram",
  "MDH",
  "Everest",
  "Maggi",
  "Vim",
  "Surf Excel",
  "Colgate",
  "Dettol",
  "Clinic Plus",
  "Fair & Lovely",
  "Lux",
  "Lifebuoy",
] as const;

export const STOCK_STATUS = {
  OK: {
    label: "भरा (Full)",
    color: "emerald",
    icon: "🟢",
  },
  LOW: {
    label: "कम (Low)",
    color: "amber",
    icon: "🟡",
  },
  EMPTY: {
    label: "खत्म (Empty)",
    color: "rose",
    icon: "🔴",
  },
} as const;

export const LANGUAGES = [
  { value: "hi", label: "हिंदी" },
  { value: "en", label: "English" },
] as const;

export const DEFAULT_MARGIN = 10;
export const MAX_RECENT_ITEMS = 10;
export const SEARCH_DEBOUNCE_MS = 300;
export const TOAST_DURATION_MS = 2000;
