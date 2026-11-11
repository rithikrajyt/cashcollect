import { NextRequest, NextResponse } from 'next/server';
import { listInvoices, createInvoiceDraft } from '@/modules/receivables/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const customer_id = searchParams.get('customer_id') ?? undefined;
  const overdue_only = searchParams.get('overdue_only') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  const invoices = listInvoices(DEMO_ORG_ID, { status, customer_id, overdue_only, limit });

  // Enrich with customer names
  const { store } = await import('@/lib/db/store');
  const enriched = invoices.map((inv) => {
    const customer = store.customers.get(inv.customer_id);
    return {
      ...inv,
      customer_name: customer?.display_name ?? 'Unknown',
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createInvoiceDraft(DEMO_ORG_ID, body, 'user');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
