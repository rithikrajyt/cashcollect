"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Plug,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_id: string;
  due_date: string;
  total_paise: number;
  paid_paise: number;
  status: string;
}

interface ReportBucket {
  label: string;
  count: number;
  amount_paise: number;
  amount_display: string;
}

interface Report {
  total_outstanding_paise: number;
  total_outstanding_display: string;
  total_paid_paise: number;
  total_paid_display: string;
  total_issued_paise: number;
  total_issued_display: string;
  invoice_count: number;
  customer_count: number;
  buckets: ReportBucket[];
  invoices: Array<{
    invoice_id: string;
    invoice_number: string;
    customer_name: string;
    outstanding_paise: number;
    outstanding_display: string;
    days_overdue: number;
  }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusVariant: Record<
  string,
  "default" | "success" | "warning" | "destructive" | "secondary"
> = {
  draft: "secondary",
  issued: "default",
  partially_paid: "warning",
  paid: "success",
  overdue: "destructive",
  voided: "secondary",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  issued: "Issued",
  partially_paid: "Partial",
  paid: "Paid",
  overdue: "Overdue",
  voided: "Voided",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardOverview() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      fetch("/api/invoices?limit=50").then((r) => r.json()),
      fetch(`/api/reports/receivables?as_of_date=${today}`).then((r) =>
        r.json()
      ),
    ])
      .then(([invs, rpt]) => {
        setInvoices(invs);
        setReport(rpt);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Derived data
  const today = new Date().toISOString().split("T")[0];
  const next7 = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const overdueInvoices = invoices.filter(
    (i) =>
      (i.status === "issued" || i.status === "partially_paid") &&
      i.due_date < today &&
      i.paid_paise < i.total_paise
  );
  const overdueTotal = overdueInvoices.reduce(
    (s, i) => s + (i.total_paise - i.paid_paise),
    0
  );

  const dueSoon = invoices.filter(
    (i) =>
      (i.status === "issued" || i.status === "partially_paid") &&
      i.due_date >= today &&
      i.due_date <= next7 &&
      i.paid_paise < i.total_paise
  );
  const dueSoonTotal = dueSoon.reduce(
    (s, i) => s + (i.total_paise - i.paid_paise),
    0
  );

  const recentInvoices = invoices.slice(0, 5);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Your financial operations at a glance
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 w-24 mb-3 bg-muted animate-pulse rounded" />
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Your financial operations at a glance
          </p>
        </div>
        <Link href="/app/receivables/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Outstanding Receivables"
          value={report ? report.total_outstanding_display : "—"}
          icon={IndianRupee}
          description={`${report?.invoice_count ?? 0} open invoices`}
        />
        <KpiCard
          title="Overdue Amount"
          value={fmtINR(overdueTotal)}
          icon={AlertTriangle}
          description={`${overdueInvoices.length} overdue invoices`}
          variant="destructive"
        />
        <KpiCard
          title="Collected"
          value={report ? report.total_paid_display : "—"}
          icon={CheckCircle2}
          description="Total payments received"
          variant="success"
        />
        <KpiCard
          title="Due in 7 Days"
          value={fmtINR(dueSoonTotal)}
          icon={Clock}
          description={`${dueSoon.length} invoices due soon`}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Invoices */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Invoices</CardTitle>
              <CardDescription>Latest invoices in your workspace</CardDescription>
            </div>
            <Link href="/app/receivables">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((inv) => {
                    const isOverdue =
                      (inv.status === "issued" ||
                        inv.status === "partially_paid") &&
                      inv.due_date < today &&
                      inv.paid_paise < inv.total_paise;
                    const displayStatus = isOverdue ? "overdue" : inv.status;
                    return (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <Link
                            href={`/app/receivables/${inv.id}`}
                            className="text-primary hover:underline font-medium text-sm"
                          >
                            {inv.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {inv.customer_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {fmtDate(inv.due_date)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm font-medium">
                          {fmtINR(inv.total_paise)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusVariant[displayStatus] ?? "secondary"}
                          >
                            {statusLabel[displayStatus] ?? displayStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No invoices yet. Create one via Claude or the dashboard.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Overdue section */}
          {overdueInvoices.length > 0 && (
            <Card className="border-destructive/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-base">Overdue</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {overdueInvoices.slice(0, 4).map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/app/receivables/${inv.id}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {inv.invoice_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {inv.customer_name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-destructive">
                      {fmtINR(inv.total_paise - inv.paid_paise)}
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* MCP panel */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Plug className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    Connected to Claude via MCP
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Ask Claude to create invoices, manage customers, and
                    generate reports.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "list_customers",
                      "create_customer",
                      "create_invoice_draft",
                      "get_receivables_report",
                    ].map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component
// ---------------------------------------------------------------------------

function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  variant,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  variant?: "destructive" | "success" | "warning";
}) {
  const iconColor =
    variant === "destructive"
      ? "text-destructive"
      : variant === "success"
        ? "text-success"
        : variant === "warning"
          ? "text-warning"
          : "text-primary";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="text-2xl font-bold tabular-nums text-foreground">
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
