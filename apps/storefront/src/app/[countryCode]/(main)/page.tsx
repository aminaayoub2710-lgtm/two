import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import AIRecommendations from "@modules/commerce/components/ai-recommendations"

export const metadata: Metadata = {
  title: "CommerceMind AI — Shop with more clarity",
  description:
    "Discover a considered collection with intelligent recommendations, fast checkout, and a calm premium shopping experience.",
  openGraph: {
    title: "CommerceMind AI — Shop with more clarity",
    description:
      "A premium, AI-aware commerce experience built on Medusa and Next.js.",
    type: "website",
  },
}

const valueProps = [
  {
    eyebrow: "01",
    title: "Curated by intent",
    description: "Explore products through thoughtful collections instead of endless noise.",
  },
  {
    eyebrow: "02",
    title: "Built for momentum",
    description: "A focused storefront keeps browsing, cart, and checkout moving naturally.",
  },
  {
    eyebrow: "03",
    title: "Commerce intelligence",
    description: "Recommendations and insights are designed to become more useful over time.",
  },
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <section className="border-b border-ui-border-base bg-ui-bg-base">
        <div className="content-container grid gap-0 divide-y divide-ui-border-base py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
          {valueProps.map((item) => (
            <div key={item.eyebrow} className="px-0 py-7 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0">
              <p className="text-xs font-medium tracking-[0.18em] text-ui-fg-muted">{item.eyebrow}</p>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-ui-fg-base">{item.title}</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ui-fg-subtle">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="featured" className="bg-ui-bg-subtle py-16 md:py-24">
        <div className="content-container">
          <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ui-fg-muted">The selection</p>
              <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base md:text-4xl">Made to be discovered.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ui-fg-subtle">Browse the latest collection and find the pieces that fit your world.</p>
          </div>
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </section>
      <AIRecommendations seed="latest collection and thoughtful essentials" />
    </>
  )
}
