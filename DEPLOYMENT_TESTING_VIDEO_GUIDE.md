# CashCollect Finance OS — Deployment, Testing and Video Guide

## 17.1 Project Status

- **Product:** CashCollect Finance OS v1.0.0
- **Date prepared:** 11 November 2026
- **Branch:** main
- **Stack:** Next.js 16 + TypeScript + Tailwind CSS + MCP SDK 1.32

### Features implemented (P0 complete)

- Landing page with product description
- Dashboard with KPI cards (outstanding, overdue, collected, due soon)
- Receivables list with filtering and search
- Invoice detail view with editable draft fields
- Customer list and search
- Collections schedule view
- Receivables ageing report
- Remote MCP server (Streamable HTTP) with 8 tools
- Bearer token authentication for MCP
- In-memory data store with realistic seed data (5 customers, 8+ invoices)
- Audit event logging for all mutations
- No AI API keys or model calls in the application

### Known limitations

- Uses in-memory store (data resets on server restart). Supabase migration available for persistent storage.
- Email delivery not configured (reminders saved as drafts only)
- No Supabase Auth integration yet — uses demo mode for immediate testing
- Double-entry ledger (P1) not implemented
- No Vercel deployment yet — requires user to deploy and configure

## 17.2 Live URLs

| Resource | URL | Status |
|---|---|---|
| Local web app | http://localhost:3000 | Verified working |
| Local MCP endpoint | http://localhost:3000/api/mcp | Verified working |
| Local health check | http://localhost:3000/api/health | Verified working |
| Production web app | `<deploy to Vercel and fill in>` | NOT YET DEPLOYED |
| Production MCP endpoint | `<production-url>/api/mcp` | NOT YET DEPLOYED |

## 17.3 Environment Variables

| Variable | Purpose | Required | Public/Secret | Where |
|---|---|---|---|---|
| `DEMO_MODE` | Enable in-memory demo store | Yes (for local) | Public | `.env.local` |
| `MCP_DEMO_BEARER_TOKEN` | Auth token for MCP requests | Yes | Secret | `.env.local`, Vercel |
| `MCP_DEMO_ORGANIZATION_ID` | Demo org UUID | No (defaults to seed org) | Public | `.env.local` |
| `NEXT_PUBLIC_APP_URL` | App base URL for MCP links | No (defaults localhost) | Public | `.env.local`, Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | For production | Public | Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | For production | Public | Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key | For production | Secret | Vercel only |

### Setup commands

```bash
# Install
npm install

# Create env file
cp .env.example .env.local
# Edit .env.local with your values

# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## 17.4 Database Setup

### Local demo mode (immediate testing)

Set `DEMO_MODE=true` in `.env.local`. The app uses an in-memory store pre-seeded with:

- **Organization:** Northstar Digital Services Pvt. Ltd. (ID: `org_demo_northstar_001`)
- **5 customers:** TechVista Solutions, Pinnacle Staffing, Meridian Creative, Cloudbridge Infrastructure, NexGen Analytics
- **8 invoices:** 2 overdue, 2 due soon, 2 paid, 1 partially paid, 1 draft
- **Collection plans and events** for selected invoices
- **Audit events** for all seeded records

### Supabase deployment (production)

1. Create a Supabase project at supabase.com
2. Run the SQL migration from `supabase/migrations/` in the SQL editor
3. Run `supabase/seed.sql` to populate demo data
4. Copy project URL and anon key to Vercel environment variables
5. Set `DEMO_MODE=false`

## 17.5 Claude MCP Connector Setup

### For local testing

1. Open Claude Desktop or claude.ai (requires MCP connector support)
2. Go to Settings > Connectors (or equivalent current UI)
3. Add Custom Connector
4. **Name:** CashCollect Finance OS
5. **URL:** `http://localhost:3000/api/mcp` (for local) or `https://<your-vercel-url>/api/mcp` (for production)
6. **Authentication:** Add header `Authorization` with value `Bearer <your-MCP_DEMO_BEARER_TOKEN>`
7. Save and enable the connector

**Important:** Claude's cloud connector requires a publicly accessible HTTPS endpoint. For local testing, use a tunnel service like ngrok or deploy to Vercel first.

### For production/reviewer

1. Deploy the app to Vercel
2. Set `MCP_DEMO_BEARER_TOKEN` in Vercel environment variables
3. Use the Vercel URL as the MCP endpoint
4. Configure the bearer token in Claude's connector settings

## 17.6 Reviewer Test Credentials

| Field | Value |
|---|---|
| App URL | http://localhost:3000/app (local) or production URL |
| Auth | Demo mode — no login required |
| MCP Bearer Token | Set in `.env.local` as `MCP_DEMO_BEARER_TOKEN` |
| Access level | Full read/write on demo organization |

## 17.7 Verified Test Report

| ID | Test | Expected | Actual | Status |
|---|---|---|---|---|
| T1 | Health endpoint | 200 OK with service info | 200 OK | PASS |
| T2 | MCP auth rejected (no token) | 401 | 401 | PASS |
| T3 | MCP initialize | Server info returned | Server info returned | PASS |
| T4 | MCP tools/list | 8 tools | 8 tools | PASS |
| T5 | create_customer via MCP | Customer created with ID | Customer created | PASS |
| T6 | create_invoice_draft via MCP | Draft invoice with number | DRAFT-2026-XXXX created | PASS |
| T7 | list_customers via MCP | Returns seeded customers | 5+ customers returned | PASS |
| T8 | get_receivables_report via MCP | Ageing buckets and totals | Correct totals calculated | PASS |
| T9 | create_collection_plan via MCP | Schedule created | 3 events scheduled | PASS |
| T10 | get_invoice via MCP | Full invoice with lines | Invoice + lines returned | PASS |
| T11 | Landing page renders | 200 | 200 | PASS |
| T12 | Dashboard renders | 200 with KPI cards | 200 | PASS |
| T13 | Receivables list renders | 200 with invoice table | 200 | PASS |
| T14 | Invoice detail renders | 200 with line items | 200 | PASS |
| T15 | Invoice draft edit (PATCH) | Notes/due_date updated | Updated successfully | PASS |
| T16 | No-AI audit | No AI API keys in code | Clean — no hits | PASS |
| T17 | Build succeeds | No TypeScript errors | Build clean | PASS |

## 17.8 End-to-End Reviewer Script

### Prompt 1 — Create/find customer

> Using CashCollect, find a customer named ABC Technologies. If it does not exist, create it with email finance@example.com and 15-day payment terms. Return the saved customer ID and CashCollect link.

### Prompt 2 — Create invoice and collection plan

> Create a draft invoice for ABC Technologies dated 10 November 2026 and due 25 November 2026. Add one line: Software consulting, quantity 1, unit price 8500000 paise (₹85,000), tax 0. Create a collection plan with reminders 3 days before due date, on due date and 3 days after. Do not send emails. Return the invoice link and schedule summary.

### Prompt 3 — Edit in web app

> Open the CashCollect invoice link, change the notes to "November consulting retainer" and save the draft. Refresh the page and make sure the change persists.

### Prompt 4 — Read report

> Retrieve this invoice and prepare a receivables report as of 10 November 2026. Show the invoice total, due date, status, outstanding amount and ageing bucket. Do not estimate any value; use CashCollect's saved records.

## 17.9 Five-Minute Video Demo Plan

| Time | Section | Content |
|---|---|---|
| 0:00–0:45 | Who you are | Founder intro and background |
| 0:45–1:15 | Best work | Previous project with measurable results |
| 1:15–2:15 | Why this wins | SME finance pain, Claude as interface, CashCollect as system of record, no AI cost |
| 2:15–4:15 | Demo | Claude creates invoice via MCP → appears in dashboard → edit in app → report matches |
| 4:15–5:00 | Economics | ₹999–4,999/month pricing, zero AI inference cost, first 100 via founder-led outbound and CA referrals |

### Demo preparation

- **Tab 1:** Claude with CashCollect connector enabled
- **Tab 2:** CashCollect dashboard (http://localhost:3000/app or production URL)
- **Tab 3:** CashCollect receivables page

### Demo flow

1. In Claude, paste Prompt 2 (create invoice + collection plan)
2. Show Claude calling `create_invoice_draft` and `create_collection_plan` tools
3. Switch to Tab 2, refresh dashboard — new invoice appears
4. Click into the invoice, edit notes, save
5. Back in Claude, paste Prompt 4 (get report)
6. Show report values match what's in the dashboard

## 17.10 Submission Checklist

- [ ] Working live app URL (deploy to Vercel)
- [ ] Test credentials documented
- [ ] Working MCP URL (public HTTPS)
- [ ] Claude connector setup steps
- [ ] 5-minute video recorded and uploaded
- [ ] No AI API keys in the codebase (verified)
- [ ] All links checked from incognito browser
- [ ] Final status and limitations stated
