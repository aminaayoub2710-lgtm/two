import ar from "../../messages/ar.json"
import de from "../../messages/de.json"
import en from "../../messages/en.json"
import es from "../../messages/es.json"
import fr from "../../messages/fr.json"
import it from "../../messages/it.json"
import type { AppLocale } from "./config"

export const messageBundles = {
  en,
  ar,
  fr,
  de,
  it,
  es,
} as const

export type MessageTree = Record<string, unknown>
export type MessageBundle = typeof en

const getValue = (messages: MessageTree, key: string): unknown => {
  return key.split(".").reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") {
      return undefined
    }
    return (value as Record<string, unknown>)[segment]
  }, messages)
}

export const translate = (
  locale: AppLocale,
  key: string,
  values?: Record<string, string | number>
): string => {
  const localized = getValue(messageBundles[locale] as MessageTree, key)
  const fallback = getValue(messageBundles.en as MessageTree, key)
  const template = typeof localized === "string" ? localized : fallback

  if (typeof template !== "string") {
    return key
  }

  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = values?.[name]
    return value === undefined ? `{${name}}` : String(value)
  })
}

export const getMessages = (locale: AppLocale): MessageBundle =>
  messageBundles[locale] as MessageBundle
