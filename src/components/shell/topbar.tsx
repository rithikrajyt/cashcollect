"use client";

import { Badge } from "@/components/ui/badge";
import { Building2, Plug, LogOut } from "lucide-react";

export function Topbar() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Left: Organization name */}
      <div className="flex items-center gap-3">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Northstar Digital Services
        </span>
        <Badge variant="secondary" className="text-[10px]">
          Demo Workspace
        </Badge>
      </div>

      {/* Right: MCP status + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/5 px-3 py-1">
          <Plug className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium text-success">MCP Ready</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
