import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a UUID v4 identifier.
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Generate a human-readable invoice number.
 * Format: DRAFT-YYYY-NNNN (e.g. DRAFT-2026-0001)
 */
export function generateInvoiceNumber(
  year: number,
  sequence: number
): string {
  const seq = String(sequence).padStart(4, '0');
  return `DRAFT-${year}-${seq}`;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Truncate a string with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}
