import { type LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

interface MainNavProps {
  appName: string
  appLogo: LucideIcon
  sections: NavSection[]
  onNavigate?: (href: string) => void
}

export function MainNav({
  appName,
  appLogo: AppLogo,
  sections,
  onNavigate,
}: MainNavProps) {
  return (
    <nav className="flex h-full w-64 flex-col border-r border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex h-14 items-center gap-2 border-b border-stone-200 px-4 dark:border-stone-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900">
          <AppLogo className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          {appName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {sections.map((section, sectionIdx) => (
          <div key={section.title ?? sectionIdx} className="mb-4">
            {section.title && (
              <div className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => onNavigate?.(item.href)}
                      className={[
                        "flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
                        item.isActive
                          ? "bg-stone-200/70 font-medium text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
