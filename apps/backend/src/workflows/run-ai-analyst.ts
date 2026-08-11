import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AI_GATEWAY_MODULE } from "../modules/ai-gateway"
import {
  AIAnalystsService,
  type AnalystType,
} from "../modules/ai-gateway/analysts"
import type AIGatewayService from "../modules/ai-gateway/service"

type RunAIAnalystInput = {
  analystType: AnalystType
  commerceData: unknown
}

const runAIAnalystStep = createStep(
  "run-ai-analyst",
  async ({ analystType, commerceData }: RunAIAnalystInput, { container }) => {
    const aiGateway = container.resolve<AIGatewayService>(AI_GATEWAY_MODULE)
    const analysts = new AIAnalystsService(aiGateway)
    const result = await analysts.analyze(analystType, commerceData)
    return new StepResponse(result)
  }
)

export const runAIAnalystWorkflow = createWorkflow(
  "run-ai-analyst",
  (input: RunAIAnalystInput) => {
    const result = runAIAnalystStep(input)
    return new WorkflowResponse(result)
  }
)
