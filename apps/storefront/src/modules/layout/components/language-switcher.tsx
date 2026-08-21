"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { localeFromPathname, localeNames, locales, isAppLocale } from "@/i18n/config"
import { useTranslations } from "@/i18n/client"

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/en/dk"
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useTranslations()
  const segments = pathname.split("/").filter(Boolean)
  const hasLocale = isAppLocale(segments[0])
  const currentLocale = localeFromPathname(pathname)
  const countryCode = (hasLocale ? segments[1] : segments[0]) || "dk"
  const routeSegments = hasLocale ? segments.slice(2) : segments.slice(1)

  const changeLocale = (locale: string) => {
    if (!isAppLocale(locale)) return
    const path = routeSegments.length ? `/${routeSegments.join("/")}` : ""
    const query = searchParams.toString()
    router.push(`/${locale}/${countryCode}${path}${query ? `?${query}` : ""}`)
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-ui-fg-subtle">
      <span className="sr-only">{t("languageSwitcher.choose")}</span>
      <select
        value={currentLocale}
        onChange={(event) => changeLocale(event.target.value)}
        aria-label={t("languageSwitcher.label")}
        className="cursor-pointer appearance-none bg-transparent py-2 text-xs font-medium text-ui-fg-base outline-none"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </label>
  )
}
