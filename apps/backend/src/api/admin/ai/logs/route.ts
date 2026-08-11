import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AI_GATEWAY_MODULE } from "../../../../modules/ai-gateway"
import type AIGatewayService from "../../../../modules/ai-gateway/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const aiGateway = req.scope.resolve<AIGatewayService>(AI_GATEWAY_MODULE)
  const logs = aiGateway.getLogs()
  const metrics = aiGateway.getUsageMetrics()

  res.json({
    status: "success",
    metrics,
    logs,
  })
}
