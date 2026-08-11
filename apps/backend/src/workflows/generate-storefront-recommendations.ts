import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { AI_GATEWAY_MODULE } from "../modules/ai-gateway"
import type AIGatewayService from "../modules/ai-gateway/service"

type RecommendationInput = { prompt: string }

const generateRecommendationExplanationStep = createStep(
  "generate-recommendation-explanation",
  async ({ prompt }: RecommendationInput, { container }) => {
    const aiGateway = container.resolve<AIGatewayService>(AI_GATEWAY_MODULE)
    try {
      const result = await aiGateway.generateText({ prompt, temperature: 0.3 })
      return new StepResponse(result)
    } catch {
      return new StepResponse({ content: "Selected from the live CommerceMind catalog.", provider: "fallback", model: "deterministic" })
    }
  }
)

export const generateStorefrontRecommendationsWorkflow = createWorkflow(
  "generate-storefront-recommendations",
  (input: RecommendationInput) => {
    const result = generateRecommendationExplanationStep(input)
    return new WorkflowResponse(result)
  }
)
