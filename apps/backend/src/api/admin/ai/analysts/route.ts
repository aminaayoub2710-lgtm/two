import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { runAIAnalystWorkflow } from "../../../../workflows/run-ai-analyst"
import type { AnalystType } from "../../../../modules/ai-gateway/analysts"

const SUPPORTED_ANALYSTS: AnalystType[] = ["sales", "inventory", "customer"]

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body || {}) as {
    analystType?: AnalystType
    data?: unknown
  }

  if (!body.analystType || !SUPPORTED_ANALYSTS.includes(body.analystType)) {
    res.status(400).json({
      error: "analystType must be one of: sales, inventory, customer",
    })
    return
  }

  if (!body.data) {
    res.status(400).json({ error: "data is required" })
    return
  }

  const { result } = await runAIAnalystWorkflow(req.scope).run({
    input: {
      analystType: body.analystType,
      commerceData: body.data,
    },
  })

  res.json({ status: "success", result })
}
