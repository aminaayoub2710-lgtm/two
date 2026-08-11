"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useStorefrontStore } from "@lib/storefront-store"
import { XIcon } from "@modules/common/components/icons"

export default function CompareClient() {
  const comparison = useStorefrontStore((state) => state.comparison)
  const toggleComparison = useStorefrontStore((state) => state.toggleComparison)
  const clearComparison = useStorefrontStore((state) => state.clearComparison)

  return (
    <section className="content-container py-14 md:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-2xl"><p className="cm-eyebrow">Decision support</p><h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-ui-fg-base md:text-6xl">Compare with confidence.</h1><p className="mt-5 text-base leading-7 text-ui-fg-subtle">Keep up to four products side by side while you make the call.</p></div>{comparison.length > 0 && <button type="button" className="self-start rounded-full border border-ui-border-base px-4 py-2 text-sm text-ui-fg-subtle transition hover:border-ui-fg-base hover:text-ui-fg-base" onClick={clearComparison}>Clear comparison</button>}</div>
      {comparison.length > 0 ? (
        <div className="mt-12 overflow-x-auto rounded-2xl border border-ui-border-base bg-ui-bg-base">
          <div className="grid min-w-[720px]" style={{ gridTemplateColumns: `180px repeat(${comparison.length}, minmax(180px, 1fr))` }}>
            <div className="border-b border-r border-ui-border-base p-4 text-xs uppercase tracking-[0.16em] text-ui-fg-muted">Signal</div>
            {comparison.map((product) => <div key={product.id} className="relative border-b border-ui-border-base p-4"><button type="button" className="absolute right-3 top-3 text-ui-fg-muted hover:text-ui-fg-base" aria-label={`Remove ${product.title} from comparison`} onClick={() => toggleComparison(product)}><XIcon size={15} /></button>{product.thumbnail ? <Image src={product.thumbnail} alt="" width={800} height={600} className="aspect-[4/3] w-full rounded-lg object-cover" /> : <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-cyan-100 to-violet-100" />}<LocalizedClientLink href={`/products/${product.handle}`} className="mt-4 block text-sm font-medium text-ui-fg-base hover:underline">{product.title}</LocalizedClientLink></div>)}
            <div className="border-b border-r border-ui-border-base p-4 text-sm text-ui-fg-subtle">Availability</div>
            {comparison.map((product) => <div key={`${product.id}-availability`} className="border-b border-ui-border-base p-4 text-sm text-emerald-600">Available in catalog</div>)}
            <div className="border-r border-ui-border-base p-4 text-sm text-ui-fg-subtle">Price snapshot</div>
            {comparison.map((product) => <div key={`${product.id}-price`} className="p-4 text-sm font-medium text-ui-fg-base">{product.price || "See product details"}</div>)}
          </div>
        </div>
      ) : (
        <div className="cm-surface mt-12 flex min-h-56 flex-col items-center justify-center px-6 text-center"><h2 className="text-xl font-medium text-ui-fg-base">Nothing to compare yet.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-ui-fg-subtle">Use “Compare” on product cards to build a side-by-side decision view.</p><LocalizedClientLink href="/store" className="mt-6 rounded-full bg-ui-fg-base px-5 py-3 text-sm font-medium text-ui-bg-base transition hover:opacity-80">Explore the catalog</LocalizedClientLink></div>
      )}
    </section>
  )
}
