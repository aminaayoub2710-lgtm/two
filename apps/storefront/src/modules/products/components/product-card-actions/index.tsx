"use client"

import { CheckIcon, HeartIcon } from "@modules/common/components/icons"
import { useStorefrontStore, SavedProduct } from "@lib/storefront-store"
import { useState } from "react"

export default function ProductCardActions({ product }: { product: SavedProduct }) {
  const [notice, setNotice] = useState("")
  const wishlist = useStorefrontStore((state) => state.wishlist)
  const comparison = useStorefrontStore((state) => state.comparison)
  const toggleWishlist = useStorefrontStore((state) => state.toggleWishlist)
  const toggleComparison = useStorefrontStore((state) => state.toggleComparison)
  const isSaved = wishlist.some((item) => item.id === product.id)
  const isCompared = comparison.some((item) => item.id === product.id)

  const announce = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(""), 1800)
  }

  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/85 text-ui-fg-base shadow-sm backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-[#111820]/85"
        aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
        aria-pressed={isSaved}
        onClick={() => {
          toggleWishlist(product)
          announce(isSaved ? "Removed from wishlist" : "Saved to wishlist")
        }}
      >
        <HeartIcon size={16} className={isSaved ? "fill-current" : ""} />
      </button>
      <button
        type="button"
        className="rounded-full border border-black/10 bg-white/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ui-fg-base shadow-sm backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-[#111820]/85"
        aria-label={isCompared ? `Remove ${product.title} from comparison` : `Compare ${product.title}`}
        aria-pressed={isCompared}
        onClick={() => {
          toggleComparison(product)
          announce(isCompared ? "Removed from comparison" : comparison.length >= 4 ? "Compare up to four products" : "Added to comparison")
        }}
      >
        {isCompared ? <span className="inline-flex items-center gap-1"><CheckIcon size={12} /> Compared</span> : "Compare"}
      </button>
      <span className="sr-only" aria-live="polite">{notice}</span>
    </div>
  )
}
