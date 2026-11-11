import { store } from '@/lib/db/store';
import { paiseToCurrency } from '@/lib/money';
import { differenceInDays, parseISO } from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AgeingBucket {
  label: string;
  count: number;
  amount_paise: number;
  amount_display: string;
}

export interface InvoiceRow {
  invoice_id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  due_date: string;
  total_paise: number;
  total_display: string;
  paid_paise: number;
  paid_display: string;
  outstanding_paise: number;
  outstanding_display: string;
  days_overdue: number;
  bucket: string;
}

export interface ReceivablesReport {
  as_of_date: string;
  currency: string;
  include_drafts: boolean;
  total_issued_paise: number;
  total_issued_display: string;
  total_paid_paise: number;
  total_paid_display: string;
  total_outstanding_paise: number;
  total_outstanding_display: string;
  invoice_count: number;
  customer_count: number;
  buckets: AgeingBucket[];
  invoices: InvoiceRow[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBucket(daysOverdue: number): string {
  if (daysOverdue <= 0) return 'not_yet_due';
  if (daysOverdue <= 30) return '1_30';
  if (daysOverdue <= 60) return '31_60';
  if (daysOverdue <= 90) return '61_90';
  return '91_plus';
}

function bucketLabel(key: string): string {
  switch (key) {
    case 'not_yet_due':
      return 'Not yet due';
    case '1_30':
      return '1–30 days';
    case '31_60':
      return '31–60 days';
    case '61_90':
      return '61–90 days';
    case '91_plus':
      return '91+ days';
    default:
      return key;
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export function getReceivablesReport(
  orgId: string,
  params: {
    as_of_date: string;
    customer_id?: string;
    include_drafts?: boolean;
  }
): ReceivablesReport {
  const asOf = parseISO(params.as_of_date);
  const includeDrafts = params.include_drafts ?? false;

  const allowedStatuses = new Set(['issued', 'partially_paid']);
  if (includeDrafts) allowedStatuses.add('draft');

  // Gather eligible invoices
  let invoices = Array.from(store.invoices.values()).filter(
    (inv) =>
      inv.organization_id === orgId &&
      allowedStatuses.has(inv.status)
  );

  if (params.customer_id) {
    invoices = invoices.filter((inv) => inv.customer_id === params.customer_id);
  }

  // Build bucket accumulators
  const bucketMap: Record<string, { count: number; amount_paise: number }> = {
    not_yet_due: { count: 0, amount_paise: 0 },
    '1_30': { count: 0, amount_paise: 0 },
    '31_60': { count: 0, amount_paise: 0 },
    '61_90': { count: 0, amount_paise: 0 },
    '91_plus': { count: 0, amount_paise: 0 },
  };

  let totalIssued = 0;
  let totalPaid = 0;
  const customerIds = new Set<string>();

  const rows: InvoiceRow[] = invoices.map((inv) => {
    const outstanding = inv.total_paise - inv.paid_paise;
    const dueDate = parseISO(inv.due_date);
    const daysOverdue = differenceInDays(asOf, dueDate);
    const bucket = getBucket(daysOverdue);

    totalIssued += inv.total_paise;
    totalPaid += inv.paid_paise;
    customerIds.add(inv.customer_id);

    bucketMap[bucket].count += 1;
    bucketMap[bucket].amount_paise += outstanding;

    const cust = store.customers.get(inv.customer_id);

    return {
      invoice_id: inv.id,
      invoice_number: inv.invoice_number,
      customer_id: inv.customer_id,
      customer_name: cust?.display_name ?? 'Unknown',
      due_date: inv.due_date,
      total_paise: inv.total_paise,
      total_display: paiseToCurrency(inv.total_paise),
      paid_paise: inv.paid_paise,
      paid_display: paiseToCurrency(inv.paid_paise),
      outstanding_paise: outstanding,
      outstanding_display: paiseToCurrency(outstanding),
      days_overdue: Math.max(0, daysOverdue),
      bucket,
    };
  });

  // Sort by days overdue desc
  rows.sort((a, b) => b.days_overdue - a.days_overdue);

  const buckets: AgeingBucket[] = [
    'not_yet_due',
    '1_30',
    '31_60',
    '61_90',
    '91_plus',
  ].map((key) => ({
    label: bucketLabel(key),
    count: bucketMap[key].count,
    amount_paise: bucketMap[key].amount_paise,
    amount_display: paiseToCurrency(bucketMap[key].amount_paise),
  }));

  const totalOutstanding = totalIssued - totalPaid;

  return {
    as_of_date: params.as_of_date,
    currency: 'INR',
    include_drafts: includeDrafts,
    total_issued_paise: totalIssued,
    total_issued_display: paiseToCurrency(totalIssued),
    total_paid_paise: totalPaid,
    total_paid_display: paiseToCurrency(totalPaid),
    total_outstanding_paise: totalOutstanding,
    total_outstanding_display: paiseToCurrency(totalOutstanding),
    invoice_count: rows.length,
    customer_count: customerIds.size,
    buckets,
    invoices: rows,
  };
}
