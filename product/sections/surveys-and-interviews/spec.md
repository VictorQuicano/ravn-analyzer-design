# Surveys & Interviews Specification

## Overview
Surveys & Interviews is the per-project hub where reps run the three magic-link instruments — Tool Intake, Financial, and Usage — and review the responses streaming back. It surfaces send/resend/copy-link controls for each survey type, public Slack-blast links, completion + progress telemetry across respondents, plus reviewer-only surfaces for surfacing standout quotes and uploading follow-up call transcripts. Lives behind the **Surveys** project tab.

## User Flows
- Land on the Surveys tab and read three large survey-type cards (Tool Intake, Financial, Usage), each with response counts, completion rate, last-response timestamp, and a primary action (Copy public link / Open send sheet).
- Click "Send" on a survey card to open a right-side sheet that lists the project's respondents, picks who receives a magic link, and triggers send/resend with a delivery confirmation toast.
- Copy the public blast link for a survey to paste into Slack, and see a "Public link ON · 14 starts" indicator on the card with a kill-switch to revoke it.
- Toggle between three filtered views of the responses table: All responses, By respondent, By survey type.
- See per-row progress: a thin progress bar and "step 4 of 7" sublabel when a response is in-progress (server-side resume), plus a clear "Submitted 12m ago" status when complete.
- Click a response row to drill into the full structured submission (out of scope for this view — the click fires `onOpenResponse`).
- Open the row's three-dot menu to perform fast actions: open response, copy magic link, resend invitation, mark as standout quote, archive.
- Promote any answer to a "Standout Quote" — pinned in the right-hand Quotes panel for proposal lift. Quotes show speaker, role, the quote text, and which survey/question it came from.
- Upload a follow-up call transcript (audio file or text paste) and see it land in the Transcripts table with respondent name, source (Zoom / Granola / paste), duration, status (uploaded → transcribing → ready → reviewed), and a link to the project respondent.
- Search responses by respondent name, email, or quote substring from the topnav search.
- Filter the responses table by survey type, status (in-progress / submitted / overdue), and respondent role using the navbar filter button.
- Use the topnav `+ New invite` button to open a sheet that combines respondent creation + survey-type pick + magic link send into a single flow.

## UI Requirements
- Inside-shell screen — uses Analyzer's sidebar + topnav under the active Project's tab strip with **Surveys** active. `useTopNav` injects: NavbarSearch ("Search responses…"), NavbarFilterButton (survey type / status / role), and a primary "New invite" button.
- Three survey-type cards rendered in a responsive grid (1 col mobile / 3 col desktop). Each card shows: survey label + icon (Wrench/DollarSign/Activity), short description, large mono respondent count, completion percentage with a thin lime/amber progress bar, last-response timestamp, public-blast-link state (ON/OFF) with a copy button, and a primary action button. Subtle index glyph in the corner mirrors the StatCard style on Pipeline Dashboard.
- Responses table with columns: Respondent (avatar initials + name + email), Role (compact pill), Survey (Tool Intake / Financial / Usage badge with stage-style ring), Progress (bar + step counter when in-progress, "Submitted Xd ago" when complete, "Overdue Xd" rose when overdue), Submitted (date or em-dash), Sent via (magic-link / public-link icon), Last activity. Row-hover shows the vertical three-dot menu (`MoreVertical`, opacity 0 → 100 on row hover, `data-[state=open]:opacity-100`).
- Survey badges: Tool Intake (sky), Financial (amber), Usage (lime) — match the stage badge ring/pill pattern from Pipeline Dashboard.
- Status pills: in-progress (sky), submitted (lime), overdue (rose), not-started (stone).
- Right side panel "Standout Quotes" — sticky on desktop (xl: column), collapses below the table on mobile. Each quote card shows: a large left quote-mark glyph, the quote text in italics, attribution line ("— Sasha Park, Director of Engineering · Tool Intake Q5"), and a small "Pinned by Alex Morgan · 3d ago" footer. Empty state: dashed slot "Mark answers as standout to surface verbatim pain points here."
- Lower section "Follow-up Transcripts" — separate table with: Title, Respondent, Source (badge with logo glyph: Zoom / Granola / Paste / Upload), Duration (mono), Status (uploaded / transcribing / ready / reviewed), Uploaded (timestamp). Includes an inline upload dropzone bar above the table ("Drop a `.mp3`/`.m4a`/`.txt` here, or paste transcript").
- Light + dark mode mandatory using Tailwind v4 semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `border-border`, `bg-muted`).
- IBM Plex Mono (`font-mono tabular-nums`) for: response counts, completion percentages, step counters, durations, days-overdue, timestamps.
- Mobile-responsive: survey cards stack to single column, responses table becomes a horizontally scrollable card list, Standout Quotes drops below the table as a horizontal swipe carousel, transcripts table becomes single-column cards.
- Empty states: zero responses ("No responses yet — copy the public link or send an invite"), empty quotes panel (described above), empty transcripts ("No follow-up transcripts uploaded yet").
- All forms (send invite, new invite) open in right-side `Sheet` (never modal) — consistent with shell pattern.

## Configuration
- shell: true
