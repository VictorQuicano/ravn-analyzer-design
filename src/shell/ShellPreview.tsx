import {
  FolderKanban,
  LayoutGrid,
  LineChart,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react"

import { AppShell } from "./components"

export default function ShellPreview() {
  const navSections = [
    {
      title: "Workspace",
      items: [
        {
          label: "Pipeline",
          href: "/pipeline",
          icon: FolderKanban,
          isActive: false,
        },
        {
          label: "Catalog",
          href: "/catalog",
          icon: LayoutGrid,
          isActive: false,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
          isActive: false,
        },
      ],
    },
  ]

  const breadcrumbs = [
    {
      label: "Pipeline",
      href: "/pipeline",
      icon: FolderKanban,
    },
    {
      label: "Acme Corp",
    },
  ]

  const topNavActions = (
    <>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="flex h-9 items-center gap-1.5 rounded-md border border-stone-200 px-2.5 text-sm text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </button>
      <div className="mx-1 h-6 w-px bg-stone-200 dark:bg-stone-800" />
      <button
        type="button"
        className="flex h-9 items-center gap-1.5 rounded-md bg-stone-900 px-2.5 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
      >
        <Plus className="h-4 w-4" />
        New SaaS
      </button>
    </>
  )

  const projectContext = {
    name: "Acme Corp",
    tabs: [
      {
        label: "Portfolio",
        href: "/projects/acme-corp/portfolio",
        isActive: true,
        badgeCount: 18,
      },
      {
        label: "Surveys",
        href: "/projects/acme-corp/surveys",
        badgeCount: 7,
      },
      {
        label: "Opportunities",
        href: "/projects/acme-corp/opportunities",
        badgeCount: 4,
      },
      {
        label: "Proposals",
        href: "/projects/acme-corp/proposals",
        badgeCount: 1,
      },
    ],
  }

  return (
    <AppShell
      appName="Analyzer"
      appLogo={LineChart}
      navSections={navSections}
      user={{
        name: "Alex Morgan",
        email: "alex@ravn.co",
      }}
      breadcrumbs={breadcrumbs}
      topNavActions={topNavActions}
      projectContext={projectContext}
      themeMode="light"
      onNavigate={(href) => console.log("navigate", href)}
      onThemeChange={(mode) => console.log("theme", mode)}
      onLogout={() => console.log("logout")}
    >
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Acme Corp · Portfolio
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            18 SaaS applications captured · $2.4M annual spend · 3 contracts
            renewing in the next 90 days.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center dark:border-stone-700 dark:bg-stone-900">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Section content renders here. Each section's screen designs slot
            into this content area, inheriting the shell's chrome (sidebar,
            topnav, project tabs).
          </p>
        </div>
      </div>
    </AppShell>
  )
}
