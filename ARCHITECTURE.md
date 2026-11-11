# CashCollect Finance OS — Architecture & Implementation

**Version:** 1.0.0 (MVP)  
**Status:** Live at https://cashcollect.vercel.app | Demo: https://canva.link/d9u2h682oco39k2

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL USERS & SYSTEMS                      │
├──────────────────────────────────────────────────────────────────┤
│  Web Browser (React)          │   Claude AI (ChatGPT Pro)        │
│  https://cashcollect.vercel.app    MCP Plugin Integration       │
└──────────────┬──────────────────────────────┬────────────────────┘
               │ HTTPS REST                   │ HTTPS MCP
               ↓                              ↓
┌──────────────────────────────────────────────────────────────────┐
│         NEXT.JS 16.4 + TYPESCRIPT (Vercel Serverless)            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  • Pages: /app/dashboard, /receivables, /customers, /reports     │
│  • API Routes: /api/mcp (MCP server), /api/invoices, etc         │
│  • Business Logic: Customer, Invoice, Collection services        │
│  • Data Access: Repository pattern (in-memory or Supabase)       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
               ↓                              ↓
    ┌──────────────────────┐      ┌──────────────────────┐
    │ DEMO MODE (Local)    │      │ SUPABASE (Production)│
    ├──────────────────────┤      ├──────────────────────┤
    │ In-Memory JSON Store │      │ PostgreSQL Database  │
    │ 5 customers          │      │ Org-scoped data      │
    │ 8 invoices           │      │ Real-time sync       │
    │ 3 collection plans   │      │ ACID compliance      │
    └──────────────────────┘      └──────────────────────┘
```

---

## Data Flow

### **Web App Flow: Create Invoice (User → Dashboard)**

```
User clicks "New Invoice" → fills form → clicks "Save"
    ↓
PATCH /api/invoices/[id] (Next.js API route)
    ↓
invoices.service.updateInvoiceDraft(data)
    ↓
Validates with Zod schema → Saves to DB (Supabase or in-memory)
    ↓
Audit service logs event: { action: "invoice_draft_updated", source: "web" }
    ↓
Response sent back → React updates dashboard
    ↓
Invoice visible in /app/receivables page
```

### **MCP Flow: Create Invoice via Claude (Claude → CashCollect)**

```
User in ChatGPT: "Create invoice for customer X, amount Y, due date Z"
    ↓
ChatGPT calls MCP tool: create_invoice_draft(...)
    ↓
HTTPS POST → https://cashcollect.vercel.app/api/mcp
    ↓
MCP server receives request → authenticates (future: Bearer token)
    ↓
Calls invoices.service.createInvoiceDraft(orgId, data)
    ↓
Validates input → Saves to database
    ↓
Audit logs: { action: "invoice_draft_created", source: "mcp" }
    ↓
Returns: { invoice_id, invoice_number, link, total_amount }
    ↓
ChatGPT displays response + clickable link to dashboard
    ↓
User clicks link → Opens invoice in web dashboard
```

---

## Tools Used

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | React 19.3 + TypeScript | Latest React, type-safe |
| **Backend** | Next.js 16.4 | Full-stack, Vercel native, MCP compatible |
| **MCP SDK** | @modelcontextprotocol/sdk 1.32 | Official Claude integration |
| **Database (Dev)** | In-Memory JSON | Fast local testing, no setup |
| **Database (Prod)** | Supabase PostgreSQL | Open-source, ACID, real-time |
| **Validation** | Zod 4.6.7 | Type-safe schemas |
| **Styling** | Tailwind CSS 4.3 | Utility-first, responsive |
| **Deployment** | Vercel | Seamless Next.js hosting |
| **Type System** | TypeScript 5 | Compile-time safety |

---

## Assumptions

1. **Single Organization** — MVP assumes one org per session (schema supports multi-tenant for future)
2. **Demo Mode** — Data in memory for quick testing (resets on restart)
3. **No Real Email** — Collection reminders drafted but not sent (future: Resend/SendGrid)
4. **MCP Auth Disabled** — Temporarily off for ChatGPT (re-enable when ChatGPT SDK supports headers)
5. **No GL Ledger** — Simple outstanding/paid tracking (production: double-entry GL)
6. **Demo Data Seeded** — 5 customers, 8 invoices with realistic scenarios
7. **Currency: INR** — All amounts in paise (₹100 = 10,000 paise)
8. **Timezone: Asia/Kolkata** — Hardcoded for Indian SMEs

---

## Limitations (Current vs Production)

| Feature | MVP | Production |
|---------|-----|-----------|
| **Persistence** | In-memory | Supabase PostgreSQL |
| **Auth** | Demo (no login) | Supabase Auth + RBAC |
| **Email** | Drafted only | Resend integration |
| **Multi-tenant** | Single org | Org-scoped isolation |
| **Payment Sync** | Manual entry | Volopay API integration |
| **Ledger** | None | Double-entry GL |
| **PDF Export** | No | React-PDF |
| **Bulk Import** | No | CSV/Excel upload |
| **Mobile** | No | React Native app |
| **Webhooks** | No | Event-based integrations |

---

## What Was Built

**✅ Dashboard**
- KPI cards (outstanding, overdue, collected, due-soon)
- Receivables list with filtering/search
- Invoice detail + editable drafts
- Customer list + CRUD
- Collection schedule view
- Ageing report

**✅ MCP Integration (8 Tools)**
1. list_customers, create_customer
2. list_invoices, get_invoice
3. create_invoice_draft, update_invoice_draft
4. create_collection_plan
5. get_receivables_report

**✅ Core Features**
- Demo authentication
- Audit logging
- Live on Vercel
- MCP endpoint: `/api/mcp`

---

## Builder vs Partner Responsibilities

### **Builder (This MVP)**
- Designed & built MCP server
- Implemented 8 business logic tools
- Built React dashboard UI
- Deployed to Vercel + Supabase
- Integrated with ChatGPT

### **Volopay / Partner (Future)**
- Bank feed API (transaction sync)
- Payment reconciliation UI
- Payment collection
- Compliance reporting

---

## Next Steps (Prioritized)

**Phase 1: Production Hardening**
- Re-enable MCP Bearer token auth
- Add role-based access control
- API rate limiting

**Phase 2: Core Features**
- Supabase Auth integration
- Multi-tenancy support
- Email delivery (Resend)

**Phase 3: Integrations**
- Volopay bank feed API
- Razorpay payment links
- Tally export

**Phase 4: Advanced**
- DSO tracking & AR aging trends
- Invoice PDF export
- GST compliance module

---

## Quick Start

### **Local Development**
```bash
git clone https://github.com/rithikrajyt/cashcollect.git
npm install
cp .env.example .env.local
npm run dev
# Open http://localhost:3000
```

### **Demo Credentials**
- Email: `demo@cashcollect.app`
- Password: `demo2026`

### **Test MCP**
- URL: https://cashcollect.vercel.app/api/mcp
- Test in ChatGPT Pro > Plugins > Add MCP Connector

---

**I have included my architecture diagram and implementation notes.**

*Live Demo:* https://canva.link/d9u2h682oco39k2  
*GitHub:* https://github.com/rithikrajyt/cashcollect  
*App:* https://cashcollect.vercel.app
