# CashCollect Finance OS

> **Working product specification and business plan**  
> **Version:** 1.0  
> **Date:** 10 November 2026  
> **Market:** India-first, with an architecture that can expand internationally  
> **Product category:** Claude-native finance operations and accounting workspace for SMEs  
> **Status:** Product vision + technical blueprint + assignment MVP scope

---

## 1. Executive summary

**CashCollect Finance OS** is a finance operating system for Indian small and medium-sized businesses. It brings together accounts receivable, accounts payable, cash visibility, double-entry bookkeeping, bank reconciliation, ledger maintenance, management reporting and accountant/CA collaboration in one controlled workspace.

The product is designed around a simple separation of responsibilities:

- **Claude is the conversational intelligence layer.** The business owner or finance operator asks questions, explains transactions, requests reports and instructs Claude to prepare structured actions through MCP.
- **CashCollect is the system of record and execution layer.** It validates inputs, applies deterministic accounting rules, stores documents and transactions, posts balanced journal entries, runs schedules, enforces approvals, maintains an audit trail and serves live dashboards and reports.
- **The business owner remains accountable for business decisions and approvals.** Sensitive or consequential actions are subject to role permissions and confirmation.
- **The accountant/CA remains the professional reviewer and statutory signatory where the law requires one.** CashCollect prepares cleaner books and evidence; it does not claim to issue audit opinions or professional certifications.

### The product promise

**“Know where your money is, know what you owe, know what customers owe you, and keep your books ready for your accountant — simply by asking Claude.”**

### Initial wedge

Start with **cash collection and bookkeeping for Indian B2B service SMEs**: IT consultancies, staffing/recruitment agencies, marketing agencies, design studios and other professional-service firms.

These businesses commonly have recurring invoices, customer advances, vendor bills, employee expenses, bank transactions and monthly CA hand-offs, but often manage the workflow across spreadsheets, email, WhatsApp and accounting software.

### Long-term vision

Become the **financial operating system for SMEs**: the place where every receivable, payable, expense, payment, bank movement and accounting entry is recorded, reconciled, explained and made actionable. The interface can be conversational through Claude, visual through the CashCollect web app, and later connected to banks, payment providers and accounting/tax workflows through secure integrations.

---

## 2. Assignment interpretation and product principles

The Volopay assignment is not asking for a chatbot embedded in an accounting dashboard. It explicitly asks for a business that runs through the customer's own Claude connection, with no AI inside the application. Claude performs the reasoning and writing; the app performs the work that must persist and remain useful after the chat ends.

The four non-negotiable acceptance criteria are:

1. **Work from Claude:** a request in Claude invokes an MCP tool and creates or changes a real record in CashCollect.
2. **Human-editable:** a user can open the application, inspect the record, edit it and save the change.
3. **Live on the internet:** the app and remote MCP endpoint are publicly reachable for evaluation.
4. **No AI inside the product:** no OpenAI, Anthropic or other model API keys, model calls or hidden AI-powered services are used by the deployed application.

The brief also rules out website builders and online shops, asks for one focused workflow that works well, and requires a pitch explaining the founder, best work, why the business wins, live demo and economics.

### What we should learn from Volopay without copying it

Volopay's public positioning is broader than a single expense tool: it describes a connected financial stack spanning corporate cards, expense management, business accounts, accounts payable, vendor payouts, accounting automation and integrations. Its stated mission is to make finance teams more strategic rather than leaving them doing repetitive bookkeeping and administration. See [Volopay India](https://www.volopay.com/in/) and [Volopay About](https://www.volopay.com/about/).

**The principle to borrow is unification of fragmented finance work, not its exact features or regulated financial infrastructure.** CashCollect should not attempt to issue cards, hold customer funds or become a bank. Its opportunity is the SME's finance operations and books layer:

- unify money-in and money-out workflows;
- connect daily operating events to accounting records;
- give owners real-time visibility and control;
- reduce repetitive finance administration;
- make review and hand-off to professional accountants easier;
- integrate with, rather than immediately force replacement of, existing banks and accounting systems.

### Product principles

1. **One source of truth:** all finance workflows should ultimately map to a company ledger and source documents.
2. **Conversation is an interface, not the database:** Claude can initiate actions, but CashCollect owns the permanent record.
3. **Deterministic accounting:** debits, credits, tax arithmetic, ageing, balances and report totals are computed by tested application code—not by an LLM.
4. **Human control:** approvals, posting, payment release, period closure and filing-related actions have explicit permissions and confirmation.
5. **Traceability by default:** every posted entry must link to its source, actor, timestamp and history.
6. **CA-friendly, not CA-replacement marketing:** produce reviewable books, reconciliations and evidence packages.
7. **Progressive automation:** start with reliable capture and workflow; add integrations and automatic matching only when they can be tested and audited.
8. **No AI in CashCollect:** no LLM, OCR-AI, AI classification, embeddings or AI-generated advice inside the app. Claude may read user-supplied material in its own client and pass structured fields through MCP.

---

## 3. The problem

SMEs often do not have a unified finance operations layer. The company may use a bank portal, Tally or another accounting package, spreadsheets for receivables, email or WhatsApp for payment follow-ups, and a CA's separate process for month-end and statutory work.

This fragmentation creates predictable problems:

- invoices are issued but collection follow-ups are inconsistent;
- promised payment dates are forgotten;
- owners cannot quickly see overdue receivables or near-term cash needs;
- vendor bills and employee expenses are recorded late;
- bank statements do not reconcile cleanly with invoices and expenses;
- bookkeeping entries lack attached supporting documents or clear explanations;
- the CA receives incomplete, late or inconsistent information;
- owners ask simple finance questions but need to wait for a spreadsheet or accountant response;
- changing an old transaction can destroy the audit trail if the process is not controlled.

### Core job to be done

“When I need to understand or operate my company's finances, let me ask in plain language, inspect the proposed action, approve it, and have the system update the books and workflow reliably.”

### Value proposition

CashCollect should sell **faster collections, reliable books, visible cash position and less month-end chaos**—not merely “AI accounting.”

---

## 4. Target customers and positioning

### Initial ideal customer profile (ICP)

Start with Indian B2B service businesses that have relatively simple operations and meaningful invoice volume.

| Attribute | Initial target |
|---|---|
| Business type | IT/software consultancy, staffing/recruitment agency, marketing/design agency, professional services |
| Team size | Approximately 5–50 employees |
| Finance setup | Owner/founder + one finance/admin person + external CA/accountant |
| Transactions | Regular sales invoices, vendor bills, expenses and bank transactions |
| Accounting setup | Spreadsheet, Tally, Zoho Books or outsourced bookkeeping |
| Pain | Chasing payments, delayed bookkeeping, poor visibility, month-end document collection |
| Buyer | Founder, CFO/finance head, operations head |
| Daily users | Finance executive, accounts assistant, owner, authorised managers |
| Professional partner | External accountant, CA or tax practitioner |

The company-size and transaction ranges are product hypotheses for customer discovery, not statutory SME definitions.

### Positioning statement

For Indian service SMEs that lose time coordinating invoices, expenses, bank records and accounting work across disconnected tools, **CashCollect Finance OS** is a Claude-connected finance operations platform that turns natural-language instructions into controlled, traceable financial workflows and current books. Unlike a chatbot or a standalone collections tracker, it links collections, payables, bookkeeping and CA hand-off to one auditable system of record.

### What we are not

- Not a bank, lender, payment aggregator or custodian of funds.
- Not a generic chatbot that gives unverified accounting answers.
- Not merely an invoice generator or reminder sender.
- Not an ATS, CRM or generic workflow builder.
- Not a replacement for statutory auditors or professional CA sign-off.
- Not a full ERP for manufacturing, complex inventory or multi-country tax in the first release.

### Naming note

“CashCollect” is strong for the receivables wedge but may sound too narrow for a wider general-ledger and accounting platform. Keep **CashCollect Finance OS** as the working name for this project. Before commercial launch, test a broader umbrella name such as **CashCollect OS**, **LedgerFlow** or **FinDesk** with target customers and check trademark/domain availability. Do not spend assignment time on renaming.

---

## 5. Product vision and roadmap

### Vision

**Give every SME the financial clarity and operating discipline of a well-run finance department, without requiring a large finance team.**

### Mission

Make business finance understandable, current and actionable by connecting everyday money movement to accurate books, controlled workflows and accountant-ready evidence.

### Strategic product layers

1. **Operate:** create invoices, bills, expenses, collection plans, approvals and payment records.
2. **Record:** post every approved financial transaction into a double-entry general ledger.
3. **Reconcile:** match bank statement lines with invoices, bills, expenses and payments; flag exceptions.
4. **Understand:** generate balances, ageing, cash-flow views, P&L, balance sheet, trial balance and management reports.
5. **Close and collaborate:** prepare month-end checklists and CA-ready evidence packs with a clear reviewer workflow.

### Product phases

| Phase | Scope | Purpose |
|---|---|---|
| Assignment MVP | Invoice/receivable register, customer records, collection reminders, payment status, simple cash dashboard, Claude MCP create/list/update tools, editable UI | Prove Claude → MCP → persistent app → human edit → live workflow |
| Phase 1 | Double-entry ledger, chart of accounts, sales invoices, receipts, vendor bills, expenses, manual journal entries, trial balance and ledger reports | Become a dependable finance record system for service SMEs |
| Phase 2 | Bank statement import/reconciliation, receivable/payable ageing, P&L, balance sheet, cash-flow report, period-close workflow, audit trail and CA export | Reduce monthly bookkeeping and review effort |
| Phase 3 | GST registers and reconciliation preparation, TDS workflow support, e-invoice/e-way bill integrations where applicable, accountant portal, Tally/Zoho imports and exports | Become a useful CA collaboration and compliance-preparation layer |
| Phase 4 | Bank feeds through authorised providers, payment provider integrations, multi-entity, inventory, payroll integrations, configurable rules and international expansion | Expand into a broad SME financial operating system |

**Do not claim Phase 2–4 capabilities in the assignment demo unless they have actually been built and tested.**

---

## 6. Product modules and capabilities

### 6.1 Accounts receivable and CashCollect (initial wedge)

- Customer and contact master.
- Sales invoice register and invoice line items.
- Invoice status: draft, issued, partially paid, paid, overdue, disputed, written off or cancelled.
- Due dates, credit terms and customer-specific collection preferences.
- Ageing buckets: current, 1–30, 31–60, 61–90 and 90+ days (configurable).
- Collection schedules and reminder history.
- Promise-to-pay record with expected date and amount.
- Dispute and follow-up notes.
- Receipt capture and invoice allocation.
- Customer statement and outstanding report.
- Deterministic scheduled reminders via email; messaging-channel integrations are later phase.

### 6.2 Accounts payable

- Vendor master and vendor contact details.
- Supplier bill register and attachments.
- Bill due dates, payment terms and approval status.
- Duplicate-reference checks and configurable approval thresholds.
- Payable ageing and upcoming payment calendar.
- Payment instruction records and payment status.
- Vendor statement and outstanding report.
- Do not move money or release payments in the initial MVP. Record approval and settlement status only.

### 6.3 Expenses and employee reimbursements

- Expense request, category, amount, date, business purpose and evidence attachment.
- Employee/submitter and approver.
- Policy limits and approval routing.
- Reimbursement status and payment reference.
- Expense ledger posting after approval.
- Policy exceptions are flagged for human review; do not auto-approve exceptions.

### 6.4 General ledger and bookkeeping

The accounting core is a **double-entry general ledger**. Each posted transaction generates one or more journal lines, and total debits must equal total credits for every journal entry.

Core components:

- company chart of accounts;
- account groups and account types;
- customer and vendor subledgers;
- sales, purchase, receipt, payment, contra and journal vouchers;
- journal entries and journal lines;
- opening balances;
- financial year and accounting periods;
- posting, reversal and adjustment workflows;
- account ledger and voucher drill-down;
- trial balance;
- profit and loss statement;
- balance sheet;
- cash-flow statement (subject to configured accounting policy and correct classifications);
- cost centres/projects in a later phase.

**Accounting integrity rule:** posted entries should not be silently overwritten or deleted. Correct a posted transaction with a linked reversal and replacement/adjustment entry, preserving the full history. Draft transactions can be edited before posting. Closed periods must reject ordinary back-dated postings unless an authorised user reopens the period with a reason.

### 6.5 Bank reconciliation

Initial release:

- Upload a bank statement CSV using a supported template.
- Parse transaction date, narration, debit, credit, balance and reference.
- Match exact amount/date/reference against recorded receipts and payments.
- Allow the user to confirm or reject suggested deterministic matches.
- Record unmatched lines, duplicates and bank charges for review.
- Produce a reconciliation summary and list of exceptions.

Later release:

- Bank feeds through approved account-information/open-banking partners where available and permitted.
- More flexible deterministic matching rules.
- Reconciliation across multiple accounts and entities.

Do not use screen scraping or store net-banking credentials.

### 6.6 Tax and compliance preparation

CashCollect can maintain structured records and produce **preparation reports**, including:

- sales and purchase registers;
- GST tax-code summaries;
- input/output tax control-account balances;
- invoice and credit/debit note registers;
- TDS ledger and payment tracking, where configured;
- GST reconciliation exception lists when source data is imported;
- period-wise document/evidence index;
- CA review checklist and export pack.

The system must not assert that a business is compliant merely because a report has been generated. Tax treatment depends on transaction facts, current law, exemptions, place/time of supply, eligibility, documentation and professional interpretation.

### 6.7 CA/accountant workspace

An accountant-facing role or external reviewer portal should allow an authorised professional to:

- access only the assigned entity/entities;
- view trial balance, ledgers, registers and supporting documents;
- filter unposted, unreconciled and exception transactions;
- add review comments and request clarifications;
- mark schedules as reviewed;
- export a period-wise evidence pack;
- download CSV/XLSX/PDF reports;
- view all transaction changes and approval history.

The CA remains responsible for professional judgement, audit procedures, signing and certification where required.

---

## 7. High-value natural-language use cases

The product should make finance operations accessible in plain language while preserving structured confirmations and accounting controls.

### Use case A — create an invoice and collection plan

User asks Claude:

> “Create an invoice for ABC Technologies for ₹85,000 plus applicable GST for software consulting. The payment terms are 15 days. Save it as a draft and create reminders three days before the due date, on the due date and three days after. Do not send the invoice until I approve it.”

Expected flow:

1. Claude gathers the structured customer, line-item, date and tax information.
2. Claude invokes `create_sales_invoice` through MCP.
3. CashCollect validates the customer, tax configuration, amount and due date.
4. CashCollect stores a draft invoice and a proposed reminder schedule.
5. The user opens the invoice in the web app and edits any field.
6. The user approves issue/send. CashCollect records the approval and performs the configured delivery action.
7. Collection reminders run on schedule; every send is logged.

### Use case B — record a customer payment

> “ABC Technologies paid ₹50,000 against invoice INV-104 by bank transfer today. Record the receipt, allocate it to the invoice and show the remaining balance.”

Expected accounting effect (illustrative, assuming the bank receipt is verified):

- Debit Bank: ₹50,000
- Credit Accounts Receivable – ABC Technologies: ₹50,000

CashCollect should ask for confirmation if the payment evidence or bank transaction is not verified.

### Use case C — explain overdue receivables

> “Show all invoices overdue by more than 30 days, group them by customer and total the amount at risk. Prepare a polite follow-up for each customer, but don't send anything yet.”

CashCollect returns exact records and balances. Claude drafts the customer messages. The user reviews and approves sending.

### Use case D — record a vendor bill

> “Record this vendor bill from Cloud Services for ₹18,500, due in 10 days. Categorise the expense as cloud hosting, use the GST code configured for this vendor, and send it to the finance manager for approval.”

Claude may interpret the document in its own client and pass structured data. CashCollect validates required fields, stores the document and creates a pending bill. The application applies deterministic posting rules only after approval.

### Use case E — maintain the ledger

> “Show me the bank ledger for October, the closing balance and every unreconciled entry.”

CashCollect queries posted journal lines and reconciliation status. The answer must be calculated from the database, not generated from Claude's memory.

### Use case F — create a monthly report for the CA

> “Prepare the October 2026 CA review pack: trial balance, general ledger, sales register, purchase register, receivables ageing, payables ageing, bank reconciliation, GST summary, expense evidence and all unposted or unreconciled exceptions. Export it as a ZIP and a summary PDF.”

CashCollect creates reproducible reports from database records and includes the data cutoff, accounting period, report generation time, preparer and exception list.

### Use case G — explain cash position

> “How much cash do we have, how much is expected in the next 30 days, what must be paid and what is the net projected position?”

CashCollect returns:

- reconciled bank/cash balances;
- due and overdue customer receivables;
- scheduled vendor payments;
- approved payroll/expense commitments if configured;
- explicit assumptions and excluded/unreconciled records.

Claude explains the returned figures in natural language. The app performs all arithmetic.

---

## 8. MCP design: Claude as the finance operations interface

### Architecture rule

The MCP server is an authenticated interface to CashCollect's deterministic application services. It is not an AI agent and does not call a model.

**Recommended transport:** MCP Streamable HTTP for the remote server. Deploy it on a stable, publicly reachable HTTPS URL. The Claude connector must be configured with the exact endpoint and authentication mode supported by the target Claude environment.

### Initial assignment MVP tool set

Keep the assignment build small and demonstrably reliable:

| MCP tool | Description | Side effect |
|---|---|---|
| `list_customers` | List or search company customers | Read only |
| `create_customer` | Create customer record | Writes record |
| `create_invoice` | Create an invoice draft | Writes draft |
| `list_invoices` | List invoices by status/customer/date | Read only |
| `get_invoice` | Fetch invoice details and payment status | Read only |
| `update_invoice` | Update permitted fields on a draft | Writes record |
| `create_collection_plan` | Attach reminder schedule to an invoice | Writes schedule |
| `record_payment` | Record a receipt and allocation | Financially consequential; confirmation/approval required |
| `get_receivables_report` | Return receivables ageing and totals | Read only |
| `get_cash_summary` | Return cash, due receivables and payables | Read only |

The 24-hour assignment MVP can implement only a subset, provided the live demo proves one complete end-to-end workflow. Do not expose tools that are not implemented or tested.

### Expanded accounting MCP tool catalogue

**Company and master data**

- `get_company_profile`
- `list_chart_of_accounts`
- `create_ledger_account`
- `list_customers`
- `create_customer`
- `list_vendors`
- `create_vendor`
- `get_tax_codes`

**Sales and receivables**

- `create_sales_invoice`
- `update_draft_invoice`
- `issue_invoice`
- `create_credit_note_draft`
- `record_customer_receipt`
- `allocate_receipt`
- `record_promise_to_pay`
- `create_collection_plan`
- `get_receivables_ageing`
- `get_customer_statement`

**Purchases and payables**

- `create_vendor_bill_draft`
- `submit_bill_for_approval`
- `approve_vendor_bill`
- `record_vendor_payment`
- `get_payables_ageing`
- `get_vendor_statement`

**Bookkeeping and ledgers**

- `create_expense_draft`
- `submit_expense_for_approval`
- `create_journal_draft`
- `post_journal_entry`
- `reverse_journal_entry`
- `get_general_ledger`
- `get_trial_balance`
- `get_profit_and_loss`
- `get_balance_sheet`
- `get_cash_flow_report`

**Banking and reconciliation**

- `import_bank_statement`
- `get_unreconciled_bank_lines`
- `suggest_bank_matches` (deterministic rules only)
- `confirm_bank_match`
- `get_reconciliation_summary`

**Close and CA hand-off**

- `get_close_checklist`
- `create_close_exception`
- `get_gst_registers`
- `get_tds_summary`
- `create_ca_review_pack`
- `export_report`
- `get_audit_trail`

### MCP response design

Return structured, factual output. Example:

```json
{
  "success": true,
  "record_id": "inv_01J...",
  "status": "draft",
  "invoice_number": "DRAFT-2026-0104",
  "total_amount_minor": 10030000,
  "currency": "INR",
  "requires_approval": true,
  "web_url": "https://app.example.com/invoices/inv_01J..."
}
```

Amounts should be returned in integer minor units (paise) as well as a formatted display value if helpful. The server should never return misleading success before the database transaction commits.

### Confirmation and approval rules

| Action | Default handling |
|---|---|
| Read reports, view ledger, list invoices | Execute immediately if authorised |
| Create draft customer/invoice/bill/expense | May create draft immediately |
| Edit draft | Execute immediately if authorised; log change |
| Issue/send invoice or reminder | Preview and require configured approval |
| Post journal entry | Require permission; use approval based on policy/materiality |
| Record a verified payment | Require evidence or user confirmation |
| Release an actual bank payment | Out of scope for MVP; later require strong authorisation and provider controls |
| Delete posted accounting data | Not allowed; reverse/adjust instead |
| Close/reopen financial period | Restricted role + reason + audit event |
| GST/income-tax filing or certification | Not part of MVP; CA/authorised professional workflow and legal review required |

### Security for the MCP endpoint

- Use HTTPS only.
- For the demo, use a dedicated, revocable, scoped demo token if Claude's connector supports it for the selected setup.
- For production, use OAuth 2.1 or the authentication mechanism supported by the MCP client and server implementation, with per-tenant scopes.
- Never expose Supabase service-role credentials to Claude or the browser.
- Validate every tool argument with Zod or equivalent schema validation.
- Derive tenant/company identity from the authenticated principal, not from a model-supplied `company_id` field.
- Add idempotency keys to write operations to prevent duplicates on retries.
- Limit tool scopes and rate; log actor, tool, request ID, outcome and changed record.
- Treat natural-language tool arguments as untrusted input. Enforce database constraints and application permissions independently.

---

## 9. Technical architecture

### Recommended stack

| Layer | Recommended technology | Reason |
|---|---|---|
| Web app | Next.js App Router + React + TypeScript | Fast development, server routes and strong typed UI |
| Styling | Tailwind CSS + shadcn/ui | Consistent, polished SaaS interface |
| Icons | Lucide | Simple, consistent iconography |
| Data fetching | TanStack Query or server actions where appropriate | Cache and mutation lifecycle |
| Forms/validation | React Hook Form + Zod | Typed forms and runtime validation |
| Database | PostgreSQL through Supabase | Relational accounting data and transactions |
| Authentication | Supabase Auth initially | Company membership and user roles |
| Authorisation | Server-side RBAC + PostgreSQL RLS | Tenant isolation and permissions |
| MCP server | Official TypeScript MCP SDK | Standard MCP tool interface |
| MCP transport | Streamable HTTP | Remote Claude connector support |
| Background jobs | Trigger.dev / Inngest / managed cron (later) | Scheduled reminders and month-end jobs |
| Email | Resend or another transactional email provider | Deterministic email sending, not AI |
| File storage | Supabase Storage or S3-compatible object storage | Invoice/receipt/document evidence |
| Hosting | Vercel for web/API or a separate Node host for MCP | Simple initial deployment; split services if needed |
| Monitoring | Sentry + structured server logs | Error reporting and operational visibility |
| Testing | Vitest + Playwright | Accounting logic and end-to-end assurance |
| Exports | CSV/XLSX/PDF generation libraries | CA-ready and owner-friendly reports |

**Important deployment note:** confirm the chosen host supports the runtime and persistent connection behaviour needed by the official MCP SDK. If serverless constraints make the MCP transport unreliable, deploy the MCP service separately as a Node service while keeping the web app on Vercel.

### Logical architecture

```text
  Customer / Finance Team / CA
              |
       +------+------+
       |             |
    Claude       CashCollect Web UI
       |             |
   Remote MCP        | HTTPS
   Streamable HTTP   |
       |             |
       +------+------+
              |
       Application Service Layer
    (auth, RBAC, validation, policies)
              |
    +---------+-----------+
    |         |           |
 Accounting  Workflow   Reporting
  Engine      Engine     Engine
    |         |           |
    +---------+-----------+
              |
         PostgreSQL
       /      |       \
   Storage  Job Queue  Audit Log
              |
     Email / Export / Integrations
```

### Service boundaries

1. **MCP adapter:** translates tool arguments into typed application commands and returns typed results.
2. **Application service layer:** validates company scope, permissions, business rules and approval state.
3. **Accounting engine:** creates and validates journal entries, calculates balances and generates reports.
4. **Workflow engine:** manages reminder schedules, approvals, collection stages and period-close checklists.
5. **Reporting engine:** performs deterministic SQL/report calculations and exports.
6. **Persistence layer:** PostgreSQL, attachments and append-only audit events.

Do not put accounting rules directly inside MCP tool handlers. MCP tools should call the same application services used by the web interface.

---

## 10. Data model

All business tables must include `organization_id` (and, when needed, `entity_id`) to enforce tenant boundaries. Use UUID/ULID identifiers and UTC timestamps. Use `NUMERIC` for database monetary amounts or integer minor units; never use floating-point arithmetic for money.

### Core tables

| Table | Purpose | Key fields |
|---|---|---|
| `organizations` | Tenant/business workspace | id, name, plan, created_at |
| `legal_entities` | Registered business entities | id, organization_id, legal_name, PAN, GSTINs, currency, FY settings |
| `memberships` | User-to-tenant membership | user_id, organization_id, role, status |
| `contacts` | Customers and vendors | id, organization_id, type, name, GSTIN, email, payment_terms |
| `chart_of_accounts` | Ledger accounts | id, organization_id, code, name, account_type, parent_id, control_account |
| `tax_codes` | Configured tax treatment | id, organization_id, tax_type, rate, effective_from, effective_to, status |
| `sales_invoices` | Sales invoices | id, organization_id, customer_id, number, issue_date, due_date, status, subtotal, tax, total |
| `sales_invoice_lines` | Invoice line items | invoice_id, description, quantity, unit_price, account_id, tax_code_id, amount |
| `vendor_bills` | Supplier bills | id, organization_id, vendor_id, supplier_ref, issue_date, due_date, status, total |
| `vendor_bill_lines` | Bill line items | bill_id, description, account_id, tax_code_id, amount |
| `payments` | Cash/bank receipts and payments | id, organization_id, bank_account_id, direction, amount, date, reference, status |
| `payment_allocations` | Allocate receipts/payments to invoices/bills | payment_id, invoice_or_bill_id, amount |
| `journal_entries` | Double-entry journal header | id, organization_id, voucher_type, voucher_no, date, status, source_type, source_id, posted_at |
| `journal_lines` | Debit/credit lines | journal_entry_id, account_id, contact_id, debit, credit, description, cost_center_id |
| `bank_accounts` | Bank/cash accounts | id, organization_id, name, account_number_masked, currency, ledger_account_id |
| `bank_statement_imports` | Uploaded bank statements | id, organization_id, bank_account_id, file_id, period, imported_at |
| `bank_statement_lines` | Individual statement rows | import_id, transaction_date, narration, debit, credit, balance, reference, match_status |
| `reconciliation_matches` | Statement-to-ledger links | statement_line_id, journal_line_id, match_type, confirmed_by, confirmed_at |
| `attachments` | Invoice/bill/receipt evidence | id, organization_id, storage_key, filename, mime_type, checksum, linked_record_type, linked_record_id |
| `approval_requests` | Maker-checker approval | id, organization_id, record_type, record_id, requester_id, approver_id, status, reason |
| `reminder_schedules` | Collection and due reminders | id, organization_id, invoice_id, channel, scheduled_at, status, template_id |
| `communication_logs` | Sent/failed reminder history | id, organization_id, related_record_id, channel, recipient, status, provider_ref, sent_at |
| `accounting_periods` | Period close controls | id, organization_id, period_start, period_end, status, closed_by, closed_at |
| `audit_events` | Append-only activity history | id, organization_id, actor_type, actor_id, action, entity_type, entity_id, before_json, after_json, timestamp, request_id |
| `mcp_idempotency_keys` | Retry protection | organization_id, key, tool_name, result_ref, expires_at |
| `report_exports` | Generated evidence packages | id, organization_id, period, report_type, storage_key, generated_by, generated_at |

### Double-entry invariants

For each posted journal entry:

- sum(debit) must equal sum(credit);
- each line must point to an active ledger account in the same organisation;
- the posting date must belong to an open accounting period;
- source transaction and journal entry must have a valid relationship;
- currency and exchange-rate rules must be explicit if multi-currency is enabled;
- duplicate posting must be prevented with a unique source/voucher constraint;
- posted entries cannot be hard-deleted or silently changed.

### Illustrative journal mappings

**Issue a ₹100,000 sales invoice with ₹18,000 output GST (illustrative):**

| Account | Debit | Credit |
|---|---:|---:|
| Accounts Receivable | ₹118,000 | — |
| Sales Revenue | — | ₹100,000 |
| Output GST Payable | — | ₹18,000 |

**Receive ₹50,000 from the customer:**

| Account | Debit | Credit |
|---|---:|---:|
| Bank | ₹50,000 | — |
| Accounts Receivable | — | ₹50,000 |

**Record a vendor bill of ₹10,000 plus ₹1,800 eligible input GST (illustrative; eligibility must be verified):**

| Account | Debit | Credit |
|---|---:|---:|
| Expense | ₹10,000 | — |
| Input GST Credit | ₹1,800 | — |
| Accounts Payable | — | ₹11,800 |

The above are structural examples only. Actual tax treatment depends on the nature of supply, place of supply, recipient eligibility, reverse charge and current law. Never hard-code 18% as a universal rate.

---

## 11. API and application routes

### Public web routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Product landing page | Public |
| `/login` | Login | Public |
| `/app` | Finance overview | Authenticated |
| `/app/receivables` | Invoices and customer collections | Finance roles |
| `/app/receivables/[id]` | Invoice detail and collection history | Finance roles |
| `/app/payables` | Vendor bills and due payments | Finance roles |
| `/app/expenses` | Expense requests and reimbursements | Role-based |
| `/app/accounting/chart-of-accounts` | Chart of accounts | Finance/admin |
| `/app/accounting/journals` | Journal entries | Finance/admin |
| `/app/accounting/ledger/[accountId]` | Ledger drill-down | Finance/CA |
| `/app/reports` | Financial and operational reports | Role-based |
| `/app/banking/reconciliation` | Bank statement and matching | Finance roles |
| `/app/approvals` | Approval queue | Approvers |
| `/app/ca-workspace` | Review pack and CA comments | Invited CA/reviewer |
| `/app/settings` | Company, tax, roles and integrations | Admin |

### Server/API routes (illustrative)

- `POST /api/mcp` — remote MCP endpoint (exact path depends on SDK/host).
- `POST /api/invoices` / `PATCH /api/invoices/:id` — invoice draft lifecycle.
- `POST /api/invoices/:id/issue` — issue invoice after approval.
- `POST /api/receipts` — record a receipt.
- `POST /api/bills` — create supplier bill draft.
- `POST /api/journals/:id/post` — post a validated journal.
- `POST /api/journals/:id/reverse` — reverse a posted journal.
- `POST /api/bank-imports` — upload/import bank statement.
- `POST /api/reconciliations/:id/confirm` — confirm deterministic match.
- `GET /api/reports/trial-balance` — trial balance.
- `GET /api/reports/profit-and-loss` — P&L.
- `GET /api/reports/balance-sheet` — balance sheet.
- `POST /api/exports/ca-pack` — generate CA evidence export.

All endpoints must authenticate the user/service principal, establish the tenant scope server-side, validate inputs and write audit events.

---

## 12. UI/UX and visual design system

### Design direction

The product should feel like a modern finance control centre: clear, calm, trustworthy and operational. It should not imitate Volopay's visual identity, Tally's desktop layout or a generic AI chat interface.

**Visual concept:** “Modern financial cockpit for a growing SME.”

- Background: warm off-white/light grey for work surfaces.
- Primary text: deep navy/charcoal for trust and readability.
- Main accent: cobalt/indigo for navigation and primary actions.
- Positive state: restrained green for reconciled/paid/healthy.
- Warning: amber for due soon, approval required or exceptions.
- Critical: muted red for overdue, failed, disputed or blocked.
- Surfaces: white cards, subtle borders, small shadow only when needed.
- Typography: Inter or a similarly readable modern sans-serif.
- Data: tabular numerals, consistent INR formatting, clear date ranges and report cutoffs.

Do not overuse gradients, glassmorphism, AI sparkles or large decorative charts. Financial software must prioritize scanning, precision and confidence.

### Navigation structure

Left sidebar:

1. Overview
2. Money In
   - Invoices
   - Customers
   - Collections
3. Money Out
   - Bills
   - Vendors
   - Expenses
4. Accounting
   - Chart of Accounts
   - Journals
   - General Ledger
   - Trial Balance
5. Banking
   - Accounts
   - Reconciliation
6. Reports
7. Approvals
8. CA Workspace
9. Settings

Top bar:

- Company/entity selector;
- Financial-year/period selector;
- Global search;
- Notifications;
- User profile and role;
- “Ask Claude” connector status/instructions, not an embedded AI assistant.

### Screen 1 — Finance overview

Purpose: answer “How is my business doing financially?” within five seconds.

Top KPI cards:

- Cash and bank balance (show reconciled vs unreconciled component);
- Receivables outstanding;
- Overdue receivables;
- Payables due in 7/30 days;
- Month-to-date income;
- Month-to-date expenses.

Main content:

- Cash movement chart (selectable date range);
- Receivables ageing chart;
- Upcoming collections and payments;
- Pending approvals;
- Reconciliation exceptions;
- “Month-end readiness” checklist.

Every KPI must drill into source records. Show data freshness and last bank import/sync timestamp. Do not display a single “cash balance” if imported statement lines are stale or unreconciled without explaining it.

### Screen 2 — Receivables workspace

- Searchable invoice table.
- Filters: status, customer, due date, ageing, amount and owner.
- Columns: invoice number, customer, issue date, due date, total, paid, outstanding, status, next follow-up.
- Invoice detail drawer/page with line items, tax breakdown, attachment, journal link, payment allocations and communication timeline.
- Actions: edit draft, issue, record receipt, allocate receipt, create reminder, record promise-to-pay, open dispute, download PDF.
- Any external communication must preview recipient and content before sending, unless the customer explicitly enables a pre-approved deterministic policy.

### Screen 3 — Invoice editor

- Customer, invoice date, due date and terms.
- Line-item rows: description, quantity, unit, price, ledger account and tax code.
- Calculated subtotal, discount, tax and total.
- Notes, attachment, reference and collection settings.
- Save as draft and preview.
- Tax values come from configured tax codes; do not ask Claude to calculate final tax independently.

### Screen 4 — General ledger and journal detail

- Account list grouped by assets, liabilities, equity, income and expenses.
- Ledger view with date, voucher, contact, narration, debit, credit and running balance.
- Drill down to source invoice/bill/receipt/expense.
- Journal detail showing balanced debit/credit lines.
- Status: draft, pending approval, posted, reversed.
- Reversal history and audit history visible.

### Screen 5 — Bank reconciliation

- Statement upload panel and CSV format instructions.
- Statement lines on one side, book transactions on the other.
- Exact match/suggested match/unmatched/duplicate status.
- Explain match reason (same reference, amount/date or manual selection).
- Human confirms each suggested match.
- Reconciliation totals: statement closing balance, book balance, outstanding items and difference.

### Screen 6 — Reports

Report catalogue:

- Profit and Loss;
- Balance Sheet;
- Trial Balance;
- General Ledger;
- Cash Flow;
- Receivables Ageing;
- Payables Ageing;
- Sales Register;
- Purchase Register;
- Expense Register;
- Bank Reconciliation;
- GST summary/registers;
- TDS summary (where configured);
- Customer/Vendor statements;
- Audit trail and period-close exceptions.

Each report must show entity, reporting period, accounting basis, generated-at timestamp, source cutoff and filters. Allow CSV/XLSX/PDF export where supported.

### Screen 7 — CA workspace

- Assigned company and period.
- Review status: not started, in progress, query raised, ready for sign-off, completed.
- Trial balance and ledger access.
- Missing documents and unreconciled transaction queue.
- CA comments and company responses.
- Downloadable evidence pack.
- “Reviewed by” and timestamps; do not label a report “audited” until a qualified auditor has actually performed and signed the audit.

### Accessibility and responsive behaviour

- Desktop-first for ledger/report work, but mobile-friendly for approvals and quick status checks.
- Keyboard accessible tables and forms.
- Clear focus states and labels.
- Never communicate a financial state by colour alone.
- Keep number formatting consistent and support Indian digit grouping (₹1,23,456.00).

---

## 13. Security, permissions and financial controls

Financial software needs higher trust standards than a normal CRUD app.

### Roles

| Role | Typical permissions |
|---|---|
| Owner/Admin | Company setup, roles, all reports, approval policy, period controls |
| Finance Admin | Create/edit drafts, post authorised entries, reconcile, reports |
| Accounts Executive | Create drafts, upload evidence, record payments for review |
| Approver | Approve designated invoices, bills, expenses and journals |
| Employee | Submit own expenses and view own reimbursement status |
| External CA/Reviewer | Read assigned records, review reports, comment, export evidence; no payment release by default |
| MCP Client | Narrowly scoped tools according to the authenticated user and tenant |

### Controls

- Multi-tenant isolation with PostgreSQL Row Level Security and server-side authorization.
- Separate company/legal-entity scope from the user session.
- Maker-checker approvals for high-value or sensitive actions.
- Immutable audit event for create/update/approve/post/reverse/export/send.
- No hard-delete of posted financial records.
- Period locking and documented reopen process.
- Idempotency for every financial write operation.
- Configurable materiality and approval thresholds.
- Daily backups and tested restore process.
- Encryption in transit and at rest through managed providers.
- Mask bank account identifiers in normal UI and logs.
- Never store bank login credentials or card CVV/PIN.
- Secure attachment URLs with short-lived access.
- Audit logs must not store passwords, tokens or unnecessary personal information.
- Data export and account deletion/retention procedures must be documented.

### AI boundary

CashCollect's own code must not call an LLM. It may perform ordinary deterministic logic such as validations, calculations, matching rules, scheduled jobs, email templating, file storage, PDF/CSV/XLSX generation and database queries.

Claude may generate prose and structure information through its MCP connector. The app validates the structure and executes permitted commands. No generated accounting treatment is accepted blindly: uncertain tax/account classification should be marked for review.

---

## 14. Can CashCollect replace Tally or an accountant?

### The honest answer

**It can replace or reduce a substantial amount of routine bookkeeping, data entry, collections administration and report preparation. It should not claim to replace a qualified CA, statutory auditor or all professional accounting judgement.**

The word “accountant” is used loosely in businesses. It may refer to:

1. **Accounts/data-entry executive:** records invoices, bills, receipts, payments and vouchers.
2. **Bookkeeper:** maintains ledgers, reconciles records and produces periodic books.
3. **Finance manager/controller:** interprets results, manages cash, budgets, controls and decisions.
4. **Tax practitioner/CA:** advises on tax positions, reviews returns, signs prescribed certifications and performs audits when eligible and engaged.
5. **Statutory auditor:** performs an independent audit and issues an audit opinion under applicable law and standards.

CashCollect can automate much of levels 1 and 2, assist level 3 with reliable current information, and make level 4/5 work more efficient by preparing records and evidence. It must not represent itself as the qualified professional performing level 4/5 work.

### India legal and compliance boundary (research snapshot: 10 November 2026)

This section is product-design guidance, not legal or tax advice. Requirements depend on entity type, turnover, business activity, applicable notifications, tax year and facts. A practising Indian CA and legal counsel should review the product before any filing or compliance claims.

**Income-tax Act, 2025:** The Act came into force on 1 April 2026. Section 62 addresses maintenance of books of account. Section 63 requires specified businesses/professions to have accounts audited by an “accountant” when the prescribed conditions are met. The Act's section 515(3)(b) defines “accountant” as a Chartered Accountant with a valid certificate of practice, subject to stated disqualifications. Accordingly, CashCollect can maintain the books and generate a tax-audit-ready data pack, but cannot itself sign or perform the statutory tax audit as the legally defined accountant. Sources: [Income-tax Act, 2025 (official text, as amended by Finance Act 2026)](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf), [Section 63 text](https://indiacode.ecourtsindia.com/income-tax-act-2025/section/63/).

**Companies Act, 2013:** Section 141 sets eligibility and qualifications for appointment as a company auditor; the provision states that an individual is eligible only if a Chartered Accountant, with further rules for firms and disqualifications. CashCollect must not issue or market an independent statutory audit opinion. Source: [Companies Act, 2013, Section 141](https://wm.incometaxindia.gov.in/w/section-141-78) (official government page; verify current consolidated text with counsel).

**GST records:** CGST Act Section 35 requires registered persons to maintain true and correct prescribed accounts/records, including supplies, stock, input tax credit and output tax payable/paid; electronic maintenance is contemplated. CGST Rules Rule 56 adds supporting records and particulars such as import/export/reverse-charge documents, invoices, credit/debit notes, stock and tax records. Section 36 contains a retention requirement of 72 months from the due date of the annual return, with a longer period for specified proceedings. CashCollect should make record-retention policy configurable and verify current rules/notifications before launch. Sources: [CBIC CGST Act, Section 35 and 36](https://cbic-gst.gov.in/hindi/CGST-bill-e.html), [CBIC CGST Rules, Rule 56](https://cbic-gst.gov.in/hindi/accnt-record-rules.html).

**GST practitioner:** CGST Act Section 48 and the rules provide for approved GST practitioners, with authorised activities and registered-person responsibility for correctness. Product integration with a GST practitioner or CA can be explored, but CashCollect itself must not imply that MCP access makes the product an approved GST practitioner. Source: [CBIC CGST Act, Section 48](https://cbic-gst.gov.in/hindi/CGST-bill-e.html).

**E-invoicing:** The official Invoice Registration Portal describes the phased GST e-invoicing mandate and the ₹5 crore aggregate annual turnover threshold announced for applicability from 1 August 2023, subject to the applicable taxpayer/category rules and exemptions. Because applicability is notification-driven, build a versioned rule/configuration layer and re-check current official guidance before enabling production e-invoicing. Source: [GST Invoice Registration Portal — e-invoicing mandate](https://einvoice6.gst.gov.in/content/einvoice-mandate/).

### What we may safely promise

- “Automate day-to-day bookkeeping workflows.”
- “Maintain double-entry ledgers and linked source records.”
- “Generate current financial and management reports from your books.”
- “Prepare structured GST/TDS registers and CA review packs.”
- “Reduce repetitive work for internal accounts staff and external accountants.”
- “Keep your accountant and business owner looking at the same underlying records.”

### What we must not promise

- “Replace your CA.”
- “Guarantee GST or income-tax compliance.”
- “Automatically determine every tax treatment correctly.”
- “Perform statutory audit or issue audit certification.”
- “File every return without review/authorisation.”
- “Make payments or alter books without authorised approval.”

### Recommended market message

**“Replace manual bookkeeping chaos, not professional accountability.”**

The goal is not to remove the CA from the business. The goal is to stop paying people to repeatedly collect the same documents, type the same transactions, chase the same invoices and rebuild the same reports every month. The CA should spend more time reviewing exceptions, tax positions and business advice.

---

## 15. Competitive landscape and differentiation

### TallyPrime

TallyPrime already provides accounting, inventory, payroll, banking utilities, GST and other tax compliance features, reporting and edit-log functionality. Its documentation also describes ledgers, vouchers, bill-wise tracking, inventory and audit/verification features. CashCollect cannot compete by simply reproducing a ledger screen. See [TallyPrime product documentation](https://help.tallysolutions.com/tally-prime/) and [TallyPrime features](https://help.tallysolutions.com/tallyprime-get-started/).

### Zoho Books

Zoho Books covers invoicing, bills, purchase orders, banking, inventory, expenses, reporting, GST filing, e-invoicing and audit trail; its public product pages also describe built-in AI features. CashCollect's distinction is not feature count; it is a Claude-first MCP action surface, a controlled finance workflow and a CA collaboration layer. See [Zoho Books India](https://www.zoho.com/in/books/).

### Volopay

Volopay focuses on spend controls and movement of money: cards, reimbursements, bill payments, vendor payouts and accounting integrations. CashCollect focuses on **business books and the money-in / money-out record**: collections, payables, journals, reconciliation, ledger and CA-ready reporting. It should integrate with payment/bank providers rather than initially becoming a card issuer or bank. See [Volopay India](https://www.volopay.com/in/) and [Volopay About](https://www.volopay.com/about/).

### Differentiation thesis

1. **MCP-native actions:** the user can operate finance workflows from Claude rather than only asking questions about them.
2. **Accounting as the backbone:** collections, expenses and bills become traceable accounting entries rather than disconnected workflow records.
3. **CA collaboration:** the business and CA work from a shared, evidence-linked ledger and exception queue.
4. **Owner-friendly explanations:** plain-language access to deterministic reports, with clear drill-down to underlying entries.
5. **SME-first operational simplicity:** less setup and less accounting jargon for service businesses, without sacrificing double-entry discipline.

MCP itself is not a durable moat. Competitors can add MCP interfaces. Defensibility must come from trusted ledger data, reliable integrations, workflow depth, accountant distribution, migration tooling, customer history and strong operational support.

---

## 16. Business model and pricing hypotheses

### Suggested pricing structure

| Plan | Indicative price | Target |
|---|---:|---|
| Starter | ₹999/month | Sole proprietor or very small service business |
| Growth | ₹2,499/month | Growing SME with an internal finance operator |
| Finance Plus | ₹4,999/month | Multi-user business needing approvals, reports and CA collaboration |
| Accountant / CA workspace | Free or partner tier initially | External accountant reviewing multiple invited clients |

Pricing is a hypothesis. Validate willingness to pay through interviews and pilots. Consider pricing by entity, monthly transaction volume, users and integrations rather than charging only per Claude tool call.

### Revenue streams

- Monthly/annual SaaS subscriptions.
- Additional legal entities and higher transaction bands.
- Premium bank feeds and reconciliation integrations.
- Paid migration/onboarding from Tally or spreadsheets.
- Accountant/CA practice tier for multiple client workspaces.
- Premium report/export and audit-preparation packages.

Avoid transaction-based payment fees until the company has the relevant partners, regulatory assessment and payment infrastructure.

### Cost structure

There is no AI inference cost within CashCollect because the customer's Claude subscription provides the model usage. However, “zero AI cost” does not mean zero variable cost.

Costs include:

- hosting and database;
- backups and object storage;
- transactional email/SMS/WhatsApp providers;
- bank feed or payment integration provider charges;
- report generation and bandwidth;
- customer onboarding and support;
- compliance reviews, security testing and professional accounting review;
- payment collection fees if we later process subscription payments.

### Illustrative unit economics (not a forecast)

At an assumed blended subscription of ₹2,499/month:

- 100 paying organisations = ₹2,49,900 MRR;
- 500 paying organisations = ₹12,49,500 MRR;
- 1,000 paying organisations = ₹24,99,000 MRR.

These are gross recurring revenue illustrations before taxes, discounts, churn, refunds, payment fees, hosting, support and sales costs. Do not present them as profit.

### First 100 customers

1. **Founder-led outbound:** target owners/finance leads of IT consultancies, staffing firms and marketing agencies.
2. **CA/bookkeeper referrals:** show the product as a tool that reduces routine data-entry and month-end chasing, not one that threatens their professional role.
3. **Migration-led offer:** import customer/vendor lists, opening balances and historical invoice registers from spreadsheets or supported Tally exports.
4. **Free receivables health check:** show overdue invoices, ageing and collection gaps from a customer-provided CSV.
5. **Niche demos:** publish 2–3 demos for a staffing agency, software consultancy and marketing agency.
6. **Customer referrals:** reward a referred business after it becomes a paying customer.

### Important go-to-market insight

Do not sell “AI accounting” to a skeptical SME. Sell **fewer overdue payments, current books, faster month-end close and easier CA hand-off**. The user should be able to measure time saved and money collected.

---

## 17. Metrics and success criteria

### Product activation

- Time from signup to first customer/invoice created.
- Percentage of new workspaces connecting Claude via MCP.
- Percentage of MCP write calls that succeed.
- Percentage of created records opened and reviewed in the web app.

### Finance operations

- Invoices tracked per customer per month.
- Percentage of invoices with a defined collection plan.
- Average days sales outstanding (DSO), measured consistently.
- Amount of overdue receivables and amount recovered after reminders.
- Bank statement lines reconciled.
- Percentage of transactions with source evidence.
- Month-end close completion time.
- Number of unresolved exceptions at CA hand-off.

### Reliability and trust

- Journal entries balanced (must be 100%).
- Duplicate posting incidents (target zero).
- Cross-tenant data exposure (target zero).
- Audit-event coverage for critical actions (target 100%).
- Report reproducibility for a fixed period and data cutoff.
- Backup restore success.

### Business

- Paying organisations.
- MRR and ARR.
- Activation-to-paid conversion.
- Gross revenue retention and logo churn.
- CAC payback period.
- Support cost per customer.
- Expansion revenue per organisation.

---

## 18. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Incorrect accounting treatment | Can produce misleading books and tax outputs | Deterministic posting rules, configurable accounts/tax codes, review queue, CA validation |
| Claude supplies malformed or incorrect data | Model output is probabilistic | Zod validation, database constraints, preview, approval and source-document linking |
| Duplicate MCP calls | Retried tool calls can create duplicate invoices/entries | Idempotency keys, unique constraints and safe retries |
| Unauthorised tool use | Financial records are sensitive | OAuth/scoped tokens, RBAC, tenant isolation and approval policies |
| Data breach | Books contain business and personal data | Encryption, RLS, least privilege, secure storage and incident process |
| Missed reminder | Collection workflow loses value | Durable job queue, retries, provider status and delivery logs |
| Incorrect tax rule or outdated law | Compliance exposure | Versioned rules, effective dates, official source monitoring and CA review |
| Customers will not switch from Tally | Existing accounting systems are entrenched | Coexistence, exports/imports, CA workflow and narrow collections wedge |
| MVP tries to build too much | Assignment deadline and reliability suffer | Limit demo to one end-to-end receivables workflow |
| “Replace accountant” positioning alienates CAs | CAs may influence SME software selection | Position as bookkeeping automation and CA productivity platform |
| CashCollect name is too narrow | Brand conflicts with wider finance OS | Use product umbrella/sub-brand strategy and test names later |

---

## 19. Assignment MVP: exactly what to build first

The vision is broad; the assignment build must remain narrow. The first live version should demonstrate one meaningful workflow, not pretend to be complete accounting software.

### MVP scenario

A service business receives a customer invoice and needs to track collection.

### MVP capabilities

1. Company demo workspace.
2. Customer creation.
3. Create invoice draft through Claude MCP.
4. Persist invoice and line items in PostgreSQL/Supabase.
5. View invoice in a polished web dashboard.
6. Edit invoice details in the app and save.
7. Set a due date and reminder schedule.
8. Publish a customer-facing invoice/status page or create a secure share link.
9. Record a payment manually and update outstanding balance.
10. Show receivables ageing and collection history.
11. Generate a simple customer statement or receivables CSV.
12. Show activity history.

### Minimal MCP tools for live demo

- `create_customer`
- `create_invoice`
- `list_invoices`
- `update_invoice`
- `create_collection_plan`
- `record_payment`
- `get_receivables_report`

For the first demo, implement at least create, list, update and report with the real database. Add the remaining tools only if they are reliable.

### Demo prompt

> “Create a customer called ABC Technologies. Create a draft invoice for ₹85,000 for software consulting, due in 15 days. Add a collection plan with reminders three days before the due date, on the due date and three days after. Save it and show me the CashCollect link.”

Demo sequence:

1. Type the request into Claude.
2. Show Claude calling CashCollect's MCP tool.
3. Show the tool returning the actual invoice ID and app URL.
4. Open the CashCollect dashboard and show the saved invoice.
5. Edit the amount or due date and save.
6. Show the collection schedule and invoice status.
7. Ask Claude to retrieve receivables and show the database-backed answer.

**Do not claim that the reminder was delivered unless you demonstrate a real delivery log. Do not claim that an invoice was GST-compliant unless the tax configuration and applicable checks are actually implemented.**

### Suggested assignment stack

- Next.js + TypeScript + Tailwind + shadcn/ui.
- Supabase PostgreSQL and Auth.
- Official MCP TypeScript SDK.
- Streamable HTTP endpoint.
- Vercel for the web app; separate Node host for MCP if required.
- Resend (or equivalent) only if sending actual transactional emails in the demo.

### Definition of done

- Public HTTPS app URL works in a fresh browser session.
- Remote MCP URL connects to Claude.
- No AI API keys or model calls exist in the deployed project.
- Claude creates an actual invoice/customer record.
- Record is visible after refresh.
- Human can edit and save it.
- Collection schedule is stored and visible.
- Read/report tool returns data from the database.
- Demo credentials and connection steps are documented.
- Video is five minutes or less.

---

## 20. Suggested five-minute pitch

| Time | Section | Message |
|---|---|---|
| 0:00–0:45 | Founder | Product-focused builder/founder; experience working on recruitment/SME workflows and building business software |
| 0:45–1:15 | Best work | HiremeClub: founder experience, customer discovery, recruitment workflow understanding and measurable product execution |
| 1:15–2:15 | Business | SMEs operate finance across disconnected tools; CashCollect connects collections and accounting records; Claude is the interface, CashCollect is the system of record |
| 2:15–4:15 | Demo | Claude creates an invoice via MCP, app stores it, user edits it, collection schedule is visible and a report is retrieved |
| 4:15–5:00 | Economics | Example pricing, no AI inference cost in app, infrastructure/provider costs, founder-led first 100 customers and one-/three-year hypotheses |

Avoid making a broad claim that CashCollect replaces the CA. Say it reduces manual finance administration and prepares cleaner books so business owners and CAs can focus on review and decisions.

---

## 21. Suggested repository structure

```text
cashcollect/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── app/
│   │   │   ├── overview/
│   │   │   ├── receivables/
│   │   │   ├── payables/
│   │   │   ├── accounting/
│   │   │   ├── banking/
│   │   │   ├── reports/
│   │   │   ├── approvals/
│   │   │   └── ca-workspace/
│   │   └── api/
│   │       ├── mcp/
│   │       └── webhooks/
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── tables/
│   │   ├── forms/
│   │   └── finance/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── validation/
│   │   ├── money/
│   │   ├── permissions/
│   │   └── exports/
│   ├── modules/
│   │   ├── customers/
│   │   ├── receivables/
│   │   ├── payables/
│   │   ├── accounting/
│   │   ├── reconciliation/
│   │   ├── collections/
│   │   ├── reporting/
│   │   └── ca-workspace/
│   └── mcp/
│       ├── server.ts
│       ├── auth.ts
│       ├── schemas.ts
│       └── tools/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── accounting/
│   ├── api/
│   └── e2e/
├── docs/
├── .env.example
├── business.md
├── package.json
└── README.md
```

This is the intended scalable structure. For the assignment MVP, do not create empty folders for every future module; build only the routes and services needed for the end-to-end demo.

---

## 22. Build plan after assignment

### Week 1: Reliable receivables MVP

- customer/invoice CRUD;
- collection schedule and notification history;
- MCP create/list/update/report tools;
- human-editable UI;
- first demo customers and onboarding flow.

### Weeks 2–3: Accounting foundation

- chart of accounts;
- journal engine and posting rules;
- receipts and payment allocations;
- customer/vendor subledgers;
- trial balance and general ledger;
- audit events and period controls.

### Weeks 4–5: Payables and bank reconciliation

- vendor bills and expense records;
- CSV bank statement import;
- deterministic matching and exception review;
- payables ageing and cash position.

### Weeks 6–8: Reports and CA collaboration

- P&L, balance sheet, cash-flow reports;
- month-end checklist;
- GST/TDS registers where configured;
- CA portal and export pack;
- Tally/Zoho import/export experiments.

### Before commercial launch

- security review and penetration testing;
- accounting engine review by practising CA(s);
- GST and Income-tax compliance review;
- backup/restore exercise;
- privacy policy, terms, data-processing and retention policies;
- customer discovery and paid pilot validation;
- production monitoring and incident response.

---

## 23. Open product decisions

These decisions should be validated with prospective customers and a practising CA before the product expands beyond the assignment MVP:

1. Should the first vertical be IT consultancies, staffing agencies or marketing agencies?
2. Will CashCollect be the primary accounting ledger, or will it initially coexist with Tally/Zoho and sync/export records?
3. Which accounting basis and voucher workflows are required for the first customer segment?
4. Will the first release support inventory, payroll, TDS and multi-GSTIN entities, or explicitly exclude them?
5. Which bank statement formats and payment providers are most common in the target segment?
6. What level of approval is required before invoice issue, journal posting and payment recording?
7. What is the minimum data migration needed to move an SME from spreadsheets or Tally?
8. Which reports do target CAs actually request at month-end and year-end?
9. What is the appropriate data-retention and tenant-deletion policy for each record class?
10. What claims are acceptable in marketing after review by Indian accounting/tax counsel?

---

## 24. Final product thesis

CashCollect should not be another AI chatbot for finance and should not be positioned as a simplistic Tally replacement.

It should be built as a **Claude-connected finance operating system for SMEs**, starting with the most immediate pain—getting invoices collected and keeping receivables current—then expanding into payables, ledgers, reconciliation, financial reports and CA collaboration.

The long-term value is not that Claude can answer “What is my profit?” The value is that every relevant invoice, expense, payment, journal entry, bank movement and supporting document is already connected, validated and traceable, so the answer can be generated from the actual books and the next approved action can be executed from the same workflow.

**The product should aim to replace manual finance administration and fragmented bookkeeping workflows—not replace the legal responsibilities or professional judgement of a qualified accountant or auditor.**

---

## 25. Reference links

### Volopay and assignment context

- [Volopay India — financial platform](https://www.volopay.com/in/)
- [Volopay — About, mission and vision](https://www.volopay.com/about/)
- [Model Context Protocol — official site](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK — server documentation](https://ts.sdk.modelcontextprotocol.io/server)
- [Claude — remote MCP custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)

### Accounting product references

- [TallyPrime documentation](https://help.tallysolutions.com/tally-prime/)
- [TallyPrime features](https://help.tallysolutions.com/tallyprime-get-started/)
- [TallyPrime Edit Log](https://help.tallysolutions.com/tracking-modifications/)
- [Zoho Books India](https://www.zoho.com/in/books/)

### India legal and compliance references

- [Income-tax Act, 2025, as amended by Finance Act 2026 — official Income Tax Department PDF](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf)
- [Income-tax Act, 2025, Section 63 — tax audit](https://indiacode.ecourtsindia.com/income-tax-act-2025/section/63/)
- [Companies Act, 2013, Section 141 — auditor eligibility](https://wm.incometaxindia.gov.in/w/section-141-78)
- [CBIC — CGST Act, including Sections 35, 36 and 48](https://cbic-gst.gov.in/hindi/CGST-bill-e.html)
- [CBIC — CGST Rules, including Rule 56](https://cbic-gst.gov.in/hindi/accnt-record-rules.html)
- [GST Invoice Registration Portal — e-invoicing mandate](https://einvoice6.gst.gov.in/content/einvoice-mandate/)

> **Disclaimer:** This document is a product and business specification, not a substitute for professional accounting, tax, legal, information-security or regulatory advice. All accounting policies, statutory workflows, tax rules, filing integrations and marketing claims must be reviewed by qualified professionals against the law and notifications in force at the time of implementation.
