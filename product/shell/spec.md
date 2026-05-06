# Application Shell Specification

## Overview
Analyzer's shell is a workspace chrome optimized for Ravn BD reps as the daily-driver persona. It mirrors the existing Ravn `analyzer` Next.js app: a left sidebar for top-level navigation, a topnav strip with breadcrumbs and page-injected actions, and a content area that hosts each section's screens. When a Project is active, a tab bar appears directly under the topnav exposing the four per-project surfaces (Portfolio, Surveys, Opportunities, Proposals). All forms open in a right-side Sheet — never a modal.

## Navigation Structure

**Sidebar (top-level — visible always):**
- Logo + app name "Analyzer" (LineChart icon)
- **Pipeline** — Pipeline Dashboard (default landing surface). Stat cards, prospect list, kanban, renewal calendar.
- **Catalog** — SaaS Catalog master reference. Pre-populated feature checklists used as autocomplete when adding a SaaS to a project.
- **Settings** — Workspace settings, team access, integrations.

**Project-scoped inner tabs (visible only when a Project is open):**
A tab strip rendered directly under the topnav with the four per-project surfaces:
- **Portfolio** — Project's SaaS list, intake form, contract upload.
- **Surveys** — Tool Intake / Financial / Usage surveys + responses for this project.
- **Opportunities** — Per-SaaS Rip Score, redundancy callouts, AI build scope.
- **Proposals** — Proposal builder, web/PDF/Slides export, view tracking for this project.

**Breadcrumbs** in the topnav read: `Pipeline / [Project Name]` (the active tab is implied by the tab bar, not the breadcrumb — keeps the breadcrumb compact).

## User Menu
- **Location:** Bottom of the sidebar (collapses with the sidebar in icon-only mode). Mirrors the analyzer app pattern — avatar + name + email row that opens a dropdown.
- **Contents:** User name, email, theme toggle (light / dark / system), Sign out.
- The theme toggle lives inside the user-menu dropdown (no standalone toggle in the topnav).

## Layout Pattern
- Outer container: `flex h-screen overflow-hidden`.
- **Left sidebar:** fixed width (`w-64` expanded, `w-16` collapsed), full height, scrolls independently. Section group headings use uppercase tracking-wide muted text.
- **Right column:** `flex flex-1 flex-col overflow-hidden`.
  - **Topnav** (`h-14`): breadcrumbs left, page-injected actions right. The actions slot is wired through a `useTopNav` context so each screen pushes its own search/filter/create button into the topnav.
  - **Project tabs strip** (conditional, `h-12`): underline-style tabs, full-width with horizontal padding matching the content area.
  - **Main content** (`flex-1 overflow-auto`): sections render here.
- All forms (create / edit / add) open in a right-side `Sheet` (never a modal). `AlertDialog` only for terminal yes/no confirmations.

## Responsive Behavior
- **Desktop (≥1024px):** sidebar expanded by default with text labels; topnav full breadcrumbs; project tabs render inline.
- **Tablet (768–1023px):** sidebar collapses to icon-only by default but expandable; topnav shrinks search and filter buttons to icon-only.
- **Mobile (<768px):** sidebar becomes an off-canvas drawer triggered by a hamburger button in the topnav; project tabs become a horizontally scrollable strip with snap; user menu reachable via the avatar in the topnav (since the sidebar is hidden).

## Design Notes
- **Tokens:** stone primary, lime secondary, stone neutral. Both light + dark mandatory. Use `bg-background`, `text-foreground`, `border-border`, `bg-sidebar`, `bg-card` semantic tokens (Tailwind v4 / shadcn integration via `index.css`).
- **Active state:** active sidebar item gets `bg-sidebar-accent text-sidebar-accent-foreground`; active tab gets a 2px lime underline (matches `chart-1` accent).
- **Sticky chrome:** topnav and project-tabs strip are sticky to the top of the content column. The sidebar is independently scrollable from the content.
- **Shape & rhythm:** 0.5rem base radius (`--radius`); compact density (sidebar items `h-9`, topnav `h-14`); generous left/right content padding (`px-6` desktop).
- **Icons:** `lucide-react` exclusively. Sidebar item icons render at `h-4 w-4` next to label (or `h-5 w-5` when collapsed).
- **Typography:** DM Sans for both heading and body; IBM Plex Mono only for monetary values, scores, and tabular numbers in content.
- **Keyboard:** sidebar items focusable, tab order top-to-bottom; topnav search opens with `/`; project tabs navigable with Left/Right arrow keys when focused.
