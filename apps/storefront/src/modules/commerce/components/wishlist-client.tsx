"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useStorefrontStore } from "@lib/storefront-store"
import { XIcon } from "@modules/common/components/icons"
import { useTranslations } from "@/i18n/client"

export default function WishlistClient() {
  const wishlist = useStorefrontStore((state) => state.wishlist)
  const removeWishlist = useStorefrontStore((state) => state.removeWishlist)
  const { t } = useTranslations()

  return (
    <section className="content-container py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="cm-eyebrow">{t("navigation.wishlist")}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-ui-fg-base md:text-6xl">{t("commerce.wishlistReady")}</h1>
        <p className="mt-5 text-base leading-7 text-ui-fg-subtle">{t("commerce.wishlistDescription")}</p>
      </div>
      {wishlist.length > 0 ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <article key={product.id} className="cm-surface group relative overflow-hidden p-4">
              <LocalizedClientLink href={`/products/${product.handle}`} className="block">
                {product.thumbnail ? <Image src={product.thumbnail} alt="" width={800} height={600} className="aspect-[4/3] w-full rounded-xl bg-ui-bg-subtle object-cover transition group-hover:scale-[1.02]" /> : <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-cyan-100 to-violet-100" />}
                <h2 className="mt-4 text-base font-medium text-ui-fg-base">{product.title}</h2>
                {product.price && <p className="mt-1 text-sm text-ui-fg-subtle">{product.price}</p>}
              </LocalizedClientLink>
              <button type="button" className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ui-fg-base shadow-sm backdrop-blur dark:bg-[#111820]/85" aria-label={`${t("cart.remove")} ${product.title}`} onClick={() => removeWishlist(product.id)}><XIcon size={15} /></button>
            </article>
          ))}
        </div>
      ) : (
        <div className="cm-surface mt-12 flex min-h-56 flex-col items-center justify-center px-6 text-center"><h2 className="text-xl font-medium text-ui-fg-base">{t("commerce.wishlistReady")}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-ui-fg-subtle">{t("commerce.wishlistDescription")}</p><LocalizedClientLink href="/store" className="mt-6 rounded-full bg-ui-fg-base px-5 py-3 text-sm font-medium text-ui-bg-base transition hover:opacity-80">{t("commerce.browseProducts")}</LocalizedClientLink></div>
      )}
    </section>
  )
}
