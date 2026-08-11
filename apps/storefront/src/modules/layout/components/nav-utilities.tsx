"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchLauncher from "@modules/common/components/search-launcher"
import ThemeToggle from "@modules/common/components/theme-toggle"
import { HeartIcon } from "@modules/common/components/icons"
import { useStorefrontStore } from "@lib/storefront-store"

export default function NavUtilities() {
  const wishlistCount = useStorefrontStore((state) => state.wishlist.length)
  const comparisonCount = useStorefrontStore((state) => state.comparison.length)

  return (
    <div className="flex items-center gap-3">
      <div className="hidden w-52 lg:block">
        <SearchLauncher compact />
      </div>
      <LocalizedClientLink
        href="/wishlist"
        aria-label={`Wishlist, ${wishlistCount} saved`}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-ui-fg-subtle transition hover:border-ui-border-base hover:text-ui-fg-base"
      >
        <HeartIcon size={16} />
        {wishlistCount > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-ui-fg-base px-1 text-center text-[9px] leading-4 text-ui-bg-base">{wishlistCount}</span>}
      </LocalizedClientLink>
      <LocalizedClientLink
        href="/compare"
        className="hidden text-xs text-ui-fg-subtle transition hover:text-ui-fg-base md:block"
      >
        Compare{comparisonCount > 0 ? ` (${comparisonCount})` : ""}
      </LocalizedClientLink>
      <ThemeToggle />
    </div>
  )
}
