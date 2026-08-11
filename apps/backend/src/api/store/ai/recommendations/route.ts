import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { generateStorefrontRecommendationsWorkflow } from "../../../../workflows/generate-storefront-recommendations"

type CatalogProduct = {
  id: string
  title?: string
  handle?: string
  thumbnail?: string | null
  metadata?: Record<string, unknown> | null
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const seed = typeof req.query?.seed === "string" ? req.query.seed : ""
  const result = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "thumbnail", "metadata", "created_at"],
    filters: { status: "published" },
    pagination: { take: 8 },
  })
  const products = ((result.data || []) as CatalogProduct[]).filter((product) => product.id && product.handle)
  const prompt = [
    "You are CommerceMind AI's storefront recommendation assistant.",
    "Explain in one short sentence why this catalog selection is useful. Do not mention private data or invent product claims.",
    `Customer intent signal: ${seed || "general discovery"}`,
    `Catalog count: ${products.length}`,
  ].join("\n")
  const { result: explanation } = await generateStorefrontRecommendationsWorkflow(req.scope).run({ input: { prompt } })

  res.json({
    status: "success",
    recommendations: products,
    explanation: typeof explanation === "string" ? explanation : explanation.content,
  })
}
