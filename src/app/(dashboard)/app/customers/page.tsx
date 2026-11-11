"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, Search, Mail, Phone, Plus, X } from "lucide-react";

interface Customer {
  id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  payment_terms_days: number;
  status: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // New customer form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newTerms, setNewTerms] = useState("15");

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      const res = await fetch(`/api/customers?${params}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!newName.trim()) {
      setFormError("Customer name is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: newName.trim(),
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
          payment_terms_days: parseInt(newTerms) || 15,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setFormError(d.error || "Failed to create customer.");
        return;
      }
      // Reset form
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewTerms("15");
      setShowForm(false);
      // Refresh
      setLoading(true);
      fetchCustomers();
    } catch {
      setFormError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your customer records
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Add Customer
            </>
          )}
        </Button>
      </div>

      {/* Create customer form */}
      {showForm && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-2">
                  {formError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cname">Name *</Label>
                  <Input
                    id="cname"
                    placeholder="Company name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cemail">Email</Label>
                  <Input
                    id="cemail"
                    type="email"
                    placeholder="finance@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cphone">Phone</Label>
                  <Input
                    id="cphone"
                    placeholder="+91..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cterms">Payment Terms</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="cterms"
                      type="number"
                      min="0"
                      max="365"
                      className="w-20"
                      value={newTerms}
                      onChange={(e) => setNewTerms(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                    <Button type="submit" size="sm" disabled={saving} className="ml-auto">
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground mb-1">
                {search ? "No customers match your search" : "No customers yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Create customers via Claude using the create_customer tool, or click Add Customer above.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Payment Terms</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {cust.display_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {cust.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {cust.email}
                          </div>
                        )}
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {cust.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {cust.payment_terms_days} days
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={cust.status === "active" ? "success" : "secondary"}
                      >
                        {cust.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
