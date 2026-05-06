import { useState } from "react"

import data from "../../../product/sections/pipeline-dashboard/data.json"
import type {
  DashboardView,
  Owner,
  PipelineOpportunity,
  PipelineProject,
  PipelineRenewal,
  PipelineStage,
  PipelineStat,
} from "../../../product/sections/pipeline-dashboard/types"
import { PipelineDashboard as PipelineDashboardView } from "./components/PipelineDashboard"

const stats = data.stats as PipelineStat[]
const owners = data.owners as Owner[]
const initialOpportunities = data.opportunities as PipelineOpportunity[]
const projects = data.projects as PipelineProject[]
const renewals = data.renewals as PipelineRenewal[]

export default function PipelineDashboardPreview() {
  const [view, setView] = useState<DashboardView>("kanban")
  const [opportunities, setOpportunities] = useState(initialOpportunities)

  return (
    <PipelineDashboardView
      stats={stats}
      owners={owners}
      projects={projects}
      opportunities={opportunities}
      renewals={renewals}
      view={view}
      onViewChange={(v) => {
        console.log("view change", v)
        setView(v)
      }}
      onOpenProject={(id) => console.log("open project", id)}
      onCreateProject={() => console.log("create project")}
      onMoveOpportunity={(id, toStage: PipelineStage) => {
        console.log("move opportunity", id, "→", toStage)
        setOpportunities((prev) =>
          prev.map((o) => (o.id === id ? { ...o, stage: toStage, daysInStage: 0 } : o))
        )
      }}
      onProjectAction={(id, action) => console.log("project action", id, action)}
      onOpenRenewal={(id) => console.log("open renewal", id)}
      onSearchChange={(q) => console.log("search", q)}
      onFiltersChange={(f) => console.log("filters", f)}
    />
  )
}
