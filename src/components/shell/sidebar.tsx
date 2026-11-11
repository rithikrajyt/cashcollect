"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/app",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Receivables",
    href: "/app/receivables",
    icon: FileText,
  },
  {
    label: "Customers",
    href: "/app/customers",
    icon: Users,
  },
  {
    label: "Collections",
    href: "/app/collections",
    icon: Bell,
  },
  {
    label: "Reports",
    href: "/app/reports/receivables",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <Image
          src="/app-icon.svg"
          alt="CashCollect"
          width={34}
          height={34}
          className="rounded-lg shrink-0"
        />
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            CashCollect
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
            Finance OS
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-sidebar-foreground/60">
            MCP Endpoint Active
          </span>
        </div>
      </div>
    </aside>
  );
}
