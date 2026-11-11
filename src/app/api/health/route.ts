export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'CashCollect Finance OS',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mcp_endpoint: '/api/mcp',
  });
}
