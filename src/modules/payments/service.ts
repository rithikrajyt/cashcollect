import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/db/store';
import type { Payment, PaymentAllocation, Invoice } from '@/lib/db/types';
import { createAuditEvent } from '@/modules/audit/service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RecordPaymentInput {
  customer_id: string;
  invoice_id: string;
  payment_date: string; // YYYY-MM-DD
  amount_paise: number;
  method?: string;
  reference?: string;
  notes?: string;
}

export interface RecordPaymentResult {
  payment: Payment;
  allocation: PaymentAllocation;
  invoice_updated: Invoice;
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
}

const VALID_METHODS = new Set([
  'bank_transfer',
  'cash',
  'cheque',
  'upi',
  'other',
]);

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export function recordPayment(
  orgId: string,
  data: RecordPaymentInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: RecordPaymentResult } | { success: false; error: string } {
  // 1. Validate customer
  const customer = store.customers.get(data.customer_id);
  if (!customer || customer.organization_id !== orgId) {
    return { success: false, error: 'Customer not found in this organization' };
  }
  if (customer.status !== 'active') {
    return { success: false, error: 'Customer is inactive' };
  }

  // 2. Validate invoice
  const invoice = store.invoices.get(data.invoice_id);
  if (!invoice || invoice.organization_id !== orgId) {
    return { success: false, error: 'Invoice not found in this organization' };
  }
  if (invoice.customer_id !== data.customer_id) {
    return { success: false, error: 'Invoice does not belong to the specified customer' };
  }

  // 3. Validate invoice status
  if (invoice.status !== 'issued' && invoice.status !== 'partially_paid') {
    return {
      success: false,
      error: `Cannot record payment against a ${invoice.status} invoice. Only issued or partially paid invoices are eligible.`,
    };
  }

  // 4. Validate amount
  if (
    !Number.isInteger(data.amount_paise) ||
    data.amount_paise <= 0
  ) {
    return { success: false, error: 'amount_paise must be a positive integer' };
  }

  // 5. Check outstanding
  const outstanding = invoice.total_paise - invoice.paid_paise;
  if (data.amount_paise > outstanding) {
    return {
      success: false,
      error: `Payment of ${data.amount_paise} paise exceeds outstanding balance of ${outstanding} paise. Maximum allowed: ${outstanding} paise.`,
    };
  }

  // 6. Validate date
  if (!isValidDate(data.payment_date)) {
    return { success: false, error: 'Invalid payment_date format (YYYY-MM-DD)' };
  }

  // 7. Validate method
  const method = data.method ?? 'bank_transfer';
  if (!VALID_METHODS.has(method)) {
    return { success: false, error: `Invalid payment method. Use one of: ${[...VALID_METHODS].join(', ')}` };
  }

  const now = new Date().toISOString();

  // 8. Create payment record
  const payment: Payment = {
    id: uuidv4(),
    organization_id: orgId,
    customer_id: data.customer_id,
    payment_date: data.payment_date,
    amount_paise: data.amount_paise,
    currency: 'INR',
    method,
    reference: data.reference?.trim() || null,
    notes: data.notes?.trim() || null,
    status: 'confirmed',
    created_at: now,
    updated_at: now,
  };
  store.payments.set(payment.id, payment);

  // 9. Create allocation
  const allocation: PaymentAllocation = {
    id: uuidv4(),
    organization_id: orgId,
    payment_id: payment.id,
    invoice_id: data.invoice_id,
    amount_paise: data.amount_paise,
    created_at: now,
  };
  store.paymentAllocations.set(allocation.id, allocation);

  // 10. Update invoice
  const beforeInvoice = { ...invoice };
  invoice.paid_paise += data.amount_paise;
  if (invoice.paid_paise >= invoice.total_paise) {
    invoice.status = 'paid';
  } else {
    invoice.status = 'partially_paid';
  }
  invoice.updated_at = now;
  store.invoices.set(invoice.id, invoice);

  // 11. Audit event
  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'payment.recorded',
    entity_type: 'payment',
    entity_id: payment.id,
    before_data: { invoice: beforeInvoice },
    after_data: { payment, allocation, invoice: { ...invoice } },
  });

  // 12. Return result
  return {
    success: true,
    data: {
      payment: { ...payment },
      allocation: { ...allocation },
      invoice_updated: { ...invoice },
    },
  };
}

export function listPayments(
  orgId: string,
  customerId?: string,
  limit?: number
): Payment[] {
  const max = Math.min(Math.max(limit ?? 50, 1), 100);
  const results: Payment[] = [];
  for (const p of store.payments.values()) {
    if (p.organization_id !== orgId) continue;
    if (customerId && p.customer_id !== customerId) continue;
    results.push({ ...p });
    if (results.length >= max) break;
  }
  return results.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getPaymentAllocationsForInvoice(
  orgId: string,
  invoiceId: string
): Array<PaymentAllocation & { payment_date: string; method: string; reference: string | null }> {
  const allocations = store.getPaymentAllocations(orgId, { invoice_id: invoiceId });
  return allocations.map((a) => {
    const payment = store.payments.get(a.payment_id);
    return {
      ...a,
      payment_date: payment?.payment_date ?? '',
      method: payment?.method ?? 'unknown',
      reference: payment?.reference ?? null,
    };
  });
}
