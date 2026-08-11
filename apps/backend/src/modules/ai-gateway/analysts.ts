import type AIGatewayService from "./service"

export type AnalystType = "sales" | "inventory" | "customer"

const analystInstructions: Record<AnalystType, string> = {
  sales: "Act as a senior sales analyst. Identify revenue trends, order anomalies, growth opportunities, and measurable next actions.",
  inventory: "Act as an inventory and supply-chain analyst. Identify stock risks, dead stock, slow movers, and reorder opportunities.",
  customer: "Act as a customer intelligence analyst. Segment the supplied aggregate data, identify retention risks, and recommend lifecycle actions.",
}

export class AIAnalystsService {
  constructor(private readonly aiGateway: AIGatewayService) {}

  buildPrompt(type: AnalystType, commerceData: unknown) {
    return [
      `You are CommerceMind AI. ${analystInstructions[type]}`,
      "Use only the supplied commerce data. Never infer or output a customer's name, email, address, payment details, or other personal data.",
      "Return a concise result with Observations, Risks, and Recommended Actions headings.",
      JSON.stringify(commerceData),
    ].join("\n\n")
  }

  async analyze(type: AnalystType, commerceData: unknown) {
    const result = await this.aiGateway.generateText({
      prompt: this.buildPrompt(type, commerceData),
    })

    return {
      analystType: type,
      ...result,
    }
  }
}
