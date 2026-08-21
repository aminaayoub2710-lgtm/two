import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowIcon } from "@modules/common/components/icons"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()
  return {
    title: t("navigation.brands"),
    description: t("home.discoverDescription"),
  }
}

function brandName(product: { metadata?: Record<string, unknown> | null; tags?: { value?: string | null }[] | null }) {
  const metadataBrand = product.metadata?.brand
  if (typeof metadataBrand === "string" && metadataBrand.trim()) return metadataBrand.trim()
  const tag = product.tags?.find((item) => item.value?.toLowerCase().startsWith("brand:"))?.value
  return tag?.split(":").slice(1).join(":").trim() || null
}

export default async function BrandsPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const [{ response }, { t }] = await Promise.all([
    listProducts({ countryCode, queryParams: { limit: 100 } }),
    getServerTranslator(),
  ])
  const brands = new Map<string, number>()
  response.products.forEach((product) => {
    const brand = brandName(product)
    if (brand) brands.set(brand, (brands.get(brand) || 0) + 1)
  })
  const entries = Array.from(brands.entries()).sort(([a], [b]) => a.localeCompare(b))

  return (
    <section className="content-container py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="cm-eyebrow">{t("navigation.brands")}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-ui-fg-base md:text-6xl">{t("navigation.brands")}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ui-fg-subtle">{t("home.discoverDescription")}</p>
      </div>
      {entries.length > 0 ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([name, count]) => (
            <LocalizedClientLink key={name} href={`/search?q=${encodeURIComponent(name)}`} className="cm-surface group flex min-h-40 flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="text-2xl font-medium tracking-[-0.04em] text-ui-fg-base">{name}</span>
              <span className="flex items-center justify-between text-sm text-ui-fg-subtle"><span>{count} {t("products.product")}</span><ArrowIcon size={17} className="transition-transform group-hover:translate-x-1" /></span>
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        <div className="cm-surface mt-14 max-w-2xl p-8"><h2 className="text-xl font-medium text-ui-fg-base">{t("collections.empty")}</h2><p className="mt-3 text-sm leading-6 text-ui-fg-subtle">{t("home.discoverDescription")}</p></div>
      )}
    </section>
  )
}
