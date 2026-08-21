import { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { ArrowIcon } from "@modules/common/components/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()

  return {
    title: t("collections.title"),
    description: t("home.curatedDescription"),
  }
}

export default async function CollectionsPage() {
  const [{ collections }, { t }] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    getServerTranslator(),
  ])

  const availableCollections = collections.filter((collection) => Boolean(collection.handle))

  return (
    <section className="content-container py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="cm-eyebrow">{t("collections.title")}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[-0.05em] text-ui-fg-base md:text-6xl">
          {t("collections.title")}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ui-fg-subtle">
          {t("home.curatedDescription")}
        </p>
      </div>

      {availableCollections.length > 0 ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableCollections.map((collection) => (
            <LocalizedClientLink
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="cm-surface group flex min-h-48 flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-2xl font-medium tracking-[-0.04em] text-ui-fg-base">
                {collection.title}
              </span>
              <span className="flex items-center justify-between text-sm text-ui-fg-subtle">
                <span>{collection.handle}</span>
                <ArrowIcon
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </LocalizedClientLink>
          ))}
        </div>
      ) : (
        <div className="cm-surface mt-14 max-w-2xl p-8">
          <h2 className="text-xl font-medium text-ui-fg-base">
            {t("collections.empty")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-ui-fg-subtle">
            {t("home.curatedDescription")}
          </p>
        </div>
      )}
    </section>
  )
}
