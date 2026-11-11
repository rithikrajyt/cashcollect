import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageSquare,
  Plug,
  FileText,
  PenLine,
  Shield,
  Zap,
  IndianRupee,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/app-icon.svg"
              alt="CashCollect"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-foreground tracking-tight">
                CashCollect
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Finance OS
              </span>
            </div>
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5B4AE8] px-4 py-2 text-sm font-medium text-white hover:bg-[#4937D8] transition-colors"
          >
            Open Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#5B4AE8]/20 bg-[#F4F2FF] px-3 py-1 text-xs font-medium text-[#5B4AE8] mb-6">
                <Shield className="h-3 w-3" />
                No AI inside. Your Claude plan powers the intelligence.
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#151B2D] leading-[1.15] tracking-tight">
                Get paid on time.
                <br />
                Keep your finance
                <br />
                operations{" "}
                <span className="text-[#5B4AE8]">in control.</span>
              </h1>
              <p className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-lg">
                A Claude-connected finance workspace for invoices, collections
                and clearer books. Built for Indian SMEs who want to manage
                their money without the complexity of traditional accounting
                software.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5B4AE8] px-6 py-3 text-base font-semibold text-white hover:bg-[#4937D8] transition-colors shadow-lg shadow-[#5B4AE8]/25"
                >
                  Open Demo Workspace
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 text-base font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  How it Works
                </a>
              </div>
            </div>

            {/* Right: Hero illustration */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/hero-illustration.svg"
                alt="CashCollect finance dashboard with invoices, collections and receivables"
                width={600}
                height={450}
                className="w-full max-w-[560px] h-auto drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-[#F4F2FF]/50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatItem icon={FileText} value="9 MCP Tools" label="Claude can call" />
            <StatItem icon={Zap} value="₹0" label="AI cost for you" />
            <StatItem icon={IndianRupee} value="INR Native" label="Paise-accurate math" />
            <StatItem icon={Users} value="SME First" label="Indian B2B services" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#151B2D] mb-3">
              How CashCollect Works
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              Claude handles the thinking and writing. CashCollect stores,
              validates, and operates your finance workflows.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard
              step={1}
              icon={MessageSquare}
              title="Ask Claude"
              description={`Tell Claude what you need: "Create an invoice for ABC Technologies for software consulting, due in 15 days."`}
            />
            <StepCard
              step={2}
              icon={Plug}
              title="MCP Connects"
              description="Claude calls CashCollect through MCP. No AI API keys in your app. Your Claude plan pays for the intelligence."
            />
            <StepCard
              step={3}
              icon={FileText}
              title="Records Persist"
              description="CashCollect validates, calculates, and stores the invoice with proper line items, dates, and totals in the database."
            />
            <StepCard
              step={4}
              icon={PenLine}
              title="You Control"
              description="Open the dashboard, review the invoice, edit details, set up collection reminders, and issue when ready."
            />
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="bg-[#F8F7FF]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold text-[#151B2D] mb-4">
                Why not just use Claude alone?
              </h2>
              <p className="text-[#64748B] leading-relaxed">
                Claude is brilliant at understanding your requests and drafting
                content. But it cannot keep your invoices live on the internet,
                calculate your receivables ageing, or let your team edit and
                manage records after the chat ends.
              </p>
              <p className="text-[#64748B] leading-relaxed mt-4">
                CashCollect is the persistent operating system. It validates
                financial data, stores records in a real database, serves
                dashboards, runs collection schedules, generates PDF invoices,
                and produces deterministic reports.
              </p>
            </div>
            <div className="space-y-3">
              <FeatureRow
                title="Zero AI costs for you"
                description="No OpenAI, Anthropic, or AI API keys. The customer's own Claude plan powers the intelligence."
              />
              <FeatureRow
                title="Real financial data"
                description="Integer paise arithmetic, proper ageing calculations, audit trails, PDF invoices, and database persistence."
              />
              <FeatureRow
                title="Indian SME focused"
                description="INR formatting, Indian date conventions, GSTIN fields, and collection workflows built for B2B services."
              />
              <FeatureRow
                title="Human in control"
                description="Every record can be reviewed, edited, issued, and downloaded before any action is taken."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#151B2D] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <Image
            src="/app-icon.svg"
            alt=""
            width={56}
            height={56}
            className="mx-auto mb-6 rounded-xl"
          />
          <h2 className="text-2xl font-bold mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Open the demo workspace to explore the dashboard, or connect Claude
            via MCP to create invoices with natural language.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5B4AE8] px-6 py-3 text-base font-semibold text-white hover:bg-[#4937D8] transition-colors shadow-lg shadow-[#5B4AE8]/25"
          >
            Open Demo Workspace
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/app-icon.svg" alt="" width={20} height={20} className="rounded" />
            <span className="text-sm text-muted-foreground font-medium">
              CashCollect Finance OS
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for the Volopay Product &amp; Tech Assignment. No AI inside
            this application.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="h-5 w-5 text-[#5B4AE8] mb-1" />
      <span className="text-lg font-bold text-[#151B2D]">{value}</span>
      <span className="text-xs text-[#64748B]">{label}</span>
    </div>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-xl border border-[#E3DEFF] bg-white p-6 hover:shadow-md hover:shadow-[#5B4AE8]/5 transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F2FF] text-[#5B4AE8] text-sm font-bold">
          {step}
        </span>
        <Icon className="h-5 w-5 text-[#64748B]" />
      </div>
      <h3 className="text-sm font-semibold text-[#151B2D] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FeatureRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-[#E3DEFF] bg-white p-4">
      <CheckCircle2 className="h-5 w-5 text-[#25B879] shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-semibold text-[#151B2D] mb-0.5">{title}</h3>
        <p className="text-sm text-[#64748B]">{description}</p>
      </div>
    </div>
  );
}
