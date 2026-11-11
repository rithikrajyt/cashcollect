import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/db/store';
import type { Customer } from '@/lib/db/types';
import { createAuditEvent } from '@/modules/audit/service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateCustomerInput {
  display_name: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  gstin?: string;
  payment_terms_days?: number;
  notes?: string;
}

export interface UpdateCustomerInput {
  display_name?: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  gstin?: string;
  payment_terms_days?: number;
  notes?: string;
  status?: 'active' | 'inactive';
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export function listCustomers(
  orgId: string,
  query?: string,
  limit?: number
): Customer[] {
  const max = Math.min(Math.max(limit ?? 20, 1), 50);
  const q = query?.trim().toLowerCase();

  const results = Array.from(store.customers.values())
    .filter((c) => c.organization_id === orgId && c.status === 'active')
    .filter((c) => !q || c.display_name.toLowerCase().includes(q))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, max);

  return results.map((c) => ({ ...c }));
}

export function getCustomer(
  orgId: string,
  customerId: string
): Customer | null {
  const c = store.customers.get(customerId);
  if (!c || c.organization_id !== orgId) return null;
  return { ...c };
}

export function createCustomer(
  orgId: string,
  data: CreateCustomerInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: Customer } | { success: false; error: string } {
  // --- validation ---
  const name = data.display_name?.trim();
  if (!name) {
    return { success: false, error: 'display_name is required' };
  }

  if (data.email && !validateEmail(data.email)) {
    return { success: false, error: 'Invalid email format' };
  }

  const terms = data.payment_terms_days ?? 15;
  if (!Number.isInteger(terms) || terms < 0 || terms > 365) {
    return {
      success: false,
      error: 'payment_terms_days must be an integer between 0 and 365',
    };
  }

  // --- create ---
  const now = new Date().toISOString();
  const customer: Customer = {
    id: uuidv4(),
    organization_id: orgId,
    display_name: name,
    legal_name: data.legal_name?.trim() || null,
    email: data.email?.trim() || null,
    phone: data.phone?.trim() || null,
    gstin: data.gstin?.trim() || null,
    billing_address: {},
    payment_terms_days: terms,
    notes: data.notes?.trim() || null,
    status: 'active',
    created_at: now,
    updated_at: now,
  };

  store.customers.set(customer.id, customer);

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'customer.created',
    entity_type: 'customer',
    entity_id: customer.id,
    after_data: customer,
  });

  return { success: true, data: { ...customer } };
}

export function updateCustomer(
  orgId: string,
  customerId: string,
  data: UpdateCustomerInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: Customer } | { success: false; error: string } {
  const existing = store.customers.get(customerId);
  if (!existing || existing.organization_id !== orgId) {
    return { success: false, error: 'Customer not found' };
  }

  const before = { ...existing };

  if (data.display_name !== undefined) {
    const n = data.display_name.trim();
    if (!n) return { success: false, error: 'display_name cannot be empty' };
    existing.display_name = n;
  }
  if (data.legal_name !== undefined)
    existing.legal_name = data.legal_name.trim() || null;
  if (data.email !== undefined) {
    if (data.email && !validateEmail(data.email)) {
      return { success: false, error: 'Invalid email format' };
    }
    existing.email = data.email.trim() || null;
  }
  if (data.phone !== undefined)
    existing.phone = data.phone.trim() || null;
  if (data.gstin !== undefined)
    existing.gstin = data.gstin.trim() || null;
  if (data.payment_terms_days !== undefined) {
    if (
      !Number.isInteger(data.payment_terms_days) ||
      data.payment_terms_days < 0 ||
      data.payment_terms_days > 365
    ) {
      return {
        success: false,
        error: 'payment_terms_days must be an integer between 0 and 365',
      };
    }
    existing.payment_terms_days = data.payment_terms_days;
  }
  if (data.notes !== undefined)
    existing.notes = data.notes.trim() || null;
  if (data.status !== undefined) existing.status = data.status;

  existing.updated_at = new Date().toISOString();
  store.customers.set(customerId, existing);

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'customer.updated',
    entity_type: 'customer',
    entity_id: customerId,
    before_data: before,
    after_data: { ...existing },
  });

  return { success: true, data: { ...existing } };
}
