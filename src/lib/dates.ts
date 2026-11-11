/**
 * Date utilities for CashCollect.
 * Business dates use Asia/Kolkata timezone.
 * Timestamps are stored in UTC.
 */

import { format, differenceInDays, parseISO } from 'date-fns';

const INDIA_TZ = 'Asia/Kolkata';

/**
 * Format a date as Indian-style string: "10 Nov 2026"
 */
export function formatIndianDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy');
}

/**
 * Format a date with time: "10 Nov 2026, 14:30"
 */
export function formatIndianDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM yyyy, HH:mm');
}

/**
 * Format date as ISO date string (YYYY-MM-DD).
 */
export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export type AgeingBucket =
  | 'not_yet_due'
  | '1_30_days'
  | '31_60_days'
  | '61_90_days'
  | '91_plus_days';

export const AGEING_BUCKET_LABELS: Record<AgeingBucket, string> = {
  not_yet_due: 'Not Yet Due',
  '1_30_days': '1-30 Days',
  '31_60_days': '31-60 Days',
  '61_90_days': '61-90 Days',
  '91_plus_days': '91+ Days',
};

/**
 * Calculate the ageing bucket for an invoice given its due date and the report date.
 */
export function calculateAgeingBucket(
  dueDate: Date | string,
  asOfDate: Date | string
): AgeingBucket {
  const days = calculateDaysOverdue(dueDate, asOfDate);
  if (days <= 0) return 'not_yet_due';
  if (days <= 30) return '1_30_days';
  if (days <= 60) return '31_60_days';
  if (days <= 90) return '61_90_days';
  return '91_plus_days';
}

/**
 * Calculate days overdue. Returns 0 if not yet due, positive number if overdue.
 */
export function calculateDaysOverdue(
  dueDate: Date | string,
  asOfDate: Date | string
): number {
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const asOf = typeof asOfDate === 'string' ? parseISO(asOfDate) : asOfDate;
  const days = differenceInDays(asOf, due);
  return Math.max(0, days);
}

/**
 * Calculate a reminder date from an invoice due date and an offset in days.
 * Negative offset = before due date, positive = after.
 */
export function calculateReminderDate(
  dueDate: Date | string,
  offsetDays: number
): Date {
  const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  const result = new Date(d);
  result.setDate(result.getDate() + offsetDays);
  return result;
}

/**
 * Get the current date in Asia/Kolkata timezone as a YYYY-MM-DD string.
 */
export function todayIndia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: INDIA_TZ });
}
