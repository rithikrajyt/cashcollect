-- CashCollect Finance OS - Initial Schema
-- Migration 001: Core tables for receivables, collections, and audit

-- =============================================================================
-- Helper: auto-update updated_at column
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- organizations
-- =============================================================================
CREATE TABLE organizations (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  legal_name   text,
  currency     char(3)     NOT NULL DEFAULT 'INR',
  timezone     text        NOT NULL DEFAULT 'Asia/Kolkata',
  financial_year_start_month smallint NOT NULL DEFAULT 4
    CHECK (financial_year_start_month BETWEEN 1 AND 12),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: service_role has full access; public denied by default
CREATE POLICY "service_role_all" ON organizations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- customers
-- =============================================================================
CREATE TABLE customers (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    uuid        NOT NULL REFERENCES organizations(id),
  display_name       text        NOT NULL,
  legal_name         text,
  email              text,
  phone              text,
  gstin              text,
  billing_address    jsonb       NOT NULL DEFAULT '{}',
  payment_terms_days int         NOT NULL DEFAULT 15
    CHECK (payment_terms_days BETWEEN 0 AND 365),
  notes              text,
  status             text        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_customers_org ON customers (organization_id);
CREATE INDEX idx_customers_status ON customers (organization_id, status);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "service_role_all" ON customers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- invoices
-- =============================================================================
CREATE TABLE invoices (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid        NOT NULL REFERENCES organizations(id),
  customer_id      uuid        NOT NULL REFERENCES customers(id),
  invoice_number   text        NOT NULL,
  invoice_date     date        NOT NULL,
  due_date         date        NOT NULL,
  currency         char(3)     NOT NULL DEFAULT 'INR',
  subtotal_paise   bigint      NOT NULL CHECK (subtotal_paise >= 0),
  tax_total_paise  bigint      NOT NULL DEFAULT 0 CHECK (tax_total_paise >= 0),
  total_paise      bigint      NOT NULL CHECK (total_paise >= 0),
  paid_paise       bigint      NOT NULL DEFAULT 0 CHECK (paid_paise >= 0),
  status           text        NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'voided', 'disputed')),
  notes            text,
  created_by       uuid,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  UNIQUE (organization_id, invoice_number)
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_invoices_org ON invoices (organization_id);
CREATE INDEX idx_invoices_status ON invoices (organization_id, status);
CREATE INDEX idx_invoices_customer ON invoices (organization_id, customer_id);
CREATE INDEX idx_invoices_due_date ON invoices (organization_id, due_date);

CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "service_role_all" ON invoices
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- invoice_lines
-- =============================================================================
CREATE TABLE invoice_lines (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid          NOT NULL,
  invoice_id          uuid          NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description         text          NOT NULL,
  quantity            numeric(14,3) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_paise    bigint        NOT NULL CHECK (unit_price_paise >= 0),
  line_subtotal_paise bigint        NOT NULL CHECK (line_subtotal_paise >= 0),
  tax_amount_paise    bigint        NOT NULL DEFAULT 0,
  sort_order          int           NOT NULL DEFAULT 0
);

ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_invoice_lines_invoice ON invoice_lines (invoice_id);
CREATE INDEX idx_invoice_lines_org ON invoice_lines (organization_id);

CREATE POLICY "service_role_all" ON invoice_lines
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- collection_plans
-- =============================================================================
CREATE TABLE collection_plans (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id),
  invoice_id      uuid        NOT NULL REFERENCES invoices(id),
  name            text        NOT NULL DEFAULT 'Standard collection plan',
  channel         text        NOT NULL DEFAULT 'email'
    CHECK (channel IN ('email', 'manual')),
  status          text        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE collection_plans ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_collection_plans_org ON collection_plans (organization_id);
CREATE INDEX idx_collection_plans_invoice ON collection_plans (invoice_id);

CREATE TRIGGER trg_collection_plans_updated_at
  BEFORE UPDATE ON collection_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE POLICY "service_role_all" ON collection_plans
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- collection_events
-- =============================================================================
CREATE TABLE collection_events (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id    uuid        NOT NULL REFERENCES organizations(id),
  collection_plan_id uuid        NOT NULL REFERENCES collection_plans(id) ON DELETE CASCADE,
  invoice_id         uuid        NOT NULL REFERENCES invoices(id),
  scheduled_at       timestamptz NOT NULL,
  event_type         text        NOT NULL
    CHECK (event_type IN ('before_due', 'due_date', 'overdue', 'manual_follow_up')),
  status             text        NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'ready', 'sent', 'skipped', 'failed', 'cancelled')),
  recipient_email    text,
  subject            text,
  body               text,
  sent_at            timestamptz,
  provider_message_id text,
  failure_reason     text,
  created_at         timestamptz NOT NULL DEFAULT now(),

  UNIQUE (collection_plan_id, scheduled_at, event_type)
);

ALTER TABLE collection_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_collection_events_org ON collection_events (organization_id);
CREATE INDEX idx_collection_events_plan ON collection_events (collection_plan_id);
CREATE INDEX idx_collection_events_invoice ON collection_events (invoice_id);
CREATE INDEX idx_collection_events_status ON collection_events (status, scheduled_at);

CREATE POLICY "service_role_all" ON collection_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- audit_events (append-only)
-- =============================================================================
CREATE TABLE audit_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id),
  actor_type      text        NOT NULL
    CHECK (actor_type IN ('user', 'mcp', 'system')),
  actor_id        text,
  action          text        NOT NULL,
  entity_type     text        NOT NULL,
  entity_id       uuid        NOT NULL,
  before_data     jsonb,
  after_data      jsonb,
  request_id      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_audit_events_org ON audit_events (organization_id);
CREATE INDEX idx_audit_events_entity ON audit_events (entity_type, entity_id);
CREATE INDEX idx_audit_events_created ON audit_events (organization_id, created_at DESC);

CREATE POLICY "service_role_all" ON audit_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- mcp_idempotency_keys
-- =============================================================================
CREATE TABLE mcp_idempotency_keys (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   uuid        NOT NULL REFERENCES organizations(id),
  idempotency_key   text        NOT NULL,
  tool_name         text        NOT NULL,
  result_entity_type text,
  result_entity_id  uuid,
  created_at        timestamptz NOT NULL DEFAULT now(),

  UNIQUE (organization_id, idempotency_key)
);

ALTER TABLE mcp_idempotency_keys ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_idempotency_org ON mcp_idempotency_keys (organization_id);

CREATE POLICY "service_role_all" ON mcp_idempotency_keys
  FOR ALL TO service_role USING (true) WITH CHECK (true);
