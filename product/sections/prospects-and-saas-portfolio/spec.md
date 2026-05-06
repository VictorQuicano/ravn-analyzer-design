# Prospects & SaaS Portfolio Specification

## Overview
The Portfolio surface is the per-project workspace where a Ravn rep captures everything about a prospect's SaaS footprint — branded intake of company facts, the working list of SaaS apps in the portfolio, structured contract/financial details per app (with PDF upload + AI extraction), and a lightweight catalog autocomplete that pre-populates feature checklists. It lives under the project's "Portfolio" tab and is the data spine that feeds Surveys, Opportunities, and Proposals downstream.

## User Flows
- Land on the Portfolio tab and read the project header — company name + logo, intake source (rep-guided vs. self-service form), captured spend, app count, average utilization, and the next renewal across the portfolio.
- Pick an intake method from the empty/early state: send the prospect a branded intake URL, paste a CSV from their finance team, or add SaaS apps manually one at a time.
- Use the topnav `+ Add SaaS` button to open a right-side Sheet — autocomplete by typing a SaaS name, see catalog suggestions with vendor + logo + pre-populated feature checklist, optionally fall back to a free-form entry with website URL.
- Bulk-import a SaaS list from CSV via an "Import CSV" action — drop a file, see a preview table with column-matching dropdowns, dry-run validation errors inline, then commit the import.
- Scan the SaaS list as a card grid: each card shows logo, vendor, category, departments, license count, annual cost, contract end date with renewal countdown, AI-extraction status pill, and a Rip-readiness chip indicating whether enough data has been captured.
- Filter the list by category, contract status (active / renewing / expired / draft), AI extraction state, and department; sort by spend / renewal date / utilization.
- Click a SaaS card to open its detail Sheet — structured contract & financial form on the right, PDF preview on the left when a contract is uploaded, with an "AI extract" button that pulls cost / seats / billing cadence / contract end date / custom terms from the PDF and stages them as suggested values the rep accepts or edits.
- Upload (or replace) a contract PDF directly from the SaaS card's three-dot menu without entering the detail Sheet — drag-drop or browse, watch the AI extraction status transition (queued → extracting → ready-for-review → confirmed).
- See the SaaS Catalog autocomplete pre-populate a feature checklist when a known app is selected (e.g., Salesforce → Lead capture, Workflow automation, Reporting, Mobile app, …). Toggle which features are actually used at this prospect.
- Send a contract-upload link to a finance contact at the prospect company from the SaaS card menu, so the contact can drop a PDF without needing access to the workspace.
- Use the row's three-dot menu for fast actions: open detail, request contract, mark as not-in-use, duplicate, archive.
- Review the AI-extraction queue strip at the top of the list when extractions are pending or need review — quick-jump links to each app awaiting confirmation.

## UI Requirements
- Inside-shell screen — uses Analyzer's sidebar + topnav. `useTopNav` injects NavbarSearch ("Search apps…"), NavbarFilterButton (category / contract status / extraction state / department), and a primary `+ Add SaaS` button into the topnav actions slot.
- Project context strip directly under the topnav: company avatar, project name, intake source pill (Branded form / Rep-guided), 4 KPI tiles (Apps captured, Annual spend, Avg utilization, Next renewal in N days). Tiles use IBM Plex Mono tabular-nums for the values.
- Intake-method card row below the context strip — three side-by-side cards: "Send branded intake form" (copy public URL / send via Slack), "Bulk CSV import" (drag-drop upload zone), "Add manually" (opens the Add SaaS Sheet). Cards collapse into compact pills once the portfolio has any apps.
- AI extraction queue strip — a thin band that appears when one or more contracts are pending review, with a "Review N extractions" CTA. Hidden when queue is empty.
- SaaS list rendered as a responsive card grid (1 col mobile / 2 col tablet / 3 col desktop). Each card shows: logo tile (with fallback initial), name + vendor, category pill, department tags, annual cost (mono, tabular-nums), license count, contract end date with a renewal countdown badge (90/60/30 day urgency banding using rose/amber/sky/lime), AI-extraction status pill (Pending / Extracting / Ready / Confirmed / Manual / Failed), and a Rip-readiness chip (Ready / Needs data / Missing contract).
- Card-hover reveals a vertical three-dot menu (`MoreVertical`, `opacity-0 group-hover/card:opacity-100 data-[state=open]:opacity-100`) right-aligned with actions: Open detail, Upload contract, Request contract, Toggle features, Duplicate, Archive.
- Renewal countdown banding: Overdue (rose), 0–30d (amber), 31–60d (sky), 61–90d (lime), 90+ (stone/muted). Uses the same color language as Pipeline Dashboard renewals.
- AI-extraction status pill colors: Pending (stone), Extracting (sky animated), Ready for review (amber), Confirmed (lime), Manual entry (violet), Failed (rose).
- Category pills use a stable hashed palette (productivity, sales, marketing, support, finance, dev, data, design, hr, security) so the same category always reads the same color across the workspace.
- Empty state — when the project has zero apps: large dashed-border card with the three intake-method cards full-width, headline "Capture this prospect's SaaS footprint", supportive copy, and a small "Why does this matter?" link that hints at downstream Rip Score gating.
- Filter empty state — when filters return zero matches: muted message "No SaaS apps match these filters" with a "Clear filters" button.
- Light + dark mandatory using Tailwind v4 semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-muted`, `bg-popover`).
- Mobile-responsive: project context strip collapses tiles to 2 cols; intake-method cards stack vertically; SaaS card grid becomes single column; topnav search/filter shrink to icon-only.
- Forms (Add SaaS, SaaS detail edit, Bulk CSV import preview) all open in right-side `Sheet` components — never modals — and are NOT rendered inside this view; the section exposes callbacks (`onAddSaas`, `onUploadContract`, `onImportCsv`, `onOpenSaas`, `onRequestContract`, `onToggleFeatures`, `onSendIntakeLink`) so the host shell or preview wrapper handles Sheet rendering.

## Configuration
- shell: true
