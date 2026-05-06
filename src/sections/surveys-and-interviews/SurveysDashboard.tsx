import { useState } from "react"

import data from "../../../product/sections/surveys-and-interviews/data.json"
import type {
  Respondent,
  ResponsesView,
  Reviewer,
  StandoutQuote,
  SurveyResponseRow,
  SurveyTypeSummary,
  TranscriptRow,
} from "../../../product/sections/surveys-and-interviews/types"
import { SurveysDashboard as SurveysDashboardView } from "./components/SurveysDashboard"

const surveyTypes = data.surveyTypes as SurveyTypeSummary[]
const reviewers = data.reviewers as Reviewer[]
const respondents = data.respondents as Respondent[]
const initialResponses = data.responses as SurveyResponseRow[]
const initialQuotes = data.quotes as StandoutQuote[]
const transcripts = data.transcripts as TranscriptRow[]

export default function SurveysDashboardPreview() {
  const [view, setView] = useState<ResponsesView>("all")
  const [quotes, setQuotes] = useState(initialQuotes)
  const [responses] = useState(initialResponses)

  return (
    <SurveysDashboardView
      projectName={data.projectName}
      surveyTypes={surveyTypes}
      reviewers={reviewers}
      respondents={respondents}
      responses={responses}
      quotes={quotes}
      transcripts={transcripts}
      view={view}
      onViewChange={(v) => {
        console.log("view change", v)
        setView(v)
      }}
      onOpenSendSheet={(surveyType) =>
        console.log("open send sheet", surveyType)
      }
      onCopyPublicLink={(surveyType) =>
        console.log("copy public link", surveyType)
      }
      onTogglePublicLink={(surveyType, active) =>
        console.log("toggle public link", surveyType, active)
      }
      onOpenResponse={(id) => console.log("open response", id)}
      onResponseAction={(id, action) =>
        console.log("response action", id, action)
      }
      onOpenQuote={(id) => console.log("open quote", id)}
      onUnpinQuote={(id) => {
        console.log("unpin quote", id)
        setQuotes((prev) => prev.filter((q) => q.id !== id))
      }}
      onOpenTranscript={(id) => console.log("open transcript", id)}
      onUploadTranscript={() => console.log("upload transcript")}
      onCreateInvite={() => console.log("create invite")}
      onSearchChange={(q) => console.log("search", q)}
      onFiltersChange={(f) => console.log("filters", f)}
    />
  )
}
