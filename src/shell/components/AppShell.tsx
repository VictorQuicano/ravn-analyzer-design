import { type ReactNode } from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { MainNav, type NavSection } from "./MainNav"
import { UserMenu, type ThemeMode } from "./UserMenu"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: LucideIcon
}

export interface ProjectTab {
  label: string
  href: string
  isActive?: boolean
  badgeCount?: number
}

export interface ProjectContext {
  name: string
  tabs: ProjectTab[]
}

interface AppShellProps {
  appName: string
  appLogo: LucideIcon
  navSections: NavSection[]
  user: { name: string; email: string; avatarUrl?: string }
  breadcrumbs: BreadcrumbItem[]
  topNavActions?: ReactNode
  projectContext?: ProjectContext
  themeMode?: ThemeMode
  onNavigate?: (href: string) => void
  onThemeChange?: (mode: ThemeMode) => void
  onLogout?: () => void
  children: ReactNode
}

export function AppShell({
  appName,
  appLogo,
  navSections,
  user,
  breadcrumbs,
  topNavActions,
  projectContext,
  themeMode,
  onNavigate,
  onThemeChange,
  onLogout,
  children,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <aside className="flex h-full w-64 shrink-0 flex-col">
        <div className="flex-1 overflow-hidden">
          <MainNav
            appName={appName}
            appLogo={appLogo}
            sections={navSections}
            onNavigate={onNavigate}
          />
        </div>
        <div className="border-r border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
          <UserMenu
            user={user}
            themeMode={themeMode}
            onThemeChange={onThemeChange}
            onLogout={onLogout}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-stone-200 bg-white px-6 dark:border-stone-800 dark:bg-stone-900">
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
          {topNavActions && (
            <div className="flex items-center gap-2">{topNavActions}</div>
          )}
        </header>

        {projectContext && (
          <ProjectTabs
            tabs={projectContext.tabs}
            onNavigate={onNavigate}
          />
        )}

        <main className="flex-1 overflow-auto bg-stone-50 dark:bg-stone-950">
          {children}
        </main>
      </div>
    </div>
  )
}

function Breadcrumbs({
  items,
  onNavigate,
}: {
  items: BreadcrumbItem[]
  onNavigate?: (href: string) => void
}) {
  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-sm">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        const Icon = item.icon
        const content = (
          <span
            className={[
              "flex items-center gap-1.5 truncate",
              isLast
                ? "font-medium text-stone-900 dark:text-stone-50"
                : "text-stone-500 dark:text-stone-400",
            ].join(" ")}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="truncate">{item.label}</span>
          </span>
        )
        return (
          <span key={`${item.label}-${idx}`} className="flex min-w-0 items-center gap-1.5">
            {item.href && !isLast ? (
              <button
                type="button"
                onClick={() => onNavigate?.(item.href!)}
                className="flex items-center gap-1.5 truncate hover:text-stone-900 dark:hover:text-stone-50"
              >
                {content}
              </button>
            ) : (
              content
            )}
            {!isLast && (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-stone-600" />
            )}
          </span>
        )
      })}
    </nav>
  )
}

function ProjectTabs({
  tabs,
  onNavigate,
}: {
  tabs: ProjectTab[]
  onNavigate?: (href: string) => void
}) {
  return (
    <div className="flex h-12 shrink-0 items-end gap-1 overflow-x-auto border-b border-stone-200 bg-white px-6 dark:border-stone-800 dark:bg-stone-900">
      {tabs.map((tab) => (
        <button
          key={tab.href}
          type="button"
          onClick={() => onNavigate?.(tab.href)}
          className={[
            "relative flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm transition-colors",
            tab.isActive
              ? "border-lime-500 font-medium text-stone-900 dark:text-stone-50"
              : "border-transparent text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50",
          ].join(" ")}
        >
          {tab.label}
          {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              {tab.badgeCount}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
