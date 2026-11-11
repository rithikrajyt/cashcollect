"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  Clock,
  Bell,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Types matching actual API response
// ---------------------------------------------------------------------------

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit_price_paise: number;
  line_subtotal_paise: number;
  tax_amount_paise: number;
  sort_order: number;
}

interface CollectionEvent {
  id: string;
  event_type: string;
  scheduled_at: string;
  status: string;
  subject: string | null;
  body: string | null;
}

interface CollectionPlanData {
  id: string;
  name: string;
  channel: string;
  status: string;
  events: CollectionEvent[];
}

interface AuditEventData {
  id: string;
  action: string;
  actor_type: string;
  created_at: string;
}

interface InvoiceData {
  invoice: {
    id: string;
    invoice_number: string;
    customer_id: string;
    invoice_date: string;
    due_date: string;
    currency: string;
    subtotal_paise: number;
    tax_total_paise: number;
    total_paise: number;
    paid_paise: number;
    status: string;
    notes: string | null;
    updated_at: string;
  };
  lines: InvoiceLine[];
  customer: { id: string; display_name: string; email: string | null } | null;
  collection_plans: CollectionPlanData[];
  audit_events: AuditEventData[];
}

const statusVariant: Record<
  string,
  "default" | "success" | "warning" | "destructive" | "secondary"
> = {
  draft: "secondary",
  issued: "default",
  partially_paid: "warning",
  paid: "success",
  voided: "secondary",
};

const eventTypeLabels: Record<string, string> = {
  before_due: "Before Due",
  due_date: "Due Date",
  overdue: "Overdue",
  manual_follow_up: "Follow-up",
};

const eventStatusVariant: Record<
  string,
  "default" | "success" | "warning" | "destructive" | "secondary"
> = {
  scheduled: "secondary",
  ready: "warning",
  sent: "success",
  skipped: "secondary",
  failed: "destructive",
  cancelled: "secondary",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [issuing, setIssuing] = useState(false);

  // Editable fields
  const [editNotes, setEditNotes] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`);
      if (!res.ok) throw new Error("Not found");
      const d = await res.json();
      setData(d);
      setEditNotes(d.invoice?.notes ?? "");
      setEditDueDate(d.invoice?.due_date ?? "");
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const inv = data?.invoice;
  const isDraft = inv?.status === "draft";

  const handleSave = async () => {
    if (!isDraft || !inv) return;
    setSaving(true);
    setSaveMsg("idle");

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: editNotes,
          due_date: editDueDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      // Re-fetch full data
      await fetchInvoice();
      setSaveMsg("success");
      setTimeout(() => setSaveMsg("idle"), 3000);
    } catch {
      setSaveMsg("error");
      setTimeout(() => setSaveMsg("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleIssue = async () => {
    if (!isDraft || !inv) return;
    const confirmed = window.confirm(
      "Issue this invoice? It will be assigned a final invoice number (INV-YYYY-NNNN) and can no longer be edited as a draft.",
    );
    if (!confirmed) return;

    setIssuing(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "issue" }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to issue invoice");
        return;
      }
      await fetchInvoice();
    } catch {
      alert("Failed to issue invoice");
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!data || !inv) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Invoice Not Found
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          This invoice does not exist or you do not have access.
        </p>
        <Link href="/app/receivables">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Receivables
          </Button>
        </Link>
      </div>
    );
  }

  const outstanding = inv.total_paise - inv.paid_paise;
  const allEvents = data.collection_plans.flatMap((p) => p.events);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/app/receivables">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {inv.invoice_number}
              </h1>
              <Badge variant={statusVariant[inv.status] ?? "secondary"}>
                {inv.status}
              </Badge>
              {isDraft && (
                <span className="text-xs text-muted-foreground">
                  Draft — editable
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.customer?.display_name ?? "Unknown Customer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/app/receivables/${invoiceId}/pdf`} target="_blank">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </Link>
          {isDraft && (
            <>
              <Button onClick={handleSave} disabled={saving || issuing} variant="outline">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveMsg === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : saveMsg === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving
                  ? "Saving..."
                  : saveMsg === "success"
                    ? "Saved!"
                    : saveMsg === "error"
                      ? "Error"
                      : "Save Draft"}
              </Button>
              <Button
                onClick={handleIssue}
                disabled={saving || issuing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {issuing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {issuing ? "Issuing..." : "Issue Invoice"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {data.customer?.display_name ?? "Unknown"}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Invoice Date</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{fmtDate(inv.invoice_date)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  {isDraft ? (
                    <Input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{fmtDate(inv.due_date)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Currency</Label>
                  <div className="mt-1">
                    <span className="text-sm">{inv.currency}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Notes</Label>
                {isDraft ? (
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm mt-1 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm mt-1">
                    {inv.notes || "No notes"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line Items</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lines.map((line, idx) => (
                    <TableRow key={line.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {line.description}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {line.quantity}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {fmtINR(line.unit_price_paise)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm">
                        {line.tax_amount_paise > 0
                          ? fmtINR(line.tax_amount_paise)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-sm font-medium">
                        {fmtINR(line.line_subtotal_paise + line.tax_amount_paise)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="border-t p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{fmtINR(inv.subtotal_paise)}</span>
                </div>
                {inv.tax_total_paise > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="tabular-nums">
                      {fmtINR(inv.tax_total_paise)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Total</span>
                  <span className="tabular-nums">{fmtINR(inv.total_paise)}</span>
                </div>
                {inv.paid_paise > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-success">
                      <span>Paid</span>
                      <span className="tabular-nums">
                        {fmtINR(inv.paid_paise)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Outstanding</span>
                      <span className="tabular-nums">
                        {fmtINR(outstanding)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Collection Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Collection Schedule
              </CardTitle>
              <CardDescription>
                Reminder timeline for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allEvents.length > 0 ? (
                <div className="space-y-3">
                  {allEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {eventTypeLabels[event.event_type] ?? event.event_type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fmtDate(event.scheduled_at)}
                        </div>
                      </div>
                      <Badge
                        variant={eventStatusVariant[event.status] ?? "secondary"}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-2">
                    Email delivery not configured. Reminders saved as drafts.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No collection plan. Ask Claude to create one.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Record Payment */}
          {(inv.status === "issued" || inv.status === "partially_paid") && (
            <RecordPaymentCard
              invoiceId={inv.id}
              customerId={inv.customer_id}
              outstandingPaise={outstanding}
              onPaymentRecorded={fetchInvoice}
            />
          )}

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {data.audit_events && data.audit_events.length > 0 ? (
                <div className="space-y-3">
                  {data.audit_events.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-start gap-2 py-1">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0" />
                      <div>
                        <div className="text-sm">
                          {event.action.replace(/[._]/g, " ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.actor_type} &middot;{" "}
                          {new Date(event.created_at).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activity recorded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Record Payment Card
// ---------------------------------------------------------------------------

function RecordPaymentCard({
  invoiceId,
  customerId,
  outstandingPaise,
  onPaymentRecorded,
}: {
  invoiceId: string;
  customerId: string;
  outstandingPaise: number;
  onPaymentRecorded: () => Promise<void>;
}) {
  const [amount, setAmount] = useState(String((outstandingPaise / 100).toFixed(2)));
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMsg(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid positive amount");
      return;
    }
    const paise = Math.round(amountNum * 100);
    if (paise > outstandingPaise) {
      setError(`Amount exceeds outstanding balance of ${fmtINR(outstandingPaise)}`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          invoice_id: invoiceId,
          payment_date: date,
          amount_paise: paise,
          method,
          reference: reference || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to record payment");
        return;
      }
      setSuccessMsg(`Payment of ${fmtINR(paise)} recorded`);
      await onPaymentRecorded();
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Record Payment
        </CardTitle>
        <CardDescription>
          Outstanding: <span className="font-semibold text-foreground tabular-nums">{fmtINR(outstandingPaise)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Amount (₹)</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
            placeholder="e.g. 50000"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Method</Label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Reference</Label>
          <Input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1"
            placeholder="e.g. UTR number"
          />
        </div>

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {successMsg && (
          <p className="text-xs text-emerald-600 font-medium">{successMsg}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="sm"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {submitting ? "Recording..." : "Record Payment"}
        </Button>
      </CardContent>
    </Card>
  );
}
