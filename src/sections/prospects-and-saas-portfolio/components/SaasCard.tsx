import { useEffect, useRef, useState } from "react"
import {
  Archive,
  ArrowRightCircle,
  Copy,
  ExternalLink,
  ListChecks,
  Mail,
  MoreVertical,
  Upload,
  Users,
} from "lucide-react"

import type {
  SaasAction,
  SaasApplication,
  SaasCategory,
} from "../../../../product/sections/prospects-and-saas-portfolio/types"
import { AiExtractedBadge } from "./AiExtractedBadge"
import { RenewalCountdown } from "./RenewalCountdown"
import { ContractStatusPill, RipReadinessChip } from "./StatusPill"

const CATEGORY_LABEL: Record<SaasCategory, string> = {
  productivity: "Productivity",
  sales: "Sales",
  marketing: "Marketing",
  support: "Support",
  finance: "Finance",
  dev: "Dev",
  data: "Data",
  design: "Design",
  hr: "HR",
  security: "Security",
  other: "Other",
}

const CATEGORY_CLASSES: Record<SaasCategory, string> = {
  productivity:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
  sales:
    "bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900/60",
  marketing:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60",
  support:
    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60",
  finance:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60",
  dev: "bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-900/60",
  data: "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60",
  design:
    "bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:ring-fuchsia-900/60",
  hr: "bg-teal-50 text-teal-800 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60",
  security:
    "bg-lime-50 text-lime-900 ring-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:ring-lime-900/60",
  other:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:ring-stone-700",
}

function fmtUsd(amount: number): string {
  if (amount === 0) return "—"
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}M`
  if (amount >= 1_000)
    return `$${(amount / 1_000).toFixed(amount >= 100_000 ? 0 : 1)}K`
  return `$${amount}`
}

function logoColors(name: string): { from: string; to: string; text: string } {
  // Stable hash → palette pair. Keeps each app card visually distinct.
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  const palettes = [
    { from: "from-violet-200", to: "to-violet-300", text: "text-violet-800" },
    { from: "from-sky-200", to: "to-sky-300", text: "text-sky-800" },
    { from: "from-amber-200", to: "to-amber-300", text: "text-amber-900" },
    { from: "from-rose-200", to: "to-rose-300", text: "text-rose-800" },
    { from: "from-lime-200", to: "to-lime-300", text: "text-lime-900" },
    { from: "from-fuchsia-200", to: "to-fuchsia-300", text: "text-fuchsia-800" },
    { from: "from-emerald-200", to: "to-emerald-300", text: "text-emerald-900" },
    { from: "from-indigo-200", to: "to-indigo-300", text: "text-indigo-800" },
    { from: "from-teal-200", to: "to-teal-300", text: "text-teal-900" },
    { from: "from-stone-200", to: "to-stone-300", text: "text-stone-800" },
  ]
  return palettes[hash % palettes.length]
}

interface SaasCardProps {
  app: SaasApplication
  onOpen?: () => void
  onAction?: (action: SaasAction) => void
}

export function SaasCard({ app, onOpen, onAction }: SaasCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [menuOpen])

  const palette = logoColors(app.name)
  const utilizationPct = Math.round(app.utilization * 100)

  return (
    <article
      className="group/card bg-card hover:border-stone-300 dark:hover:border-stone-700 relative flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-all hover:shadow-sm"
      onClick={onOpen}
    >
      {/* Header: logo + name + status pill + menu */}
      <header className="flex items-start gap-3">
        <div
          className={`bg-gradient-to-br ${palette.from} ${palette.to} flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold ${palette.text} dark:from-stone-700 dark:to-stone-800 dark:text-stone-300`}
          aria-hidden
        >
          {app.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-foreground truncate text-sm font-semibold leading-tight">
              {app.name}
            </h3>
            <a
              href={app.websiteUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground/60 hover:text-foreground shrink-0 transition-colors"
              aria-label={`Visit ${app.name} website`}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-muted-foreground truncate text-[11px]">
            {app.vendorName}
          </p>
        </div>

        <div
          className="relative shrink-0"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className={`text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 w-8 items-center justify-center rounded-md transition-opacity group-hover/card:opacity-100 ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label={`${app.name} actions`}
            aria-expanded={menuOpen}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="bg-popover border-border absolute right-0 top-full z-30 mt-1 w-52 rounded-md border py-1 shadow-lg">
              <RowMenuItem
                icon={<ArrowRightCircle className="h-3.5 w-3.5" />}
                label="Open detail"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("open")
                }}
              />
              <RowMenuItem
                icon={<Upload className="h-3.5 w-3.5" />}
                label="Upload contract"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("upload-contract")
                }}
              />
              <RowMenuItem
                icon={<Mail className="h-3.5 w-3.5" />}
                label="Request contract"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("request-contract")
                }}
              />
              <RowMenuItem
                icon={<ListChecks className="h-3.5 w-3.5" />}
                label="Toggle features"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("toggle-features")
                }}
              />
              <div className="bg-border my-1 h-px" />
              <RowMenuItem
                icon={<Copy className="h-3.5 w-3.5" />}
                label="Duplicate"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("duplicate")
                }}
              />
              <RowMenuItem
                icon={<Archive className="h-3.5 w-3.5" />}
                label="Archive"
                tone="destructive"
                onClick={() => {
                  setMenuOpen(false)
                  onAction?.("archive")
                }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Pills row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${CATEGORY_CLASSES[app.category]}`}
        >
          {CATEGORY_LABEL[app.category]}
        </span>
        <ContractStatusPill status={app.contractStatus} />
        <RipReadinessChip readiness={app.ripReadiness} />
      </div>

      {/* Cost + utilization */}
      <div className="border-border grid grid-cols-2 gap-3 rounded-md border bg-stone-50/60 p-3 dark:bg-stone-900/40">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Annual cost
          </span>
          <span className="text-foreground font-mono text-base font-semibold tabular-nums">
            {fmtUsd(app.contract.annualCost)}
          </span>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
            <Users className="h-3 w-3" />
            <span className="font-mono tabular-nums">
              {app.contract.licenseCount}
            </span>{" "}
            seat{app.contract.licenseCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
            Utilization
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground font-mono text-base font-semibold tabular-nums">
              {utilizationPct}%
            </span>
            <span className="text-muted-foreground font-mono text-[10px] tabular-nums">
              of seats
            </span>
          </div>
          <UtilizationBar value={app.utilization} />
        </div>
      </div>

      {/* Footer: renewal + extraction + departments */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RenewalCountdown
          endDate={app.contract.contractEndDate}
          daysUntil={app.contract.daysUntilRenewal}
        />
        <AiExtractedBadge status={app.aiExtraction} size="sm" />
      </div>

      {app.departments.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {app.departments.slice(0, 4).map((dept) => (
            <span
              key={dept}
              className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
            >
              {dept}
            </span>
          ))}
          {app.departments.length > 4 && (
            <span className="text-muted-foreground rounded px-1 py-0.5 font-mono text-[9px]">
              +{app.departments.length - 4}
            </span>
          )}
        </div>
      )}
    </article>
  )
}

function UtilizationBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  // Low utilization is a feature, not a bug, in Analyzer — color it as a "rip signal".
  const tone =
    value < 0.3
      ? "bg-rose-500"
      : value < 0.55
        ? "bg-amber-500"
        : value < 0.8
          ? "bg-sky-500"
          : "bg-lime-500"
  return (
    <div className="bg-muted h-1 overflow-hidden rounded-full">
      <div
        className={`${tone} h-full rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function RowMenuItem({
  icon,
  label,
  tone = "default",
  onClick,
}: {
  icon: React.ReactNode
  label: string
  tone?: "default" | "destructive"
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm ${
        tone === "destructive"
          ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
          : "hover:bg-muted"
      }`}
    >
      <span
        className={
          tone === "destructive"
            ? "text-rose-500 dark:text-rose-400"
            : "text-muted-foreground"
        }
      >
        {icon}
      </span>
      {label}
    </button>
  )
}
