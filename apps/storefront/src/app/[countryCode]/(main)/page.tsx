import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import AIRecommendations from "@modules/commerce/components/ai-recommendations"
import { getServerTranslator } from "@/i18n/server"

const valuePropKeys = [
  ["home.curatedEyebrow", "home.curatedTitle", "home.curatedDescription"],
  ["home.momentumEyebrow", "home.momentumTitle", "home.momentumDescription"],
  ["home.intelligenceEyebrow", "home.intelligenceTitle", "home.intelligenceDescription"],
] as const

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const [{ collections }, region, { t }] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    getRegion(countryCode),
    getServerTranslator(),
  ])

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <section className="border-b border-ui-border-base bg-ui-bg-base">
        <div className="content-container grid gap-0 divide-y divide-ui-border-base py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
          {valuePropKeys.map(([eyebrow, title, description]) => (
            <div key={eyebrow} className="px-0 py-7 md:px-8 md:py-10 first:md:pl-0 last:md:pr-0">
              <p className="text-xs font-medium tracking-[0.18em] text-ui-fg-muted">{t(eyebrow)}</p>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-ui-fg-base">{t(title)}</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ui-fg-subtle">{t(description)}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="featured" className="bg-ui-bg-subtle py-16 md:py-24">
        <div className="content-container">
          <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ui-fg-muted">{t("home.selection")}</p>
              <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base md:text-4xl">{t("home.discoverTitle")}</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ui-fg-subtle">{t("home.discoverDescription")}</p>
          </div>
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </section>
      <AIRecommendations seed={t("home.discoverDescription")} />
    </>
  )
}
