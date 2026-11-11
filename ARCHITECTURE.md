# CashCollect Finance OS — Architecture & Implementation Notes

**Version:** 1.0.0 (MVP)  
**Date:** 11 November 2026  
**Status:** Live on Vercel with MCP connector for Claude

---

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXTERNAL USERS                            │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (React)           │   Claude AI (MCP Client)        │
│  https://cashcollect.vercel.app     chatgpt.com/plugins         │
└──────────────┬──────────────────────────────┬────────────────────┘
               │                              │
        [HTTPS GET/POST]           [HTTPS MCP over HTTP]
               │                              │
┌──────────────┴──────────────────────────────┴────────────────────┐
│              NEXT.JS 16 APPLICATION LAYER (Vercel)               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ PAGES & ROUTES                                              │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • /app/dashboard          → KPI cards, overview             │ │
│  │ • /app/receivables        → Invoice list & search           │ │
│  │ • /app/customers          → Customer list & search          │ │
│  │ • /app/collections        → Collection schedules            │ │
│  │ • /app/reports            → Ageing & financial reports      │ │
│  │ • /login                  → Auth (demo mode, no real login) │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 ↓                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ API ROUTES (Next.js /api)                                   │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • /api/mcp                 → MCP server (HTTP transport)    │ │
│  │ • /api/health              → Health check                   │ │
│  │ • /api/auth/*              → Auth endpoints (demo)          │ │
│  │ • /api/customers/*         → CRUD operations                │ │
│  │ • /api/invoices/*          → Draft, retrieve, update        │ │
│  │ • /api/reports/*           → Ageing, outstanding           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 ↓                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ BUSINESS LOGIC LAYER (src/modules/*)                        │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • customers/service       → Customer operations             │ │
│  │ • receivables/service     → Invoice operations              │ │
│  │ • collections/service     → Collection plan logic           │ │
│  │ • reports/service         → Report generation               │ │
│  │ • payments/service        → Payment recording               │ │
│  │ • audit/service           → Event logging                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                 ↓                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ DATA ACCESS LAYER (src/modules/*/repository.ts)             │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ DEMO MODE (in-memory):     │ SUPABASE (production):         │ │
│  │ • JSON data store          │ • PostgreSQL queries           │ │
│  │ • Resets on server restart │ • Persistent storage           │ │
│  │ • No network latency       │ • Real-time sync               │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
               ↓                                ↓
    ┌──────────────────────┐      ┌──────────────────────┐
    │ DEMO DATA STORE      │      │ SUPABASE POSTGRESQL  │
    │ (In-Memory)          │      │ (Production)         │
    ├──────────────────────┤      ├──────────────────────┤
    │ 1 Organization       │      │ Organizations table  │
    │ 5 Customers          │      │ Customers table      │
    │ 8 Invoices           │      │ Invoices table       │
    │ 15+ Line items       │      │ Invoice_lines table  │
    │ 3 Collection plans   │      │ Collection_plans     │
    │ 9 Events             │      │ Collection_events    │
    │ Audit log            │      │ Audit_events table   │
    └──────────────────────┘      │ Payments table       │
                                  └──────────────────────┘
```

---

## 2. Data Flow

### **2.1 Web App Flow: Create Invoice**

```
User opens /app/invoices/[id]/edit
    ↓
Next.js page fetches invoice data via API
    ↓
React component renders form (date, customer, notes, line items)
    ↓
User clicks "Save" → PATCH /api/invoices/[id]
    ↓
API calls invoices.service.updateInvoiceDraft()
    ↓
Service validates input (Zod schemas)
    ↓
Repository updates database (Supabase or in-memory)
    ↓
Audit service logs: "invoice_draft_updated" event
    ↓
API returns updated invoice
    ↓
React updates state and shows success toast
    ↓
Data persists in Supabase (or stays in memory if demo mode)
```

### **2.2 MCP Flow: Create Invoice via Claude**

```
User in ChatGPT: "Create invoice for TechVista, $5000, due 25 Nov"
    ↓
ChatGPT calls CashCollect MCP tool: create_invoice_draft
    ↓
HTTPS POST to https://cashcollect.vercel.app/api/mcp
    ↓
MCP server receives request (no auth, temporarily disabled)
    ↓
MCP calls invoices.service.createInvoiceDraft()
    ↓
Service validates all inputs (Zod schemas)
    ↓
Repository saves to database (Supabase or in-memory)
    ↓
Audit logs: "invoice_draft_created" with source="mcp"
    ↓
MCP returns response: { invoice_id, invoice_number, link, total }
    ↓
ChatGPT parses response and shows to user
    ↓
User opens CashCollect link → Invoice visible in dashboard
```

### **2.3 Collection Plan Flow**

```
MCP tool: create_collection_plan called
    ↓
Input: invoice_id, reminder days (e.g., [-3, 0, +3])
    ↓
Service calculates scheduled times based on invoice due_date
    ↓
Creates collection_events table rows:
  - Event 1: scheduled_at = due_date - 3 days, event_type = "before_due"
  - Event 2: scheduled_at = due_date,           event_type = "due_date"
  - Event 3: scheduled_at = due_date + 3 days, event_type = "overdue"
    ↓
Status = "scheduled" (not sent yet, awaiting email service)
    ↓
Returns: plan_id, event_count, scheduled_dates
    ↓
Audit logs the plan creation
    ↓
(Future: Cron job reads collection_events table, sends emails)
```

---

## 3. Tools & Stack

| Layer | Tool | Purpose | Why Chosen |
|-------|------|---------|-----------|
| **Frontend** | React 19.3 + TypeScript | UI components, state | Latest React with async features |
| **Framework** | Next.js 16.4 | Server + API + routing | Full-stack, Vercel native, MCP SDK compat |
| **Styling** | Tailwind CSS 4.3 | Responsive UI | Utility-first, dark mode support |
| **Form validation** | Zod 4.6.7 | Input validation | Type-safe, declarative |
| **Database (Dev)** | In-Memory JSON | Fast local testing | No setup, instant feedback |
| **Database (Prod)** | Supabase PostgreSQL | Persistent storage | Open-source, real-time, ACID compliance |
| **MCP SDK** | @modelcontextprotocol/sdk 1.32 | Claude integration | Official SDK, HTTP transport |
| **Deployment** | Vercel | Hosting + CI/CD | Seamless Next.js integration |
| **Type System** | TypeScript 5 | Type safety | Catches errors at compile time |
| **Testing** | Vitest 5.1.0 | Unit tests | Fast, ESM-native, Vite-based |

---

## 4. Assumptions

1. **Single Organization per Session**
   - MVP assumes one org per login session
   - Production: Multi-tenant via `organization_id` parameter (already in schema)

2. **Demo Mode for Initial Testing**
   - Data stored in memory, resets on server restart
   - Good for quick demos; not for production

3. **No Real Email Service**
   - Collection event reminders are drafted but not sent
   - `status = "drafted"` or `"scheduled"` awaiting manual trigger
   - Production: Integrate Resend, SendGrid, or AWS SES

4. **Bearer Token Auth (Disabled for ChatGPT)**
   - MCP auth temporarily disabled (ChatGPT plugin can't send headers yet)
   - Production: Re-enable token validation with proper MCP headers

5. **No Double-Entry Ledger Yet**
   - Invoices tracked as outstanding/paid amounts
   - No GL accounts, no reconciliation
   - Production: Add debtor/creditor GL mappings

6. **Seeded Demo Data**
   - 5 customers, 8 invoices, realistic scenarios
   - All dates relative to Nov 2026 (for testing)
   - Production: Migrated from user's accounting system

7. **MCP Tools Are Read-Heavy**
   - Most tools return data without side effects
   - write tools (create_*, update_*) do persist to DB
   - Safe for Claude to call multiple times

---

## 5. Limitations (MVP vs Production)

### **Current MVP Limitations**

| Feature | MVP Status | Production Plan |
|---------|-----------|-----------------|
| **Persistence** | In-memory (demo mode) | Supabase PostgreSQL ✅ |
| **Authentication** | Demo mode (no real login) | Supabase Auth + role-based ACL |
| **Email Delivery** | Drafted, not sent | Resend or SendGrid integration |
| **Multi-tenant** | Single org hardcoded | Org-scoped data isolation |
| **Payment Recording** | Manual amount entry | Integration with bank feeds (Volopay API?) |
| **Double-entry Ledger** | Not implemented | Full GL with debtor/creditor accounts |
| **MCP Bearer Token** | Disabled (ChatGPT limitation) | Re-enable when ChatGPT SDK matures |
| **Offline Support** | Not applicable | Progressive web app (PWA) |
| **Invoice PDF Export** | Not implemented | React-PDF or HTML-to-PDF |
| **Bulk Operations** | Not supported | Batch import CSV/Excel |
| **Reminders via SMS** | Not supported | Twilio integration |
| **API Rate Limiting** | Not implemented | Redis-based rate limiter |

### **Known Bugs / Edge Cases**

- Invoice due date must be ≥ invoice date
- Collection plan reminders can't be customized per customer
- No timezone handling (assumes Asia/Kolkata)
- Currency hardcoded to INR (amount in paise)

---

## 6. What Was Built (This MVP)

### **Completed Features**

✅ **Web Dashboard**
- KPI cards: outstanding, overdue, collected, due-soon totals
- Receivables list with filtering and search
- Invoice detail view with editable draft fields
- Customer list and CRUD
- Collection schedules view
- Ageing report (current, 30d, 60d, 90d+ buckets)

✅ **MCP Integration (8 Tools)**
1. `list_customers` — Read-only search
2. `create_customer` — Add new customer
3. `list_invoices` — Search invoices by status/customer
4. `get_invoice` — Full invoice + line items
5. `create_invoice_draft` — Create draft invoice
6. `update_invoice_draft` — Modify notes/dates
7. `create_collection_plan` — Schedule reminders
8. `get_receivables_report` — Ageing + totals

✅ **Authentication**
- Demo mode login (no real credentials)
- Session cookie-based

✅ **Audit Logging**
- Every create/update/delete logged with timestamp, user, source
- Visible via API (future: UI dashboard)

✅ **Deployment**
- Live on Vercel: https://cashcollect.vercel.app
- Integrated with Supabase PostgreSQL (production)
- MCP endpoint: /api/mcp (OpenAI/Claude compatible)

---

## 7. What Was NOT Built (Production Roadmap)

- ❌ **Real Authentication** — No Supabase Auth, SSO, 2FA
- ❌ **Multi-tenancy** — Single org only
- ❌ **Payment Gateway** — No Stripe, Razorpay integration
- ❌ **Email Delivery** — Reminders drafted but not sent
- ❌ **Mobile App** — Web-only
- ❌ **Accounting Export** — No Tally, QuickBooks sync
- ❌ **Invoice PDF** — Web UI only, no downloadable PDF
- ❌ **Dunning Workflows** — No automated escalation
- ❌ **Webhook Support** — MCP only, no inbound webhooks
- ❌ **Advanced Analytics** — Only basic ageing report
- ❌ **Role-Based Access** — Demo user sees all data
- ❌ **API Documentation** — No Swagger/OpenAPI spec

---

## 8. Who Did What (Builder vs Partner Responsibilities)

### **Builder (This Implementation)**

- ✅ Designed and built the MCP server (OpenAI-compatible HTTP API)
- ✅ Implemented all 8 business logic tools
- ✅ Designed data schema (PostgreSQL migrations)
- ✅ Built React UI dashboard
- ✅ Seeded realistic demo data
- ✅ Deployed to Vercel + Supabase
- ✅ Integrated with Claude via MCP plugin
- ✅ Wrote audit logging
- ✅ Built collection plan scheduling logic

### **Partner (Future: Volopay or Similar)**

- Future: Provide bank feed API (transaction sync)
- Future: Host reconciliation UI
- Future: Provide identity verification for customers
- Future: Handle payment collection (if integrated)
- Future: Provide compliance/regulatory reporting

### **Third-party (Future)**

- **Supabase**: PostgreSQL hosting, Auth, Real-time sync
- **Vercel**: Next.js hosting, CI/CD, CDN
- **Email Service**: Resend/SendGrid for reminders
- **Payment Gateway**: Razorpay/Stripe for collections

---

## 9. Limitations & Trade-offs

### **Technical Limitations**

1. **Serverless Cold Starts**
   - Vercel Functions warm up in 100-500ms
   - Not suitable for real-time transaction processing
   - Solution: Node.js process on Railway/Render for high-volume

2. **MCP Over HTTP**
   - Not true bidirectional streaming (polling-based)
   - Adds 200-500ms latency vs local Claude connector
   - Solution: Run MCP server locally or on dedicated VPS for low-latency

3. **PostgreSQL Scaling**
   - Supabase free tier has 500MB limit
   - For 10K+ invoices, need enterprise plan
   - Solution: Migrate to AWS RDS PostgreSQL or Planetscale MySQL

4. **Stateless API**
   - Each request is independent (no session state)
   - Collection plan jobs need external scheduler (cron service)
   - Solution: Integrate with Bull queue or AWS Step Functions

### **Business Limitations**

1. **No IST Timezone Handling**
   - Hardcoded to Asia/Kolkata
   - Cross-border SMEs get wrong reminder times
   - Solution: Add timezone per customer/organization

2. **Currency Fixed to INR**
   - All amounts in paise, hardcoded INR symbol
   - Indian SMEs only
   - Solution: Add currency_code to organizations table

3. **No Tax Calculation**
   - Tax is manual entry (no GST/IGST rules)
   - Risk: User error on invoice amounts
   - Solution: Add GST rate rules per product line

4. **No Payment Reconciliation**
   - Manual entry of payments
   - No integration with bank feeds
   - Risk: Duplicate or missing payments
   - Solution: Auto-sync from Volopay/Razorpay API

---

## 10. Next Steps (Prioritized Roadmap)

### **Phase 1: Production Hardening (Weeks 1-2)**
- [ ] Re-enable MCP Bearer token auth (when ChatGPT SDK supports it)
- [ ] Add role-based access control (RBAC) to APIs
- [ ] Implement API rate limiting (Redis + middleware)
- [ ] Add request logging and monitoring (Sentry)
- [ ] Write API documentation (Swagger)
- [ ] Load test with 1K concurrent users

### **Phase 2: Core Features (Weeks 3-4)**
- [ ] Add real Supabase Auth (Google OAuth, email/password)
- [ ] Implement multi-tenancy (org isolation in all queries)
- [ ] Add customer portal (payment status view)
- [ ] Build dunning workflow (auto-escalate overdue)
- [ ] Email delivery integration (Resend for reminders)

### **Phase 3: Integrations (Weeks 5-6)**
- [ ] Volopay bank feed sync (auto-match payments)
- [ ] Razorpay payment collection (one-click links)
- [ ] Tally export (GL sync)
- [ ] Webhook support (external systems can trigger actions)

### **Phase 4: Analytics & Compliance (Weeks 7-8)**
- [ ] Advanced reports (DSO, AR aging trends)
- [ ] Invoice PDF export
- [ ] GST compliance module
- [ ] Audit trail UI (who did what when)

### **Phase 5: Mobile & UX (Weeks 9-10)**
- [ ] React Native mobile app (iOS/Android)
- [ ] Offline sync (PWA)
- [ ] Dark mode
- [ ] Notification push (one-click payment links)

---

## 11. How to Run

### **Local Development**

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in DEMO_MODE=true and other vars

# Start dev server
npm run dev

# Open http://localhost:3000
```

### **Production Deployment**

```bash
# Build
npm run build

# Set Vercel environment variables (see .env.example)
# Push to GitHub → Vercel auto-deploys

# Or manually deploy:
vercel deploy --prod
```

### **Run MCP Tests**

```bash
# Test locally
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}'

# Test in ChatGPT
# Add MCP connector: https://cashcollect.vercel.app/api/mcp
# Chat: "Using CashCollect, list customers"
```

---

## 12. Deployment Checklist

- [x] Code on GitHub (rithikrajyt/cashcollect)
- [x] Deployed to Vercel (https://cashcollect.vercel.app)
- [x] Supabase PostgreSQL connected
- [x] Environment variables set (no secrets in code)
- [x] MCP endpoint live (/api/mcp)
- [x] ChatGPT MCP plugin configured
- [x] Demo data seeded
- [ ] Production backup strategy (Supabase snapshots)
- [ ] Monitoring alerts (Vercel + Sentry)
- [ ] GDPR compliance (data retention policy)
- [ ] Security audit (SQL injection, XSS checks)

---

## 13. Support & Documentation

**What's included in this repo:**
- `/src/mcp/server.ts` — MCP tool definitions + logic
- `/src/modules/*/service.ts` — Business logic
- `/src/app/api/*/route.ts` — API endpoints
- `supabase/migrations/` — Database schema
- `supabase/seed.sql` — Demo data
- `.env.example` — Config template

**External docs:**
- [MCP Protocol](https://modelcontextprotocol.io)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js 16 Guide](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## 14. Contact & Contributions

**Built by:** Rithik Raj Pandey  
**For:** Volopay Assignment  
**GitHub:** https://github.com/rithikrajyt/cashcollect  
**Live Demo:** https://cashcollect.vercel.app/app  
**MCP Endpoint:** https://cashcollect.vercel.app/api/mcp

**Testing credentials:**
- Email: `demo@cashcollect.app`
- Password: `demo2026`
- MCP Token: (disabled for ChatGPT testing, re-enable in production)

---

**I have included my architecture diagram and implementation notes.**

*Last updated: 11 November 2026*
