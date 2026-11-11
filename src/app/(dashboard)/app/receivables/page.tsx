"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileText, Eye } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_paise: number;
  paid_paise: number;
  status: string;
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

const STATUS_FILTERS = [
  "all",
  "draft",
  "issued",
  "overdue",
  "partially_paid",
  "paid",
] as const;

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
  disputed: "destructive",
};

const statusLabel: Record<string, string> = {
  all: "All",
  draft: "Draft",
  issued: "Issued",
  overdue: "Overdue",
  partially_paid: "Partial",
  paid: "Paid",
  voided: "Voided",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReceivablesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "overdue") {
        params.set("overdue_only", "true");
      } else if (filter !== "all") {
        params.set("status", filter);
      }
      params.set("limit", "50");

      const res = await fetch(`/api/invoices?${params}`);
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const today = new Date().toISOString().split("T")[0];

  const filtered = invoices.filter((inv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.invoice_number.toLowerCase().includes(q) ||
      (inv.customer_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receivables</h1>
          <p className="text-sm text-muted-foreground">
            Manage your invoices and track payments
          </p>
        </div>
        <Link href="/app/receivables/new">
          <Button>
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {statusLabel[s] ?? s}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices or customers..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Loading invoices...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                No invoices found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {search
                  ? "No invoices match your search."
                  : "Create your first invoice by asking Claude or click the button above."}
              </p>
              {!search && (
                <Link href="/app/receivables/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => {
                  const outstanding = inv.total_paise - inv.paid_paise;
                  const isOverdue =
                    (inv.status === "issued" ||
                      inv.status === "partially_paid") &&
                    inv.due_date < today &&
                    outstanding > 0;
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
                      <TableCell className="text-sm font-medium">
                        {inv.customer_name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fmtDate(inv.invoice_date)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fmtDate(inv.due_date)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-medium">
                        {fmtINR(inv.total_paise)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm text-success">
                        {inv.paid_paise > 0 ? fmtINR(inv.paid_paise) : "—"}
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums text-sm font-medium ${isOverdue ? "text-destructive" : ""}`}
                      >
                        {outstanding > 0 ? fmtINR(outstanding) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusVariant[displayStatus] ?? "secondary"
                          }
                        >
                          {statusLabel[displayStatus] ?? displayStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/app/receivables/${inv.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
