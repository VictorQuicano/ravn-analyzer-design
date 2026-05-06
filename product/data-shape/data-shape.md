# Data Shape

## Entities

### Project
The top-level engagement workspace for a single prospect company. Holds company profile, intake metadata, assigned Ravn owner, and is the container every other entity hangs off.

### SaasApplication
A specific SaaS tool tracked inside a Project — annual cost, license count, contract terms, renewal date, departments using it, and a link to its catalog reference. Each project has many of these and they are the unit of analysis.

### SaasCatalog
Master reference list of known SaaS products with vendor info and pre-populated feature checklists. Used as autocomplete when adding a tool to a project, separate from per-project SaasApplication instances.

### SurveyRespondent
A person inside the prospect company invited to share input — identified by email and optional role, scoped to a project. Replaces the older "PowerUser" concept so the same person can answer different survey types.

### Survey
A specific instrument sent out — Tool Intake, Financial, or Usage. Each survey is scoped to a project and (for Usage) optionally to a chosen subset of SaasApplications.

### SurveyResponse
A respondent's submission for one survey — structured answers stored as JSONB across the survey's sections, plus progress state for cross-device resume.

### Contract
The financial document attached to a SaasApplication — uploaded PDF plus AI-extracted fields (cost, seats, billing cadence, contract end date, custom terms). One per SaasApplication, optionally requested from a contact via upload link.

### RipOpportunity
The scored output for a SaasApplication — the 0–100 number, breakdown of the six weighted factors (cost, utilization, feature concentration, pain, replacement tolerance, renewal timing), tier (Hot / Warm / Lukewarm / Cold), and pipeline-stage status.

### BuildScope
The AI-generated replacement plan for a qualifying RipOpportunity — narrative, feature list with complexity ratings, integration plan, tech stack, team composition, cost range, and timeline.

### Proposal
The client-ready deliverable assembled from a Project's BuildScopes — executive summary, current state, financial comparison, risk mitigation, engagement options. Has a web share view, PDF, and Slides export.

### ProposalView
A tracking record fired each time a recipient opens a Proposal — timestamp, viewer fingerprint, dwell signal. Used to trigger owner notifications.

### RavnUser
An internal user with auth — assigned as owner on Projects and recipient of trigger notifications.

### Notification
An outbound trigger event — interview reminder, hot-lead Slack alert, renewal alert, proposal-view notification, or stale-opportunity nudge. Scoped to a project and routed to the relevant RavnUser.

## Relationships

- RavnUser owns many Project
- Project has many SaasApplication
- SaasApplication references one SaasCatalog
- Project has many SurveyRespondent
- Project has many Survey
- Survey has many SurveyResponse, each by one SurveyRespondent
- SaasApplication has one Contract
- SaasApplication has one RipOpportunity
- RipOpportunity has one BuildScope
- Project has many Proposal
- Proposal aggregates many BuildScope
- Proposal has many ProposalView
- Project has many Notification, each routed to a RavnUser
