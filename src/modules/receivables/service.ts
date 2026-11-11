import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/db/store';
import type { Invoice, InvoiceLine } from '@/lib/db/types';
import { createAuditEvent } from '@/modules/audit/service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LineInput {
  description: string;
  quantity: number;
  unit_price_paise: number;
  tax_amount_paise?: number;
}

export interface CreateInvoiceDraftInput {
  customer_id: string;
  invoice_date: string; // YYYY-MM-DD
  due_date: string;     // YYYY-MM-DD
  currency?: string;
  notes?: string;
  lines: LineInput[];
}

export interface UpdateInvoiceDraftInput {
  due_date?: string;
  notes?: string;
  lines?: LineInput[];
}

export interface InvoiceWithLines extends Invoice {
  lines: InvoiceLine[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Auto-incrementing draft counter per org (in-memory only). */
const draftCounters = new Map<string, number>();

function nextDraftNumber(orgId: string): string {
  // Scan existing invoices to find the highest number
  let max = draftCounters.get(orgId) ?? 0;
  for (const inv of store.invoices.values()) {
    if (inv.organization_id !== orgId) continue;
    const match = inv.invoice_number.match(/DRAFT-\d{4}-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  max += 1;
  draftCounters.set(orgId, max);
  const year = new Date().getFullYear();
  return `DRAFT-${year}-${String(max).padStart(4, '0')}`;
}

function computeLines(
  orgId: string,
  invoiceId: string,
  inputs: LineInput[]
): { lines: InvoiceLine[]; subtotal_paise: number; tax_total_paise: number; total_paise: number } {
  let subtotal = 0;
  let taxTotal = 0;
  const lines: InvoiceLine[] = inputs.map((li, idx) => {
    const lineSubtotal = Math.round(li.quantity * li.unit_price_paise);
    const lineTax = li.tax_amount_paise ?? 0;
    subtotal += lineSubtotal;
    taxTotal += lineTax;
    return {
      id: uuidv4(),
      organization_id: orgId,
      invoice_id: invoiceId,
      description: li.description.trim(),
      quantity: li.quantity,
      unit_price_paise: li.unit_price_paise,
      line_subtotal_paise: lineSubtotal,
      tax_amount_paise: lineTax,
      sort_order: idx,
    };
  });
  return { lines, subtotal_paise: subtotal, tax_total_paise: taxTotal, total_paise: subtotal + taxTotal };
}

function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export function createInvoiceDraft(
  orgId: string,
  data: CreateInvoiceDraftInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: InvoiceWithLines } | { success: false; error: string } {
  // Validate customer
  const customer = store.customers.get(data.customer_id);
  if (!customer || customer.organization_id !== orgId) {
    return { success: false, error: 'Customer not found in this organization' };
  }
  if (customer.status !== 'active') {
    return { success: false, error: 'Customer is inactive' };
  }

  // Validate dates
  if (!isValidDate(data.invoice_date)) {
    return { success: false, error: 'Invalid invoice_date format (YYYY-MM-DD)' };
  }
  if (!isValidDate(data.due_date)) {
    return { success: false, error: 'Invalid due_date format (YYYY-MM-DD)' };
  }
  if (data.due_date < data.invoice_date) {
    return { success: false, error: 'due_date must be on or after invoice_date' };
  }

  // Validate lines
  if (!data.lines || data.lines.length === 0) {
    return { success: false, error: 'At least one line item is required' };
  }
  if (data.lines.length > 50) {
    return { success: false, error: 'Maximum 50 line items allowed' };
  }
  for (const li of data.lines) {
    if (!li.description?.trim()) {
      return { success: false, error: 'Line description is required' };
    }
    if (typeof li.quantity !== 'number' || li.quantity <= 0) {
      return { success: false, error: 'Line quantity must be a positive number' };
    }
    if (!Number.isInteger(li.unit_price_paise) || li.unit_price_paise < 0) {
      return { success: false, error: 'unit_price_paise must be a non-negative integer' };
    }
    if (li.tax_amount_paise !== undefined && (!Number.isInteger(li.tax_amount_paise) || li.tax_amount_paise < 0)) {
      return { success: false, error: 'tax_amount_paise must be a non-negative integer' };
    }
  }

  const invoiceId = uuidv4();
  const { lines, subtotal_paise, tax_total_paise, total_paise } = computeLines(orgId, invoiceId, data.lines);

  const now = new Date().toISOString();
  const invoice: Invoice = {
    id: invoiceId,
    organization_id: orgId,
    customer_id: data.customer_id,
    invoice_number: nextDraftNumber(orgId),
    invoice_date: data.invoice_date,
    due_date: data.due_date,
    currency: data.currency ?? 'INR',
    subtotal_paise,
    tax_total_paise,
    total_paise,
    paid_paise: 0,
    status: 'draft',
    notes: data.notes?.trim() || null,
    created_by: actorId ?? null,
    created_at: now,
    updated_at: now,
  };

  store.invoices.set(invoice.id, invoice);
  for (const line of lines) {
    store.invoiceLines.set(line.id, line);
  }

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'invoice.draft_created',
    entity_type: 'invoice',
    entity_id: invoice.id,
    after_data: { ...invoice, lines },
  });

  return { success: true, data: { ...invoice, lines: lines.map((l) => ({ ...l })) } };
}

export function listInvoices(
  orgId: string,
  filters: {
    status?: string;
    customer_id?: string;
    overdue_only?: boolean;
    limit?: number;
  } = {}
): Invoice[] {
  const max = Math.min(Math.max(filters.limit ?? 20, 1), 50);
  const today = new Date().toISOString().slice(0, 10);

  let results = Array.from(store.invoices.values()).filter(
    (inv) => inv.organization_id === orgId
  );

  if (filters.status && filters.status !== 'all') {
    results = results.filter((inv) => inv.status === filters.status);
  }

  if (filters.customer_id) {
    results = results.filter((inv) => inv.customer_id === filters.customer_id);
  }

  if (filters.overdue_only) {
    results = results.filter(
      (inv) =>
        (inv.status === 'issued' || inv.status === 'partially_paid') &&
        inv.due_date < today &&
        inv.paid_paise < inv.total_paise
    );
  }

  results.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return results.slice(0, max).map((inv) => ({ ...inv }));
}

export function getInvoice(
  orgId: string,
  invoiceId: string
): InvoiceWithLines | null {
  const inv = store.invoices.get(invoiceId);
  if (!inv || inv.organization_id !== orgId) return null;

  const lines = Array.from(store.invoiceLines.values())
    .filter((l) => l.invoice_id === invoiceId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((l) => ({ ...l }));

  return { ...inv, lines };
}

export function getInvoiceWithRelations(
  orgId: string,
  invoiceId: string
): {
  invoice: Invoice;
  lines: InvoiceLine[];
  customer: { id: string; display_name: string; email: string | null; gstin: string | null; phone: string | null; billing_address: Record<string, string> } | null;
  collection_plans: Array<{
    id: string;
    name: string;
    channel: string;
    status: string;
    events: Array<{
      id: string;
      scheduled_at: string;
      event_type: string;
      status: string;
      subject: string | null;
      body: string | null;
    }>;
  }>;
} | null {
  const inv = store.invoices.get(invoiceId);
  if (!inv || inv.organization_id !== orgId) return null;

  const lines = Array.from(store.invoiceLines.values())
    .filter((l) => l.invoice_id === invoiceId)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((l) => ({ ...l }));

  const cust = store.customers.get(inv.customer_id);
  const customer = cust
    ? { id: cust.id, display_name: cust.display_name, email: cust.email, gstin: cust.gstin, phone: cust.phone, billing_address: cust.billing_address }
    : null;

  const plans = Array.from(store.collectionPlans.values())
    .filter((p) => p.invoice_id === invoiceId && p.organization_id === orgId)
    .map((p) => {
      const events = Array.from(store.collectionEvents.values())
        .filter((e) => e.collection_plan_id === p.id)
        .sort(
          (a, b) =>
            new Date(a.scheduled_at).getTime() -
            new Date(b.scheduled_at).getTime()
        )
        .map((e) => ({
          id: e.id,
          scheduled_at: e.scheduled_at,
          event_type: e.event_type,
          status: e.status,
          subject: e.subject,
          body: e.body,
        }));
      return {
        id: p.id,
        name: p.name,
        channel: p.channel,
        status: p.status,
        events,
      };
    });

  return { invoice: { ...inv }, lines, customer, collection_plans: plans };
}

export function updateInvoiceDraft(
  orgId: string,
  invoiceId: string,
  data: UpdateInvoiceDraftInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: InvoiceWithLines } | { success: false; error: string } {
  const existing = store.invoices.get(invoiceId);
  if (!existing || existing.organization_id !== orgId) {
    return { success: false, error: 'Invoice not found' };
  }
  if (existing.status !== 'draft') {
    return { success: false, error: 'Only draft invoices can be edited' };
  }

  const before = { ...existing };

  // Update simple fields
  if (data.due_date !== undefined) {
    if (!isValidDate(data.due_date)) {
      return { success: false, error: 'Invalid due_date format (YYYY-MM-DD)' };
    }
    if (data.due_date < existing.invoice_date) {
      return { success: false, error: 'due_date must be on or after invoice_date' };
    }
    existing.due_date = data.due_date;
  }
  if (data.notes !== undefined) {
    existing.notes = data.notes?.trim() || null;
  }

  // Update lines if provided
  let newLines: InvoiceLine[] | undefined;
  if (data.lines) {
    if (data.lines.length === 0) {
      return { success: false, error: 'At least one line item is required' };
    }
    if (data.lines.length > 50) {
      return { success: false, error: 'Maximum 50 line items allowed' };
    }
    for (const li of data.lines) {
      if (!li.description?.trim()) {
        return { success: false, error: 'Line description is required' };
      }
      if (typeof li.quantity !== 'number' || li.quantity <= 0) {
        return { success: false, error: 'Line quantity must be a positive number' };
      }
      if (!Number.isInteger(li.unit_price_paise) || li.unit_price_paise < 0) {
        return { success: false, error: 'unit_price_paise must be a non-negative integer' };
      }
    }

    // Remove old lines
    for (const [id, line] of store.invoiceLines) {
      if (line.invoice_id === invoiceId) {
        store.invoiceLines.delete(id);
      }
    }

    const computed = computeLines(orgId, invoiceId, data.lines);
    newLines = computed.lines;
    existing.subtotal_paise = computed.subtotal_paise;
    existing.tax_total_paise = computed.tax_total_paise;
    existing.total_paise = computed.total_paise;

    for (const line of newLines) {
      store.invoiceLines.set(line.id, line);
    }
  }

  existing.updated_at = new Date().toISOString();
  store.invoices.set(invoiceId, existing);

  const currentLines =
    newLines ??
    Array.from(store.invoiceLines.values())
      .filter((l) => l.invoice_id === invoiceId)
      .sort((a, b) => a.sort_order - b.sort_order);

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'invoice.draft_updated',
    entity_type: 'invoice',
    entity_id: invoiceId,
    before_data: before,
    after_data: { ...existing },
  });

  return {
    success: true,
    data: { ...existing, lines: currentLines.map((l) => ({ ...l })) },
  };
}

// ---------------------------------------------------------------------------
// Issue invoice (draft → issued)
// ---------------------------------------------------------------------------

/** Counter for issued invoice numbers, lazily initialised. */
const issuedCounters = new Map<string, number>();

function nextIssuedNumber(orgId: string): string {
  let max = issuedCounters.get(orgId) ?? 0;
  for (const inv of store.invoices.values()) {
    if (inv.organization_id !== orgId) continue;
    const match = inv.invoice_number.match(/^INV-\d{4}-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }
  max += 1;
  issuedCounters.set(orgId, max);
  const year = new Date().getFullYear();
  return `INV-${year}-${String(max).padStart(4, '0')}`;
}

export function issueInvoice(
  orgId: string,
  invoiceId: string,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string,
): { success: true; data: Invoice } | { success: false; error: string } {
  const existing = store.invoices.get(invoiceId);
  if (!existing || existing.organization_id !== orgId) {
    return { success: false, error: 'Invoice not found' };
  }
  if (existing.status !== 'draft') {
    return { success: false, error: 'Only draft invoices can be issued' };
  }

  // Must have line items
  const lines = Array.from(store.invoiceLines.values()).filter(
    (l) => l.invoice_id === invoiceId,
  );
  if (lines.length === 0) {
    return { success: false, error: 'Invoice must have at least one line item to be issued' };
  }
  if (existing.total_paise <= 0) {
    return { success: false, error: 'Invoice total must be greater than zero' };
  }

  const before = { ...existing };
  const newNumber = nextIssuedNumber(orgId);

  existing.status = 'issued';
  existing.invoice_number = newNumber;
  existing.updated_at = new Date().toISOString();
  store.invoices.set(invoiceId, existing);

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'invoice.issued',
    entity_type: 'invoice',
    entity_id: invoiceId,
    before_data: before,
    after_data: { ...existing },
  });

  return { success: true, data: { ...existing } };
}
