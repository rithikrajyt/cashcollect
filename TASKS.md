# CashCollect Finance OS - Implementation Tasks

## Phase 0 - Project Setup
- [x] Initialize Next.js App Router project
- [x] Install dependencies (MCP SDK, Supabase, Zod, UI libs)
- [x] Configure TypeScript strict mode
- [x] Create .env.example
- [x] Create .gitignore with secrets excluded
- [x] Add build/test/lint scripts

## Phase 1 - Database & Domain Foundation
- [x] Create Supabase migration SQL
- [x] Create seed SQL with demo data
- [x] Build in-memory data store for local testing
- [x] Build money/date/validation utilities
- [x] Build typed database entity interfaces

## Phase 2 - Core Domain Services
- [x] Customer service (create/list/get/update)
- [x] Invoice service (create draft/list/get/update)
- [x] Collection service (create plan/list events)
- [x] Receivables report service
- [x] Audit event service

## Phase 3 - MCP Server
- [x] Install MCP TypeScript SDK
- [x] Implement bearer token authentication
- [x] Create Streamable HTTP handler at /api/mcp
- [x] Register tool: list_customers
- [x] Register tool: create_customer
- [x] Register tool: create_invoice_draft
- [x] Register tool: list_invoices
- [x] Register tool: get_invoice
- [x] Register tool: update_invoice_draft
- [x] Register tool: create_collection_plan
- [x] Register tool: get_receivables_report
- [ ] Test MCP endpoint locally

## Phase 4 - Frontend
- [x] Landing page
- [x] Dashboard shell (sidebar + topbar)
- [x] Finance overview with KPI cards
- [x] Receivables list with filters
- [x] Invoice detail/editor
- [x] Create invoice form
- [x] Customer list
- [x] Collections timeline
- [x] Receivables report page

## Phase 5 - Integration & Quality
- [ ] Verify MCP → DB → UI flow end-to-end
- [ ] Run typecheck
- [ ] Run lint
- [ ] Run build
- [ ] No-AI audit
- [ ] Fix critical issues

## Phase 6 - Documentation
- [ ] README.md
- [ ] DEPLOYMENT_TESTING_VIDEO_GUIDE.md

## Phase 7 - Deployment (requires credentials)
- [ ] Deploy to Vercel
- [ ] Configure Supabase production
- [ ] Run migrations on production DB
- [ ] Seed demo data
- [ ] Verify public MCP endpoint
- [ ] Test Claude connector
