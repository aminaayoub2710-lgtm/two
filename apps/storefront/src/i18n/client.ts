"use client"

import { usePathname } from "next/navigation"
import { useCallback, useMemo } from "react"
import { localeFromPathname, type AppLocale } from "./config"
import { translate } from "./messages"

export const useAppLocale = (): AppLocale => {
  const pathname = usePathname() || "/en/dk"
  return localeFromPathname(pathname)
}

export const useTranslations = () => {
  const locale = useAppLocale()
  const t = useCallback(
    (key: string, values?: Record<string, string | number>) =>
      translate(locale, key, values),
    [locale]
  )

  return useMemo(() => ({ locale, t }), [locale, t])
}
