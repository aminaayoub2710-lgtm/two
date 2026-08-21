import { headers } from "next/headers"
import { defaultLocale, isAppLocale, type AppLocale } from "./config"
import { translate, type MessageBundle } from "./messages"

export const getRequestLocale = async (): Promise<AppLocale> => {
  const requestHeaders = await headers()
  const value = requestHeaders.get("x-commerce-locale")?.toLowerCase()
  return isAppLocale(value) ? value : defaultLocale
}

export const getRequestCountryCode = async (): Promise<string> => {
  const requestHeaders = await headers()
  return requestHeaders.get("x-commerce-country")?.toLowerCase() || "dk"
}

export const getServerMessages = async (): Promise<{
  locale: AppLocale
  messages: MessageBundle
}> => {
  const locale = await getRequestLocale()
  const { getMessages } = await import("./messages")
  return { locale, messages: getMessages(locale) }
}

export const getServerTranslator = async () => {
  const locale = await getRequestLocale()
  return {
    locale,
    t: (key: string, values?: Record<string, string | number>) =>
      translate(locale, key, values),
  }
}
