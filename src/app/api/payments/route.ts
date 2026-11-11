import { NextRequest, NextResponse } from 'next/server';
import { recordPayment, listPayments } from '@/modules/payments/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customer_id') ?? undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  const payments = listPayments(DEMO_ORG_ID, customerId, limit);
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = recordPayment(DEMO_ORG_ID, body, 'user');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
