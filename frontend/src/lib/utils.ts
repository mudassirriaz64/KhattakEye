import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Rules.md §4: prices stored as integers (PKR) — formatting to "Rs. X,XXX" happens
// only at render time, via this shared utility (never stored pre-formatted).
export function formatCurrency(value: number): string {
  return `Rs. ${value.toLocaleString()}`
}
