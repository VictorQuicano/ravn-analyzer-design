import { useState } from "react"
import { ChevronUp, LogOut, Monitor, Moon, Sun } from "lucide-react"

export type ThemeMode = "light" | "dark" | "system"

interface User {
  name: string
  email: string
  avatarUrl?: string
}

interface UserMenuProps {
  user: User
  themeMode?: ThemeMode
  onThemeChange?: (mode: ThemeMode) => void
  onLogout?: () => void
}

export function UserMenu({
  user,
  themeMode = "system",
  onThemeChange,
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false)

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative border-t border-stone-200 dark:border-stone-800">
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-md border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900">
          <div className="border-b border-stone-200 px-3 py-2.5 dark:border-stone-800">
            <div className="text-sm font-medium text-stone-900 dark:text-stone-50">
              {user.name}
            </div>
            <div className="truncate text-xs text-stone-500 dark:text-stone-400">
              {user.email}
            </div>
          </div>
          <div className="border-b border-stone-200 p-1 dark:border-stone-800">
            <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Theme
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {(
                [
                  { mode: "light" as const, icon: Sun, label: "Light" },
                  { mode: "dark" as const, icon: Moon, label: "Dark" },
                  { mode: "system" as const, icon: Monitor, label: "System" },
                ]
              ).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onThemeChange?.(mode)}
                  className={[
                    "flex flex-col items-center gap-1 rounded px-2 py-2 text-[11px] transition-colors",
                    themeMode === mode
                      ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2.5 px-3 py-3 text-left transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-medium text-stone-700 dark:bg-stone-700 dark:text-stone-200">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-stone-900 dark:text-stone-50">
            {user.name}
          </span>
          <span className="block truncate text-xs text-stone-500 dark:text-stone-400">
            {user.email}
          </span>
        </span>
        <ChevronUp
          className={[
            "h-4 w-4 shrink-0 text-stone-500 transition-transform dark:text-stone-400",
            open ? "rotate-0" : "rotate-180",
          ].join(" ")}
        />
      </button>
    </div>
  )
}
