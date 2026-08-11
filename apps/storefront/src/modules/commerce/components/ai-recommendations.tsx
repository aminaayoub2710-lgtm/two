"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SparkleIcon } from "@modules/common/components/icons"
import MotionReveal from "@modules/common/components/motion-reveal"

type Recommendation = { id: string; title?: string; handle?: string; thumbnail?: string | null }
type RecommendationResponse = { recommendations: Recommendation[]; explanation?: string }

export default function AIRecommendations({ seed = "general discovery" }: { seed?: string }) {
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  const { data, isLoading, isError } = useQuery<RecommendationResponse>({
    queryKey: ["storefront-recommendations", seed],
    queryFn: async () => {
      const response = await fetch(`${backend}/store/ai/recommendations?seed=${encodeURIComponent(seed)}`, {
        headers: { "x-publishable-api-key": publishableKey },
      })
      if (!response.ok) throw new Error("Recommendations unavailable")
      return response.json()
    },
    staleTime: 60_000,
  })

  if (isError || (!isLoading && !data?.recommendations?.length)) return null

  return <MotionReveal><section className="content-container border-t border-ui-border-base py-16 md:py-20"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="cm-eyebrow inline-flex items-center gap-2"><SparkleIcon size={13} /> AI-assisted discovery</p><h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">A little more like you.</h2></div><p className="max-w-md text-sm leading-6 text-ui-fg-subtle">{data?.explanation || "Selected from the live CommerceMind catalog."}</p></div><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{(data?.recommendations || []).slice(0, 4).map((product) => <LocalizedClientLink key={product.id} href={`/products/${product.handle}`} className="group"><div className="overflow-hidden rounded-2xl bg-ui-bg-subtle">{product.thumbnail ? <Image src={product.thumbnail} alt="" width={800} height={600} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="aspect-[4/3] bg-gradient-to-br from-cyan-100 to-violet-100" />}</div><p className="mt-3 text-sm font-medium text-ui-fg-base">{product.title}</p><p className="mt-1 text-xs text-ui-fg-muted">Recommended for discovery</p></LocalizedClientLink>)}</div></section></MotionReveal>
}
