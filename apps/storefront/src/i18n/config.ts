export const locales = ["en", "ar", "fr", "de", "it", "es"] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = "en"

export const localeNames: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
}

export const localeDirections: Record<AppLocale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  fr: "ltr",
  de: "ltr",
  it: "ltr",
  es: "ltr",
}

export const isAppLocale = (value: string | undefined): value is AppLocale =>
  !!value && (locales as readonly string[]).includes(value.toLowerCase())

export const normalizeLocale = (value: string | undefined): AppLocale =>
  isAppLocale(value) ? (value!.toLowerCase() as AppLocale) : defaultLocale

export const localeFromPathname = (pathname: string): AppLocale =>
  normalizeLocale(pathname.split("/")[1])

export const stripLocalePrefix = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length && isAppLocale(segments[0])) {
    return `/${segments.slice(1).join("/")}` || "/"
  }
  return pathname || "/"
}

export const withLocalePrefix = (
  pathname: string,
  locale: AppLocale
): string => {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  const pathWithoutLocale = stripLocalePrefix(cleanPath)
  return `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`
}

export const getLocaleCountryPath = (
  locale: AppLocale,
  countryCode: string,
  path = ""
): string => {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : ""
  return `/${locale}/${countryCode}${normalizedPath}`
}
