import { NextRequest, NextResponse } from 'next/server';
import { listCollectionEvents, createCollectionPlan } from '@/modules/collections/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const invoice_id = searchParams.get('invoice_id') ?? undefined;
  const status = searchParams.get('status') ?? undefined;

  const events = listCollectionEvents(DEMO_ORG_ID, { invoice_id, status });

  // Enrich events with invoice numbers and customer names
  const { store } = await import('@/lib/db/store');
  const enriched = events.map((evt) => {
    const invoice = store.invoices.get(evt.invoice_id);
    const customer = invoice ? store.customers.get(invoice.customer_id) : null;
    return {
      ...evt,
      invoice_number: invoice?.invoice_number ?? 'Unknown',
      customer_name: customer?.display_name ?? 'Unknown',
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createCollectionPlan(DEMO_ORG_ID, body, 'user');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
