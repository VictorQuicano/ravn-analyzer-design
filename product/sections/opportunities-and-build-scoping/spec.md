# Opportunities & Build Scoping Specification

## Overview
The Opportunities surface is where the BD rep dissects a project's SaaS portfolio one app at a time — reading the 0–100 Rip Score, the six factor sub-scores that produced it, redundancy callouts that group overlapping tools by category, and the AI-generated build scope (narrative, complexity-tagged feature list, integration plan, tech stack, team composition, cost range, and a week-by-week timeline). It is the bridge between raw survey data and a sales-ready proposal: every claim a Partner makes in the meeting traces back to a number visible on this screen.

## User Flows
- Open a project's "Opportunities" tab and land on the highest-scoring (Hot) Rip Opportunity by default.
- Scan the left list rail to see every SaaS app in the project ranked by Rip Score, color-coded by tier (Hot / Warm / Lukewarm / Cold), and click any row to swap the detail view.
- Filter the list rail by tier (toggle Hot / Warm / Lukewarm / Cold chips) or search by app name.
- Read the Rip Score hero: a large monospaced 0–100 number, tier badge, blended-confidence indicator, and a one-line headline ("Strong rip candidate — high spend, low utilization, contract due in 47 days").
- Drill into the Factor Breakdown — six weighted bars (Cost, Utilization, Feature Concentration, Pain, Replacement Tolerance, Renewal Timing) showing each factor's sub-score, weight, and one-sentence evidence string. Hover a bar to see the inputs that produced it.
- Open the Redundancy panel to see this app's category taxonomy and any overlapping apps in the same project ("Slack overlaps with Microsoft Teams in Communication") with cumulative redundant spend.
- Read the AI-generated Build Scope: narrative paragraph, feature list with complexity chips (Trivial / Standard / Complex / Hard), integrations grid, recommended tech stack (frontend / backend / data / infra), team composition (roles + counts + duration), USD cost range with low/likely/high, and a horizontal week-by-week timeline.
- Toggle a "Compare to current spend" callout in the build-scope summary that flips the cost range into a side-by-side vs. annual contract value.
- Use the row's three-dot menu in the list rail for fast actions: pin to proposal, mark as not-pursuing, regenerate build scope, copy share link.
- Use the topnav action button to "Add to proposal" — bundles the active opportunity into the project's draft proposal.
- Regenerate the build scope from the hero ribbon when survey inputs change; the screen flashes a "Generating…" state and replaces sections in-place.

## UI Requirements
- Inside-shell screen — Analyzer's sidebar + topnav + project tab strip. `useTopNav` injects a small "Opportunity" breadcrumb chip, a search input ("Search opportunities…"), a tier-filter button (multi-select Hot/Warm/Lukewarm/Cold), and a primary "Add to proposal" button into the topnav actions slot.
- Two-pane layout on desktop: a fixed-width left rail (`w-72 lg:w-80`) listing every SaaS opportunity sorted by Rip Score, and a flex-1 detail pane on the right that scrolls independently. On tablet the rail collapses to a top horizontal scroller; on mobile the rail becomes a sheet trigger.
- List rail rows show: app name, Rip Score badge (mono, tabular-nums), tier dot, annual spend, days-to-renewal, and a row-hover three-dot menu (`MoreVertical`, right-aligned).
- Detail hero ("RipScoreHero"): full-width card stack at the top of the pane. Left side has the score number (IBM Plex Mono, 6xl tabular-nums), a tier pill (Hot=rose / Warm=amber / Lukewarm=sky / Cold=stone), a confidence chip ("Confidence 84%"), and a one-line headline. Right side shows three at-a-glance stats: Annual Spend (mono USD), Annual Waste estimate (mono USD with rose tint), and Days-to-renewal (mono with amber tint when ≤90, rose when overdue). A subtle ring-gauge SVG behind the number reinforces the 0–100 reading.
- Factor Breakdown ("FactorBreakdown") — a card with six rows, one per factor: factor name, sub-score badge (mono 0–100), weight chip (mono "× 0.25"), a horizontal lime-tinted progress bar (filled to sub-score), and a one-sentence evidence string. Header shows the weighted sum (`Σ = 78.3`) in mono. Each row is `aria-label`-friendly and keyboard-focusable for hover details.
- Redundancy Panel ("RedundancyPanel") — a card grouping overlapping apps by category (Communication / CRM / Project Management / etc.). Each group shows the category name, total redundant spend in mono USD, the active app highlighted with a lime ring, and sibling apps with their per-app spend. Empty state: "No overlapping tools detected in this project."
- Build Scope Stack ("BuildScopeStack") — sectioned card with horizontal section dividers; each section uses an uppercase tracking-wider eyebrow and a tight content block:
  - **Narrative** — single paragraph (≈3–4 sentences), italic display weight, soft muted-foreground tone.
  - **Feature list** — vertically stacked rows; each row has a complexity chip (Trivial=stone / Standard=sky / Complex=amber / Hard=rose), feature title, and a one-line description. Footer aggregates by complexity: e.g. "12 features · 3 Hard · 5 Complex · 4 Standard".
  - **Integrations** — chips grid showing each integration name and a "via" label (REST API / OAuth / Webhook / SDK). Hover reveals the data direction (in / out / both).
  - **Tech stack** — four labeled columns (Frontend / Backend / Data / Infra). Each column lists 2–4 stack items in mono.
  - **Team & duration** — table-like grid: role, count, duration (weeks), shorthand cost (mono USD). Footer row sums to "Team total" with FTE-weeks and cost.
  - **Cost range** — three monospaced values side-by-side (Low / Likely / High) with a soft horizontal bar showing the spread, and a small "vs. annual contract value" toggle that overlays the current SaaS spend as a marker on the same bar.
  - **Timeline** — horizontal lane of weeks (W1…Wn), each phase rendered as a stacked bar across its weeks (Discovery=stone / Build=lime / Hardening=amber / Launch=violet); below the lane, the milestone markers ("Kickoff", "MVP demo", "GA") sit on tick marks. Mobile fallback: vertical phase list with week ranges.
- Stat values (Rip score, sub-scores, weights, USD figures, week numbers, durations, percentages) all use IBM Plex Mono with `tabular-nums`.
- Light + dark mode mandatory using Tailwind v4 semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-muted`, `bg-popover`).
- Mobile-responsive: list rail becomes a top trigger button that opens a sheet; hero stats stack vertically; factor bars stay full-width; build-scope timeline collapses to a vertical list; tech stack and team grid drop to single column.
- Empty states: if no opportunities have been scored yet, the detail pane shows a guidance card ("Run the Tool Intake & Usage surveys to score this project's apps"). If a build scope hasn't been generated, the BuildScopeStack shows a single CTA card ("Generate build scope") with a one-line description of what will happen.
- Loading states: the hero shows a shimmer line for the score; the build-scope sections each show 2–3 skeleton lines tagged with their section eyebrow ("Generating narrative…", "Drafting feature list…").
- Tier-color discipline: Hot = rose, Warm = amber, Lukewarm = sky, Cold = stone — must match Pipeline Dashboard exactly so the same prospect feels visually consistent across screens.

## Configuration
- shell: true
