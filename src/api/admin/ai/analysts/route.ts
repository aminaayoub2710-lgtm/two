import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AI_GATEWAY_MODULE } from "../../../../modules/ai-gateway"
import { AIGatewayService } from "../../../../modules/ai-gateway/service"
import { AIAnalystsService } from "../../../../modules/ai-gateway/analysts"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const aiGateway: AIGatewayService = req.scope.resolve(AI_GATEWAY_MODULE)
  const analysts = new AIAnalystsService({ aiGateway })

  const { analystType, data } = req.body as {
    analystType: "sales" | "inventory" | "customer"
    data: any
  }

  if (!analystType || !data) {
    res.status(400).json({ error: "analystType and data are required." })
    return
  }

  let result = ""
  if (analystType === "sales") {
    result = await analysts.analyzeSales(data)
  } else if (analystType === "inventory") {
    result = await analysts.analyzeInventory(data)
  } else if (analystType === "customer") {
    result = await analysts.analyzeCustomerRFM(data)
  } else {
    res.status(400).json({ error: "Invalid analystType." })
    return
  }

  res.json({
    status: "success",
    analystType,
    insight: result,
  })
}
