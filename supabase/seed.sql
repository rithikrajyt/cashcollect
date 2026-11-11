-- CashCollect Finance OS - Demo Seed Data
-- Organization: Northstar Digital Services Pvt. Ltd. (fictional)
-- All monetary values in integer paise (1 INR = 100 paise)

-- =============================================================================
-- Demo Organization
-- =============================================================================
INSERT INTO organizations (id, name, legal_name, currency, timezone, financial_year_start_month)
VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'Northstar Digital Services',
  'Northstar Digital Services Pvt. Ltd.',
  'INR',
  'Asia/Kolkata',
  4
);

-- =============================================================================
-- Customers
-- =============================================================================

-- 1. TechVista Solutions
INSERT INTO customers (id, organization_id, display_name, legal_name, email, phone, payment_terms_days, notes, status)
VALUES (
  'c1000000-0000-4000-8000-000000000001',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'TechVista Solutions',
  'TechVista Solutions Pvt. Ltd.',
  'accounts@techvista.example.com',
  '+919876543210',
  30,
  'Enterprise software client. Primary contact: Rahul Mehta.',
  'active'
);

-- 2. Pinnacle Staffing Services
INSERT INTO customers (id, organization_id, display_name, legal_name, email, phone, payment_terms_days, notes, status)
VALUES (
  'c1000000-0000-4000-8000-000000000002',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'Pinnacle Staffing Services',
  'Pinnacle Staffing Services LLP',
  'finance@pinnacle-staffing.example.com',
  '+919876543211',
  15,
  'Staffing and recruitment partner.',
  'active'
);

-- 3. Meridian Creative Agency
INSERT INTO customers (id, organization_id, display_name, legal_name, email, phone, payment_terms_days, notes, status)
VALUES (
  'c1000000-0000-4000-8000-000000000003',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'Meridian Creative Agency',
  'Meridian Creative Agency Pvt. Ltd.',
  'billing@meridian-creative.example.com',
  '+919876543212',
  15,
  'Design and branding client.',
  'active'
);

-- 4. Cloudbridge Infrastructure
INSERT INTO customers (id, organization_id, display_name, legal_name, email, phone, payment_terms_days, notes, status)
VALUES (
  'c1000000-0000-4000-8000-000000000004',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'Cloudbridge Infrastructure',
  'Cloudbridge Infrastructure Ltd.',
  'ap@cloudbridge.example.com',
  '+919876543213',
  30,
  'Cloud infrastructure consulting. Large account.',
  'active'
);

-- 5. NexGen Analytics India
INSERT INTO customers (id, organization_id, display_name, legal_name, email, phone, payment_terms_days, notes, status)
VALUES (
  'c1000000-0000-4000-8000-000000000005',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'NexGen Analytics India',
  'NexGen Analytics India Pvt. Ltd.',
  'finance@nexgen-analytics.example.com',
  '+919876543214',
  15,
  'Data analytics consulting.',
  'active'
);

-- =============================================================================
-- Invoices (8 total across various states)
-- Dates relative to November 2026
-- =============================================================================

-- INV-001: OVERDUE (issued, past due, TechVista)
-- Due 15 Oct 2026, issued 1 Oct 2026, ₹2,50,000
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000001',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000001',
  'INV-2026-0001',
  '2026-10-01',
  '2026-10-15',
  'INR',
  25000000,  -- ₹2,50,000
  0,
  25000000,
  0,
  'issued',
  'October platform development - Phase 1'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000001', 'Platform development - Sprint 1', 1, 15000000, 15000000, 0, 1),
  ('il000000-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000001', 'Code review and architecture consultation', 1, 10000000, 10000000, 0, 2);

-- INV-002: OVERDUE (issued, past due, Pinnacle)
-- Due 25 Oct 2026, issued 10 Oct 2026, ₹85,000
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000002',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000002',
  'INV-2026-0002',
  '2026-10-10',
  '2026-10-25',
  'INR',
  8500000,  -- ₹85,000
  0,
  8500000,
  0,
  'issued',
  'Recruitment portal maintenance - October'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000003', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000002', 'Monthly maintenance and support', 1, 6000000, 6000000, 0, 1),
  ('il000000-0000-4000-8000-000000000004', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000002', 'Bug fixes and hotfixes (5 tickets)', 5, 500000, 2500000, 0, 2);

-- INV-003: DUE SOON (issued, due 14 Nov 2026, Meridian)
-- ₹1,20,000
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000003',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000003',
  'INV-2026-0003',
  '2026-10-30',
  '2026-11-14',
  'INR',
  12000000,  -- ₹1,20,000
  0,
  12000000,
  0,
  'issued',
  'Brand identity redesign project'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000005', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000003', 'Brand strategy and workshop', 1, 5000000, 5000000, 0, 1),
  ('il000000-0000-4000-8000-000000000006', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000003', 'Logo and visual identity design', 1, 7000000, 7000000, 0, 2);

-- INV-004: DUE SOON (issued, due 18 Nov 2026, Cloudbridge)
-- ₹3,50,000
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000004',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000004',
  'INV-2026-0004',
  '2026-10-19',
  '2026-11-18',
  'INR',
  35000000,  -- ₹3,50,000
  0,
  35000000,
  0,
  'issued',
  'Cloud migration project - Phase 2'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000007', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000004', 'Cloud architecture design', 1, 12000000, 12000000, 0, 1),
  ('il000000-0000-4000-8000-000000000008', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000004', 'Migration execution and testing', 1, 18000000, 18000000, 0, 2),
  ('il000000-0000-4000-8000-000000000009', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000004', 'Documentation and handover', 1, 5000000, 5000000, 0, 3);

-- INV-005: PAID (TechVista, September invoice)
-- ₹1,80,000 fully paid
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000005',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000001',
  'INV-2026-0005',
  '2026-09-01',
  '2026-09-30',
  'INR',
  18000000,  -- ₹1,80,000
  0,
  18000000,
  18000000,
  'paid',
  'September development services'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000010', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000005', 'Software development - September', 1, 18000000, 18000000, 0, 1);

-- INV-006: PAID (NexGen, August invoice)
-- ₹65,000 fully paid
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000006',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000005',
  'INV-2026-0006',
  '2026-08-15',
  '2026-08-30',
  'INR',
  6500000,  -- ₹65,000
  0,
  6500000,
  6500000,
  'paid',
  'Data pipeline consulting - August'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000011', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000006', 'Data pipeline design and implementation', 1, 6500000, 6500000, 0, 1);

-- INV-007: PARTIALLY PAID (Cloudbridge, older invoice)
-- ₹2,00,000 total, ₹1,20,000 paid
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000007',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000004',
  'INV-2026-0007',
  '2026-09-15',
  '2026-10-15',
  'INR',
  20000000,  -- ₹2,00,000
  0,
  20000000,
  12000000,  -- ₹1,20,000 paid
  'partially_paid',
  'Cloud migration project - Phase 1'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000012', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000007', 'Infrastructure assessment', 1, 8000000, 8000000, 0, 1),
  ('il000000-0000-4000-8000-000000000013', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000007', 'Migration planning and POC', 1, 12000000, 12000000, 0, 2);

-- INV-008: DRAFT (NexGen, November invoice, not yet issued)
-- ₹95,000
INSERT INTO invoices (id, organization_id, customer_id, invoice_number, invoice_date, due_date, currency, subtotal_paise, tax_total_paise, total_paise, paid_paise, status, notes)
VALUES (
  'inv00000-0000-4000-8000-000000000008',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000005',
  'DRAFT-2026-0008',
  '2026-11-10',
  '2026-11-25',
  'INR',
  9500000,  -- ₹95,000
  0,
  9500000,
  0,
  'draft',
  'November analytics consulting'
);

INSERT INTO invoice_lines (id, organization_id, invoice_id, description, quantity, unit_price_paise, line_subtotal_paise, tax_amount_paise, sort_order)
VALUES
  ('il000000-0000-4000-8000-000000000014', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000008', 'Dashboard analytics development', 1, 6000000, 6000000, 0, 1),
  ('il000000-0000-4000-8000-000000000015', 'a1b2c3d4-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000008', 'Report generation module', 1, 3500000, 3500000, 0, 2);


-- =============================================================================
-- Collection plans and events
-- =============================================================================

-- Plan for overdue INV-001
INSERT INTO collection_plans (id, organization_id, invoice_id, name, channel, status)
VALUES (
  'cp000000-0000-4000-8000-000000000001',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'inv00000-0000-4000-8000-000000000001',
  'Standard collection plan',
  'email',
  'active'
);

INSERT INTO collection_events (id, organization_id, collection_plan_id, invoice_id, scheduled_at, event_type, status, recipient_email, subject, body)
VALUES
  ('ce000000-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000001',
   '2026-10-12 03:30:00+00', 'before_due', 'sent',
   'accounts@techvista.example.com', 'Upcoming payment reminder - INV-2026-0001',
   'Dear TechVista Solutions, this is a reminder that invoice INV-2026-0001 for ₹2,50,000 is due on 15 October 2026. Please arrange payment at your earliest convenience.'),
  ('ce000000-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000001',
   '2026-10-15 03:30:00+00', 'due_date', 'sent',
   'accounts@techvista.example.com', 'Payment due today - INV-2026-0001',
   'Dear TechVista Solutions, invoice INV-2026-0001 for ₹2,50,000 is due today. Please confirm payment status.'),
  ('ce000000-0000-4000-8000-000000000003', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000001', 'inv00000-0000-4000-8000-000000000001',
   '2026-10-18 03:30:00+00', 'overdue', 'sent',
   'accounts@techvista.example.com', 'Overdue payment - INV-2026-0001',
   'Dear TechVista Solutions, invoice INV-2026-0001 for ₹2,50,000 is now 3 days past due. We kindly request immediate payment.');

-- Plan for due-soon INV-003
INSERT INTO collection_plans (id, organization_id, invoice_id, name, channel, status)
VALUES (
  'cp000000-0000-4000-8000-000000000002',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'inv00000-0000-4000-8000-000000000003',
  'Standard collection plan',
  'email',
  'active'
);

INSERT INTO collection_events (id, organization_id, collection_plan_id, invoice_id, scheduled_at, event_type, status, recipient_email, subject, body)
VALUES
  ('ce000000-0000-4000-8000-000000000004', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000002', 'inv00000-0000-4000-8000-000000000003',
   '2026-11-11 03:30:00+00', 'before_due', 'scheduled',
   'billing@meridian-creative.example.com', 'Upcoming payment reminder - INV-2026-0003',
   'Dear Meridian Creative Agency, this is a reminder that invoice INV-2026-0003 for ₹1,20,000 is due on 14 November 2026.'),
  ('ce000000-0000-4000-8000-000000000005', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000002', 'inv00000-0000-4000-8000-000000000003',
   '2026-11-14 03:30:00+00', 'due_date', 'scheduled',
   'billing@meridian-creative.example.com', 'Payment due today - INV-2026-0003',
   'Dear Meridian Creative Agency, invoice INV-2026-0003 for ₹1,20,000 is due today. Please confirm payment status.'),
  ('ce000000-0000-4000-8000-000000000006', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000002', 'inv00000-0000-4000-8000-000000000003',
   '2026-11-17 03:30:00+00', 'overdue', 'scheduled',
   'billing@meridian-creative.example.com', 'Overdue payment - INV-2026-0003',
   'Dear Meridian Creative Agency, invoice INV-2026-0003 for ₹1,20,000 is now overdue. We kindly request payment at your earliest convenience.');

-- Plan for due-soon INV-004
INSERT INTO collection_plans (id, organization_id, invoice_id, name, channel, status)
VALUES (
  'cp000000-0000-4000-8000-000000000003',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'inv00000-0000-4000-8000-000000000004',
  'Standard collection plan',
  'email',
  'active'
);

INSERT INTO collection_events (id, organization_id, collection_plan_id, invoice_id, scheduled_at, event_type, status, recipient_email, subject, body)
VALUES
  ('ce000000-0000-4000-8000-000000000007', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000003', 'inv00000-0000-4000-8000-000000000004',
   '2026-11-15 03:30:00+00', 'before_due', 'scheduled',
   'ap@cloudbridge.example.com', 'Upcoming payment reminder - INV-2026-0004',
   'Dear Cloudbridge Infrastructure, this is a reminder that invoice INV-2026-0004 for ₹3,50,000 is due on 18 November 2026.'),
  ('ce000000-0000-4000-8000-000000000008', 'a1b2c3d4-0000-4000-8000-000000000001', 'cp000000-0000-4000-8000-000000000003', 'inv00000-0000-4000-8000-000000000004',
   '2026-11-18 03:30:00+00', 'due_date', 'scheduled',
   'ap@cloudbridge.example.com', 'Payment due today - INV-2026-0004',
   'Dear Cloudbridge Infrastructure, invoice INV-2026-0004 for ₹3,50,000 is due today.');
