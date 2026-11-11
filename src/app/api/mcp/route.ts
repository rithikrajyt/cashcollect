import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createMcpServer } from '@/mcp/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Authenticate the MCP request using a Bearer token.
 * Returns the organization ID on success, null on failure.
 * TEMPORARY: Allow unauthenticated access for ChatGPT testing
 */
function authenticateRequest(req: Request): string | null {
  // TEMPORARY: Allow all requests for ChatGPT MCP testing
  // TODO: Re-enable token verification after testing
  return process.env.MCP_DEMO_ORGANIZATION_ID || 'org_demo_northstar_001';

  /* Original auth logic (disabled for testing)
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const expectedToken = process.env.MCP_DEMO_BEARER_TOKEN;

  if (!expectedToken && process.env.DEMO_MODE === 'true') {
    return process.env.MCP_DEMO_ORGANIZATION_ID || 'org_demo_northstar_001';
  }

  if (!expectedToken || !token || token !== expectedToken) {
    return null;
  }

  return process.env.MCP_DEMO_ORGANIZATION_ID || 'org_demo_northstar_001';
  */
}

/**
 * Handle an MCP request statelessly.
 * Each request creates its own transport and server instance.
 */
async function handleMcpRequest(req: Request): Promise<Response> {
  // Authenticate
  const orgId = authenticateRequest(req);
  if (!orgId) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Unauthorized' },
        id: null,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // Create stateless transport (no session tracking)
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  // Create MCP server scoped to the authenticated organization
  const mcpServer = createMcpServer(orgId);

  // Connect server to transport
  await mcpServer.connect(transport);

  // Handle the web request
  const response = await transport.handleRequest(req);

  return response;
}

export async function POST(req: Request) {
  return handleMcpRequest(req);
}

export async function GET(req: Request) {
  return handleMcpRequest(req);
}

export async function DELETE(req: Request) {
  return handleMcpRequest(req);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
      'Access-Control-Max-Age': '86400',
    },
  });
}
