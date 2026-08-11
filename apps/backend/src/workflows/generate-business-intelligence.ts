import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AI_GATEWAY_MODULE } from "../modules/ai-gateway"
import type AIGatewayService from "../modules/ai-gateway/service"

type GenerateBusinessIntelligenceInput = {
  prompt: string
}

const generateBusinessIntelligenceStep = createStep(
  "generate-business-intelligence",
  async ({ prompt }: GenerateBusinessIntelligenceInput, { container }) => {
    const aiGateway = container.resolve<AIGatewayService>(AI_GATEWAY_MODULE)
    const result = await aiGateway.generateText({ prompt })
    return new StepResponse(result)
  }
)

export const generateBusinessIntelligenceWorkflow = createWorkflow(
  "generate-business-intelligence",
  (input: GenerateBusinessIntelligenceInput) => {
    const result = generateBusinessIntelligenceStep(input)
    return new WorkflowResponse(result)
  }
)
