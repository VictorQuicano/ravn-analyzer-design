import { ArrowUpRight, Check, Copy, FileUp, Globe, PlusCircle } from "lucide-react"
import { useState } from "react"

type IntakeKind = "branded-form" | "csv-import" | "manual"

interface BaseProps {
  kind: IntakeKind
  compact?: boolean
}

interface BrandedFormProps extends BaseProps {
  kind: "branded-form"
  url: string
  onSend?: () => void
  onCopy?: () => void
}

interface CsvImportProps extends BaseProps {
  kind: "csv-import"
  onImport?: () => void
}

interface ManualProps extends BaseProps {
  kind: "manual"
  onAdd?: () => void
}

type Props = BrandedFormProps | CsvImportProps | ManualProps

const ACCENT: Record<IntakeKind, { bg: string; ring: string; text: string }> = {
  "branded-form": {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-200 dark:ring-violet-900/60",
    text: "text-violet-800 dark:text-violet-300",
  },
  "csv-import": {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    ring: "ring-sky-200 dark:ring-sky-900/60",
    text: "text-sky-800 dark:text-sky-300",
  },
  manual: {
    bg: "bg-lime-50 dark:bg-lime-950/40",
    ring: "ring-lime-200 dark:ring-lime-900/60",
    text: "text-lime-900 dark:text-lime-300",
  },
}

export function IntakeMethodCard(props: Props) {
  const accent = ACCENT[props.kind]

  if (props.compact) {
    return <CompactPill {...props} />
  }

  if (props.kind === "branded-form") {
    return (
      <div className="bg-card group relative flex flex-col gap-3 overflow-hidden rounded-lg border p-4 transition-shadow hover:shadow-sm">
        <Header
          accent={accent}
          icon={<Globe className="h-4 w-4" />}
          eyebrow="Self-service"
          title="Send a branded intake form"
          description="The prospect's finance contact fills it in — apps, contracts, departments — and the data lands here."
        />
        <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-[11px]">
          <span className="truncate">{props.url}</span>
          <CopyUrlButton url={props.url} onCopy={props.onCopy} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={props.onSend}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-stone-900 px-3 text-xs font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Send via Slack
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  if (props.kind === "csv-import") {
    return (
      <button
        type="button"
        onClick={props.onImport}
        className="bg-card group relative flex w-full flex-col gap-3 overflow-hidden rounded-lg border border-dashed p-4 text-left transition-all hover:border-sky-400 hover:shadow-sm dark:hover:border-sky-700"
      >
        <Header
          accent={accent}
          icon={<FileUp className="h-4 w-4" />}
          eyebrow="Bulk"
          title="Drop a CSV from procurement"
          description="Map columns to apps, costs, renewal dates. Dry-run validates before commit."
        />
        <div className="border-border bg-muted/40 group-hover:border-sky-300 group-hover:bg-sky-50/40 dark:group-hover:border-sky-800 dark:group-hover:bg-sky-950/20 flex h-20 items-center justify-center rounded-md border border-dashed transition-colors">
          <div className="text-muted-foreground flex flex-col items-center gap-0.5 text-[11px]">
            <FileUp className="h-4 w-4" />
            <span>Drop CSV here or click to browse</span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={props.onAdd}
      className="bg-card group relative flex w-full flex-col gap-3 overflow-hidden rounded-lg border p-4 text-left transition-all hover:shadow-sm"
    >
      <Header
        accent={accent}
        icon={<PlusCircle className="h-4 w-4" />}
        eyebrow="One at a time"
        title="Add SaaS manually"
        description="Type a name — the catalog autocompletes vendor, logo, and the feature checklist."
      />
      <div className="text-muted-foreground inline-flex items-center gap-1.5 self-start text-[11px] font-medium">
        <span className="bg-muted rounded-md px-2 py-1">Open form</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </button>
  )
}

function Header({
  accent,
  icon,
  eyebrow,
  title,
  description,
}: {
  accent: { bg: string; ring: string; text: string }
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-1 ring-inset ${accent.bg} ${accent.ring} ${accent.text}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${accent.text}`}
        >
          {eyebrow}
        </span>
        <h3 className="text-foreground text-sm font-semibold leading-snug">
          {title}
        </h3>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function CopyUrlButton({ url, onCopy }: { url: string; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false)

  const handle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCopied(true)
    onCopy?.()
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button
      type="button"
      onClick={handle}
      className="text-muted-foreground hover:text-foreground hover:bg-background ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors"
      aria-label="Copy intake URL"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function CompactPill(props: Props) {
  const label =
    props.kind === "branded-form"
      ? "Branded form"
      : props.kind === "csv-import"
        ? "Import CSV"
        : "Add manually"
  const Icon =
    props.kind === "branded-form"
      ? Globe
      : props.kind === "csv-import"
        ? FileUp
        : PlusCircle

  const handler =
    props.kind === "branded-form"
      ? props.onSend
      : props.kind === "csv-import"
        ? props.onImport
        : props.onAdd

  return (
    <button
      type="button"
      onClick={handler}
      className="text-muted-foreground hover:text-foreground border-border bg-card hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
