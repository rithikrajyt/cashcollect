# CashCollect Finance OS — Feature Gap Analysis

> Comparing `business.md` vision against the implemented codebase as of 11 Nov 2026.

---

## 1. Section 6.1 — Accounts Receivable and CashCollect

### EXISTS
- Customer master (create, list, search, update, GSTIN/email/phone/billing address)
- Sales invoice register with line items (create draft, list, get, update draft)
- Issue invoice (draft → issued with INV-YYYY-NNNN number)
- Invoice statuses: draft, issued, partially_paid, paid, voided, disputed
- Due dates and customer-specific payment terms (0–365 days)
- Ageing buckets: current, 1–30, 31–60, 61–90, 91+ days
- Collection schedule with reminder events (before_due, due_date, overdue, follow-up)
- Receivables ageing report with per-invoice detail
- Audit trail on all mutations
- PDF invoice generation (printable template)

### MISSING
- **Promise-to-pay records** (expected date + amount tracking) — **P2**
- **Dispute and follow-up notes** (structured dispute workflow) — **P2**
- **Receipt capture and invoice allocation** (record_payment + allocate) — **P1** (business.md lists this in the MVP tool set)
- **Customer statement report** (per-customer outstanding summary) — **P2**
- **Actual email delivery** (Resend integration for reminders) — **P2**
- **Invoice status: written off, cancelled** (only voided exists in checks) — **P2**
- **Credit/debit notes** — **P3**
- **Configurable ageing bucket ranges** — **P3**
- **Overdue as a derived display state** (currently handled in report, not as a UI filter badge) — **P2**

---

## 2. Section 6.2 — Accounts Payable

### EXISTS
- Nothing. No vendor/bill/payable module exists.

### MISSING (entire module)
- Vendor master and contact details — **P3**
- Supplier bill register and attachments — **P3**
- Bill due dates, payment terms, approval status — **P3**
- Duplicate-reference checks — **P3**
- Payable ageing and upcoming payment calendar — **P3**
- Payment instruction records — **P3**
- Vendor statement and outstanding report — **P3**

---

## 3. Section 6.3 — Expenses and Employee Reimbursements

### EXISTS
- Nothing. No expense module exists.

### MISSING (entire module)
- Expense request form (category, amount, date, purpose, evidence) — **P3**
- Employee/submitter and approver workflow — **P3**
- Policy limits and approval routing — **P3**
- Reimbursement status tracking — **P3**
- Expense ledger posting — **P3**

---

## 4. Section 6.4 — General Ledger and Bookkeeping

### EXISTS
- Nothing. No ledger, chart of accounts, or journal module exists.

### MISSING (entire module)
- Chart of accounts — **P3**
- Account groups and types — **P3**
- Customer and vendor subledgers — **P3**
- Voucher types (sales, purchase, receipt, payment, contra, journal) — **P3**
- Journal entries and lines — **P3**
- Opening balances — **P3**
- Financial year and accounting periods — **P3**
- Posting, reversal, adjustment workflows — **P3**
- Trial balance — **P3**
- Profit and loss statement — **P3**
- Balance sheet — **P3**
- Cash-flow statement — **P3**
- Period close controls — **P3**

---

## 5. Section 6.5 — Bank Reconciliation

### EXISTS
- Nothing. No bank module exists.

### MISSING (entire module)
- Bank statement CSV upload — **P3**
- Transaction parsing — **P3**
- Deterministic matching rules — **P3**
- Confirm/reject match UI — **P3**
- Reconciliation summary and exceptions — **P3**

---

## 6. Section 6.6 — Tax and Compliance Preparation

### EXISTS
- Nothing. No tax module exists.
- Invoice line items accept a tax_amount_paise but there are no tax codes or GST calculations.

### MISSING (entire module)
- Sales and purchase registers — **P3**
- GST tax-code configuration — **P3**
- Input/output tax control accounts — **P3**
- Credit/debit note registers — **P3**
- TDS ledger — **P3**
- GST reconciliation exceptions — **P3**
- CA review checklist and export pack — **P3**

---

## 7. Section 6.7 — CA/Accountant Workspace

### EXISTS
- Nothing. No CA workspace or reviewer portal exists.

### MISSING (entire module)
- External reviewer role with scoped access — **P3**
- Trial balance / ledger / register views for CA — **P3**
- Unposted/unreconciled filter — **P3**
- Review comments and clarification requests — **P3**
- Downloadable evidence pack (CSV/XLSX/PDF) — **P3**
- "Reviewed by" tracking — **P3**

---

## 8. Section 7 — Natural-Language Use Cases

### EXISTS (working end-to-end via MCP)
- **Use case A:** Create invoice + collection plan — fully works
- **Use case C (partial):** Overdue receivables report — ageing report works, but Claude-drafted follow-up messages are not generated/stored in CashCollect

### MISSING
- **Use case B:** Record a customer payment — **P1** (`record_payment` listed in MVP tool set but not implemented)
- **Use case D:** Record a vendor bill — **P3** (requires AP module)
- **Use case E:** View bank ledger / unreconciled entries — **P3** (requires ledger + bank modules)
- **Use case F:** Monthly CA review pack export — **P3** (requires ledger + reports + CA module)
- **Use case G:** Cash position summary — **P2** (`get_cash_summary` listed in MVP tools but not implemented; needs bank balance data)

---

## 9. Section 8 — MCP Tools (Full Catalogue vs Implemented)

### Implemented (9 tools)
| Tool | Status |
|------|--------|
| `list_customers` | Done |
| `create_customer` | Done |
| `create_invoice_draft` | Done |
| `list_invoices` | Done |
| `get_invoice` | Done |
| `update_invoice_draft` | Done |
| `issue_invoice` | Done |
| `create_collection_plan` | Done |
| `get_receivables_report` | Done |

### Missing from MVP tool set (business.md Section 8)
- `record_payment` — **P1** (listed in the MVP table)
- `get_cash_summary` — **P2** (listed in MVP table; needs bank data)

### Missing from expanded catalogue (45+ tools described)
- All company/master-data tools except list/create customers — **P3**
- All sales tools: `issue_invoice` ✓, `create_credit_note_draft`, `record_customer_receipt`, `allocate_receipt`, `record_promise_to_pay`, `get_customer_statement` — **P2–P3**
- All purchase/payable tools (6) — **P3**
- All bookkeeping/ledger tools (10) — **P3**
- All banking/reconciliation tools (5) — **P3**
- All close/CA tools (7) — **P3**

---

## 10. Section 12 — UI/UX Screens

### EXISTS
| Screen | Route | Status |
|--------|-------|--------|
| Landing page | `/` | Done |
| Finance overview / Dashboard | `/app` | Done — KPIs, recent invoices, overdue, MCP panel |
| Receivables list | `/app/receivables` | Done — search, status filter, table |
| Invoice detail/editor | `/app/receivables/[id]` | Done — edit draft, save, issue, view lines/collections/audit |
| Create invoice form | `/app/receivables/new` | Done — customer picker, line items, totals |
| Invoice PDF | `/app/receivables/[id]/pdf` | Done — printable template |
| Customers list | `/app/customers` | Done — search, inline create |
| Collections schedule | `/app/collections` | Done — event timeline, status badges |
| Receivables ageing report | `/app/reports/receivables` | Done — date picker, ageing buckets, detail table |

### MISSING
- **Login page** (`/login`) — uses demo mode, no Supabase Auth — **P1** (required for deployment)
- **Payables / Bills** (`/app/payables`) — **P3**
- **Expenses** (`/app/expenses`) — **P3**
- **Chart of Accounts** (`/app/accounting/chart-of-accounts`) — **P3**
- **Journals** (`/app/accounting/journals`) — **P3**
- **General Ledger drill-down** (`/app/accounting/ledger/[id]`) — **P3**
- **Bank Reconciliation** (`/app/banking/reconciliation`) — **P3**
- **Approvals queue** (`/app/approvals`) — **P3**
- **CA Workspace** (`/app/ca-workspace`) — **P3**
- **Settings** (`/app/settings`) — **P2**
- **Reports catalogue** (P&L, balance sheet, trial balance, cash flow, GST, TDS, customer/vendor statements) — **P3**
- **Invoice PDF download** as actual PDF file (current approach is print-to-PDF via browser) — **P2**

### Navigation gaps
- Sidebar shows flat list; business.md describes grouped "Money In / Money Out / Accounting / Banking" hierarchy — **P2**
- No company/entity selector in topbar — **P2**
- No financial-year/period selector — **P3**
- No notifications — **P3**
- No global search — **P2**

---

## 11. Section 13 — Security & Controls (not a module section but important gaps)

### EXISTS
- Bearer token auth for MCP
- Tenant scoping on all queries (organization_id)
- Audit events on all mutations
- No AI keys in the app (verified)

### MISSING
- **Supabase Auth for web users** — **P1** (demo mode only; no real login)
- **Role-based access control (RBAC)** — **P2** (no roles enforced)
- **Maker-checker approvals** — **P3**
- **Idempotency keys for MCP writes** — **P2** (table defined in migration, not enforced)
- **Rate limiting** on MCP endpoint — **P2**
- **Optimistic concurrency** (updated_at check on edits) — **P2**

---

## Summary: Priority Counts

| Priority | Count | Description |
|----------|-------|-------------|
| **P1** | 3 | Record payment, Supabase Auth login, issue workflow ✓ (just added) |
| **P2** | ~15 | Cash summary, customer statements, email delivery, settings, global search, RBAC, idempotency, etc. |
| **P3** | ~60+ | Entire AP, expenses, ledger, bank recon, tax, CA workspace, expanded MCP tools, expanded reports |

### Recommended before submission
1. ~~Issue invoice (draft → issued)~~ — Done
2. Record payment + allocate to invoice — Adds the most demo value
3. PDF invoice generation — Done
