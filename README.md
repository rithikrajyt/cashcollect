# CashCollect Finance OS

> AI-powered financial operating system for Indian SMEs, integrated with Claude via Model Context Protocol (MCP).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://cashcollect.vercel.app)
[![Video Demo](https://img.shields.io/badge/video-watch-red?style=flat-square)](https://canva.link/d9u2h682oco39k2)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)

**Create invoices, track receivables, and manage collections by talking to Claude. No AI API costs—zero inference charges.**

## ✨ What's Built

✅ **Dashboard** — KPI cards, receivables list, invoice detail, customer management, collection schedules, ageing report  
✅ **MCP Integration** — 8 tools for Claude integration  
✅ **Demo Auth** — No setup needed for testing  
✅ **Audit Logging** — All mutations tracked  
✅ **Production Ready** — Deployed on Vercel with Supabase option  

## 📋 What's NOT Built (Future Roadmap)

- Real authentication (Supabase Auth)
- Multi-tenancy
- Email delivery
- Payment gateway integration
- Mobile app
- Double-entry ledger
- PDF export

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

## 🚀 Test with ChatGPT Pro

1. Open https://chatgpt.com
2. Settings > Plugins > Add MCP Connector
3. **Name:** CashCollect Finance OS
4. **URL:** https://cashcollect.vercel.app/api/mcp
5. Click **Create as a plugin**
6. Ask: *"Using CashCollect, list all customers"*

**Try live:** https://cashcollect.vercel.app (demo@cashcollect.app / demo2026)

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

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — System design, data flows, builder vs partner responsibilities
- **[DEPLOYMENT_TESTING_VIDEO_GUIDE.md](./DEPLOYMENT_TESTING_VIDEO_GUIDE.md)** — Step-by-step setup guide
- **[business.md](./business.md)** — Business model & economics

## 🎥 Demo

**Live App:** https://cashcollect.vercel.app  
**Video Demo:** https://canva.link/d9u2h682oco39k2

### Try Without Sign Up
```
Dashboard: https://cashcollect.vercel.app/app
Email:     demo@cashcollect.app
Password:  demo2026
```

## 📞 Support

- **Questions?** Open an [issue](https://github.com/rithikrajyt/cashcollect/issues)
- **Architecture details?** See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Step-by-step guide?** See [DEPLOYMENT_TESTING_VIDEO_GUIDE.md](./DEPLOYMENT_TESTING_VIDEO_GUIDE.md)
