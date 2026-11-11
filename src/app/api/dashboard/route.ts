import { NextResponse } from 'next/server';
import { store, DEMO_ORG_ID } from '@/lib/db/store';
import { paiseToCurrency } from '@/lib/money';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const orgId = DEMO_ORG_ID;
    const invoices = store.listInvoices(orgId);
    const customers = store.listCustomers(orgId);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // KPI calculations
    const issuedInvoices = invoices.filter(
      (i) => i.status !== 'draft' && i.status !== 'voided' && i.status !== 'paid'
    );

    const totalOutstanding = issuedInvoices.reduce(
      (sum, i) => sum + (i.total_paise - i.paid_paise),
      0
    );

    const overdueInvoices = issuedInvoices.filter(
      (i) => i.due_date < today && i.total_paise - i.paid_paise > 0
    );
    const totalOverdue = overdueInvoices.reduce(
      (sum, i) => sum + (i.total_paise - i.paid_paise),
      0
    );

    // Collected this month
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const paidThisMonth = invoices
      .filter((i) => i.status === 'paid' && i.updated_at >= monthStart)
      .reduce((sum, i) => sum + i.paid_paise, 0);

    // Due next 7 days
    const dueNext7 = issuedInvoices.filter(
      (i) =>
        i.due_date >= today &&
        i.due_date <= sevenDaysLater &&
        i.total_paise - i.paid_paise > 0
    );
    const dueNext7Amount = dueNext7.reduce(
      (sum, i) => sum + (i.total_paise - i.paid_paise),
      0
    );

    // Recent invoices (last 5)
    const recentInvoices = [...invoices]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5)
      .map((inv) => {
        const customer = customers.find((c) => c.id === inv.customer_id);
        return {
          id: inv.id,
          invoice_number: inv.invoice_number,
          customer_name: customer?.display_name ?? 'Unknown',
          total_display: paiseToCurrency(inv.total_paise),
          status: inv.status,
          due_date: inv.due_date,
        };
      });

    // Overdue invoices
    const overdueList = overdueInvoices
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .slice(0, 5)
      .map((inv) => {
        const customer = customers.find((c) => c.id === inv.customer_id);
        const daysOverdue = Math.floor(
          (new Date(today).getTime() - new Date(inv.due_date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return {
          id: inv.id,
          invoice_number: inv.invoice_number,
          customer_name: customer?.display_name ?? 'Unknown',
          outstanding_display: paiseToCurrency(inv.total_paise - inv.paid_paise),
          days_overdue: daysOverdue,
        };
      });

    return NextResponse.json({
      kpis: {
        total_outstanding_paise: totalOutstanding,
        total_outstanding_display: paiseToCurrency(totalOutstanding),
        total_overdue_paise: totalOverdue,
        total_overdue_display: paiseToCurrency(totalOverdue),
        collected_this_month_paise: paidThisMonth,
        collected_this_month_display: paiseToCurrency(paidThisMonth),
        due_next_7_days_count: dueNext7.length,
        due_next_7_days_paise: dueNext7Amount,
        due_next_7_days_display: paiseToCurrency(dueNext7Amount),
      },
      recent_invoices: recentInvoices,
      overdue_invoices: overdueList,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
