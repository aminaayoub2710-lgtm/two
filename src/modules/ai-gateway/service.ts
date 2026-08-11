import { Logger } from "@medusajs/framework/types"

export interface AIOptions {
  ollamaUrl?: string
  openaiApiKey?: string
  defaultProvider?: string
}

export class AIGatewayService {
  private logger: Logger
  private options: AIOptions

  constructor({ logger }: { logger: Logger }, options: AIOptions) {
    this.logger = logger
    this.options = {
      ollamaUrl: options.ollamaUrl || "http://localhost:11434",
      openaiApiKey: options.openaiApiKey || process.env.OPENAI_API_KEY || "",
      defaultProvider: options.defaultProvider || "ollama",
    }
  }

  async generateText(prompt: string, model: string = "llama3"): Promise<string> {
    // Try Ollama first if configured or available
    try {
      this.logger.info(`[AIGateway] Trying Ollama with model ${model}...`)
      const res = await fetch(`${this.options.ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        return data.response || "No response from Ollama."
      }
    } catch (e) {
      this.logger.warn(`[AIGateway] Ollama unavailable, falling back to OpenAI/Cloud API...`)
    }

    // Fallback to OpenAI if available
    if (this.options.openaiApiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.options.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
          }),
        })

        if (res.ok) {
          const data = await res.json()
          return data.choices[0]?.message?.content || "No response from OpenAI."
        }
      } catch (e) {
        this.logger.error(`[AIGateway] OpenAI fallback failed: ${e.message}`)
      }
    }

    return "Error: All AI providers (Ollama & Cloud APIs) failed or are unconfigured."
  }
}
