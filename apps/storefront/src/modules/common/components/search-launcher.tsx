"use client"

import { SearchIcon } from "@modules/common/components/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { isAppLocale, localeFromPathname } from "@/i18n/config"
import { useTranslations } from "@/i18n/client"

export default function SearchLauncher({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const pathname = usePathname() || "/en/dk/store"
  const segments = pathname.split("/").filter(Boolean)
  const currentLocale = localeFromPathname(pathname)
  const countryCode = (isAppLocale(segments[0]) ? segments[1] : segments[0]) || "dk"
  const current = useSearchParams().get("q") || ""
  const [query, setQuery] = useState(current)
  const { t } = useTranslations()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    router.push(`/${currentLocale}/${countryCode}/search${value ? `?q=${encodeURIComponent(value)}` : ""}`)
  }

  return (
    <form onSubmit={submit} className={compact ? "w-full" : "w-full max-w-md"} role="search">
      <label className="sr-only" htmlFor="storefront-search">{t("search.label")}</label>
      <div className="relative">
        <SearchIcon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
        <input
          id="storefront-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search.placeholder")}
          className="h-10 w-full rounded-full border border-ui-border-base bg-ui-bg-subtle pl-10 pr-4 text-sm text-ui-fg-base placeholder:text-ui-fg-muted focus:border-ui-fg-base focus:outline-none"
        />
      </div>
    </form>
  )
}
