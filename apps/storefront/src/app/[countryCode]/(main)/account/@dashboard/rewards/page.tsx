import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = { title: "Rewards", description: "Your CommerceMind rewards overview." }

export default async function RewardsPage() {
  const customer = await retrieveCustomer().catch(() => null)
  if (!customer) notFound()
  const orders = (await listOrders().catch(() => [])) || []
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const points = Math.floor(totalSpent / 100)
  const nextTier = points < 250 ? 250 : points < 750 ? 750 : 1500
  const tier = points < 250 ? "Signal" : points < 750 ? "Orbit" : "North Star"
  const progress = Math.min(100, Math.round((points / nextTier) * 100))

  return (
    <div className="px-0 md:px-8">
      <p className="cm-eyebrow">Member value</p>
      <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">Rewards, with clarity.</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-ui-fg-subtle">Your balance is calculated from completed account activity. One point is earned for every 100 minor currency units spent. Rewards can later be connected to a dedicated loyalty module without changing this page.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="cm-surface p-5"><p className="text-xs text-ui-fg-muted">Current tier</p><p className="mt-2 text-2xl font-medium text-ui-fg-base">{tier}</p></div>
        <div className="cm-surface p-5"><p className="text-xs text-ui-fg-muted">Available points</p><p className="mt-2 text-2xl font-medium text-ui-fg-base">{points.toLocaleString()}</p></div>
        <div className="cm-surface p-5"><p className="text-xs text-ui-fg-muted">Orders counted</p><p className="mt-2 text-2xl font-medium text-ui-fg-base">{orders.length}</p></div>
      </div>
      <div className="cm-surface mt-6 p-6"><div className="flex items-center justify-between text-sm"><span className="font-medium text-ui-fg-base">Progress to {nextTier.toLocaleString()} points</span><span className="text-ui-fg-muted">{progress}%</span></div><div className="mt-4 h-2 rounded-full bg-ui-bg-subtle"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${progress}%` }} /></div></div>
    </div>
  )
}
