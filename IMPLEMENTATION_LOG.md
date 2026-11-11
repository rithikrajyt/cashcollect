# CashCollect Finance OS - Implementation Log

## Session: 11 November 2026

### Starting State
- Empty project directory (renamed from CashCollect to cashcollect for npm)
- Node.js v24.14.0, npm v11.9.0
- Assignment: Volopay Product & Tech - Build a business on Claude MCP, no AI inside

### Decisions Made
1. **Stack**: Next.js 16 App Router + TypeScript + Tailwind CSS + MCP SDK v1.32
2. **Database**: Dual mode - in-memory store for local testing, Supabase PostgreSQL for production
3. **MCP Transport**: WebStandardStreamableHTTPServerTransport (stateless, per-request)
4. **Authentication**: Bearer token for MCP demo, demo mode for web app
5. **Money**: Integer paise throughout, formatted with Intl.NumberFormat en-IN
6. **Scope**: P0 only - receivables workflow (create customer → invoice → collection plan → report)

### Implementation Progress
- Phase 0: Project initialized, deps installed, scripts configured
- Phase 1: SQL migrations, seed data, in-memory store, utility libs
- Phase 2: Domain services (customers, invoices, collections, reports, audit)
- Phase 3: MCP server with 8 tools, /api/mcp route handler
- Phase 4: Landing page, dashboard shell, all dashboard pages
- Phase 5: Integration and build verification (in progress)
