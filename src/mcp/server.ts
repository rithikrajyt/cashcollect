import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as customerService from '@/modules/customers/service';
import * as invoiceService from '@/modules/receivables/service';
import * as collectionService from '@/modules/collections/service';
import * as reportService from '@/modules/reports/service';
import * as paymentService from '@/modules/payments/service';
import { paiseToCurrency } from '@/lib/money';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function fmt(paise: number): string {
  return paiseToCurrency(paise);
}

export function createMcpServer(organizationId: string): McpServer {
  const server = new McpServer(
    {
      name: 'CashCollect Finance OS',
      version: '1.0.0',
    },
    {
      instructions:
        'CashCollect Finance OS — the financial workspace for Indian SMEs. ' +
        'Use these tools to manage customers, invoices, collection plans and ' +
        'financial reports. All data is persisted in CashCollect and visible in ' +
        'the web dashboard. Money amounts in tool inputs are in paise (1 INR = 100 paise).',
    },
  );

  // ─── Tool 1: list_customers ───────────────────────────────────────────

  server.tool(
    'list_customers',
    'List or search customers in the CashCollect workspace. Read-only. ' +
      'Returns active customers matching the optional search query.',
    {
      query: z.string().max(100).describe('Optional substring to search customer names').optional(),
      limit: z.number().int().min(1).max(50).describe('Max results to return (default 20)').optional(),
    },
    async (args) => {
      try {
        const customers = customerService.listCustomers(organizationId, args.query, args.limit);
        if (customers.length === 0) {
          return {
            content: [{
              type: 'text' as const,
              text: args.query ? `No customers found matching "${args.query}".` : 'No customers found. Use create_customer to add one.',
            }],
          };
        }
        const lines = customers.map(
          (c) => `• ${c.display_name} (ID: ${c.id})\n  Email: ${c.email || '—'}  |  Payment terms: ${c.payment_terms_days} days`,
        );
        return {
          content: [{ type: 'text' as const, text: `Found ${customers.length} customer(s):\n\n${lines.join('\n\n')}` }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 2: create_customer ──────────────────────────────────────────

  server.tool(
    'create_customer',
    'Create a new customer record in CashCollect. Requires display_name. ' +
      'The customer is saved with active status. This is a write operation.',
    {
      display_name: z.string().min(1).max(200).describe('Customer display name (required)'),
      legal_name: z.string().max(300).describe('Legal / registered name').optional(),
      email: z.string().email().describe('Primary email').optional(),
      phone: z.string().max(20).describe('Phone number').optional(),
      gstin: z.string().max(20).describe('GSTIN if applicable').optional(),
      payment_terms_days: z.number().int().min(0).max(365).describe('Payment terms in days (default 15)').optional(),
      notes: z.string().max(1000).describe('Optional notes').optional(),
    },
    async (args) => {
      try {
        const result = customerService.createCustomer(
          organizationId,
          {
            display_name: args.display_name,
            legal_name: args.legal_name,
            email: args.email,
            phone: args.phone,
            gstin: args.gstin,
            payment_terms_days: args.payment_terms_days ?? 15,
            notes: args.notes,
          },
          'mcp',
        );
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const c = result.data;
        return {
          content: [{
            type: 'text' as const,
            text:
              `Customer created successfully.\n\n` +
              `Name: ${c.display_name}\n` +
              `ID: ${c.id}\n` +
              `Email: ${c.email || '—'}\n` +
              `Payment terms: ${c.payment_terms_days} days\n` +
              `Status: ${c.status}\n\n` +
              `View in CashCollect: ${APP_URL}/app/customers/${c.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 3: create_invoice_draft ─────────────────────────────────────

  server.tool(
    'create_invoice_draft',
    'Create a draft invoice in CashCollect with line items. The invoice ' +
      'starts in draft status and can be edited in the web app. Does NOT ' +
      'issue or send the invoice. Money amounts are in paise (100 paise = ₹1).',
    {
      customer_id: z.string().describe('Customer UUID'),
      invoice_date: z.string().describe('Invoice date in YYYY-MM-DD format'),
      due_date: z.string().describe('Due date in YYYY-MM-DD format'),
      currency: z.string().default('INR').describe('Currency code (default INR)').optional(),
      notes: z.string().max(2000).describe('Invoice notes').optional(),
      lines: z.array(
        z.object({
          description: z.string().min(1).describe('Line item description'),
          quantity: z.number().positive().default(1).describe('Quantity (default 1)'),
          unit_price_paise: z.number().int().nonnegative().describe('Unit price in paise (e.g. 8500000 = ₹85,000)'),
          tax_amount_paise: z.number().int().nonnegative().default(0).describe('Tax amount in paise for this line (default 0)').optional(),
        }),
      ).min(1).max(50).describe('Invoice line items (at least 1)'),
    },
    async (args) => {
      try {
        const result = invoiceService.createInvoiceDraft(
          organizationId,
          {
            customer_id: args.customer_id,
            invoice_date: args.invoice_date,
            due_date: args.due_date,
            currency: args.currency ?? 'INR',
            notes: args.notes,
            lines: args.lines.map((l) => ({
              description: l.description,
              quantity: l.quantity ?? 1,
              unit_price_paise: l.unit_price_paise,
              tax_amount_paise: l.tax_amount_paise ?? 0,
            })),
          },
          'mcp',
        );
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const inv = result.data;
        const customer = customerService.getCustomer(organizationId, inv.customer_id);
        return {
          content: [{
            type: 'text' as const,
            text:
              `Draft invoice created successfully.\n\n` +
              `Invoice number: ${inv.invoice_number}\n` +
              `Invoice ID: ${inv.id}\n` +
              `Customer: ${customer?.display_name ?? inv.customer_id}\n` +
              `Date: ${inv.invoice_date}\n` +
              `Due date: ${inv.due_date}\n` +
              `Subtotal: ${fmt(inv.subtotal_paise)}\n` +
              `Tax: ${fmt(inv.tax_total_paise)}\n` +
              `Total: ${fmt(inv.total_paise)}\n` +
              `Status: ${inv.status}\n` +
              `Line items: ${inv.lines.length}\n\n` +
              `View in CashCollect: ${APP_URL}/app/receivables/${inv.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 4: list_invoices ────────────────────────────────────────────

  server.tool(
    'list_invoices',
    'List invoices in CashCollect. Can filter by status, customer or overdue flag. Read-only.',
    {
      status: z.enum(['all', 'draft', 'issued', 'partially_paid', 'paid', 'voided', 'disputed']).default('all').describe('Filter by status').optional(),
      customer_id: z.string().describe('Filter by customer UUID').optional(),
      overdue_only: z.boolean().default(false).describe('Show only overdue invoices').optional(),
      limit: z.number().int().min(1).max(50).default(20).describe('Max results (default 20)').optional(),
    },
    async (args) => {
      try {
        const invoices = invoiceService.listInvoices(organizationId, {
          status: args.status === 'all' ? undefined : args.status,
          customer_id: args.customer_id,
          overdue_only: args.overdue_only ?? false,
          limit: args.limit ?? 20,
        });
        if (invoices.length === 0) {
          return { content: [{ type: 'text' as const, text: 'No invoices found matching the filters.' }] };
        }
        const customerCache = new Map<string, string>();
        const lines = invoices.map((inv) => {
          let custName = customerCache.get(inv.customer_id);
          if (!custName) {
            const c = customerService.getCustomer(organizationId, inv.customer_id);
            custName = c?.display_name ?? 'Unknown';
            customerCache.set(inv.customer_id, custName);
          }
          return (
            `${inv.invoice_number} — ${custName}\n` +
            `  Total: ${fmt(inv.total_paise)}  |  Paid: ${fmt(inv.paid_paise)}  |  Outstanding: ${fmt(inv.total_paise - inv.paid_paise)}\n` +
            `  Due: ${inv.due_date}  |  Status: ${inv.status}`
          );
        });
        return { content: [{ type: 'text' as const, text: `Found ${invoices.length} invoice(s):\n\n${lines.join('\n\n')}` }] };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 5: get_invoice ──────────────────────────────────────────────

  server.tool(
    'get_invoice',
    'Get detailed invoice information including line items, collection plans and payment status. Read-only.',
    {
      invoice_id: z.string().describe('Invoice UUID'),
    },
    async (args) => {
      try {
        const data = invoiceService.getInvoiceWithRelations(organizationId, args.invoice_id);
        if (!data) {
          return { content: [{ type: 'text' as const, text: 'Invoice not found.' }], isError: true };
        }
        const inv = data.invoice;
        const outstanding = inv.total_paise - inv.paid_paise;
        const linesText = data.lines
          .map((l, i) => `  ${i + 1}. ${l.description} — Qty: ${l.quantity} x ${fmt(l.unit_price_paise)} = ${fmt(l.line_subtotal_paise)}`)
          .join('\n');

        let collectionsText = '';
        for (const plan of data.collection_plans) {
          if (plan.events.length > 0) {
            collectionsText += '\n\nCollection schedule:\n' +
              plan.events.map((e) => `  ${e.event_type} — ${e.scheduled_at.split('T')[0]} — Status: ${e.status}`).join('\n');
          }
        }

        return {
          content: [{
            type: 'text' as const,
            text:
              `Invoice: ${inv.invoice_number}\n` +
              `Customer: ${data.customer?.display_name ?? 'Unknown'}\n` +
              `Status: ${inv.status}\n` +
              `Date: ${inv.invoice_date}  |  Due: ${inv.due_date}\n\n` +
              `Line items:\n${linesText}\n\n` +
              `Subtotal: ${fmt(inv.subtotal_paise)}\n` +
              `Tax: ${fmt(inv.tax_total_paise)}\n` +
              `Total: ${fmt(inv.total_paise)}\n` +
              `Paid: ${fmt(inv.paid_paise)}\n` +
              `Outstanding: ${fmt(outstanding)}` +
              (inv.notes ? `\n\nNotes: ${inv.notes}` : '') +
              collectionsText +
              `\n\nView in CashCollect: ${APP_URL}/app/receivables/${inv.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 6: update_invoice_draft ─────────────────────────────────────

  server.tool(
    'update_invoice_draft',
    'Update a draft invoice in CashCollect. Only draft invoices can be modified. Can update due_date, notes and line items.',
    {
      invoice_id: z.string().describe('Invoice UUID'),
      due_date: z.string().describe('New due date (YYYY-MM-DD)').optional(),
      notes: z.string().max(2000).describe('Updated notes').optional(),
      lines: z.array(
        z.object({
          description: z.string().min(1),
          quantity: z.number().positive().default(1),
          unit_price_paise: z.number().int().nonnegative(),
          tax_amount_paise: z.number().int().nonnegative().default(0).optional(),
        }),
      ).min(1).max(50).describe('Replacement line items').optional(),
    },
    async (args) => {
      try {
        const result = invoiceService.updateInvoiceDraft(
          organizationId,
          args.invoice_id,
          {
            due_date: args.due_date,
            notes: args.notes,
            lines: args.lines?.map((l) => ({
              description: l.description,
              quantity: l.quantity ?? 1,
              unit_price_paise: l.unit_price_paise,
              tax_amount_paise: l.tax_amount_paise ?? 0,
            })),
          },
          'mcp',
        );
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const inv = result.data;
        return {
          content: [{
            type: 'text' as const,
            text:
              `Draft invoice updated successfully.\n\n` +
              `Invoice number: ${inv.invoice_number}\n` +
              `Due date: ${inv.due_date}\n` +
              `Total: ${fmt(inv.total_paise)}\n` +
              `Status: ${inv.status}\n\n` +
              `View in CashCollect: ${APP_URL}/app/receivables/${inv.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 7: issue_invoice ─────────────────────────────────────────────

  server.tool(
    'issue_invoice',
    'Issue a draft invoice in CashCollect. This changes the invoice status from draft to issued ' +
      'and assigns a final invoice number (INV-YYYY-NNNN). Once issued, the invoice cannot be ' +
      'directly edited. This is a consequential action.',
    {
      invoice_id: z.string().describe('Invoice UUID to issue'),
    },
    async (args) => {
      try {
        const result = invoiceService.issueInvoice(organizationId, args.invoice_id, 'mcp');
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const inv = result.data;
        const customer = customerService.getCustomer(organizationId, inv.customer_id);
        return {
          content: [{
            type: 'text' as const,
            text:
              `Invoice issued successfully.\n\n` +
              `Invoice number: ${inv.invoice_number}\n` +
              `Customer: ${customer?.display_name ?? inv.customer_id}\n` +
              `Total: ${fmt(inv.total_paise)}\n` +
              `Status: ${inv.status}\n\n` +
              `The invoice is now finalized and cannot be edited directly.\n\n` +
              `View in CashCollect: ${APP_URL}/app/receivables/${inv.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 8: create_collection_plan ───────────────────────────────────

  server.tool(
    'create_collection_plan',
    'Create a collection reminder plan for an invoice. Reminders are ' +
      'scheduled relative to the due date. This does NOT send any emails — ' +
      'it creates a schedule visible in CashCollect. Write operation.',
    {
      invoice_id: z.string().describe('Invoice UUID'),
      reminders: z.array(
        z.object({
          offset_days_from_due: z.number().int().min(-30).max(180).describe('Days relative to due date (negative = before, 0 = on due, positive = after)'),
          event_type: z.enum(['before_due', 'due_date', 'overdue', 'manual_follow_up']).describe('Type of reminder event'),
        }),
      ).min(1).max(10).describe('Reminder schedule entries'),
      channel: z.enum(['email', 'manual']).default('email').describe('Reminder channel (default email)').optional(),
    },
    async (args) => {
      try {
        const result = collectionService.createCollectionPlan(
          organizationId,
          {
            invoice_id: args.invoice_id,
            reminders: args.reminders,
            channel: args.channel ?? 'email',
          },
          'mcp',
        );
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const plan = result.data;
        const invoice = invoiceService.getInvoice(organizationId, args.invoice_id);
        const eventsText = plan.events
          .map((e) => `  ${e.event_type} — ${e.scheduled_at.split('T')[0]} — Status: ${e.status}`)
          .join('\n');

        return {
          content: [{
            type: 'text' as const,
            text:
              `Collection plan created.\n\n` +
              `Plan ID: ${plan.id}\n` +
              `Invoice: ${invoice?.invoice_number ?? args.invoice_id}\n` +
              `Channel: ${plan.channel}\n` +
              `Events (${plan.events.length}):\n${eventsText}\n\n` +
              `Note: No emails have been sent. Email delivery requires configuration. ` +
              `The schedule is visible in the CashCollect collections tab.\n\n` +
              `View in CashCollect: ${APP_URL}/app/collections`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 8: get_receivables_report ───────────────────────────────────

  server.tool(
    'get_receivables_report',
    'Generate a receivables ageing report from CashCollect records. All ' +
      'values are calculated from the database — not estimated. Returns ' +
      'total outstanding, ageing buckets and per-invoice detail. Read-only.',
    {
      as_of_date: z.string().describe('Report cutoff date in YYYY-MM-DD format'),
      customer_id: z.string().describe('Optional: filter by customer UUID').optional(),
      include_drafts: z.boolean().default(false).describe('Include draft invoices (default false)').optional(),
    },
    async (args) => {
      try {
        const report = reportService.getReceivablesReport(organizationId, {
          as_of_date: args.as_of_date,
          customer_id: args.customer_id,
          include_drafts: args.include_drafts ?? false,
        });

        const bucketsText = report.buckets
          .map((b) => `  ${b.label}: ${b.amount_display} (${b.count} invoices)`)
          .join('\n');

        const invoiceRows = report.invoices
          .map(
            (inv) =>
              `  ${inv.invoice_number} | ${inv.customer_name} | Due: ${inv.due_date} | ` +
              `Total: ${inv.total_display} | Paid: ${inv.paid_display} | ` +
              `Outstanding: ${inv.outstanding_display} | ${inv.bucket}`,
          )
          .join('\n');

        return {
          content: [{
            type: 'text' as const,
            text:
              `Receivables Ageing Report\n` +
              `Report date: ${report.as_of_date}  |  Currency: ${report.currency}\n\n` +
              `Summary:\n` +
              `  Total issued: ${report.total_issued_display}\n` +
              `  Total paid:   ${report.total_paid_display}\n` +
              `  Outstanding:  ${report.total_outstanding_display}\n` +
              `  Invoices: ${report.invoice_count}  |  Customers: ${report.customer_count}\n\n` +
              `Ageing buckets:\n${bucketsText}\n\n` +
              `Invoice details:\n${invoiceRows || '  (no invoices)'}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  // ─── Tool 10: record_payment ─────────────────────────────────────────

  server.tool(
    'record_payment',
    'Record a customer payment and allocate it to a specific invoice. The payment amount ' +
      'must not exceed the invoice outstanding balance. This updates the invoice paid amount ' +
      'and status (partially_paid or paid). This is a financially consequential write operation.',
    {
      customer_id: z.string().describe('Customer UUID'),
      invoice_id: z.string().describe('Invoice UUID to allocate payment to'),
      payment_date: z.string().describe('Payment date in YYYY-MM-DD format'),
      amount_paise: z.number().int().positive().describe('Payment amount in paise (e.g. 5000000 = ₹50,000)'),
      method: z.enum(['bank_transfer', 'cash', 'cheque', 'upi', 'other']).default('bank_transfer').describe('Payment method (default bank_transfer)').optional(),
      reference: z.string().max(200).describe('Payment reference number').optional(),
      notes: z.string().max(500).describe('Payment notes').optional(),
    },
    async (args) => {
      try {
        const result = paymentService.recordPayment(
          organizationId,
          {
            customer_id: args.customer_id,
            invoice_id: args.invoice_id,
            payment_date: args.payment_date,
            amount_paise: args.amount_paise,
            method: args.method ?? 'bank_transfer',
            reference: args.reference,
            notes: args.notes,
          },
          'mcp',
        );
        if (!result.success) {
          return { content: [{ type: 'text' as const, text: `Error: ${result.error}` }], isError: true };
        }
        const { payment, invoice_updated } = result.data;
        const customer = customerService.getCustomer(organizationId, payment.customer_id);
        const previousOutstanding = invoice_updated.total_paise - invoice_updated.paid_paise + payment.amount_paise;
        const newOutstanding = invoice_updated.total_paise - invoice_updated.paid_paise;

        return {
          content: [{
            type: 'text' as const,
            text:
              `Payment recorded successfully.\n\n` +
              `Payment ID: ${payment.id}\n` +
              `Customer: ${customer?.display_name ?? payment.customer_id}\n` +
              `Amount: ${fmt(payment.amount_paise)}\n` +
              `Method: ${payment.method}\n` +
              `Reference: ${payment.reference || 'none'}\n` +
              `Date: ${payment.payment_date}\n\n` +
              `Invoice: ${invoice_updated.invoice_number}\n` +
              `Previous outstanding: ${fmt(previousOutstanding)}\n` +
              `Payment applied: ${fmt(payment.amount_paise)}\n` +
              `New outstanding: ${fmt(newOutstanding)}\n` +
              `Invoice status: ${invoice_updated.status}\n\n` +
              `View in CashCollect: ${APP_URL}/app/receivables/${invoice_updated.id}`,
          }],
        };
      } catch (err: unknown) {
        return { content: [{ type: 'text' as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
      }
    },
  );

  return server;
}
