import { NextRequest, NextResponse } from 'next/server';
import { listCustomers, createCustomer } from '@/modules/customers/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  const customers = listCustomers(DEMO_ORG_ID, q, limit);
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createCustomer(DEMO_ORG_ID, body, 'user');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
