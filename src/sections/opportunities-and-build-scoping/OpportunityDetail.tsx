import { useState } from "react"

import data from "../../../product/sections/opportunities-and-build-scoping/data.json"
import type {
  RipOpportunity,
} from "../../../product/sections/opportunities-and-build-scoping/types"
import { OpportunityDetail as OpportunityDetailView } from "./components/OpportunityDetail"

const opportunities = data.opportunities as RipOpportunity[]

export default function OpportunityDetailPreview() {
  const [activeId, setActiveId] = useState<string>(opportunities[0]?.id ?? "")

  return (
    <OpportunityDetailView
      opportunities={opportunities}
      activeOpportunityId={activeId}
      onSelectOpportunity={(id) => {
        console.log("select opportunity", id)
        setActiveId(id)
      }}
      onOpportunityAction={(id, action) =>
        console.log("opportunity action", id, action)
      }
      onTierFilterChange={(tiers) => console.log("tier filter", tiers)}
      onSearchChange={(q) => console.log("search", q)}
      onAddToProposal={(id) => console.log("add to proposal", id)}
      onRegenerateScope={(id) => console.log("regenerate scope", id)}
      onGenerateScope={(id) => console.log("generate scope", id)}
    />
  )
}
