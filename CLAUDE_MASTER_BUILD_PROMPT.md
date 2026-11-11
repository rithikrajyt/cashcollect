# CashCollect Finance OS — Claude Master Build Specification

> **Document type:** Autonomous implementation brief for Claude Code / a coding agent with terminal and filesystem access  
> **Product:** CashCollect Finance OS  
> **Version:** 1.0  
> **Prepared:** 10 November 2026  
> **Assignment context:** Volopay Product & Tech — Build a business that runs on Claude, with no AI inside it  
> **Primary outcome:** A polished, working, internet-deployed full-stack application with a working remote MCP connector, plus a verified deployment/testing/video handoff document.  
> **Required final generated document:** `DEPLOYMENT_TESTING_VIDEO_GUIDE.md`

---

# PART 0 — READ THIS FIRST: EXECUTION CONTRACT FOR CLAUDE

## 0.1 Your role

You are acting as the **principal full-stack engineer, MCP engineer, product designer, QA engineer and release engineer** for CashCollect Finance OS.

You are not being asked to provide advice, a plan only, or code snippets for the user to assemble. You are being asked to **build the project in the active workspace** from an empty or existing repository, run it, test it, correct it, deploy it where credentials permit, and leave behind complete operational documentation.

Operate as an autonomous coding agent. Use the terminal, inspect the repository, create and edit files, install packages, run migrations, run tests, start the app, inspect errors, and fix them. Do not stop after generating a scaffold or a list of recommendations.

This specification is the execution contract. The companion `business.md` describes the larger business vision. The original `Volopay Product Tech Assignment.pdf` is the acceptance-criteria source. Read both before implementation whenever they are present in the project root.

## 0.2 First actions — mandatory preflight

1. Inspect the current directory and repository state. Do not overwrite an existing implementation blindly.
2. Read these files if present:
   - `CLAUDE_MASTER_BUILD_PROMPT.md` (this file)
   - `business.md`
   - `Volopay Product Tech Assignment.pdf` (extract text locally or use an available PDF reader; do not infer unseen content)
   - existing `README.md`, `package.json`, `.env.example`, migrations and source files.
3. Identify whether this is a new project or an existing project. Preserve useful existing work.
4. Inspect the installed runtime versions (`node -v`, `npm -v`) and available tools.
5. Create or update `IMPLEMENTATION_LOG.md` with:
   - current date/time if available;
   - starting repository state;
   - decisions made;
   - implementation phases;
   - tests and their actual results;
   - blockers and resolutions;
   - deployment state and URLs only when verified.
6. Create or update `TASKS.md` with a checkbox list derived from this specification.
7. Then begin implementation. Do not wait for user approval for ordinary engineering choices that are already constrained by this document.

### If required information or credentials are missing

Do not fabricate them. Build all code and local functionality that can be completed without them. Ask the user only for a genuinely blocking secret or external account action, and ask for all currently blocking details together in one concise message. Never ask the user to paste production secrets into source files or into a public issue. Prefer configuring secrets directly in the provider dashboard or a local `.env.local` file.

Typical external values that may be required later:

- Supabase project URL and publishable/anon key;
- Supabase service-role/secret key for server-only use if required by the selected access design;
- Vercel account/project access;
- `MCP_DEMO_BEARER_TOKEN` (generate a strong random value; never hard-code it);
- optional Resend API key and verified sender domain for actual email reminders.

If Vercel/Supabase credentials are not available, still complete a local build, database migrations, seed data, tests, MCP server and the deployment guide. Mark deployment as **not completed due to missing access**, not as successful.

## 0.3 Autonomous build loop — use this after every phase

Work in short, verifiable implementation loops:

1. **Inspect:** inspect the relevant files and current behavior before editing.
2. **Define:** state the precise acceptance criteria for the next small unit of work in `IMPLEMENTATION_LOG.md`.
3. **Implement:** make the smallest coherent code change that meets those criteria.
4. **Format and lint:** run the formatter/linter and correct issues.
5. **Type-check:** run TypeScript checking.
6. **Test:** run the closest unit/integration test, then broader tests where practical.
7. **Exercise:** run the app or endpoint and verify actual behavior, not just compilation.
8. **Review:** inspect the diff for secrets, tenant-scope errors, accounting errors, unsafe writes and unhandled failures.
9. **Record:** update `TASKS.md` and `IMPLEMENTATION_LOG.md` with the actual result.
10. **Continue:** proceed to the next dependency only when the current phase passes or a documented, consciously accepted limitation exists.

### Bounded self-correction

- When a test or command fails, read the complete error and identify its root cause before changing code.
- Attempt a targeted fix. Re-run the failed test after every fix.
- Do not repeatedly make speculative changes. After 3 failed attempts on the same blocker, pause that branch, inspect current official documentation or source types, choose the least risky fallback, document the trade-off, and continue with the core acceptance criteria.
- Never delete a failing test, weaken a security rule, skip a type check or mark a task complete merely to make the build green.
- Do not run destructive database resets against a remotely shared or production database without explicit approval.
- Do not run indefinite loops. Every loop must have a named acceptance criterion and a verifiable exit condition.

## 0.4 Prioritisation rule — assignment first, larger vision second

The business vision is a Finance OS. The assignment has a short deadline and four hard acceptance criteria. Implement in this order:

**P0 — Must work end-to-end:**

1. Public Next.js app with clean finance dashboard.
2. Persistent Supabase/PostgreSQL database.
3. Demo tenant and realistic seeded records.
4. Remote MCP endpoint using Streamable HTTP.
5. Claude can create a real customer/invoice/collection plan through MCP.
6. Created record appears in the web app.
7. A human can edit and save it in the web app.
8. Receivables report is calculated from database records.
9. Public deployment or a fully working local release if external deployment credentials are unavailable.
10. `DEPLOYMENT_TESTING_VIDEO_GUIDE.md` generated from verified project facts.

**P1 — Build if P0 is stable and time permits:**

- record a customer receipt and allocate it to an invoice;
- minimal double-entry journal posting for issued invoices and confirmed receipts;
- basic general-ledger / trial-balance view;
- actual reminder email sending if Resend credentials are available;
- a daily reminder dispatcher if deployment scheduling is configured.

**P2 — Design for later, do not implement in the assignment unless all P0/P1 work is complete:**

- vendor bills and full accounts payable;
- expenses/reimbursements;
- bank statement imports and reconciliation;
- GST/TDS preparation reports;
- P&L, balance sheet and cash-flow reports beyond a demonstrably correct minimal ledger;
- CA portal, Tally migration, bank feeds, payment initiation, payroll, inventory and multi-entity consolidation.

Do not build P2 modules as empty screens or fake buttons. Do not advertise unbuilt features as live.

## 0.5 Absolute product constraints

- **No AI inside CashCollect.** No Anthropic, OpenAI, Google Gemini, AWS Bedrock, local LLM, OCR model, embeddings, AI SDK, AI gateway or inference API calls in the delivered application.
- No provider AI API key may be introduced into `.env`, deployment variables or source code.
- The MCP server is not an AI model. It exposes typed tools and calls deterministic CashCollect services.
- Claude, running in the user's own Claude account, performs reasoning and writing. CashCollect stores, validates, calculates, schedules, renders and executes deterministic operations.
- No website builder and no online shop.
- Do not copy Volopay's name, logos, colors, exact UI or product screens. Learn from its connected-finance-workflow vision; build a distinct SME Finance OS.
- No false “sent”, “paid”, “reconciled”, “posted”, “audited” or “compliant” statuses. A status must reflect a persisted, verified state transition.
- Do not claim CashCollect replaces a practising CA, tax auditor or other legally reserved professional role. It can automate routine bookkeeping and prepare evidence/reports for professional review.
- Do not make real bank transfers or initiate payments in this MVP.

## 0.6 Definition of successful delivery

The assignment is successful only when a reviewer can:

1. Open the deployed CashCollect app and sign in using supplied test credentials (or use the documented demo access mode).
2. Add the CashCollect remote MCP connector to Claude using the provided URL and authentication instructions.
3. Ask Claude to create a customer, invoice draft and collection schedule.
4. Observe Claude call the actual CashCollect MCP tools.
5. Open CashCollect and see the same persisted records.
6. Edit the invoice in CashCollect and save it.
7. Ask Claude to retrieve the invoice or receivables report and see values matching the app/database.
8. Refresh the app and verify the data remains.

A mock demo, local-only endpoint, static JSON response or hard-coded dashboard does not satisfy this definition.

---

# PART 1 — PRODUCT CONTEXT AND SCOPE

## 1.1 Product vision

**CashCollect Finance OS — the financial operating system for Indian SMEs.**

Product promise:

> Know what customers owe you, what you owe others, where your money is, and whether your books are ready for review — by asking Claude and controlling the result in CashCollect.

CashCollect begins with B2B receivables and collection workflows, but the underlying architecture must be ready to expand into bookkeeping, payables, double-entry ledger, reconciliation and CA collaboration.

## 1.2 Product architecture principle

- **Claude = conversational intelligence:** understands natural-language instructions, drafts descriptions/reminders, asks clarifying questions and chooses the appropriate exposed MCP tool.
- **CashCollect = deterministic operating system:** applies validation, permissions, approval rules, arithmetic, database transactions, reminders, audit history, dashboards and exports.
- **Human = accountable approver:** approves consequential actions and can inspect/change persistent information.

Do not store data only in a Claude conversation. Every created or updated object must be persisted by CashCollect.

## 1.3 Target first customer

India-first B2B service SMEs, initially 5–50 employees, especially:

- IT/software consultancies;
- staffing/recruitment agencies;
- marketing and creative agencies;
- design and professional-services firms.

Buyer: founder, owner, finance lead or operations head. Daily user: accounts executive/finance administrator. External reviewer: accountant or CA.

## 1.4 Assignment MVP use case

The MVP demonstrates a complete **receivables-to-collection-plan** workflow:

1. Create/search a customer.
2. Create a draft invoice with one or more line items.
3. Validate amounts, due date, currency and customer relationship.
4. Create a collection schedule attached to the invoice.
5. Persist all records in PostgreSQL.
6. Display them in the CashCollect dashboard.
7. Let the human edit permitted draft fields and save.
8. Retrieve an invoice and receivables ageing report through MCP.
9. Optionally record a receipt and update outstanding balance if this P1 capability can be built safely.

**The central demo must be real and fast.** Use seeded demo data and one new Claude-created invoice.

## 1.5 Explicit non-goals for this assignment

Do not attempt to build a complete Tally/Zoho replacement overnight. Do not build full GST filings, tax calculations from arbitrary natural language, bank API access, payment gateways, payroll, inventory, statutory audit, OCR, AI classification or an accounting-advice chatbot. Preserve architectural extension points but do not represent future modules as complete.

---

# PART 2 — TECHNICAL DECISIONS AND STACK

## 2.1 Required stack

Use a conventional TypeScript full-stack application with current stable releases compatible with one another. Pin actual resolved versions in the lockfile. Do not guess package versions from memory; inspect official documentation and package metadata during setup.

| Layer | Required technology | Notes |
|---|---|---|
| Web framework | Next.js App Router | Server Components by default; Client Components only where interaction requires them |
| Language | TypeScript strict mode | No `any` unless there is a justified, isolated compatibility boundary |
| UI | React + Tailwind CSS | Use a consistent design system |
| Components | shadcn/ui + Radix primitives (or equivalent accessible primitives) | Use only components needed; do not over-install |
| Icons | Lucide React | Consistent line icons |
| Database | Supabase PostgreSQL | Persistent system of record |
| Auth | Supabase Auth with `@supabase/ssr` | Cookie-based server-side auth for app users |
| Database client | `@supabase/supabase-js` | Server/client factories separated |
| MCP | Official MCP TypeScript SDK v2: `@modelcontextprotocol/server` | Verify the current API and use Streamable HTTP |
| Schema validation | Zod v4 (`zod/v4`) | Shared schemas for forms, APIs and MCP tool input |
| Forms | React Hook Form + Zod resolver (if useful) | Controlled validation and errors |
| Tables | TanStack Table or a simple typed table | Avoid building an abstraction unnecessarily |
| Charts | Recharts (optional) | Only if a chart materially improves dashboard clarity |
| Date handling | `date-fns` or native `Intl` for display | Persist timestamps in UTC; business dates use company timezone |
| Money | Integer paise in application/database for fixed INR MVP | Never use JS floating-point for money |
| Email (optional P1) | Resend Node SDK | Deterministic email delivery only; requires API key and verified sender |
| Hosting | Vercel for Next.js | Confirm remote MCP route works after deployment |
| Tests | Vitest + Testing Library + Playwright | Unit, service, integration and browser tests |
| Lint/format | ESLint + Prettier (or project-supported formatter) | Add scripts |

### MCP SDK version instruction

The current official TypeScript SDK has a v2 stable line published as separate packages, including `@modelcontextprotocol/server`, implementing the 2026-07-28 protocol revision. Use v2 by default. Its `createMcpHandler` can serve modern requests and, by default, provide a stateless legacy fallback for 2025-era requests. It has a fetch-shaped interface that can be called from a web-standard `Request`/`Response` route handler.

Official references:

- https://ts.sdk.modelcontextprotocol.io/v2/
- https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/server/server/createMcpHandler.html
- https://ts.sdk.modelcontextprotocol.io/v2/serving/web-standard.html

If the installed SDK's exact APIs differ from this specification, follow the installed TypeScript declarations and official docs. Do not write guessed imports. Do not silently switch to SDK v1. If v2 proves incompatible with the deployment host after a documented test, use the official v1 SDK as a deliberate fallback and document the reason.

## 2.2 Initial app creation

If the repository is empty, create a Next.js App Router application using the current official `create-next-app` guidance. Use TypeScript, ESLint, Tailwind and `src/` directory if supported by the selected CLI. Add packages only after checking peer dependency compatibility.

Suggested install command (adjust only when the current CLI requires a different supported option):

```bash
npx create-next-app@latest cashcollect --typescript --tailwind --eslint --app --src-dir --use-npm
```

If working in an already-named root directory, do not create a nested duplicate project; initialize in the current directory safely.

## 2.3 Environment variables

Create `.env.example` with descriptions and placeholders only. Never commit `.env.local` or real credentials.

Minimum variables (adapt names consistently throughout the code):

```dotenv
# Supabase public configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only Supabase credential, if required by the chosen server-side access design.
# Never prefix with NEXT_PUBLIC_. Never expose to browser code.
SUPABASE_SERVICE_ROLE_KEY=

# Demo/MCP configuration
MCP_DEMO_BEARER_TOKEN=
MCP_DEMO_ORGANIZATION_ID=
MCP_ALLOWED_HOSTS=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Demo authentication (prefer Supabase Auth; only use a demo gate if explicitly documented)
DEMO_MODE=true

# Optional email delivery — no AI is involved
RESEND_API_KEY=
EMAIL_FROM=

# Optional protected reminder dispatcher
CRON_SECRET=
```

If the current Supabase UI uses the newer publishable/secret key naming, prefer the current recommended key type and update variable names consistently. The `service_role`/secret key must stay server-side. Use RLS even when server-side code also filters by tenant.

## 2.4 Hosting/runtime decision

Preferred initial deployment: one Next.js project on Vercel with the MCP handler exposed by a Route Handler at `/api/mcp`.

- Set Node runtime explicitly where required: `export const runtime = 'nodejs'`.
- Disable static caching for data-dependent MCP/API routes: use dynamic route settings where required by the current Next.js version.
- Use the SDK v2 web-standard handler (`createMcpHandler`) from a Route Handler and delegate the incoming web-standard `Request` to `handler.fetch(request, requestOptions)`.
- Implement GET/POST/DELETE (and OPTIONS only when required) according to current Streamable HTTP transport and framework support. Do not invent protocol responses. Use the official example/API signatures.
- Apply Host/Origin validation using official SDK middleware/helpers where appropriate, and ensure the production host is explicitly configured. Do not blindly trust arbitrary Host headers.
- MCP calls must be request-stateless for the demo: every tool call loads its tenant principal from validated authentication and fetches current data from Supabase. Do not rely on in-memory session state or Vercel instance affinity.
- If Next/Vercel streaming or runtime behaviour fails an actual Claude connector test, deploy MCP as a separate small Node service on a host that supports the official Streamable HTTP transport. Keep the same shared domain/service layer and database.

---

# PART 3 — REPOSITORY ARCHITECTURE

Use a modular monolith. Do not split into microservices for the assignment.

Recommended structure:

```text
cashcollect/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx
│   │   ├── (auth)/login/page.tsx
│   │   ├── (dashboard)/app/layout.tsx
│   │   ├── (dashboard)/app/page.tsx
│   │   ├── (dashboard)/app/receivables/page.tsx
│   │   ├── (dashboard)/app/receivables/new/page.tsx
│   │   ├── (dashboard)/app/receivables/[invoiceId]/page.tsx
│   │   ├── (dashboard)/app/customers/page.tsx
│   │   ├── (dashboard)/app/customers/[customerId]/page.tsx
│   │   ├── (dashboard)/app/collections/page.tsx
│   │   ├── (dashboard)/app/reports/receivables/page.tsx
│   │   ├── (dashboard)/app/accounting/ledger/page.tsx   # only if actually implemented
│   │   ├── (public)/invoice/[publicToken]/page.tsx      # optional customer-facing read-only view
│   │   └── api/
│   │       ├── mcp/route.ts
│   │       ├── invoices/route.ts
│   │       ├── invoices/[invoiceId]/route.ts
│   │       ├── customers/route.ts
│   │       ├── reports/receivables/route.ts
│   │       ├── cron/dispatch-reminders/route.ts         # optional P1
│   │       └── health/route.ts
│   ├── components/
│   │   ├── shell/
│   │   ├── dashboard/
│   │   ├── data-table/
│   │   ├── forms/
│   │   ├── finance/
│   │   └── ui/
│   ├── lib/
│   │   ├── env.ts
│   │   ├── supabase/client.ts
│   │   ├── supabase/server.ts
│   │   ├── supabase/admin.ts
│   │   ├── auth/
│   │   ├── money/
│   │   ├── dates/
│   │   ├── errors/
│   │   ├── validation/
│   │   └── utils.ts
│   ├── modules/
│   │   ├── organizations/
│   │   ├── customers/
│   │   ├── receivables/
│   │   ├── collections/
│   │   ├── payments/                 # minimal P1
│   │   ├── accounting/               # minimal P1
│   │   ├── reports/
│   │   └── audit/
│   ├── mcp/
│   │   ├── create-server.ts
│   │   ├── auth.ts
│   │   ├── context.ts
│   │   ├── schemas.ts
│   │   ├── result.ts
│   │   └── tools/
│   │       ├── customers.ts
│   │       ├── invoices.ts
│   │       ├── collections.ts
│   │       └── reports.ts
│   └── styles/globals.css
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── public/
├── business.md
├── CLAUDE_MASTER_BUILD_PROMPT.md
├── IMPLEMENTATION_LOG.md
├── TASKS.md
├── DEPLOYMENT_TESTING_VIDEO_GUIDE.md       # must be generated at the end
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Adjust structure based on actual project conventions. Do not create files or modules with no meaningful implementation. Keep database logic, domain services and MCP definitions separated.

---

# PART 4 — DATA MODEL AND DATABASE RULES

## 4.1 Tenant model

Every finance record must belong to an `organization_id`. The demo may have one seeded organization, but queries must still explicitly scope to its ID. Never trust an `organization_id` supplied by Claude as authority. Resolve tenant identity from the authenticated MCP principal or signed-in web user.

Required core tables:

1. `organizations`
2. `profiles` (only if required in addition to Supabase Auth)
3. `memberships`
4. `customers`
5. `invoices`
6. `invoice_lines`
7. `collection_plans`
8. `collection_events`
9. `payments` (P1 optional)
10. `payment_allocations` (P1 optional)
11. `audit_events`
12. `mcp_idempotency_keys`

Minimal accounting extension when time permits:

13. `chart_of_accounts`
14. `journal_entries`
15. `journal_lines`

## 4.2 Suggested columns

### organizations

- `id uuid primary key default gen_random_uuid()`
- `name text not null`
- `legal_name text`
- `currency char(3) not null default 'INR'`
- `timezone text not null default 'Asia/Kolkata'`
- `financial_year_start_month smallint not null default 4`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### memberships

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null references organizations(id)`
- `user_id uuid not null references auth.users(id)`
- `role text not null check (role in ('owner','admin','finance_manager','finance_operator','viewer','ca_reviewer'))`
- `created_at timestamptz not null default now()`
- unique `(organization_id, user_id)`

### customers

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null references organizations(id)`
- `display_name text not null`
- `legal_name text`
- `email text`
- `phone text`
- `gstin text` (optional text; validate format only if supplied; do not certify validity)
- `billing_address jsonb not null default '{}'`
- `payment_terms_days int not null default 15 check (payment_terms_days between 0 and 365)`
- `notes text`
- `status text not null default 'active' check (status in ('active','inactive'))`
- `created_at`, `updated_at` timestamptz
- unique case-insensitive customer name per organization is optional; avoid blocking legitimate duplicate names.

### invoices

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null references organizations(id)`
- `customer_id uuid not null references customers(id)`
- `invoice_number text not null`
- `invoice_date date not null`
- `due_date date not null`
- `currency char(3) not null default 'INR'`
- `subtotal_paise bigint not null check (subtotal_paise >= 0)`
- `tax_total_paise bigint not null default 0 check (tax_total_paise >= 0)`
- `total_paise bigint not null check (total_paise >= 0)`
- `paid_paise bigint not null default 0 check (paid_paise >= 0)`
- `status text not null default 'draft' check (status in ('draft','issued','partially_paid','paid','voided','disputed'))`
- `notes text`
- `public_token_hash text` or a high-entropy public identifier; never expose internal numeric IDs as public secrets
- `created_by uuid` nullable
- `created_at`, `updated_at` timestamptz
- unique `(organization_id, invoice_number)`
- constraint `total_paise = subtotal_paise + tax_total_paise` (or implement when discounts/rounding require explicit line calculation)
- due date may equal or follow invoice date; allow historical data import but validate new draft creation.

### invoice_lines

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `invoice_id uuid not null references invoices(id) on delete cascade`
- `description text not null`
- `quantity numeric(14,3) not null default 1 check (quantity > 0)`
- `unit_price_paise bigint not null check (unit_price_paise >= 0)`
- `line_subtotal_paise bigint not null check (line_subtotal_paise >= 0)`
- optional `tax_rate_bps int` and `tax_amount_paise bigint` only when explicitly provided/configured
- `sort_order int not null default 0`
- All invoice line writes must be scoped to the same organization as the parent invoice.

### collection_plans

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `invoice_id uuid not null references invoices(id)`
- `name text not null default 'Standard collection plan'`
- `channel text not null default 'email' check (channel in ('email','manual'))`
- `status text not null default 'active' check (status in ('active','paused','completed','cancelled'))`
- `created_at`, `updated_at timestamptz`

### collection_events

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `collection_plan_id uuid not null references collection_plans(id) on delete cascade`
- `invoice_id uuid not null references invoices(id)`
- `scheduled_at timestamptz not null`
- `event_type text not null check (event_type in ('before_due','due_date','overdue','manual_follow_up'))`
- `status text not null default 'scheduled' check (status in ('scheduled','ready','sent','skipped','failed','cancelled'))`
- `recipient_email text`
- `subject text`
- `body text`
- `sent_at timestamptz`
- `provider_message_id text`
- `failure_reason text`
- `created_at timestamptz not null default now()`
- Unique idempotency protection for `(collection_plan_id, scheduled_at, event_type)`.

### payments (P1)

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `customer_id uuid not null references customers(id)`
- `payment_date date not null`
- `amount_paise bigint not null check (amount_paise > 0)`
- `currency char(3) not null default 'INR'`
- `method text` (bank_transfer, cash, cheque, UPI, other)
- `reference text`
- `status text not null default 'draft' check (status in ('draft','confirmed','reversed'))`
- `created_at`, `updated_at`

### payment_allocations (P1)

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `payment_id uuid not null references payments(id)`
- `invoice_id uuid not null references invoices(id)`
- `amount_paise bigint not null check (amount_paise > 0)`
- unique per payment/invoice pair or aggregate safely in service code.
- total allocations must never exceed payment amount; total confirmed allocations must never exceed invoice outstanding amount.

### audit_events

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `actor_type text not null check (actor_type in ('user','mcp','system'))`
- `actor_id text`
- `action text not null`
- `entity_type text not null`
- `entity_id uuid not null`
- `before_data jsonb`
- `after_data jsonb`
- `request_id text`
- `created_at timestamptz not null default now()`

Audit rows are append-only to application users. Do not expose update/delete operations for the audit table.

### mcp_idempotency_keys

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null`
- `idempotency_key text not null`
- `tool_name text not null`
- `result_entity_type text`
- `result_entity_id uuid`
- `created_at timestamptz not null default now()`
- unique `(organization_id, idempotency_key)`

## 4.3 Database functions and transactions

Prefer PostgreSQL functions/RPC or a single database transaction for operations that must be atomic:

- create invoice + lines + audit event;
- update draft invoice + lines + audit event;
- create collection plan + multiple scheduled events;
- record receipt + allocations + update invoice outstanding/status + audit event;
- post journal entry + lines, if implemented.

Never partially write a header without its required lines. Ensure database constraints backstop service-layer validation.

## 4.4 RLS and tenant separation

- Enable Row Level Security on every organization-owned table.
- Signed-in app users can access only organizations where a valid active membership exists.
- Viewer role can read; finance operator can manage permitted drafts; finance manager/admin can approve/issue; owner/admin can manage settings and members.
- MCP calls use a separately authenticated service principal tied to one fixed demo organization for this assignment. Derive the organization ID from the server-validated MCP token or server environment; ignore/reject a user-provided organization ID.
- If using the Supabase service-role key in server-only code, explicitly filter every query by the resolved `organization_id`; never return unrestricted admin query results. Do not expose the key to client components or browser bundles.
- Test cross-tenant access with at least two seeded organizations if practical. At minimum, test a fabricated organization ID cannot read/write another tenant's data.

---

# PART 5 — FINANCIAL DOMAIN RULES

## 5.1 Money arithmetic

- Fixed INR amounts are integer paise throughout application logic and API payloads.
- Never use `number` floats to calculate or persist money. Use integer-safe checks and/or `bigint` for larger values; convert to JSON string when needed because JSON cannot serialize `bigint`.
- UI displays amounts with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` after safe conversion.
- When parsing user-entered rupees, validate up to two decimal places and convert once to paise.
- Reject NaN, Infinity, negative invoice totals, unsafe integers and excess decimal places.
- Keep invoice subtotal, tax and total explicit. Do not infer tax rates from a description.

## 5.2 Dates and timezones

- Persist event timestamps in UTC (`timestamptz`).
- Business invoice dates/due dates are `date` fields, interpreted in the organization's timezone (default `Asia/Kolkata`).
- Display dates in `en-IN` format (e.g. `10 Nov 2026`) and company timezone.
- Be explicit about whether a reminder is date-only or time-specific. Avoid off-by-one due date errors.
- For Vercel Cron, schedules run in UTC. Convert the intended India time correctly and explain the configured schedule in documentation. A daily 09:00 IST run corresponds to 03:30 UTC.

## 5.3 Invoice lifecycle

Draft → Issued → Partially Paid → Paid. A draft can be edited. An issued invoice should not be directly overwritten; use a controlled edit/credit-note/void flow appropriate to its state. For this MVP, allow edit of draft only. If issue/void is not fully implemented, do not expose the button.

`overdue` is a derived display/report state for an issued invoice with outstanding amount > 0 and due date before current business date. Do not persist stale `overdue` status without an update process.

## 5.4 Collection plan rules

- A schedule belongs to one invoice and one organization.
- Do not schedule follow-ups for drafts or paid/voided invoices; allow schedule creation only for eligible invoices or make the plan explicitly activate after issue.
- Avoid duplicate scheduled events.
- Collection messages must be factual and polite. They must not threaten legal action or make unverified claims.
- Do not send messages automatically unless an email provider, sender identity, recipient and user-approved workflow are configured.
- A reminder preview is not a sent email. Only mark an event `sent` after the email provider confirms success and a provider reference is persisted.
- If no Resend credentials exist, show a clear “Email delivery not configured” status and allow viewing/copying a prepared reminder draft; do not pretend delivery occurred.

## 5.5 Receivables calculations

For each invoice:

`outstanding_paise = total_paise - confirmed_allocated_payment_paise`

Never allow a negative outstanding amount. Handle overpayments as unallocated customer credit only if that feature is explicitly implemented. For the MVP, reject over-allocation and tell the user to split/hold the excess.

Ageing buckets are calculated against the report's `as_of_date`:

- Not yet due / current;
- 1–30 days overdue;
- 31–60 days overdue;
- 61–90 days overdue;
- 91+ days overdue.

Report output must contain its date cutoff, currency, filters, excluded statuses and calculation basis. Sum totals from query results/database logic, not from LLM text.

---

# PART 6 — MCP SERVER IMPLEMENTATION

## 6.1 Protocol and transport

Implement a remote MCP server over **Streamable HTTP** at:

`POST https://<deployed-host>/api/mcp`

Use the current official `@modelcontextprotocol/server` v2 package and `createMcpHandler` if the installed SDK supports it. The SDK's official documentation describes this as a fetch-shaped handler for web-standard runtimes. Use the exact API signature in the installed version and official docs.

References:

- https://ts.sdk.modelcontextprotocol.io/v2/
- https://ts.sdk.modelcontextprotocol.io/v2/serving/web-standard.html
- https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/server/server/createMcpHandler.html
- https://modelcontextprotocol.io/specification/

Use stateless tool calls for this project. Every tool reads current data from Supabase; do not rely on a previous MCP request's memory.

## 6.2 Authentication for the assignment demo

Implement the simplest secure assignment-ready option:

- Use a long random `MCP_DEMO_BEARER_TOKEN` configured only as an environment variable in the server and as a request header in Claude's custom connector setup.
- Require `Authorization: Bearer <token>` for all MCP requests including initialization and tool calls, except an explicitly documented minimal health route if needed.
- Compare secrets in constant time where practical; never log the token.
- Resolve the demo `organization_id` from the validated token/configuration. Do not accept tenant scope from tool arguments.
- Return 401 for missing/invalid token and do not leak details.
- Add a basic rate limit where practical and cap request body size.
- Do not expose MCP token in page HTML, source maps, logs, analytics or public README.
- Include a token-rotation procedure in the final deployment guide.

This fixed bearer token is an **assignment/demo authentication mode**, not the long-term multi-customer SaaS auth design. Document that production would use per-organization credentials or OAuth with least-privilege scopes and revocation.

Claude connector setup currently supports adding a custom remote MCP connector and configuring fixed request headers for services authenticated by API key or bearer token. Use the exact current Claude UI labels when generating the final guide; they may change.

Official references:

- https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- https://support.anthropic.com/en/articles/11503834-building-custom-integrations-via-remote-mcp-servers

## 6.3 Request context and tenant scope

Authentication must occur before invoking any tool. Pass the validated tenant/principal to the MCP server factory/request context using the SDK's supported `authInfo`/factory context or bind a request-scoped server factory to the verified tenant ID. Confirm exact types from the installed SDK. Do not parse tenant identity from a client-controlled tool argument.

All MCP tools must call the same domain services as the web app. Do not duplicate SQL/accounting logic inside tool handler files.

## 6.4 MCP tools — assignment MVP

Implement these tools first. The tool names should be stable, snake_case, descriptive and documented.

### 1. `list_customers`

Input:

```json
{
  "query": "optional substring search",
  "limit": 20
}
```

Rules:

- `query` optional, trimmed, max 100 characters.
- `limit` integer 1–50, default 20.
- Return active customers in the authenticated organization only.
- Read-only; no confirmation required.

Output includes `id`, `display_name`, `email`, `payment_terms_days`, `status` and `created_at`.

### 2. `create_customer`

Input:

```json
{
  "display_name": "ABC Technologies",
  "legal_name": "ABC Technologies Private Limited",
  "email": "finance@example.com",
  "phone": "+91...",
  "gstin": null,
  "payment_terms_days": 15,
  "notes": "Optional notes"
}
```

Rules:

- Require `display_name`.
- Validate optional email and phone conservatively.
- Validate `payment_terms_days` 0–365.
- Use authenticated organization, never a supplied organization ID.
- Insert database record and audit event atomically.
- Return the persisted customer ID and web URL.

### 3. `create_invoice_draft`

Input:

```json
{
  "customer_id": "uuid",
  "invoice_date": "2026-11-10",
  "due_date": "2026-11-25",
  "currency": "INR",
  "notes": "Software consulting services",
  "lines": [
    {
      "description": "Software consulting",
      "quantity_milli": 1000,
      "unit_price_paise": 8500000,
      "tax_amount_paise": 0
    }
  ]
}
```

Rules:

- Require customer ID belonging to the authenticated organization and active status.
- Require at least one line; max 50 lines.
- Use quantity in thousandths (`quantity_milli`) or a carefully validated decimal string; use one convention consistently.
- `unit_price_paise` non-negative integer.
- Compute line subtotals using integer-safe arithmetic; validate input tax amounts and total. Do not guess GST.
- Set status to `draft`.
- Generate a unique human-readable draft number server-side, scoped per organization, e.g. `DRAFT-2026-0001`.
- Use database transaction/RPC to save invoice, lines and audit event atomically.
- Accept `idempotency_key` to protect against retry duplicates; generate one only if caller omits and tool implementation can guarantee safe retry semantics. Prefer caller-provided key for writes.
- Return actual database ID, invoice number, computed totals, status and app URL.

### 4. `list_invoices`

Input:

```json
{
  "status": "all",
  "customer_id": null,
  "overdue_only": false,
  "limit": 20
}
```

Rules:

- Validate status enum.
- `overdue_only` uses deterministic date + outstanding logic.
- Only returns tenant-scoped records.
- Return concise summary fields and pagination cursor if implemented.

### 5. `get_invoice`

Input:

```json
{ "invoice_id": "uuid" }
```

Return header, line items, computed paid/outstanding, collection schedules/events and status. Return not-found if not in authenticated tenant; do not reveal whether the ID exists in another tenant.

### 6. `update_invoice_draft`

Input:

```json
{
  "invoice_id": "uuid",
  "due_date": "2026-11-30",
  "notes": "Updated payment terms",
  "lines": null
}
```

Rules:

- Only draft invoices may be changed.
- Only explicitly allowed fields can be updated.
- Recalculate totals using the same deterministic domain service.
- Use optimistic concurrency (`updated_at` or version field) to avoid overwriting a concurrent UI edit.
- Persist audit before/after data.
- Do not permit status change to issued/paid via this tool.

### 7. `create_collection_plan`

Input:

```json
{
  "invoice_id": "uuid",
  "reminders": [
    { "offset_days_from_due": -3, "event_type": "before_due" },
    { "offset_days_from_due": 0, "event_type": "due_date" },
    { "offset_days_from_due": 3, "event_type": "overdue" }
  ],
  "channel": "email"
}
```

Rules:

- Verify invoice belongs to tenant and is eligible. If draft, create plan in inactive/proposed state until invoice is issued, or explicitly set an activation-on-issue flag. Do not schedule sending for a draft invoice.
- Max 10 reminders per plan; allowed offsets -30 to +180 days.
- Calculate schedule times deterministically in organization timezone; convert to UTC.
- Prevent duplicate schedules.
- Store collection plan and all events transactionally.
- Return next reminder and event count.
- Do not state that reminders have been sent.

### 8. `get_receivables_report`

Input:

```json
{
  "as_of_date": "2026-11-10",
  "customer_id": null,
  "include_drafts": false
}
```

Return deterministic totals:

- total issued invoice value;
- total confirmed receipts allocated;
- total outstanding;
- not-yet-due amount;
- 1–30, 31–60, 61–90 and 91+ day ageing buckets;
- invoice count and customer count;
- rows with invoice number, customer, due date, total, paid and outstanding.

Exclude drafts, voided and paid invoices from overdue outstanding. State the report cutoff date and currency. All amounts should include integer paise and formatted INR display values.

### 9. `get_cash_summary` (only if data supports it)

For the MVP, do not imply a full cash-flow statement if bank balances are not imported. Return only what can be proven: recorded cash/bank balances if available, current outstanding receivables, and upcoming collection amounts. Label incomplete components explicitly.

## 6.5 P1 MCP tools (only after P0 passes)

- `create_payment_receipt_draft`
- `get_payment_receipt`
- `get_general_ledger`
- `get_trial_balance`

Any tool that posts a ledger entry or confirms a receipt should either require a verified human approval in the UI or use a carefully designed explicit confirmation mechanism. Do not let a casual, ambiguous natural-language request silently trigger consequential accounting writes.

## 6.6 MCP tool design conventions

- Each tool description must explain exactly what it does, its side effects, required permission and whether it creates a draft or commits a financial state change.
- Define input schemas with Zod v4. Add sensible length/range limits and `.strict()` where appropriate.
- Return structured content when supported by the SDK and a clear text summary for Claude.
- Use stable error codes: `VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN`, `CONFLICT`, `DUPLICATE_REQUEST`, `INTERNAL_ERROR`.
- Never include stack traces, SQL, secrets or raw provider errors in tool output.
- Write audit events for all mutations with actor type `mcp` and request/correlation ID.
- Use idempotency for create/write actions. A retried MCP request must not create duplicate invoices or reminder plans when a stable idempotency key is supplied.
- Ensure the MCP server has no Anthropic/OpenAI SDK package or AI API integration.

## 6.7 MCP health and diagnostics

Provide a minimal `/api/health` HTTP endpoint returning app health and database connectivity without revealing secrets. Do not expose sensitive internal details. The MCP URL itself must be the actual deployed endpoint, not the health endpoint.

Test MCP with the official MCP Inspector or SDK-compatible test client, then test by adding the deployed connector to Claude itself. A local-only MCP test is not sufficient.

---

# PART 7 — WEB APPLICATION UX / DESIGN SYSTEM

## 7.1 Design direction

Create a premium, calm, trustworthy finance SaaS experience. It must feel like a real operating system for business finance, not a generic admin template and not an AI chat UI.

Visual keywords:

- modern financial operations;
- clear hierarchy;
- high data readability;
- restrained accent color;
- strong table design;
- precise number/date formatting;
- generous spacing;
- accessible contrast;
- responsive desktop-first layout that still works on mobile.

Do not reproduce Volopay's distinctive branding, logo, exact palette or screenshots. Use the CashCollect wordmark as text with a simple abstract ledger/flow icon if needed.

Suggested design tokens (adjust for contrast/accessibility):

- App background: very light cool neutral (`#F7F8FA` or equivalent).
- Sidebar: dark ink/navy (`#101828` or equivalent).
- Primary action: deep indigo/blue (`#4F46E5` or equivalent).
- Accent: muted teal for positive cash/paid indicators.
- Danger: red only for overdue, failed or destructive states.
- Surfaces: white cards with subtle border, minimal shadow.
- Body font: Inter or a high-quality system sans.
- Tabular numbers: use tabular-nums in financial columns.

The design should remain coherent in light mode. Do not introduce multiple competing accent colors.

## 7.2 Application shell

Desktop layout:

- fixed/collapsible left sidebar;
- top bar with organization selector (single demo organization for MVP), search/action affordance, help and user menu;
- main content with breadcrumb, page title, concise descriptive subtitle and primary action;
- responsive collapse for narrow screens.

Sidebar order:

1. Overview
2. Receivables
3. Customers
4. Collections
5. Reports
6. Accounting (show only if ledger is implemented; otherwise hide)
7. Settings

Avoid showing blank menu items for future features.

## 7.3 Required screens

### A. Marketing / landing (`/`)

- Product name: CashCollect Finance OS.
- Headline: “Get paid on time. Keep your finance operations in control.”
- Supporting line: “A Claude-connected finance workspace for invoices, collections and clearer books.”
- CTA: “Open demo workspace”.
- Explain clearly: Claude brings natural-language reasoning; CashCollect stores and operates real finance workflows.
- No fake customer logos or unsupported claims.

### B. Login / demo entry

Use Supabase Auth for app users. A seeded reviewer account may be created manually through Supabase Auth dashboard and supplied in the final guide. Never hardcode a production password into source.

If auth setup blocks the assignment and only a single public demo tenant is feasible, use a clearly labelled demo gate backed by a server-side secret and signed secure HttpOnly cookie; do not put credentials in client-side JavaScript. Document that this is temporary assignment-only access, not production multi-tenant auth.

### C. Finance overview (`/app`)

Required KPI cards:

- Outstanding receivables;
- Overdue receivables;
- Collected this month;
- Invoices due in next 7 days.

Also show:

- recent invoices;
- overdue customers;
- upcoming collection activity;
- quick action “Create invoice”;
- a compact “Connected to Claude via MCP” integration panel with endpoint/setup guidance but never expose the actual bearer token.

Every KPI must be calculated from database records. Use seeded data that makes the dashboard visually useful but distinguish demo data clearly.

### D. Receivables list (`/app/receivables`)

Columns:

- invoice number;
- customer;
- invoice date;
- due date;
- total;
- paid;
- outstanding;
- status;
- row action.

Required:

- search by invoice/customer;
- status filter;
- overdue filter;
- sort by due date/outstanding;
- pagination or reasonable limit;
- empty state with create invoice CTA.

### E. Invoice detail/editor (`/app/receivables/[invoiceId]`)

- invoice header, number, customer, status and dates;
- editable draft fields and line items;
- clear subtotal/tax/total calculations;
- collection plan timeline;
- change history/audit summary;
- “Save changes” with optimistic/concurrency handling;
- status badge with semantic color;
- clear note that a draft is not a legally issued tax invoice, if issue workflow is not implemented.

Do not show edit fields on an issued invoice unless an implemented controlled correction path exists.

### F. Customers list/detail

- list/search customers;
- create/edit customer form;
- show total outstanding, invoice count and recent invoices;
- display GSTIN only if entered; do not show a “verified” state unless a real verification integration exists.

### G. Collections (`/app/collections`)

- scheduled reminder events;
- upcoming and overdue follow-up filters;
- event status (scheduled, ready, sent, failed, skipped);
- reminder content preview;
- if email integration is configured, a manual “Send reminder” action with confirmation;
- if not configured, show “Delivery not configured” and a copy-message action. Never fake delivery.

### H. Reports (`/app/reports`)

P0 report: Receivables ageing with as-of date, bucket totals and an invoice-level table. Provide CSV export if time permits. Report values must exactly match MCP output for the same filter/date.

### I. Ledger (P1 only)

Only show it if basic double-entry posting is actually implemented and tested. Include account list, journal-entry detail, debit/credit totals and trial balance. Never show unbalanced entries as posted.

## 7.4 Interaction and visual quality requirements

- All buttons must work. No decorative disabled actions that look enabled.
- Forms must validate inline and display server errors clearly.
- All mutation actions show loading and success/failure states.
- Confirm destructive or consequential actions.
- Preserve entered values on recoverable validation failures.
- Tables have readable empty/loading/error states.
- Use accessible labels, keyboard navigation, focus indicators and semantic HTML.
- Avoid horizontal overflow at common laptop widths and on mobile.
- Add skeletons only where they improve perceived loading; never replace real data with mock cards.

---

# PART 8 — APPLICATION SERVICE LAYER AND WEB API

## 8.1 Domain service rule

MCP handlers, server actions and API routes must use the same domain service functions. Example boundaries:

- `customerService.createCustomer()`
- `customerService.listCustomers()`
- `invoiceService.createDraft()`
- `invoiceService.updateDraft()`
- `invoiceService.getById()`
- `invoiceService.list()`
- `collectionService.createPlan()`
- `collectionService.listEvents()`
- `reportService.getReceivablesAgeing()`
- `auditService.appendEvent()`

A tool handler should only:

1. validate/parse tool input;
2. obtain authenticated principal and tenant context;
3. check permission;
4. call the domain service;
5. map the typed result/error to MCP output.

Do not write SQL inside the MCP tool handler.

## 8.2 Web API endpoints

Implement only endpoints actually consumed by the UI. Suggested endpoints:

- `GET /api/health`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/invoices/:id`
- `PATCH /api/invoices/:id` (draft-only)
- `POST /api/collection-plans`
- `GET /api/collections`
- `GET /api/reports/receivables`
- `POST /api/exports/receivables.csv` (optional)
- `POST /api/mcp` (MCP protocol endpoint)

Do not build a separate REST API for every future roadmap module.

## 8.3 Server/client boundaries

- Use Server Components for initial reads where possible.
- Client Components for interactive forms, filters, tables and charts.
- Supabase server client reads cookies and respects auth/RLS.
- Do not import server secrets or admin clients into client components.
- Do not pass service-role keys to browser.
- API responses use typed DTOs and do not leak database internals.

---

# PART 9 — OPTIONAL DETERMINISTIC EMAIL AND SCHEDULING

This is a business-automation enhancement, not a prerequisite for proving MCP create/edit/persistence.

## 9.1 Email adapter

If `RESEND_API_KEY` and a verified `EMAIL_FROM` are configured:

- install `resend` and implement a server-only email service;
- use a fixed, reviewed reminder template (Claude may prepare the text in the future, but the app itself does not call AI);
- send only to customer email saved in the invoice/customer record;
- require a human click/approval for first send in the demo;
- persist provider response ID and status;
- mark `sent` only after provider confirms success;
- handle provider failure and retry without duplicate sends (idempotency).

If credentials are not configured:

- retain reminder draft and schedule records;
- let user copy the prepared message;
- show delivery as not configured;
- do not claim any email was sent.

Official Resend Next.js guide: https://resend.com/docs/send-with-nextjs

## 9.2 Reminder dispatcher

Only implement if the core workflow is stable:

- protected route `GET /api/cron/dispatch-reminders` (or POST if appropriate);
- require `Authorization: Bearer ${CRON_SECRET}` or the platform's verified cron header, and validate the request;
- select a bounded batch of due `scheduled` events;
- atomically claim events to avoid duplicate concurrent sends;
- check invoice remains issued and outstanding before dispatch;
- send through provider adapter only when configured;
- persist result, provider ID, sent timestamp and error;
- use idempotency and retry limits;
- return counts (processed/sent/failed/skipped), never secret values.

If deploying on Vercel Cron, remember that cron expressions are evaluated in UTC. A daily 09:00 Asia/Kolkata job is `30 3 * * *`. Check the current plan's scheduling limits and use the current Vercel documentation. Official reference: https://vercel.com/docs/schedules/cron-jobs

Do not make a demo depend on an untested scheduled invocation. Allow the reviewer to view scheduled reminders and manually trigger a clearly confirmed send when configured.

---

# PART 10 — OPTIONAL DOUBLE-ENTRY LEDGER FOUNDATION (P1)

Only proceed once the P0 flow, deployment and MCP connection are stable.

## 10.1 Minimal chart of accounts

Seed these demo accounts only:

- 1000 — Bank
- 1100 — Accounts Receivable
- 2000 — Output Tax Payable (only if user-configured tax is used)
- 3000 — Owner's Equity / Opening Balance
- 4000 — Service Revenue

For a minimal test without tax, invoice issue journal:

- Debit Accounts Receivable = invoice total
- Credit Service Revenue = invoice subtotal (equal to total if tax is zero)
- If tax is present, credit the configured tax liability account for the tax amount.

Receipt confirmation journal:

- Debit Bank = receipt amount
- Credit Accounts Receivable = allocated amount

These are accounting-engine examples, not advice for all real transaction circumstances. Never hard-code arbitrary GST treatment.

## 10.2 Journal rules

- Journal entry consists of header plus at least two lines.
- Every posted entry has positive debit/credit line amounts and total debit equals total credit.
- No line may have both debit and credit positive.
- Sum of debits equals sum of credits exactly in paise.
- Accounts must belong to the same organization.
- Posting date must be within an open period.
- Posted entries cannot be edited/deleted. Corrections use reversal entries.
- Every journal links to its source document and audit event.
- Use a database transaction and unique source constraint to prevent duplicate posting.

## 10.3 Accounting reports

If ledger is implemented, build only reports that can be proven correct:

- General ledger by account and date range;
- Trial balance as of a date;
- totals computed from posted journal lines only;
- show opening balance, period debit, period credit and closing balance;
- validate the trial balance is balanced before rendering/exporting.

Do not produce P&L/balance-sheet outputs unless opening balances, account types and journal mappings are complete and tested.

---

# PART 11 — SECURITY, PRIVACY AND CONTROL REQUIREMENTS

Finance software is high-trust software. Even a demo should demonstrate correct habits.

## 11.1 Authentication and authorization

- Use Supabase Auth for app users where possible.
- Validate session server-side.
- Use membership roles and server-side authorization.
- Do not trust role, user ID, organization ID or approval state supplied by the browser or Claude.
- MCP demo token must be separate from user login and scoped to the demo organization.
- Provide no account enumeration in login/API errors.

## 11.2 RLS and data access

- RLS enabled for every tenant-owned table.
- Policies must check active membership in the record's organization.
- Add integration tests for cross-tenant isolation.
- Server-side admin client is permitted only in modules that require it and must enforce tenant scoping in code.

## 11.3 Audit history

Every mutation should record:

- actor type (`user`, `mcp`, `system`);
- actor ID where available;
- action;
- entity type/ID;
- timestamp;
- request/correlation ID;
- before/after snapshots for permitted fields (redact secrets and avoid storing unnecessary PII).

Do not update/delete audit events through ordinary application paths.

## 11.4 Data minimisation

- Do not request or store real PAN, Aadhaar, bank login credentials or sensitive documents for the assignment demo.
- Use fictional customer and invoice demo data.
- Mask bank account numbers if any are shown.
- Do not log full customer personal data or document contents unnecessarily.
- Use synthetic emails such as `finance@example.com` in the seed dataset.

## 11.5 Financial action boundaries

- Draft creation may happen from MCP.
- Issue/send/paid/post/reverse/close-period actions require the designed permission and confirmation flow.
- The app does not transfer money.
- No automatic tax filing or statutory audit is performed.
- Reports must carry cutoff date, currency and status filters.

## 11.6 Secret hygiene

- `.env.local` in `.gitignore`.
- `.env.example` contains variable names and descriptions, never values.
- no credentials in frontend bundles, screenshots, videos, URLs, source control or logs;
- rotate any demo token accidentally exposed;
- check `git diff` and run a secret scan if a tool is available;
- use environment validation at startup, with clear missing-variable errors that do not print secret values.

---

# PART 12 — TEST STRATEGY AND ACCEPTANCE TESTS

Tests are executable evidence, not documentation theatre. Write the tests and run them.

## 12.1 Automated test layers

### Unit tests

- paise parsing and formatting;
- invoice subtotal/total calculation;
- quantity and line calculations;
- ageing bucket calculations around due date boundaries;
- outstanding balance calculation;
- reminder schedule date/time calculations across timezone boundaries;
- validation schemas;
- invoice lifecycle eligibility;
- ledger balanced-entry invariant if P1 implemented.

### Service/integration tests

- create customer with valid data;
- reject invalid email/terms/required names;
- create invoice + lines atomically;
- reject invoice creation for customer in another tenant;
- reject invalid/negative monetary values;
- update draft invoice and recalculate total;
- reject update to issued invoice;
- create collection plan with valid reminder offsets;
- reject duplicate collection plan events;
- ensure no reminders dispatch for draft/paid/voided invoice;
- receipt allocation cannot exceed invoice outstanding if payment P1 implemented;
- audit event created on each successful mutation.

### MCP tests

- MCP initialize/handshake succeeds;
- `tools/list` returns the expected implemented tools only;
- missing/invalid bearer returns 401;
- valid bearer creates a server context for the demo tenant;
- tool input validation errors return structured error result;
- `create_customer` persists a row;
- `create_invoice_draft` persists header and line items;
- returned IDs/URL match the database;
- `get_invoice` returns the created record;
- `update_invoice_draft` persists edits;
- `get_receivables_report` matches direct service calculation;
- retry with same idempotency key does not create duplicate invoice;
- no tool can query or mutate another organization.

### Browser/E2E tests (Playwright)

1. Open `/` and see product landing.
2. Sign in with test credentials or documented demo access.
3. Dashboard loads from database.
4. Receivables list filters/searches.
5. Invoice detail opens.
6. Draft can be edited and saved.
7. Invalid amount shows inline validation.
8. Collection plan timeline renders.
9. Receivables report totals match expected fixture.
10. Browser refresh retains the persisted record.
11. Responsive layout does not overflow at desktop/tablet/mobile viewports.

## 12.2 Mandatory manual end-to-end acceptance test

Use a real Claude account with remote MCP connector access:

**Step A — connect:** Add CashCollect remote MCP URL and bearer header to Claude.

**Step B — create customer:** Ask Claude:

> Create a customer named ABC Technologies, email finance@example.com, with 15-day payment terms. Save it in CashCollect and show me the customer record link.

Expected: Claude calls `create_customer`; MCP returns a real customer ID; customer is visible in CashCollect.

**Step C — create invoice:** Ask Claude:

> For ABC Technologies, create a draft invoice dated 10 November 2026, due 25 November 2026, with one line item: Software consulting, quantity 1, unit price ₹85,000, tax ₹0. Save it as a draft and create reminders 3 days before due date, on due date and 3 days after due date. Do not send any email.

Expected: Claude calls `create_invoice_draft` and `create_collection_plan`; invoice and collection events are persisted; invoice appears in dashboard.

**Step D — edit in app:** Open invoice link, change notes to “November consulting retainer”, save, refresh.

Expected: edit persists and appears in activity history.

**Step E — read back from Claude:** Ask:

> Retrieve that CashCollect invoice and show its total, due date, status and collection schedule. Also show the receivables report as of 10 November 2026.

Expected: Claude calls `get_invoice` and `get_receivables_report`; report values agree exactly with the UI.

**Step F — persistence:** Sign out/in or refresh and confirm the same records remain.

Record actual tool names/call evidence and actual outcome in `DEPLOYMENT_TESTING_VIDEO_GUIDE.md`.

## 12.3 No-AI audit

Before release, search the repository and deployment variables for likely AI dependencies/keys:

```bash
rg -n "ANTHROPIC|OPENAI|GEMINI|BEDROCK|AI_GATEWAY|LLM_API|api\.anthropic|api\.openai|generative-ai" . --glob '!node_modules/**' --glob '!\.next/**'
```

Review each hit. References to Claude/MCP in documentation are fine. The delivered application must not call any model API. Ensure no key exists in Vercel production/preview variables. The app should not contain `@anthropic-ai/sdk`, `openai`, AI SDK or other inference package unless it is solely a dev dependency demonstrably not bundled/executed; prefer removing them entirely.

---

# PART 13 — DEMO DATA AND PRODUCT CONTENT

Seed realistic fictional data for one demo company:

**Organization:** Northstar Digital Services Pvt. Ltd. (fictional)  
**Currency:** INR  
**Timezone:** Asia/Kolkata  
**Business type:** B2B IT and digital services consultancy

Seed 4–6 fictional customers and 8–12 invoices across states:

- two overdue invoices;
- two due in the next 7 days;
- two paid invoices;
- one partially paid invoice if P1 payments exist;
- one draft invoice.

Use believable but synthetic values. Mark dashboard data as “Demo workspace”. Do not use real people's names, real GSTINs or real bank information. Use generic sample emails.

Seed at least one upcoming collection schedule and one failed/skipped reminder example only if the application supports those statuses and explains them.

The live demo should create a fresh invoice through Claude rather than only showing seeded records. Clear old demo-created records through a safe admin/reset script if needed; never expose a public destructive reset endpoint.

---

# PART 14 — BUSINESS LOGIC AND ERROR HANDLING

## 14.1 Standard service result

Use typed results or typed domain errors. Do not return arbitrary exception messages to users.

Recommended error mapping:

- `VALIDATION_ERROR` — invalid input;
- `NOT_FOUND` — missing or inaccessible entity;
- `FORBIDDEN` — permission denied;
- `CONFLICT` — stale edit, duplicate or invalid state transition;
- `CONFIGURATION_ERROR` — optional provider not configured;
- `PROVIDER_ERROR` — email or external provider failed;
- `INTERNAL_ERROR` — unexpected error with server-side correlation ID.

## 14.2 Concurrency

- Use `updated_at` or integer `version` on mutable draft invoices.
- Update queries must include the previous version/timestamp in the WHERE condition.
- On conflict return a clear message that another user changed the record; reload rather than overwrite silently.

## 14.3 Audit action names

Use consistent verbs such as:

- `customer.created`
- `invoice.draft_created`
- `invoice.draft_updated`
- `collection_plan.created`
- `collection_event.sent`
- `receipt.draft_created`
- `receipt.confirmed`
- `journal_entry.posted`

Every audit event should have a correlation/request ID shared across the route/MCP service call where possible.

---

# PART 15 — IMPLEMENTATION PHASES AND CHECKPOINTS

## Phase 0 — Preflight and environment (10–20 minutes)

- Read business brief and source assignment.
- Inspect project state.
- Initialize Next.js if needed.
- Add strict TypeScript and lint/test scripts.
- Create `.env.example`, `.gitignore`, implementation log and task checklist.
- Create a minimal landing page and app shell placeholder only as needed.

**Exit criteria:** app starts locally; task/log documents exist; no secrets tracked.

## Phase 1 — Database and domain foundation

- Create Supabase project/migration files or use existing configured Supabase project.
- Create schema, RLS policies, indexes and constraints.
- Create seed SQL with fictional demo tenant/customer/invoice data.
- Build typed DB access helpers and runtime env validation.
- Build money/date/validation utility functions.

**Exit criteria:** migrations apply; seed applies; database tests pass; a tenant cannot read other tenant data.

## Phase 2 — Core domain services

Implement and test:

- customer create/list/get/update;
- invoice create/list/get/update draft;
- invoice line calculations;
- collection plan create/list;
- receivables ageing report;
- audit event creation;
- idempotency for writes.

**Exit criteria:** service-level tests pass, database rows are real, no business logic duplicated in UI/MCP.

## Phase 3 — MCP endpoint early

Build this phase early enough to discover deployment/protocol problems before UI polish:

- install current official MCP TypeScript SDK v2;
- implement request authentication and tenant resolution;
- create stateless Streamable HTTP handler at `/api/mcp`;
- register P0 tools only;
- add robust schemas and descriptions;
- run MCP Inspector or compatible client locally;
- deploy a minimal endpoint as early as feasible and test Claude connector setup.

**Exit criteria:** Claude can list tools and create a real customer/invoice record through the public endpoint, if remote deployment access is available. Otherwise local MCP protocol tests pass and the missing deployment credential is documented.

## Phase 4 — Frontend experience

- build dashboard shell;
- receivables table and filters;
- invoice detail/editor;
- customer list/detail;
- collections timeline;
- receivables report;
- empty/loading/error states;
- responsive layout and polish.

**Exit criteria:** same records created via MCP can be seen and edited in UI; UI changes are persisted and visible after refresh.

## Phase 5 — Integration and quality

- connect all UI to the same domain services;
- align MCP and UI report totals;
- add idempotency, audit history and failure handling;
- run lint/typecheck/unit/integration/E2E tests;
- perform no-AI grep and secrets review;
- fix critical and high severity issues.

**Exit criteria:** core acceptance scenario passes, build is green, no known P0 bug.

## Phase 6 — P1 enhancements only if time allows

- add receipts and safe allocations;
- add minimal ledger postings only if complete balanced-entry tests pass;
- add reminder email adapter only if actual Resend credentials and verified sender are available;
- add reminder dispatcher only if tested after deployment.

**Exit criteria:** all added features tested and labelled accurately. If not complete, omit them from UI and pitch.

## Phase 7 — Deployment and release evidence

- deploy Next.js to Vercel;
- configure environment variables;
- apply migrations to production database;
- seed only fictional demo data;
- verify public app and MCP endpoint over HTTPS;
- add connector to Claude and run the manual E2E test;
- create test user credentials using secure path;
- record exact URLs and outcomes;
- generate the required `DEPLOYMENT_TESTING_VIDEO_GUIDE.md` from actual facts;
- final security and no-AI review.

**Exit criteria:** submission package has working app URL, reviewer credentials, MCP URL, Claude setup steps, test evidence and pitch-video script.

---

# PART 16 — BUILD COMMANDS AND SCRIPT REQUIREMENTS

Create working `package.json` scripts equivalent to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Adapt script names if the project uses current framework defaults, but preserve equivalent commands. Ensure the README documents install, env setup, database migration/seed, dev server and all test commands.

Before deployment run at least:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Run Playwright E2E if configured and record the actual result. If a command is unavailable, add/configure it rather than saying “passed”.

---

# PART 17 — FINAL GENERATED DOCUMENT: DEPLOYMENT_TESTING_VIDEO_GUIDE.md

At the end of implementation, **you must create `DEPLOYMENT_TESTING_VIDEO_GUIDE.md` in the project root**. This is a deliverable, not an optional summary.

The document must be generated from actual build/deployment/test results and contain the sections below. Use placeholders only for details the user must still supply. Never invent values.

## 17.1 Project status

- product name and release version;
- repository path/branch/commit if available;
- date/time prepared;
- features actually implemented;
- known limitations and unimplemented roadmap items.

## 17.2 Live URLs

- production web app URL;
- login URL;
- MCP endpoint URL;
- health URL;
- optional public demo invoice URL;
- deployment provider and deployment ID if available.

For each, state whether you personally verified it by making an HTTP request or opening it. Do not invent `vercel.app` names.

## 17.3 Environment variables and deployment setup

List every required variable with:

- exact variable name;
- what it is for;
- where to obtain/configure it;
- whether required or optional;
- whether public or secret;
- which hosting environment needs it.

Never include actual secret values in this document. Include migration commands, seed procedure, build command and redeploy sequence.

## 17.4 Database setup

- Supabase project configuration steps;
- migrations in correct order;
- seed data operation;
- RLS verification;
- demo organization identifier (not a secret);
- test login account creation steps;
- backup/restore limitations for the demo.

## 17.5 Claude MCP connector setup — exact reviewer instructions

Include:

1. Open Claude in a supported client/account.
2. Navigate to the current Connectors settings (verify current UI wording from official docs).
3. Choose Add custom connector.
4. Name it `CashCollect Finance OS`.
5. Paste the actual deployed MCP endpoint.
6. Configure authentication using the exact fixed request header required by the deployed server. For bearer auth, header name is `Authorization` and value format is `Bearer <reviewer-token>`; do not write an actual token to a public document.
7. Complete connection.
8. Enable the connector for the conversation using the current Claude interface.
9. Test by asking Claude to call `list_customers` and create an invoice draft.

Explain that Claude's cloud infrastructure calls the public remote MCP endpoint, so it must be publicly reachable over HTTPS and cannot be localhost-only or private-network-only.

## 17.6 Reviewer test credentials

If app login is required, include:

- app URL;
- test email/username;
- test password or magic-link procedure;
- how to reset/recreate the demo user;
- whether the account is read/write or read-only.

Never put production personal credentials in a public artifact. Use a dedicated temporary reviewer account with synthetic data. If the user must configure the actual password, mark it as a final fill-in field.

## 17.7 Verified test report

Create a table with columns:

- test ID;
- test name;
- command/steps;
- expected result;
- actual result;
- status (`PASS`, `FAIL`, `NOT RUN`, `BLOCKED`);
- evidence/log reference.

Include lint, typecheck, unit, integration, build, E2E, MCP handshake/tools list, Claude connector, create-record, UI edit, report parity, persistence, RLS and no-AI checks. Report actual outputs; never mark unrun tests as passed.

## 17.8 End-to-end reviewer script

Give the reviewer the exact Claude prompts in this order:

**Prompt 1 — create/find customer**

> Using CashCollect, find a customer named ABC Technologies. If it does not exist, create it with email finance@example.com and 15-day payment terms. Return the saved customer ID and CashCollect link.

**Prompt 2 — create invoice and collection plan**

> Create a draft invoice for ABC Technologies dated 10 November 2026 and due 25 November 2026. Add one line: Software consulting, quantity 1, unit price ₹85,000, tax ₹0. Create a collection plan with reminders 3 days before due date, on due date and 3 days after. Do not send emails. Return the invoice link and schedule summary.

**Prompt 3 — edit in web app**

> Open the CashCollect invoice link, change the notes to “November consulting retainer” and save the draft. Refresh the page and make sure the change persists.

**Prompt 4 — read report**

> Retrieve this invoice and prepare a receivables report as of 10 November 2026. Show the invoice total, due date, status, outstanding amount and ageing bucket. Do not estimate any value; use CashCollect's saved records.

Adjust prompts to match the final implemented tool names and exact product behavior. If a prompt references a tool not deployed, revise the prompt rather than claiming it works.

## 17.9 Five-minute video demo instructions

Provide a time-coded plan matching the assignment's requested sections:

- 0:00–0:45 — founder introduction;
- 0:45–1:15 — best previous work and measurable proof (use only user-provided/verified numbers; mark unknown metrics as placeholders);
- 1:15–2:15 — customer problem, ICP, why CashCollect not just Claude, why no AI API inside improves its cost model;
- 2:15–4:15 — live Claude → MCP → CashCollect → edit → report demonstration;
- 4:15–5:00 — pricing, per-customer cost assumptions, first-100 acquisition strategy, 1-year and 3-year ambition.

Include:

- exact browser tabs and windows to prepare;
- exact Claude prompt to paste;
- which tool invocation to show;
- what to click in CashCollect;
- what to avoid showing (secrets, personal data, terminal clutter, broken states);
- fallback recording plan if live Claude MCP is unavailable (screen record a verified prior successful run, but do not fabricate an MCP action);
- final video duration check and review checklist.

## 17.10 Submission checklist

- working live app URL;
- test credentials;
- working MCP URL;
- Claude connector steps;
- verified 5-minute-or-less video URL;
- no AI API keys or model calls;
- all links checked from an incognito/clean browser where possible;
- final status and limitations stated honestly.

---

# PART 18 — README AND HANDOFF REQUIREMENTS

Create/update `README.md` with:

1. Product description and assignment fit;
2. feature list distinguishing implemented vs planned;
3. architecture diagram (Mermaid is acceptable);
4. stack;
5. local setup;
6. environment variables (names only);
7. database migration/seed steps;
8. run/lint/typecheck/test/build commands;
9. MCP local and remote endpoint information;
10. security notes and demo limitations;
11. link to `business.md`, this specification and `DEPLOYMENT_TESTING_VIDEO_GUIDE.md`.

Create/update `IMPLEMENTATION_LOG.md` with chronological factual progress. Create/update `TASKS.md` with completed and pending checkboxes. Do not mark unverified deployment work complete.

---

# PART 19 — WHAT THE AGENT MUST NEVER DO

1. Never add AI inference into CashCollect, even “just for invoice categorization”, OCR or email drafting.
2. Never use Claude API from server code. Claude is external and connects only through MCP.
3. Never fake MCP tool calls, database persistence, email sends or deployment success.
4. Never hard-code credentials, passwords, API keys or reviewer bearer tokens.
5. Never expose Supabase service-role/secret key to the browser.
6. Never accept a tenant ID from Claude/browser as a trusted authorization boundary.
7. Never silently modify posted accounting records.
8. Never use floating-point arithmetic for currency.
9. Never send collection emails without an actual configured provider and approval policy.
10. Never expose destructive reset, delete-all or admin routes publicly.
11. Never claim tax compliance, audit completion or CA replacement.
12. Never build unimplemented future modules as clickable fakes.
13. Never spend the majority of the deadline polishing marketing pages before MCP create → database persist → UI edit works.
14. Never stop at the plan. Execute code, run commands and verify.
15. Never produce `DEPLOYMENT_TESTING_VIDEO_GUIDE.md` with invented URLs, credentials, screenshots, test results or video links.

---

# PART 20 — FINAL RESPONSE REQUIRED FROM CLAUDE

When all work that can be completed is finished, provide a concise but complete handoff in the final response with:

1. What was actually built.
2. Production app URL (only if verified).
3. MCP URL (only if verified).
4. Demo login instructions (never disclose secrets in a public context).
5. List of MCP tools actually implemented.
6. Commands/tests run and real pass/fail status.
7. Known bugs, limitations and blocked items.
8. Location/link to `DEPLOYMENT_TESTING_VIDEO_GUIDE.md`.
9. Exact remaining actions the user must perform (for example: add Supabase environment values, connect Claude, create reviewer login, record video, submit assignment).

Do not end by asking what to do next if the next engineering action is already defined in this specification. Continue independently until the P0 definition of done is reached or a genuine external blocker prevents it.

---

# OFFICIAL TECHNICAL REFERENCES

Use current versions of these documents rather than relying on model memory:

- MCP TypeScript SDK v2: https://ts.sdk.modelcontextprotocol.io/v2/
- MCP SDK `createMcpHandler` API: https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/server/server/createMcpHandler.html
- MCP SDK web-standard serving: https://ts.sdk.modelcontextprotocol.io/v2/serving/web-standard.html
- MCP protocol specification: https://modelcontextprotocol.io/specification/
- Claude remote MCP custom connectors: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Anthropic remote MCP server building guide: https://support.anthropic.com/en/articles/11503834-building-custom-integrations-via-remote-mcp-servers
- Next.js App Router: https://nextjs.org/docs/app
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Supabase server-side auth / SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Vercel Schedules/Cron: https://vercel.com/docs/schedules/cron-jobs
- Resend with Next.js (optional): https://resend.com/docs/send-with-nextjs

If any documented SDK signature or UI menu has changed, follow the current official documentation and record what changed in `IMPLEMENTATION_LOG.md` and `DEPLOYMENT_TESTING_VIDEO_GUIDE.md`.

---

# START EXECUTION NOW

Read the companion business brief and original Volopay assignment, inspect the active repository, create the task and progress logs, and execute Phase 0 onward. Your priority is to deliver the smallest real end-to-end CashCollect Finance OS workflow that proves Claude → MCP → persistent database → editable web app → deterministic report. Work in bounded loops, run the tests, fix failures, deploy where access permits, and generate `DEPLOYMENT_TESTING_VIDEO_GUIDE.md` from verified facts before handing the project back.
