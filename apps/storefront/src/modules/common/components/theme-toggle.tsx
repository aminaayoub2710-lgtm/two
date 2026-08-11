"use client"

import { MoonIcon, SunIcon } from "@modules/common/components/icons"
import { useStorefrontStore } from "@lib/storefront-store"

export default function ThemeToggle() {
  const theme = useStorefrontStore((state) => state.theme)
  const setTheme = useStorefrontStore((state) => state.setTheme)
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ui-border-base text-ui-fg-subtle transition hover:bg-ui-bg-subtle hover:text-ui-fg-base"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  )
}
