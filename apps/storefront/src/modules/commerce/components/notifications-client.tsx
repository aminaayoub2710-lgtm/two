"use client"

import { useStorefrontStore } from "@lib/storefront-store"
import { useState } from "react"
import { useTranslations } from "@/i18n/client"

function PreferenceRow({ title, description, enabled, onChange }: { title: string; description: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-6 border-b border-ui-border-base py-5 last:border-b-0"><span><span className="block text-sm font-medium text-ui-fg-base">{title}</span><span className="mt-1 block max-w-lg text-sm leading-6 text-ui-fg-subtle">{description}</span></span><span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-ui-fg-base" : "bg-ui-bg-subtle"}`}><input type="checkbox" className="sr-only" checked={enabled} onChange={(event) => onChange(event.target.checked)} /><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} /></span></label>
}

export default function NotificationsClient() {
  const [saved, setSaved] = useState(false)
  const { t } = useTranslations()
  const orderNotificationsEnabled = useStorefrontStore((state) => state.orderNotificationsEnabled)
  const marketingNotificationsEnabled = useStorefrontStore((state) => state.marketingNotificationsEnabled)
  const setOrderNotificationsEnabled = useStorefrontStore((state) => state.setOrderNotificationsEnabled)
  const setMarketingNotificationsEnabled = useStorefrontStore((state) => state.setMarketingNotificationsEnabled)

  const update = (setter: (value: boolean) => void, value: boolean) => {
    setter(value)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return <div className="px-0 md:px-8"><p className="cm-eyebrow">{t("account.notifications")}</p><h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">{t("notifications.title")}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-ui-fg-subtle">{t("notifications.description")}</p><div className="cm-surface mt-8 px-6"><PreferenceRow title={t("notifications.orderUpdates")} description={t("notifications.orderUpdatesDescription")} enabled={orderNotificationsEnabled} onChange={(value) => update(setOrderNotificationsEnabled, value)} /><PreferenceRow title={t("notifications.collectionNotes")} description={t("notifications.collectionNotesDescription")} enabled={marketingNotificationsEnabled} onChange={(value) => update(setMarketingNotificationsEnabled, value)} /></div><p className="mt-4 text-sm text-emerald-600" aria-live="polite">{saved ? t("notifications.saved") : ""}</p></div>
}
