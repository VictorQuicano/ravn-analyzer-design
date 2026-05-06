# Proposals Specification

## Overview
The Proposals section is the consultant-grade builder and viewer for the per-project deliverable Ravn ships to a prospect. It composes a published proposal from six required sections (executive summary, current-state analysis, "Ravn alternative", year-by-year financial comparison, risk mitigation, engagement options), supports web-share / PDF / Google Slides export, and tracks every recipient open with an event feed that fires owner notifications.

## User Flows
- **Browse proposals for the project** — Land on the Proposals tab and see the list of proposals already drafted or sent for this project, with status (draft / ready / sent / viewed / accepted), version, and last-view summary.
- **Create a new proposal** — Click "New proposal" to start a draft seeded from the project's BuildScopes; immediately enter the builder.
- **Open a proposal in the builder** — Click a row in the list and the builder takes over the surface: left section navigator, center content panel, right meta panel.
- **Edit a section** — Click a section in the navigator (Executive Summary, Current State, Ravn Alternative, Financial Comparison, Risk Mitigation, Engagement Options) and edit content inline; navigator shows completion state for each.
- **Edit the year-by-year financial comparison** — Adjust per-year baseline (current SaaS spend) vs. Ravn alternative (build + maintenance) numbers; cumulative savings recompute and a side-by-side bar chart updates inline.
- **Add / edit engagement options** — Define two or three engagement tiers (e.g. Discovery Sprint, Full Build, Build + Run) with bullet scope and price; recipient picks one when the proposal is accepted.
- **Preview the recipient web view** — Toggle "Preview" to see the published web view exactly as the recipient would.
- **Publish & generate share link** — Mark the proposal as ready and copy the share URL (token-scoped). Re-publish creates a new version.
- **Export to PDF** — Generate a PDF and download or copy a signed link.
- **Export to Google Slides** — Push the proposal to a generated Google Slides deck and open it.
- **Watch view-tracking events stream in** — The right meta panel lists every recipient open in reverse-chronological order with timestamp, viewer email (if known), device, and dwell time; new events surface a "Just viewed" pulse.
- **Re-send a proposal to a recipient** — Add or re-share a recipient email; system records a notification fired to the owner on each subsequent open.

## UI Requirements
- **List view** as a compact table (proposal title / status badge / last-view / total opens / engagement value / version), navigable from the Proposals project tab. Selecting a row enters the **builder view**.
- **Builder view layout (3-pane on desktop):**
  - **Left:** sticky section navigator (`w-60`) listing the six required sections plus a small "Cover" entry; each row shows title, status dot (complete / in-progress / empty), and word count. Active section is highlighted with `bg-sidebar-accent` and a 2px lime left rule.
  - **Center:** scrollable content canvas (`max-w-3xl mx-auto`) rendering the active section as it would appear to the recipient — typography hierarchy is the design's hero (DM Sans display headlines, generous leading, IBM Plex Mono callouts for numbers).
  - **Right:** sticky meta panel (`w-80`) with three stacked cards: *Status & Share* (status badge, share URL with copy button, version number, recipients list), *Recipients* (avatar list with last-open and total opens), *View Activity* (reverse-chrono event feed with relative timestamps and dwell badges).
- **Navbar pattern (via `useTopNav`):** breadcrumb shows `Pipeline / [Project Name] / Proposals`; right-aligned actions render a status badge, **Preview**, **Share link** (icon + copy), **Export PDF** and **Export Slides** buttons in that order. Three-dot vertical menu provides Duplicate / Archive / Delete.
- **Financial comparison section** is the showpiece: a year-by-year side-by-side bar chart (Current SaaS spend vs Ravn alternative across years 1–5), a cumulative savings KPI strip (`Total saved`, `Payback in months`, `5-yr ROI`), and a granular table editable inline. All currency uses `font-mono` (IBM Plex Mono) with `tabular-nums`.
- **Engagement options section** is rendered as 2–3 tier cards in a row with name, monthly price, total contract value, "Best for" subtitle, and bullet scope; each card has a "Recommend" toggle that promotes that tier for the recipient.
- **Status badge tokens:** Draft (stone), Ready (amber), Sent (sky), Viewed (lime/chart-1), Accepted (emerald), Archived (muted).
- **View Activity event item:** vertical timeline rail with a colored dot, line 1 shows `Opened by [recipient]` with a relative time (e.g. "2 min ago"), line 2 shows device + dwell time as muted text. A pulsing lime dot marks events from the last 60 seconds.
- **Empty states:** when no proposals exist, show a centered illustration + "Generate your first proposal" CTA seeded by the project's BuildScopes; when a section has no content, the canvas shows a dotted-border placeholder with "Generate from BuildScope" + "Write manually".
- **Forms (rename, archive confirmation, recipient invite, export):** all open in a right-side `Sheet` per the analyzer convention; never a modal. Confirmation prompts use `AlertDialog`.
- **Responsive behavior:**
  - Tablet (768–1023px): right meta panel collapses to an "Activity" button that opens an off-canvas drawer; section navigator stays visible.
  - Mobile (<768px): section navigator becomes a horizontal scrollable strip pinned under the topnav; meta panel is reachable via a floating action button.
- **Light & dark mode:** all surfaces use semantic tokens (`bg-card`, `bg-background`, `bg-sidebar`, `text-muted-foreground`, `border-border`, `bg-sidebar-accent`); chart bars use `chart-1` (lime) for Ravn alternative and `chart-2` (teal) for current SaaS.
- **Typography:** DM Sans for headings + body; `font-mono` (IBM Plex Mono) reserved for currency, percentages, version numbers, and event timestamps. Section headings use a hairline rule beneath them.
- **Keyboard:** `J` / `K` jumps between proposal sections; `⌘ K` opens command palette (out of scope here but reserved); `⌘ /` toggles the meta panel.

## Configuration
- shell: true
