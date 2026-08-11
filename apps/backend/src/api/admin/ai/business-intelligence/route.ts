import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { generateBusinessIntelligenceWorkflow } from "../../../../workflows/generate-business-intelligence"
import {
  calculateBusinessIntelligence,
  type CommerceOrder,
} from "../../../../modules/ai-gateway/analytics"

const PERIOD_DAYS: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

const getPeriod = (value: unknown) => {
  const period = Array.isArray(value) ? value[0] : value
  return typeof period === "string" && PERIOD_DAYS[period] ? period : "30d"
}

async function loadOrders(req: MedusaRequest, period: string) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const startDate = new Date()
  startDate.setUTCDate(startDate.getUTCDate() - PERIOD_DAYS[period])

  const result = await query.graph({
    entity: "order",
    fields: ["id", "total", "created_at", "status", "currency_code"],
    filters: {
      created_at: {
        $gte: startDate.toISOString(),
      },
    },
  })

  return (result.data || []) as CommerceOrder[]
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const period = getPeriod(req.query?.period)
  const orders = await loadOrders(req, period)
  const currency = orders.find((order) => order.currency_code)?.currency_code?.toUpperCase() || "USD"

  res.json({
    status: "success",
    metrics: calculateBusinessIntelligence(orders, period, currency),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const period = getPeriod(req.query?.period)
  const orders = await loadOrders(req, period)
  const currency = orders.find((order) => order.currency_code)?.currency_code?.toUpperCase() || "USD"
  const metrics = calculateBusinessIntelligence(orders, period, currency)
  const prompt = [
    "You are CommerceMind AI Business Intelligence, an internal commerce analytics assistant.",
    "Analyze only the aggregate commerce metrics below. Do not invent customer identities, personal data, or external market facts.",
    "Return a concise executive summary with three sections: Observations, Risks, and Recommended Actions.",
    JSON.stringify(metrics),
  ].join("\n\n")

  const { result: insight } = await generateBusinessIntelligenceWorkflow(req.scope).run({
    input: { prompt },
  })

  res.json({
    status: "success",
    metrics,
    insight,
  })
}
