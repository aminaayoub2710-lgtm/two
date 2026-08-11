"use client"

import { useStorefrontStore } from "@lib/storefront-store"
import { useState } from "react"

function PreferenceRow({ title, description, enabled, onChange }: { title: string; description: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-6 border-b border-ui-border-base py-5 last:border-b-0"><span><span className="block text-sm font-medium text-ui-fg-base">{title}</span><span className="mt-1 block max-w-lg text-sm leading-6 text-ui-fg-subtle">{description}</span></span><span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-ui-fg-base" : "bg-ui-bg-subtle"}`}><input type="checkbox" className="sr-only" checked={enabled} onChange={(event) => onChange(event.target.checked)} /><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} /></span></label>
}

export default function NotificationsClient() {
  const [saved, setSaved] = useState(false)
  const orderNotificationsEnabled = useStorefrontStore((state) => state.orderNotificationsEnabled)
  const marketingNotificationsEnabled = useStorefrontStore((state) => state.marketingNotificationsEnabled)
  const setOrderNotificationsEnabled = useStorefrontStore((state) => state.setOrderNotificationsEnabled)
  const setMarketingNotificationsEnabled = useStorefrontStore((state) => state.setMarketingNotificationsEnabled)

  const update = (setter: (value: boolean) => void, value: boolean) => {
    setter(value)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return <div className="px-0 md:px-8"><p className="cm-eyebrow">Preferences</p><h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">Notifications that respect your attention.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-ui-fg-subtle">Choose which updates CommerceMind may send through your account channel. Your preferences stay on this device until connected to your customer profile backend.</p><div className="cm-surface mt-8 px-6"><PreferenceRow title="Order updates" description="Receive updates about order confirmation, fulfillment, and delivery status." enabled={orderNotificationsEnabled} onChange={(value) => update(setOrderNotificationsEnabled, value)} /><PreferenceRow title="New collection notes" description="Hear about meaningful new drops and editorial selections. No daily noise." enabled={marketingNotificationsEnabled} onChange={(value) => update(setMarketingNotificationsEnabled, value)} /></div><p className="mt-4 text-sm text-emerald-600" aria-live="polite">{saved ? "Preferences saved on this device." : ""}</p></div>
}
