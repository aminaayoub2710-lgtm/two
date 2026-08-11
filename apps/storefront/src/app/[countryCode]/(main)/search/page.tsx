import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import SearchLauncher from "@modules/common/components/search-launcher"

export const metadata: Metadata = {
  title: "Search",
  description: "Search the CommerceMind collection.",
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { countryCode } = await params
  const { q = "" } = await searchParams
  const region = await getRegion(countryCode)
  const query = q.trim()
  const { response } = region
    ? await listProducts({
        countryCode,
        queryParams: { q: query || undefined, limit: 24 },
      })
    : { response: { products: [], count: 0 } }

  return (
    <section className="content-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="cm-eyebrow">Discovery</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-ui-fg-base md:text-6xl">Find your next favorite.</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ui-fg-subtle">Search the live Medusa catalog by product name, collection, or intent.</p>
        <div className="mx-auto mt-8 max-w-xl"><SearchLauncher /></div>
      </div>
      <div className="mt-16 flex items-end justify-between border-b border-ui-border-base pb-4">
        <div>
          <p className="text-sm text-ui-fg-muted">{query ? `Results for “${query}”` : "Latest products"}</p>
          <p className="mt-1 text-xs text-ui-fg-muted">{response.count} products</p>
        </div>
      </div>
      {response.products.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {response.products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region!} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="cm-surface mt-8 flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h2 className="text-xl font-medium text-ui-fg-base">No exact matches yet.</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-ui-fg-subtle">Try a shorter search phrase or browse the latest collection to discover something new.</p>
        </div>
      )}
    </section>
  )
}
