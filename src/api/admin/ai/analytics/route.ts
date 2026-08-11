import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AI_GATEWAY_MODULE } from "../../../../modules/ai-gateway"
import { AIGatewayService } from "../../../../modules/ai-gateway/service"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const aiGatewayService: AIGatewayService = req.scope.resolve(AI_GATEWAY_MODULE)
  const { prompt, model } = req.body as { prompt: string; model?: string }

  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." })
    return
  }

  const analysis = await aiGatewayService.generateText(prompt, model || "llama3")

  res.json({
    status: "success",
    provider: "CommerceMind AI Gateway",
    analysis,
  })
}
