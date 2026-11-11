"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";

interface CollectionEventRow {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  event_type: string;
  scheduled_at: string;
  status: string;
  recipient_email: string | null;
}

const eventTypeLabels: Record<string, string> = {
  before_due: "Before Due",
  due_date: "Due Date",
  overdue: "Overdue",
  manual_follow_up: "Follow-up",
};

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  scheduled: "secondary",
  ready: "warning",
  sent: "success",
  skipped: "secondary",
  failed: "destructive",
  cancelled: "secondary",
};

export default function CollectionsPage() {
  const [events, setEvents] = useState<CollectionEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Collections</h1>
        <p className="text-sm text-muted-foreground">
          Scheduled reminder events for your invoices
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                No collection events
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create collection plans via Claude using the
                create_collection_plan MCP tool to schedule reminders for your
                invoices.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Link
                        href={`/app/receivables/${event.invoice_id}`}
                        className="text-primary hover:underline font-medium text-sm"
                      >
                        {event.invoice_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.customer_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {eventTypeLabels[event.event_type] ?? event.event_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.scheduled_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {event.recipient_email || "Not set"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusColors[event.status] ?? "secondary"}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              Email delivery not configured.
            </strong>{" "}
            Collection reminders are scheduled and can be viewed here, but
            actual email sending requires a configured email provider (Resend).
            You can copy reminder content manually from the invoice detail page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
