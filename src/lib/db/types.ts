// CashCollect Finance OS — Database entity types
// All monetary amounts are in integer paise (1 INR = 100 paise).

export interface Organization {
  id: string;
  name: string;
  legal_name: string | null;
  currency: string; // ISO 4217, default 'INR'
  timezone: string; // IANA, default 'Asia/Kolkata'
  financial_year_start_month: number; // 1–12, default 4 (April)
  created_at: string; // ISO 8601
  updated_at: string;
}

export interface Customer {
  id: string;
  organization_id: string;
  display_name: string;
  legal_name: string | null;
  email: string | null;
  phone: string | null;
  gstin: string | null;
  billing_address: Record<string, string>;
  payment_terms_days: number; // 0–365, default 15
  notes: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  customer_id: string;
  invoice_number: string;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  currency: string;
  subtotal_paise: number;
  tax_total_paise: number;
  total_paise: number;
  paid_paise: number;
  status: 'draft' | 'issued' | 'partially_paid' | 'paid' | 'voided' | 'disputed';
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  organization_id: string;
  invoice_id: string;
  description: string;
  quantity: number; // e.g. 1, 2.5
  unit_price_paise: number;
  line_subtotal_paise: number;
  tax_amount_paise: number;
  sort_order: number;
}

export interface CollectionPlan {
  id: string;
  organization_id: string;
  invoice_id: string;
  name: string;
  channel: 'email' | 'manual';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CollectionEvent {
  id: string;
  organization_id: string;
  collection_plan_id: string;
  invoice_id: string;
  scheduled_at: string; // ISO 8601
  event_type: 'before_due' | 'due_date' | 'overdue' | 'manual_follow_up';
  status: 'scheduled' | 'ready' | 'sent' | 'skipped' | 'failed' | 'cancelled';
  recipient_email: string | null;
  subject: string | null;
  body: string | null;
  sent_at: string | null;
  provider_message_id: string | null;
  failure_reason: string | null;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  organization_id: string;
  actor_type: 'user' | 'mcp' | 'system';
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  before_data: unknown;
  after_data: unknown;
  request_id: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  organization_id: string;
  customer_id: string;
  payment_date: string; // YYYY-MM-DD
  amount_paise: number;
  currency: string;
  method: string; // 'bank_transfer' | 'cash' | 'cheque' | 'upi' | 'other'
  reference: string | null;
  notes: string | null;
  status: 'confirmed';
  created_at: string;
  updated_at: string;
}

export interface PaymentAllocation {
  id: string;
  organization_id: string;
  payment_id: string;
  invoice_id: string;
  amount_paise: number;
  created_at: string;
}
