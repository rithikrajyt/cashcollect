import { NextRequest, NextResponse } from 'next/server';
import { getReceivablesReport } from '@/modules/reports/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const as_of_date = searchParams.get('as_of_date') ?? new Date().toISOString().split('T')[0];
  const customer_id = searchParams.get('customer_id') ?? undefined;
  const include_drafts = searchParams.get('include_drafts') === 'true';

  const report = getReceivablesReport(DEMO_ORG_ID, {
    as_of_date,
    customer_id,
    include_drafts,
  });

  return NextResponse.json(report);
}
