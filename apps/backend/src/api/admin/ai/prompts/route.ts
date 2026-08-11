import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PROMPT_LIBRARY } from "../../../../modules/ai-gateway/prompts"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    status: "success",
    prompts: PROMPT_LIBRARY,
  })
}
