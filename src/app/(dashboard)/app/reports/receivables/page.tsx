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
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, RefreshCw } from "lucide-react";

interface AgeingBucket {
  label: string;
  count: number;
  amount_paise: number;
  amount_display: string;
}

interface ReportInvoice {
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  due_date: string;
  total_display: string;
  paid_display: string;
  outstanding_display: string;
  days_overdue: number;
  bucket: string;
}

interface ReceivablesReport {
  as_of_date: string;
  currency: string;
  total_issued_display: string;
  total_paid_display: string;
  total_outstanding_display: string;
  invoice_count: number;
  customer_count: number;
  buckets: AgeingBucket[];
  invoices: ReportInvoice[];
}

export default function ReceivablesReportPage() {
  const [report, setReport] = useState<ReceivablesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [asOfDate, setAsOfDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchReport = () => {
    setLoading(true);
    fetch(`/api/reports/receivables?as_of_date=${asOfDate}`)
      .then((r) => r.json())
      .then((d) => setReport(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Receivables Ageing Report
        </h1>
        <p className="text-sm text-muted-foreground">
          Outstanding invoices grouped by ageing buckets
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="as_of_date" className="text-sm">
                Report Date
              </Label>
              <Input
                id="as_of_date"
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={fetchReport} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : report ? (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Issued</p>
                <p className="text-xl font-bold tabular-nums mt-1">
                  {report.total_issued_display}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {report.invoice_count} invoices, {report.customer_count}{" "}
                  customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-bold tabular-nums mt-1 text-success">
                  {report.total_paid_display}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Total Outstanding
                </p>
                <p className="text-xl font-bold tabular-nums mt-1">
                  {report.total_outstanding_display}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ageing Buckets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ageing Buckets</CardTitle>
              <CardDescription>
                As of {report.as_of_date} | {report.currency}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-5">
                {report.buckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="rounded-lg border p-3 text-center"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {bucket.label}
                    </p>
                    <p className="text-lg font-bold tabular-nums">
                      {bucket.amount_display}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bucket.count} invoice{bucket.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {report.invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right tabular-nums">
                        Total
                      </TableHead>
                      <TableHead className="text-right tabular-nums">
                        Paid
                      </TableHead>
                      <TableHead className="text-right tabular-nums">
                        Outstanding
                      </TableHead>
                      <TableHead className="text-right">Days</TableHead>
                      <TableHead>Bucket</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.invoices.map((inv) => (
                      <TableRow key={inv.invoice_id}>
                        <TableCell>
                          <Link
                            href={`/app/receivables/${inv.invoice_id}`}
                            className="text-primary hover:underline font-medium text-sm"
                          >
                            {inv.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {inv.customer_name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {inv.due_date}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {inv.total_display}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm text-success">
                          {inv.paid_display}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm font-medium">
                          {inv.outstanding_display}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {inv.days_overdue > 0 ? inv.days_overdue : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.bucket.includes("91") || inv.bucket.includes("61")
                                ? "destructive"
                                : inv.bucket.includes("31") || inv.bucket.includes("1")
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {inv.bucket}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center py-12 text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No outstanding invoices for this report date.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
