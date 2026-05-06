import { useState } from "react"

import data from "../../../product/sections/proposals/data.json"
import type {
  Proposal,
  ProposalListItem,
  ProposalSectionKey,
} from "../../../product/sections/proposals/types"
import { ProposalsBuilder as ProposalsBuilderView } from "./components/ProposalsBuilder"

const proposals = data.proposals as ProposalListItem[]
const activeProposal = data.activeProposal as Proposal

export default function ProposalsBuilderPreview() {
  const [activeSectionKey, setActiveSectionKey] =
    useState<ProposalSectionKey>("financialComparison")

  return (
    <ProposalsBuilderView
      proposals={proposals}
      activeProposal={activeProposal}
      activeSectionKey={activeSectionKey}
      onSelectSection={setActiveSectionKey}
      onSelectProposal={(id) => console.log("select proposal", id)}
      onCreateProposal={() => console.log("create proposal")}
      onTogglePreview={() => console.log("toggle preview")}
      onCopyShareLink={(id) => console.log("copy share link", id)}
      onExportPdf={(id) => console.log("export pdf", id)}
      onExportSlides={(id) => console.log("export slides", id)}
      onAddRecipient={(id) => console.log("add recipient", id)}
      onResendToRecipient={(pid, rid) =>
        console.log("resend to recipient", pid, rid)
      }
      onRecommendOption={(pid, oid) =>
        console.log("recommend option", pid, oid)
      }
      onEditFinancialYear={(pid, year, field, value) =>
        console.log("edit financial year", pid, year, field, value)
      }
      onDuplicate={(id) => console.log("duplicate", id)}
      onArchive={(id) => console.log("archive", id)}
      onInspectViewEvent={(eid) => console.log("inspect event", eid)}
    />
  )
}
