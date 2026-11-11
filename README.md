# CashCollect Finance OS

A Claude-connected finance workspace for Indian SMEs. Create invoices, track collections and generate receivables reports by talking to Claude. CashCollect stores, validates and displays everything.

**No AI inside this application.** Claude runs in the user's own account and connects via MCP. CashCollect pays nothing for AI inference.

## Assignment Context

Built for the Volopay Product & Tech assignment: "Build a business that runs on Claude, with no AI inside it."

## Features (Implemented)

- Invoice creation, viewing and editing via web UI
- Customer management
- Collection plan scheduling with reminder events
- Receivables ageing report with 5 ageing buckets
- Remote MCP server with 8 tools (Streamable HTTP)
- Bearer token authentication for MCP
- Dashboard with KPI cards
- Audit trail for all mutations
- Realistic seed data for demo

## Features (Planned, not built)

- Supabase PostgreSQL persistence (migration SQL provided)
- Double-entry ledger and journal entries
- Payment receipts and allocation
- Email reminders via Resend
- Vendor bills and expenses
- Bank reconciliation
- CA/accountant portal

## Architecture

```
Claude (user's account)
    |
    | MCP Streamable HTTP
    v
CashCollect Next.js App
    |
    +-- /api/mcp      (MCP endpoint - 8 tools)
    +-- /api/*         (REST APIs for web UI)
    +-- /app/*         (Dashboard pages)
    +-- In-memory store (demo) / Supabase (production)
```

## Stack

| Layer | Technology |
|---|---|
| Web framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| MCP | @modelcontextprotocol/sdk 1.32 |
| Validation | Zod |
| Icons | Lucide React |
| Date handling | date-fns |
| Database (demo) | In-memory store |
| Database (production) | Supabase PostgreSQL |

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local: set DEMO_MODE=true and MCP_DEMO_BEARER_TOKEN

# Start development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

See `.env.example` for all variables. For local testing:

```env
DEMO_MODE=true
MCP_DEMO_BEARER_TOKEN=your-secret-token
MCP_DEMO_ORGANIZATION_ID=org_demo_northstar_001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## MCP Tools

| Tool | Description | Type |
|---|---|---|
| `list_customers` | Search/list customers | Read |
| `create_customer` | Create a new customer | Write |
| `create_invoice_draft` | Create draft invoice with line items | Write |
| `list_invoices` | List invoices with filters | Read |
| `get_invoice` | Get invoice detail with lines and collections | Read |
| `update_invoice_draft` | Update draft invoice fields | Write |
| `create_collection_plan` | Create reminder schedule for invoice | Write |
| `get_receivables_report` | Generate ageing report | Read |

## Connecting Claude

1. Deploy to a public HTTPS URL (Vercel recommended)
2. In Claude, go to Settings > Connectors > Add Custom Connector
3. Name: CashCollect Finance OS
4. URL: `https://your-domain.vercel.app/api/mcp`
5. Add header: `Authorization: Bearer <your-token>`
6. Enable and test

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Vitest
```

## Security Notes

- No AI API keys in the application
- MCP bearer token stored server-side only
- All financial calculations are deterministic (no LLM)
- Tenant scoping enforced on all queries
- Audit events for all mutations

## Documentation

- [Business specification](./business.md)
- [Build specification](./CLAUDE_MASTER_BUILD_PROMPT.md)
- [Deployment and testing guide](./DEPLOYMENT_TESTING_VIDEO_GUIDE.md)
