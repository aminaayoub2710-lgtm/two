"use client"

import { useStorefrontStore } from "@lib/storefront-store"
import { useState } from "react"

export default function SettingsClient() {
  const recommendationsEnabled = useStorefrontStore((state) => state.recommendationsEnabled)
  const setRecommendationsEnabled = useStorefrontStore((state) => state.setRecommendationsEnabled)
  const [saved, setSaved] = useState(false)

  return <div className="px-0 md:px-8"><p className="cm-eyebrow">Control center</p><h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">Make the experience yours.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-ui-fg-subtle">CommerceMind keeps personalization explicit. These controls are local today and ready to map to a customer preference module when one is enabled in Medusa.</p><div className="cm-surface mt-8 p-6"><label className="flex cursor-pointer items-start justify-between gap-6"><span><span className="block text-sm font-medium text-ui-fg-base">AI recommendations</span><span className="mt-1 block max-w-lg text-sm leading-6 text-ui-fg-subtle">Allow the storefront to use your saved products and browsing intent to make more relevant suggestions. No personal data is sent to the storefront AI layer by this toggle alone.</span></span><span className={`relative mt-1 inline-flex h-6 w-11 shrink-0 rounded-full transition ${recommendationsEnabled ? "bg-ui-fg-base" : "bg-ui-bg-subtle"}`}><input type="checkbox" className="sr-only" checked={recommendationsEnabled} onChange={(event) => { setRecommendationsEnabled(event.target.checked); setSaved(true); window.setTimeout(() => setSaved(false), 1600) }} /><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${recommendationsEnabled ? "left-6" : "left-1"}`} /></span></label></div><p className="mt-4 text-sm text-emerald-600" aria-live="polite">{saved ? "Settings saved on this device." : ""}</p></div>
}
