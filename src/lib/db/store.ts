// CashCollect Finance OS — In-memory data store (demo mode)
// Pre-seeded with realistic Indian B2B demo data.
// All monetary values are integer paise.

import type {
  Organization,
  Customer,
  Invoice,
  InvoiceLine,
  CollectionPlan,
  CollectionEvent,
  AuditEvent,
  Payment,
  PaymentAllocation,
} from './types';

export const DEMO_ORG_ID = 'org_demo_northstar_001';

// ── Helpers ──────────────────────────────────────────────────────────
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function isoNow(): string {
  return new Date().toISOString();
}

// ── Store ────────────────────────────────────────────────────────────
class DataStore {
  organizations = new Map<string, Organization>();
  customers = new Map<string, Customer>();
  invoices = new Map<string, Invoice>();
  invoiceLines = new Map<string, InvoiceLine>();
  collectionPlans = new Map<string, CollectionPlan>();
  collectionEvents = new Map<string, CollectionEvent>();
  auditEvents = new Map<string, AuditEvent>();
  payments = new Map<string, Payment>();
  paymentAllocations = new Map<string, PaymentAllocation>();

  private invoiceCounter = 9; // next number after seeded data
  private issuedInvoiceCounter = 0; // computed on first use

  constructor() {
    this.seed();
  }

  // ── Organizations ──────────────────────────────────────────────────

  getOrganization(id: string): Organization | undefined {
    const org = this.organizations.get(id);
    return org ? clone(org) : undefined;
  }

  // ── Customers ──────────────────────────────────────────────────────

  listCustomers(
    orgId: string,
    opts?: { query?: string; limit?: number },
  ): Customer[] {
    const limit = opts?.limit ?? 20;
    const query = opts?.query?.toLowerCase().trim();
    const results: Customer[] = [];
    for (const c of this.customers.values()) {
      if (c.organization_id !== orgId) continue;
      if (c.status !== 'active') continue;
      if (query && !c.display_name.toLowerCase().includes(query) && !c.email?.toLowerCase().includes(query)) continue;
      results.push(clone(c));
      if (results.length >= limit) break;
    }
    return results;
  }

  getCustomer(id: string, orgId: string): Customer | undefined {
    const c = this.customers.get(id);
    if (!c || c.organization_id !== orgId) return undefined;
    return clone(c);
  }

  createCustomer(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Customer {
    const now = isoNow();
    const id = `cust_${crypto.randomUUID().slice(0, 12)}`;
    const customer: Customer = {
      id,
      ...data,
      created_at: now,
      updated_at: now,
    };
    this.customers.set(id, customer);
    return clone(customer);
  }

  updateCustomer(id: string, orgId: string, updates: Partial<Customer>): Customer | undefined {
    const existing = this.customers.get(id);
    if (!existing || existing.organization_id !== orgId) return undefined;
    const updated: Customer = {
      ...existing,
      ...updates,
      id: existing.id,
      organization_id: existing.organization_id,
      created_at: existing.created_at,
      updated_at: isoNow(),
    };
    this.customers.set(id, updated);
    return clone(updated);
  }

  // ── Invoices ───────────────────────────────────────────────────────

  listInvoices(
    orgId: string,
    opts?: { status?: string; customer_id?: string; overdue_only?: boolean; limit?: number },
  ): Invoice[] {
    const limit = opts?.limit ?? 20;
    const today = new Date().toISOString().split('T')[0];
    const results: Invoice[] = [];
    for (const inv of this.invoices.values()) {
      if (inv.organization_id !== orgId) continue;
      if (opts?.status && opts.status !== 'all' && inv.status !== opts.status) continue;
      if (opts?.customer_id && inv.customer_id !== opts.customer_id) continue;
      if (opts?.overdue_only) {
        const isOverdue = inv.due_date < today && inv.status !== 'paid' && inv.status !== 'voided' && inv.status !== 'draft' && (inv.total_paise - inv.paid_paise) > 0;
        if (!isOverdue) continue;
      }
      results.push(clone(inv));
      if (results.length >= limit) break;
    }
    return results;
  }

  getInvoice(id: string, orgId: string): Invoice | undefined {
    const inv = this.invoices.get(id);
    if (!inv || inv.organization_id !== orgId) return undefined;
    return clone(inv);
  }

  getInvoiceByNumber(invoiceNumber: string, orgId: string): Invoice | undefined {
    for (const inv of this.invoices.values()) {
      if (inv.organization_id === orgId && inv.invoice_number === invoiceNumber) {
        return clone(inv);
      }
    }
    return undefined;
  }

  createInvoice(data: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'>): Invoice {
    const now = isoNow();
    const id = `inv_${crypto.randomUUID().slice(0, 12)}`;
    const year = new Date().getFullYear();
    const num = String(this.invoiceCounter++).padStart(4, '0');
    const invoice_number = `DRAFT-${year}-${num}`;
    const invoice: Invoice = {
      id,
      invoice_number,
      ...data,
      created_at: now,
      updated_at: now,
    };
    this.invoices.set(id, invoice);
    return clone(invoice);
  }

  updateInvoice(id: string, orgId: string, updates: Partial<Invoice>): Invoice | undefined {
    const existing = this.invoices.get(id);
    if (!existing || existing.organization_id !== orgId) return undefined;
    const updated: Invoice = {
      ...existing,
      ...updates,
      id: existing.id,
      organization_id: existing.organization_id,
      invoice_number: updates.invoice_number || existing.invoice_number,
      created_at: existing.created_at,
      updated_at: isoNow(),
    };
    this.invoices.set(id, updated);
    return clone(updated);
  }

  nextIssuedNumber(orgId: string): string {
    // Scan existing invoices to find the highest INV-YYYY-NNNN number
    let max = this.issuedInvoiceCounter;
    for (const inv of this.invoices.values()) {
      if (inv.organization_id !== orgId) continue;
      const match = inv.invoice_number.match(/^INV-\d{4}-(\d+)$/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > max) max = n;
      }
    }
    max += 1;
    this.issuedInvoiceCounter = max;
    const year = new Date().getFullYear();
    return `INV-${year}-${String(max).padStart(4, '0')}`;
  }

  // ── Invoice Lines ──────────────────────────────────────────────────

  getInvoiceLines(invoiceId: string, orgId: string): InvoiceLine[] {
    const lines: InvoiceLine[] = [];
    for (const line of this.invoiceLines.values()) {
      if (line.invoice_id === invoiceId && line.organization_id === orgId) {
        lines.push(clone(line));
      }
    }
    return lines.sort((a, b) => a.sort_order - b.sort_order);
  }

  createInvoiceLine(data: Omit<InvoiceLine, 'id'>): InvoiceLine {
    const id = `line_${crypto.randomUUID().slice(0, 12)}`;
    const line: InvoiceLine = { id, ...data };
    this.invoiceLines.set(id, line);
    return clone(line);
  }

  deleteInvoiceLines(invoiceId: string, orgId: string): void {
    for (const [id, line] of this.invoiceLines.entries()) {
      if (line.invoice_id === invoiceId && line.organization_id === orgId) {
        this.invoiceLines.delete(id);
      }
    }
  }

  // ── Collection Plans ───────────────────────────────────────────────

  listCollectionPlans(orgId: string, invoiceId?: string): CollectionPlan[] {
    const results: CollectionPlan[] = [];
    for (const plan of this.collectionPlans.values()) {
      if (plan.organization_id !== orgId) continue;
      if (invoiceId && plan.invoice_id !== invoiceId) continue;
      results.push(clone(plan));
    }
    return results;
  }

  getCollectionPlan(id: string, orgId: string): CollectionPlan | undefined {
    const plan = this.collectionPlans.get(id);
    if (!plan || plan.organization_id !== orgId) return undefined;
    return clone(plan);
  }

  createCollectionPlan(data: Omit<CollectionPlan, 'id' | 'created_at' | 'updated_at'>): CollectionPlan {
    const now = isoNow();
    const id = `cp_${crypto.randomUUID().slice(0, 12)}`;
    const plan: CollectionPlan = { id, ...data, created_at: now, updated_at: now };
    this.collectionPlans.set(id, plan);
    return clone(plan);
  }

  // ── Collection Events ──────────────────────────────────────────────

  listCollectionEvents(orgId: string, opts?: { planId?: string; invoiceId?: string }): CollectionEvent[] {
    const results: CollectionEvent[] = [];
    for (const evt of this.collectionEvents.values()) {
      if (evt.organization_id !== orgId) continue;
      if (opts?.planId && evt.collection_plan_id !== opts.planId) continue;
      if (opts?.invoiceId && evt.invoice_id !== opts.invoiceId) continue;
      results.push(clone(evt));
    }
    return results.sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
  }

  createCollectionEvent(data: Omit<CollectionEvent, 'id' | 'created_at'>): CollectionEvent {
    const id = `ce_${crypto.randomUUID().slice(0, 12)}`;
    const event: CollectionEvent = { id, ...data, created_at: isoNow() };
    this.collectionEvents.set(id, event);
    return clone(event);
  }

  // ── Audit Events ───────────────────────────────────────────────────

  listAuditEvents(orgId: string, opts?: { entityType?: string; entityId?: string; limit?: number }): AuditEvent[] {
    const limit = opts?.limit ?? 50;
    const results: AuditEvent[] = [];
    for (const evt of this.auditEvents.values()) {
      if (evt.organization_id !== orgId) continue;
      if (opts?.entityType && evt.entity_type !== opts.entityType) continue;
      if (opts?.entityId && evt.entity_id !== opts.entityId) continue;
      results.push(clone(evt));
      if (results.length >= limit) break;
    }
    return results.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  createAuditEvent(data: Omit<AuditEvent, 'id' | 'created_at'>): AuditEvent {
    const id = `audit_${crypto.randomUUID().slice(0, 12)}`;
    const event: AuditEvent = { id, ...data, created_at: isoNow() };
    this.auditEvents.set(id, event);
    return clone(event);
  }

  // ── Payments ───────────────────────────────────────────────────────

  createPayment(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Payment {
    const now = isoNow();
    const id = `pay_${crypto.randomUUID().slice(0, 12)}`;
    const payment: Payment = { id, ...data, created_at: now, updated_at: now };
    this.payments.set(id, payment);
    return clone(payment);
  }

  getPayment(id: string, orgId: string): Payment | undefined {
    const p = this.payments.get(id);
    if (!p || p.organization_id !== orgId) return undefined;
    return clone(p);
  }

  listPayments(orgId: string, opts?: { customer_id?: string; limit?: number }): Payment[] {
    const limit = opts?.limit ?? 50;
    const results: Payment[] = [];
    for (const p of this.payments.values()) {
      if (p.organization_id !== orgId) continue;
      if (opts?.customer_id && p.customer_id !== opts.customer_id) continue;
      results.push(clone(p));
      if (results.length >= limit) break;
    }
    return results.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  createPaymentAllocation(data: Omit<PaymentAllocation, 'id' | 'created_at'>): PaymentAllocation {
    const id = `alloc_${crypto.randomUUID().slice(0, 12)}`;
    const alloc: PaymentAllocation = { id, ...data, created_at: isoNow() };
    this.paymentAllocations.set(id, alloc);
    return clone(alloc);
  }

  getPaymentAllocations(orgId: string, opts?: { payment_id?: string; invoice_id?: string }): PaymentAllocation[] {
    const results: PaymentAllocation[] = [];
    for (const a of this.paymentAllocations.values()) {
      if (a.organization_id !== orgId) continue;
      if (opts?.payment_id && a.payment_id !== opts.payment_id) continue;
      if (opts?.invoice_id && a.invoice_id !== opts.invoice_id) continue;
      results.push(clone(a));
    }
    return results;
  }

  // ── Receivables Report ─────────────────────────────────────────────

  getReceivablesReport(orgId: string, opts?: { asOfDate?: string; customerId?: string; includeDrafts?: boolean }) {
    const asOf = opts?.asOfDate ?? new Date().toISOString().split('T')[0];
    const rows: Array<{
      invoice_id: string;
      invoice_number: string;
      customer_id: string;
      customer_name: string;
      invoice_date: string;
      due_date: string;
      total_paise: number;
      paid_paise: number;
      outstanding_paise: number;
      days_overdue: number;
      ageing_bucket: string;
    }> = [];

    for (const inv of this.invoices.values()) {
      if (inv.organization_id !== orgId) continue;
      if (opts?.customerId && inv.customer_id !== opts.customerId) continue;
      if (inv.status === 'voided' || inv.status === 'paid') continue;
      if (!opts?.includeDrafts && inv.status === 'draft') continue;

      const outstanding = inv.total_paise - inv.paid_paise;
      if (outstanding <= 0) continue;

      const dueDate = new Date(inv.due_date);
      const asOfDt = new Date(asOf);
      const diffMs = asOfDt.getTime() - dueDate.getTime();
      const daysOverdue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      let bucket: string;
      if (daysOverdue <= 0) {
        bucket = 'current';
      } else if (daysOverdue <= 30) {
        bucket = '1-30';
      } else if (daysOverdue <= 60) {
        bucket = '31-60';
      } else if (daysOverdue <= 90) {
        bucket = '61-90';
      } else {
        bucket = '91+';
      }

      const customer = this.customers.get(inv.customer_id);
      rows.push({
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
        customer_id: inv.customer_id,
        customer_name: customer?.display_name ?? 'Unknown',
        invoice_date: inv.invoice_date,
        due_date: inv.due_date,
        total_paise: inv.total_paise,
        paid_paise: inv.paid_paise,
        outstanding_paise: outstanding,
        days_overdue: daysOverdue,
        ageing_bucket: bucket,
      });
    }

    // Aggregate
    const buckets: Record<string, number> = { current: 0, '1-30': 0, '31-60': 0, '61-90': 0, '91+': 0 };
    let totalOutstanding = 0;
    let totalInvoiceValue = 0;
    let totalPaid = 0;
    const customerIds = new Set<string>();

    for (const row of rows) {
      buckets[row.ageing_bucket] = (buckets[row.ageing_bucket] ?? 0) + row.outstanding_paise;
      totalOutstanding += row.outstanding_paise;
      totalInvoiceValue += row.total_paise;
      totalPaid += row.paid_paise;
      customerIds.add(row.customer_id);
    }

    return {
      as_of_date: asOf,
      currency: 'INR',
      total_invoice_value_paise: totalInvoiceValue,
      total_paid_paise: totalPaid,
      total_outstanding_paise: totalOutstanding,
      ageing_buckets: buckets,
      invoice_count: rows.length,
      customer_count: customerIds.size,
      rows,
    };
  }

  // ── Seed Data ──────────────────────────────────────────────────────

  private seed() {
    const orgId = DEMO_ORG_ID;
    const now = '2026-11-10T10:00:00.000Z';

    // Organization
    this.organizations.set(orgId, {
      id: orgId,
      name: 'Northstar Digital Services Pvt. Ltd.',
      legal_name: 'Northstar Digital Services Private Limited',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      financial_year_start_month: 4,
      created_at: '2026-01-15T05:30:00.000Z',
      updated_at: now,
    });

    // Customers
    const customers: Array<Omit<Customer, 'created_at' | 'updated_at'>> = [
      {
        id: 'cust_techvista_01',
        organization_id: orgId,
        display_name: 'TechVista Solutions Pvt. Ltd.',
        legal_name: 'TechVista Solutions Private Limited',
        email: 'accounts@techvista-example.com',
        phone: '+91-9876500001',
        gstin: '27AABCT1234F1Z5',
        billing_address: { line1: '401, Trade Center', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        payment_terms_days: 15,
        notes: 'Key client for web development projects',
        status: 'active',
      },
      {
        id: 'cust_pinnacle_02',
        organization_id: orgId,
        display_name: 'Pinnacle Staffing Services',
        legal_name: 'Pinnacle Staffing Services LLP',
        email: 'finance@pinnacle-example.com',
        phone: '+91-9876500002',
        gstin: '07AAFPP5678G1Z3',
        billing_address: { line1: '12, Connaught Place', city: 'New Delhi', state: 'Delhi', pincode: '110001' },
        payment_terms_days: 30,
        notes: 'Recruitment process outsourcing',
        status: 'active',
      },
      {
        id: 'cust_meridian_03',
        organization_id: orgId,
        display_name: 'Meridian Creative Agency',
        legal_name: 'Meridian Creative Agency Pvt. Ltd.',
        email: 'billing@meridian-example.com',
        phone: '+91-9876500003',
        gstin: '29AABCM9012H1Z1',
        billing_address: { line1: '88, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
        payment_terms_days: 15,
        notes: 'Brand strategy and design retainer',
        status: 'active',
      },
      {
        id: 'cust_cloudbridge_04',
        organization_id: orgId,
        display_name: 'Cloudbridge Infrastructure Ltd.',
        legal_name: 'Cloudbridge Infrastructure Limited',
        email: 'ap@cloudbridge-example.com',
        phone: '+91-9876500004',
        gstin: '36AABCC3456I1Z9',
        billing_address: { line1: '5th Floor, Cyber Tower', city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
        payment_terms_days: 45,
        notes: 'Cloud migration and DevOps consulting',
        status: 'active',
      },
      {
        id: 'cust_nexgen_05',
        organization_id: orgId,
        display_name: 'NexGen Analytics India',
        legal_name: 'NexGen Analytics India Pvt. Ltd.',
        email: 'payments@nexgen-example.com',
        phone: '+91-9876500005',
        gstin: '33AABCN7890J1Z7',
        billing_address: { line1: '10, Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002' },
        payment_terms_days: 15,
        notes: 'Data pipeline consulting',
        status: 'active',
      },
    ];
    for (const c of customers) {
      this.customers.set(c.id, { ...c, created_at: '2026-04-01T05:30:00.000Z', updated_at: now });
    }

    // ── Invoices (8 total) ───────────────────────────────────────────
    // Helper to add invoice + lines in one go
    const addInvoice = (
      inv: Omit<Invoice, 'created_at' | 'updated_at'>,
      lines: Array<Omit<InvoiceLine, 'id' | 'organization_id' | 'invoice_id'>>,
    ) => {
      this.invoices.set(inv.id, { ...inv, created_at: '2026-10-01T05:30:00.000Z', updated_at: now });
      for (const l of lines) {
        const lineId = `line_${crypto.randomUUID().slice(0, 12)}`;
        this.invoiceLines.set(lineId, { id: lineId, organization_id: orgId, invoice_id: inv.id, ...l });
      }
    };

    // 1 — OVERDUE (due 15 Oct, issued, TechVista) — 45 days before seeds
    addInvoice(
      {
        id: 'inv_001', organization_id: orgId, customer_id: 'cust_techvista_01',
        invoice_number: 'INV-2026-0001', invoice_date: '2026-09-28', due_date: '2026-10-15',
        currency: 'INR', subtotal_paise: 17500000, tax_total_paise: 3150000, total_paise: 20650000,
        paid_paise: 0, status: 'issued', notes: 'Web application development — Phase 1', created_by: null,
      },
      [
        { description: 'Frontend development (React)', quantity: 1, unit_price_paise: 10000000, line_subtotal_paise: 10000000, tax_amount_paise: 1800000, sort_order: 0 },
        { description: 'Backend API development (Node.js)', quantity: 1, unit_price_paise: 7500000, line_subtotal_paise: 7500000, tax_amount_paise: 1350000, sort_order: 1 },
      ],
    );

    // 2 — OVERDUE (due 25 Oct, issued, Pinnacle) — 16 days overdue
    addInvoice(
      {
        id: 'inv_002', organization_id: orgId, customer_id: 'cust_pinnacle_02',
        invoice_number: 'INV-2026-0002', invoice_date: '2026-09-25', due_date: '2026-10-25',
        currency: 'INR', subtotal_paise: 12000000, tax_total_paise: 2160000, total_paise: 14160000,
        paid_paise: 0, status: 'issued', notes: 'RPO setup and candidate sourcing — October', created_by: null,
      },
      [
        { description: 'Recruitment process outsourcing — October batch', quantity: 1, unit_price_paise: 12000000, line_subtotal_paise: 12000000, tax_amount_paise: 2160000, sort_order: 0 },
      ],
    );

    // 3 — DUE SOON (due 14 Nov, issued, Meridian)
    addInvoice(
      {
        id: 'inv_003', organization_id: orgId, customer_id: 'cust_meridian_03',
        invoice_number: 'INV-2026-0003', invoice_date: '2026-10-30', due_date: '2026-11-14',
        currency: 'INR', subtotal_paise: 8500000, tax_total_paise: 1530000, total_paise: 10030000,
        paid_paise: 0, status: 'issued', notes: 'Brand identity refresh — November milestone', created_by: null,
      },
      [
        { description: 'Brand strategy workshop', quantity: 1, unit_price_paise: 3500000, line_subtotal_paise: 3500000, tax_amount_paise: 630000, sort_order: 0 },
        { description: 'Visual identity design', quantity: 1, unit_price_paise: 5000000, line_subtotal_paise: 5000000, tax_amount_paise: 900000, sort_order: 1 },
      ],
    );

    // 4 — DUE SOON (due 17 Nov, issued, Cloudbridge)
    addInvoice(
      {
        id: 'inv_004', organization_id: orgId, customer_id: 'cust_cloudbridge_04',
        invoice_number: 'INV-2026-0004', invoice_date: '2026-10-03', due_date: '2026-11-17',
        currency: 'INR', subtotal_paise: 25000000, tax_total_paise: 4500000, total_paise: 29500000,
        paid_paise: 0, status: 'issued', notes: 'Cloud migration — AWS infrastructure setup', created_by: null,
      },
      [
        { description: 'AWS architecture design', quantity: 1, unit_price_paise: 10000000, line_subtotal_paise: 10000000, tax_amount_paise: 1800000, sort_order: 0 },
        { description: 'Infrastructure provisioning (Terraform)', quantity: 1, unit_price_paise: 8000000, line_subtotal_paise: 8000000, tax_amount_paise: 1440000, sort_order: 1 },
        { description: 'CI/CD pipeline setup', quantity: 1, unit_price_paise: 7000000, line_subtotal_paise: 7000000, tax_amount_paise: 1260000, sort_order: 2 },
      ],
    );

    // 5 — PAID (NexGen, September)
    addInvoice(
      {
        id: 'inv_005', organization_id: orgId, customer_id: 'cust_nexgen_05',
        invoice_number: 'INV-2026-0005', invoice_date: '2026-09-01', due_date: '2026-09-15',
        currency: 'INR', subtotal_paise: 5000000, tax_total_paise: 900000, total_paise: 5900000,
        paid_paise: 5900000, status: 'paid', notes: 'Data pipeline consulting — August', created_by: null,
      },
      [
        { description: 'ETL pipeline design and implementation', quantity: 1, unit_price_paise: 5000000, line_subtotal_paise: 5000000, tax_amount_paise: 900000, sort_order: 0 },
      ],
    );

    // 6 — PAID (TechVista, August)
    addInvoice(
      {
        id: 'inv_006', organization_id: orgId, customer_id: 'cust_techvista_01',
        invoice_number: 'INV-2026-0006', invoice_date: '2026-08-01', due_date: '2026-08-15',
        currency: 'INR', subtotal_paise: 9500000, tax_total_paise: 1710000, total_paise: 11210000,
        paid_paise: 11210000, status: 'paid', notes: 'Mobile app prototype — August', created_by: null,
      },
      [
        { description: 'React Native prototype', quantity: 1, unit_price_paise: 9500000, line_subtotal_paise: 9500000, tax_amount_paise: 1710000, sort_order: 0 },
      ],
    );

    // 7 — PARTIALLY PAID (Pinnacle, October)
    addInvoice(
      {
        id: 'inv_007', organization_id: orgId, customer_id: 'cust_pinnacle_02',
        invoice_number: 'INV-2026-0007', invoice_date: '2026-10-10', due_date: '2026-11-10',
        currency: 'INR', subtotal_paise: 35000000, tax_total_paise: 6300000, total_paise: 41300000,
        paid_paise: 20000000, status: 'partially_paid', notes: 'Staffing engagement — Q3 milestone', created_by: null,
      },
      [
        { description: 'Executive search — 5 positions', quantity: 5, unit_price_paise: 5000000, line_subtotal_paise: 25000000, tax_amount_paise: 4500000, sort_order: 0 },
        { description: 'Background verification', quantity: 5, unit_price_paise: 2000000, line_subtotal_paise: 10000000, tax_amount_paise: 1800000, sort_order: 1 },
      ],
    );

    // 8 — DRAFT (Meridian, November)
    addInvoice(
      {
        id: 'inv_008', organization_id: orgId, customer_id: 'cust_meridian_03',
        invoice_number: 'DRAFT-2026-0008', invoice_date: '2026-11-10', due_date: '2026-11-25',
        currency: 'INR', subtotal_paise: 6000000, tax_total_paise: 1080000, total_paise: 7080000,
        paid_paise: 0, status: 'draft', notes: 'Social media campaign — November', created_by: null,
      },
      [
        { description: 'Social media strategy', quantity: 1, unit_price_paise: 2500000, line_subtotal_paise: 2500000, tax_amount_paise: 450000, sort_order: 0 },
        { description: 'Content creation (10 posts)', quantity: 10, unit_price_paise: 350000, line_subtotal_paise: 3500000, tax_amount_paise: 630000, sort_order: 1 },
      ],
    );

    // ── Collection plans ─────────────────────────────────────────────

    // Plan for inv_001 (overdue TechVista)
    const plan1: CollectionPlan = {
      id: 'cp_001', organization_id: orgId, invoice_id: 'inv_001',
      name: 'Standard collection plan', channel: 'email', status: 'active',
      created_at: '2026-10-01T05:30:00.000Z', updated_at: now,
    };
    this.collectionPlans.set(plan1.id, plan1);

    const plan1Events: Array<Omit<CollectionEvent, 'id' | 'created_at'>> = [
      { organization_id: orgId, collection_plan_id: 'cp_001', invoice_id: 'inv_001', scheduled_at: '2026-10-12T03:30:00.000Z', event_type: 'before_due', status: 'sent', recipient_email: 'accounts@techvista-example.com', subject: 'Upcoming payment reminder — INV-2026-0001', body: 'Dear TechVista Solutions, this is a reminder that invoice INV-2026-0001 for ₹2,06,500.00 is due on 15 Oct 2026.', sent_at: '2026-10-12T03:30:15.000Z', provider_message_id: null, failure_reason: null },
      { organization_id: orgId, collection_plan_id: 'cp_001', invoice_id: 'inv_001', scheduled_at: '2026-10-15T03:30:00.000Z', event_type: 'due_date', status: 'sent', recipient_email: 'accounts@techvista-example.com', subject: 'Payment due today — INV-2026-0001', body: 'Dear TechVista Solutions, invoice INV-2026-0001 for ₹2,06,500.00 is due today, 15 Oct 2026.', sent_at: '2026-10-15T03:30:12.000Z', provider_message_id: null, failure_reason: null },
      { organization_id: orgId, collection_plan_id: 'cp_001', invoice_id: 'inv_001', scheduled_at: '2026-10-18T03:30:00.000Z', event_type: 'overdue', status: 'sent', recipient_email: 'accounts@techvista-example.com', subject: 'Overdue payment follow-up — INV-2026-0001', body: 'Dear TechVista Solutions, invoice INV-2026-0001 for ₹2,06,500.00 is now overdue. Please arrange payment at your earliest convenience.', sent_at: '2026-10-18T03:31:00.000Z', provider_message_id: null, failure_reason: null },
    ];
    for (const e of plan1Events) {
      const eid = `ce_${crypto.randomUUID().slice(0, 12)}`;
      this.collectionEvents.set(eid, { id: eid, ...e, created_at: e.scheduled_at });
    }

    // Plan for inv_003 (due soon Meridian)
    const plan2: CollectionPlan = {
      id: 'cp_002', organization_id: orgId, invoice_id: 'inv_003',
      name: 'Standard collection plan', channel: 'email', status: 'active',
      created_at: '2026-11-01T05:30:00.000Z', updated_at: now,
    };
    this.collectionPlans.set(plan2.id, plan2);

    const plan2Events: Array<Omit<CollectionEvent, 'id' | 'created_at'>> = [
      { organization_id: orgId, collection_plan_id: 'cp_002', invoice_id: 'inv_003', scheduled_at: '2026-11-11T03:30:00.000Z', event_type: 'before_due', status: 'scheduled', recipient_email: 'billing@meridian-example.com', subject: 'Upcoming payment reminder — INV-2026-0003', body: 'Dear Meridian Creative Agency, this is a reminder that invoice INV-2026-0003 for ₹1,00,300.00 is due on 14 Nov 2026.', sent_at: null, provider_message_id: null, failure_reason: null },
      { organization_id: orgId, collection_plan_id: 'cp_002', invoice_id: 'inv_003', scheduled_at: '2026-11-14T03:30:00.000Z', event_type: 'due_date', status: 'scheduled', recipient_email: 'billing@meridian-example.com', subject: 'Payment due today — INV-2026-0003', body: 'Dear Meridian Creative Agency, invoice INV-2026-0003 for ₹1,00,300.00 is due today.', sent_at: null, provider_message_id: null, failure_reason: null },
      { organization_id: orgId, collection_plan_id: 'cp_002', invoice_id: 'inv_003', scheduled_at: '2026-11-17T03:30:00.000Z', event_type: 'overdue', status: 'scheduled', recipient_email: 'billing@meridian-example.com', subject: 'Overdue payment follow-up — INV-2026-0003', body: 'Dear Meridian Creative Agency, invoice INV-2026-0003 for ₹1,00,300.00 is now overdue.', sent_at: null, provider_message_id: null, failure_reason: null },
    ];
    for (const e of plan2Events) {
      const eid = `ce_${crypto.randomUUID().slice(0, 12)}`;
      this.collectionEvents.set(eid, { id: eid, ...e, created_at: plan2.created_at });
    }

    // Seed audit events for the invoices
    const seedActions = [
      { action: 'invoice.draft_created', entity_type: 'invoice', entity_id: 'inv_001' },
      { action: 'invoice.draft_created', entity_type: 'invoice', entity_id: 'inv_002' },
      { action: 'invoice.draft_created', entity_type: 'invoice', entity_id: 'inv_003' },
      { action: 'invoice.draft_created', entity_type: 'invoice', entity_id: 'inv_004' },
      { action: 'invoice.draft_created', entity_type: 'invoice', entity_id: 'inv_008' },
      { action: 'collection_plan.created', entity_type: 'collection_plan', entity_id: 'cp_001' },
      { action: 'collection_plan.created', entity_type: 'collection_plan', entity_id: 'cp_002' },
    ];
    for (const a of seedActions) {
      this.createAuditEvent({
        organization_id: orgId,
        actor_type: 'system',
        actor_id: 'seed',
        action: a.action,
        entity_type: a.entity_type,
        entity_id: a.entity_id,
        before_data: null,
        after_data: null,
        request_id: 'seed',
      });
    }
  }
}

// Singleton — survives hot-reloads in dev via globalThis cache
const globalForStore = globalThis as unknown as { __cashcollectStore?: DataStore };
export const store: DataStore = globalForStore.__cashcollectStore ?? (globalForStore.__cashcollectStore = new DataStore());
