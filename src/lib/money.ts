/**
 * Money arithmetic utilities using integer paise.
 * All monetary amounts are stored and calculated as integer paise (1/100 INR).
 * Never use floating-point for money.
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format paise as Indian currency string (e.g. "₹85,000.00").
 */
export function paiseToCurrency(paise: number): string {
  validatePaiseAmount(paise);
  return INR_FORMATTER.format(paise / 100);
}

/**
 * Format paise as a plain number string without currency symbol.
 */
export function paiseToRupees(paise: number): string {
  validatePaiseAmount(paise);
  return (paise / 100).toFixed(2);
}

/**
 * Parse a rupee string (e.g. "85000", "85,000.50", "₹85000") to integer paise.
 * Accepts up to 2 decimal places.
 */
export function currencyToPaise(input: string): number {
  // Strip currency symbols, commas, and whitespace
  const cleaned = input.replace(/[₹,\s]/g, '').trim();

  if (!cleaned || cleaned === '') {
    throw new Error('Empty currency input');
  }

  // Validate format: optional minus, digits, optional .XX
  const match = cleaned.match(/^(-?\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new Error(
      `Invalid currency format: "${input}". Use up to 2 decimal places.`
    );
  }

  const wholePart = parseInt(match[1], 10);
  const decimalStr = (match[2] ?? '').padEnd(2, '0');
  const decimalPart = parseInt(decimalStr, 10);

  const paise = wholePart * 100 + (wholePart < 0 ? -decimalPart : decimalPart);

  validatePaiseAmount(paise);
  return paise;
}

/**
 * Add two paise amounts safely.
 */
export function addPaise(a: number, b: number): number {
  validatePaiseAmount(a);
  validatePaiseAmount(b);
  const result = a + b;
  validatePaiseAmount(result);
  return result;
}

/**
 * Validate that a paise amount is a safe, non-negative integer.
 * Throws on NaN, Infinity, negative, non-integer, or unsafe integer.
 */
export function validatePaiseAmount(paise: number): void {
  if (typeof paise !== 'number') {
    throw new Error(`Paise amount must be a number, got ${typeof paise}`);
  }
  if (!Number.isFinite(paise)) {
    throw new Error('Paise amount must be finite');
  }
  if (!Number.isInteger(paise)) {
    throw new Error(`Paise amount must be an integer, got ${paise}`);
  }
  if (paise < 0) {
    throw new Error(`Paise amount must be non-negative, got ${paise}`);
  }
  if (!Number.isSafeInteger(paise)) {
    throw new Error(`Paise amount exceeds safe integer range: ${paise}`);
  }
}

/**
 * Calculate line subtotal: quantity (in thousandths) * unit_price_paise.
 * quantity_milli is quantity * 1000 (e.g. 1 unit = 1000, 1.5 units = 1500).
 */
export function calculateLineSubtotal(
  quantityMilli: number,
  unitPricePaise: number
): number {
  if (!Number.isInteger(quantityMilli) || quantityMilli <= 0) {
    throw new Error('quantity_milli must be a positive integer');
  }
  validatePaiseAmount(unitPricePaise);
  // (quantityMilli * unitPricePaise) / 1000, rounded to nearest paise
  const result = Math.round((quantityMilli * unitPricePaise) / 1000);
  validatePaiseAmount(result);
  return result;
}

/**
 * Serialize paise to JSON-safe value (number if safe, string if large).
 */
export function paiseToJsonSafe(paise: number): number | string {
  if (Number.isSafeInteger(paise)) return paise;
  return paise.toString();
}
