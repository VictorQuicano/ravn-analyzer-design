# Pipeline Dashboard Specification

## Overview
The Pipeline Dashboard is the BD rep's home surface — the one-screen "is the pipeline healthy?" answer. It consolidates four headline KPIs, the active prospect/project list, an opportunity kanban grouped by sales stage, and a renewal calendar that flags contracts coming up in the next 90/60/30 days so reach-out timing is intentional.

## User Flows
- Land on the dashboard and read the four stat cards (prospects, spend analyzed, opportunities, engagement value) at a glance with deltas vs. last period.
- Scan the prospect list, filter by owner / pipeline stage / heat tier / industry, and click a row to open that project's workspace.
- Search any prospect by name from the topnav search to find an in-flight project quickly.
- Switch the lower workspace between Kanban view (opportunities by stage) and Renewals view (calendar of upcoming renewals) using a tabbed toggle.
- Drag-or-tap an opportunity card between kanban columns (identified → proposal generated → sent → viewed → meeting scheduled) and see the column subtotals update.
- Open the row's three-dot menu to perform fast actions: open project, mark as won/lost, reassign owner, archive.
- Scroll the renewal calendar laterally and see prospects bucketed into 90/60/30-day urgency bands, with overdue renewals flagged separately.
- Tap a renewal entry to jump straight into that project's portfolio scoped to that SaaS app.
- Use the topnav `+ New prospect` button to start a new project intake from anywhere on the dashboard.

## UI Requirements
- Inside-shell screen — uses Analyzer's sidebar + topnav. `useTopNav` injects NavbarSearch ("Search prospects…"), NavbarFilterButton (owner / stage / heat / industry), and a primary "New prospect" button into the topnav actions slot.
- Four stat cards in a responsive grid (1 col mobile / 2 col tablet / 4 col desktop). Each card shows: label, large monospaced value, sublabel, signed delta vs. previous 30 days with a small sparkline.
- Stat values that are monetary or count metrics use IBM Plex Mono, tabular-nums.
- Prospect table with columns: Company, Owner (avatar + initials), Stage badge, Heat tier badge (Hot/Warm/Lukewarm/Cold), Annual Spend, Rip Score, Next Renewal, Last Activity. Row-hover shows a vertical three-dot menu (right-aligned, `MoreVertical`).
- Stage badges use a consistent color-coded pill: identified (stone), proposal-generated (amber), sent (sky), viewed (violet), meeting-scheduled (lime).
- Heat tier badges: Hot (rose), Warm (amber), Lukewarm (sky), Cold (stone).
- Lower workspace is a tabbed module with two views: "Kanban" and "Renewals". Default = Kanban.
- Kanban columns: Identified, Proposal Generated, Sent, Viewed, Meeting Scheduled. Each column has a header with stage label, count, and total engagement value. Cards show prospect name, ownership avatar, engagement value, days-in-stage, and a small Rip score chip.
- Renewal calendar groups upcoming renewals into urgency bands: Overdue (rose), 0–30 days (amber), 31–60 days (sky), 61–90 days (lime). Each renewal entry shows: prospect, SaaS app, contract value, renewal date, days-until.
- Light + dark mode mandatory using Tailwind v4 semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-muted`).
- Mobile-responsive: stat grid collapses to single column, table becomes a horizontally scrollable card list, kanban becomes vertical-scroll cards-per-stage with sticky stage header, renewal bands stack vertically.
- Empty states: an empty kanban column shows a soft dashed slot ("Drag opportunities here"). Empty renewal band shows "No renewals in this window".

## Configuration
- shell: true
