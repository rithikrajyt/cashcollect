import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceWithRelations, updateInvoiceDraft, issueInvoice } from '@/modules/receivables/service';
import { listAuditEvents } from '@/modules/audit/service';

export const dynamic = 'force-dynamic';

const DEMO_ORG_ID = 'org_demo_northstar_001';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;
  const result = getInvoiceWithRelations(DEMO_ORG_ID, invoiceId);

  if (!result) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // Include audit events
  const auditEvents = listAuditEvents(DEMO_ORG_ID, 'invoice', invoiceId);

  return NextResponse.json({ ...result, audit_events: auditEvents.slice(0, 20) });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;

  try {
    const body = await req.json();
    const result = updateInvoiceDraft(DEMO_ORG_ID, invoiceId, body, 'user');

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;
  try {
    const body = await req.json();
    if (body.action === 'issue') {
      const result = issueInvoice(DEMO_ORG_ID, invoiceId, 'user');
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result.data);
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
