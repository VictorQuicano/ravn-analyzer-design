import data from "../../../product/sections/prospects-and-saas-portfolio/data.json"
import type {
  ExtractionQueueItem,
  PortfolioStat,
  ProjectSummary,
  SaasApplication,
} from "../../../product/sections/prospects-and-saas-portfolio/types"
import { SaasPortfolio as SaasPortfolioView } from "./components/SaasPortfolio"

const project = data.project as ProjectSummary
const stats = data.stats as PortfolioStat[]
const apps = data.apps as SaasApplication[]
const extractionQueue = data.extractionQueue as ExtractionQueueItem[]
const brandedIntakeUrl = data.brandedIntakeUrl as string

export default function SaasPortfolioPreview() {
  return (
    <SaasPortfolioView
      project={project}
      stats={stats}
      apps={apps}
      extractionQueue={extractionQueue}
      brandedIntakeUrl={brandedIntakeUrl}
      onAddSaas={() => console.log("add SaaS — open right-side Sheet")}
      onImportCsv={() => console.log("import CSV — open bulk import Sheet")}
      onSendIntakeLink={() =>
        console.log("send branded intake link via Slack")
      }
      onCopyIntakeUrl={() => console.log("copied branded intake URL")}
      onOpenSaas={(id) => console.log("open SaaS detail Sheet:", id)}
      onUploadContract={(id) =>
        console.log("upload contract for:", id)
      }
      onRequestContract={(id) =>
        console.log("request contract from finance contact for:", id)
      }
      onToggleFeatures={(id) => console.log("toggle features for:", id)}
      onDuplicateSaas={(id) => console.log("duplicate SaaS:", id)}
      onArchiveSaas={(id) => console.log("archive SaaS:", id)}
      onSaasAction={(id, action) =>
        console.log("SaaS action:", action, "→", id)
      }
      onFiltersChange={(f) => console.log("filters", f)}
      onSearchChange={(q) => console.log("search", q)}
      onSortChange={(s) => console.log("sort", s)}
      onReviewExtractions={() =>
        console.log("review pending AI extractions")
      }
    />
  )
}
