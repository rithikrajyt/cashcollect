import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/db/store';
import type { CollectionPlan, CollectionEvent } from '@/lib/db/types';
import { createAuditEvent } from '@/modules/audit/service';
import { addDays } from 'date-fns';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReminderInput {
  offset_days_from_due: number;
  event_type: 'before_due' | 'due_date' | 'overdue' | 'manual_follow_up';
}

export interface CreateCollectionPlanInput {
  invoice_id: string;
  reminders: ReminderInput[];
  channel?: 'email' | 'manual';
}

export interface CollectionPlanWithEvents extends CollectionPlan {
  events: CollectionEvent[];
}

// ---------------------------------------------------------------------------
// Allowed event types
// ---------------------------------------------------------------------------

const VALID_EVENT_TYPES = new Set([
  'before_due',
  'due_date',
  'overdue',
  'manual_follow_up',
]);

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export function createCollectionPlan(
  orgId: string,
  data: CreateCollectionPlanInput,
  actorType: 'user' | 'mcp' = 'user',
  actorId?: string
): { success: true; data: CollectionPlanWithEvents } | { success: false; error: string } {
  // Validate invoice
  const invoice = store.invoices.get(data.invoice_id);
  if (!invoice || invoice.organization_id !== orgId) {
    return { success: false, error: 'Invoice not found in this organization' };
  }

  // Validate reminders
  if (!data.reminders || data.reminders.length === 0) {
    return { success: false, error: 'At least one reminder is required' };
  }
  if (data.reminders.length > 10) {
    return { success: false, error: 'Maximum 10 reminders per plan' };
  }

  for (const r of data.reminders) {
    if (!Number.isInteger(r.offset_days_from_due)) {
      return { success: false, error: 'offset_days_from_due must be an integer' };
    }
    if (r.offset_days_from_due < -30 || r.offset_days_from_due > 180) {
      return { success: false, error: 'offset_days_from_due must be between -30 and 180' };
    }
    if (!VALID_EVENT_TYPES.has(r.event_type)) {
      return {
        success: false,
        error: `Invalid event_type: ${r.event_type}. Must be one of: ${[...VALID_EVENT_TYPES].join(', ')}`,
      };
    }
  }

  const channel = data.channel ?? 'email';
  const now = new Date().toISOString();
  const planId = uuidv4();

  const plan: CollectionPlan = {
    id: planId,
    organization_id: orgId,
    invoice_id: data.invoice_id,
    name: 'Standard collection plan',
    channel,
    status: invoice.status === 'draft' ? 'paused' : 'active',
    created_at: now,
    updated_at: now,
  };

  // Build events from reminders
  const dueDate = new Date(invoice.due_date + 'T00:00:00+05:30'); // IST
  const customer = store.customers.get(invoice.customer_id);

  const events: CollectionEvent[] = data.reminders.map((r) => {
    const scheduledDate = addDays(dueDate, r.offset_days_from_due);
    // Set to 9:00 AM IST → 3:30 AM UTC
    scheduledDate.setUTCHours(3, 30, 0, 0);

    let subject = '';
    let body = '';
    const invNum = invoice.invoice_number;
    const custName = customer?.display_name ?? 'Customer';

    if (r.event_type === 'before_due') {
      subject = `Upcoming payment reminder — Invoice ${invNum}`;
      body = `Dear ${custName},\n\nThis is a friendly reminder that invoice ${invNum} is due on ${invoice.due_date}. Please ensure timely payment.\n\nThank you.`;
    } else if (r.event_type === 'due_date') {
      subject = `Payment due today — Invoice ${invNum}`;
      body = `Dear ${custName},\n\nInvoice ${invNum} is due today (${invoice.due_date}). We kindly request your prompt payment.\n\nThank you.`;
    } else if (r.event_type === 'overdue') {
      subject = `Overdue payment reminder — Invoice ${invNum}`;
      body = `Dear ${custName},\n\nInvoice ${invNum} was due on ${invoice.due_date} and is now overdue. We request your attention to this matter.\n\nThank you.`;
    } else {
      subject = `Follow-up — Invoice ${invNum}`;
      body = `Dear ${custName},\n\nThis is a follow-up regarding invoice ${invNum}. Please let us know the expected payment date.\n\nThank you.`;
    }

    return {
      id: uuidv4(),
      organization_id: orgId,
      collection_plan_id: planId,
      invoice_id: data.invoice_id,
      scheduled_at: scheduledDate.toISOString(),
      event_type: r.event_type,
      status: 'scheduled' as const,
      recipient_email: customer?.email ?? null,
      subject,
      body,
      sent_at: null,
      provider_message_id: null,
      failure_reason: null,
      created_at: now,
    };
  });

  // Persist
  store.collectionPlans.set(plan.id, plan);
  for (const ev of events) {
    store.collectionEvents.set(ev.id, ev);
  }

  createAuditEvent(orgId, {
    actor_type: actorType,
    actor_id: actorId,
    action: 'collection_plan.created',
    entity_type: 'collection_plan',
    entity_id: plan.id,
    after_data: { plan, events_count: events.length },
  });

  return {
    success: true,
    data: { ...plan, events: events.map((e) => ({ ...e })) },
  };
}

export function listCollectionEvents(
  orgId: string,
  filters?: { invoice_id?: string; status?: string }
): CollectionEvent[] {
  let results = Array.from(store.collectionEvents.values()).filter(
    (e) => e.organization_id === orgId
  );

  if (filters?.invoice_id) {
    results = results.filter((e) => e.invoice_id === filters.invoice_id);
  }
  if (filters?.status) {
    results = results.filter((e) => e.status === filters.status);
  }

  results.sort(
    (a, b) =>
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  return results.map((e) => ({ ...e }));
}

export function getCollectionPlan(
  orgId: string,
  planId: string
): CollectionPlanWithEvents | null {
  const plan = store.collectionPlans.get(planId);
  if (!plan || plan.organization_id !== orgId) return null;

  const events = Array.from(store.collectionEvents.values())
    .filter((e) => e.collection_plan_id === planId)
    .sort(
      (a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    )
    .map((e) => ({ ...e }));

  return { ...plan, events };
}
