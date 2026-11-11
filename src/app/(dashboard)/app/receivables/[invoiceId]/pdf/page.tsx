"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";

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
// Types (matching API response from /api/invoices/[id])
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
  };
  lines: InvoiceLine[];
  customer: {
    id: string;
    display_name: string;
    email: string | null;
    gstin?: string | null;
    phone?: string | null;
    billing_address?: Record<string, string>;
  } | null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvoicePdfPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${invoiceId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || !data.invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-medium mb-2">Invoice not found</p>
        <Link
          href={`/app/receivables/${invoiceId}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          Back to invoice
        </Link>
      </div>
    );
  }

  const inv = data.invoice;
  const isDraft = inv.status === "draft";
  const outstanding = inv.total_paise - inv.paid_paise;
  const addr = data.customer?.billing_address;
  const addressLine = addr
    ? [addr.line1, addr.city, addr.state, addr.pincode]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <>
      {/* Print styles — injected inline so they survive the dashboard layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              /* hide everything from the dashboard shell */
              nav, aside, header, .no-print { display: none !important; }
              body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { size: A4; margin: 15mm 20mm; }
              main { padding: 0 !important; margin: 0 !important; }
              .print-container { box-shadow: none !important; border: none !important; padding: 0 !important; }
            }
          `,
        }}
      />

      {/* Action bar — hidden on print */}
      <div className="no-print mb-6 flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <Link
          href={`/app/receivables/${invoiceId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoice
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print / Download PDF
        </button>
      </div>

      {/* Invoice document */}
      <div className="print-container mx-auto max-w-[800px] bg-white rounded-lg border shadow-sm p-10 relative overflow-hidden">
        {/* Draft watermark */}
        {isDraft && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            aria-hidden="true"
          >
            <span className="text-[120px] font-bold text-gray-100 -rotate-45 select-none tracking-widest">
              DRAFT
            </span>
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/app-icon.svg"
                alt="CashCollect"
                width={44}
                height={44}
                className="rounded-lg mt-0.5"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Northstar Digital Services Pvt. Ltd.
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  B2B IT and Digital Services Consultancy
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isDraft ? "DRAFT" : "TAX INVOICE"}
              </h2>
            </div>
          </div>

          {/* Invoice meta + Bill To */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            {/* Left — invoice details */}
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-28 text-gray-500 font-medium">
                  Invoice No.
                </span>
                <span className="text-gray-900 font-semibold">
                  {inv.invoice_number}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 text-gray-500 font-medium">
                  Invoice Date
                </span>
                <span className="text-gray-900">
                  {fmtDate(inv.invoice_date)}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 text-gray-500 font-medium">
                  Due Date
                </span>
                <span className="text-gray-900">{fmtDate(inv.due_date)}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-gray-500 font-medium">Status</span>
                <span
                  className={`font-medium ${
                    isDraft
                      ? "text-gray-500"
                      : inv.status === "paid"
                        ? "text-emerald-600"
                        : inv.status === "issued"
                          ? "text-indigo-600"
                          : "text-gray-900"
                  }`}
                >
                  {inv.status.charAt(0).toUpperCase() +
                    inv.status.slice(1).replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Right — Bill To */}
            <div className="text-sm">
              <p className="text-gray-500 font-medium mb-1">Bill To</p>
              <p className="text-gray-900 font-semibold text-base">
                {data.customer?.display_name ?? "—"}
              </p>
              {data.customer?.email && (
                <p className="text-gray-600">{data.customer.email}</p>
              )}
              {data.customer?.phone && (
                <p className="text-gray-600">{data.customer.phone}</p>
              )}
              {addressLine && (
                <p className="text-gray-600">{addressLine}</p>
              )}
              {data.customer?.gstin && (
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">GSTIN:</span>{" "}
                  {data.customer.gstin}
                </p>
              )}
            </div>
          </div>

          {/* Line items table */}
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-2 pr-3 text-left font-semibold text-gray-900 w-10">
                  #
                </th>
                <th className="py-2 pr-3 text-left font-semibold text-gray-900">
                  Description
                </th>
                <th className="py-2 pr-3 text-right font-semibold text-gray-900 w-16">
                  Qty
                </th>
                <th className="py-2 pr-3 text-right font-semibold text-gray-900 w-28">
                  Rate
                </th>
                <th className="py-2 pr-3 text-right font-semibold text-gray-900 w-28">
                  Tax
                </th>
                <th className="py-2 text-right font-semibold text-gray-900 w-28">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((line, idx) => (
                <tr
                  key={line.id}
                  className="border-b border-gray-200"
                >
                  <td className="py-2.5 pr-3 text-gray-500">{idx + 1}</td>
                  <td className="py-2.5 pr-3 text-gray-900 font-medium">
                    {line.description}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-gray-700">
                    {line.quantity}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-gray-700">
                    {fmtINR(line.unit_price_paise)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-gray-700">
                    {line.tax_amount_paise > 0
                      ? fmtINR(line.tax_amount_paise)
                      : "—"}
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-gray-900">
                    {fmtINR(
                      line.line_subtotal_paise + line.tax_amount_paise
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="tabular-nums text-gray-900">
                  {fmtINR(inv.subtotal_paise)}
                </span>
              </div>
              {inv.tax_total_paise > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="tabular-nums text-gray-900">
                    {fmtINR(inv.tax_total_paise)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="tabular-nums text-gray-900">
                  {fmtINR(inv.total_paise)}
                </span>
              </div>
              {inv.paid_paise > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-emerald-600">Paid</span>
                    <span className="tabular-nums text-emerald-600">
                      {fmtINR(inv.paid_paise)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-gray-900">Outstanding</span>
                    <span className="tabular-nums text-gray-900">
                      {fmtINR(outstanding)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {inv.notes && (
            <div className="mb-10">
              <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {inv.notes}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-400">
              This is a computer-generated invoice from CashCollect Finance OS.
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Northstar Digital Services Pvt. Ltd. &middot; Demo workspace
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
