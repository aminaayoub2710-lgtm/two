import { MedusaError } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"

type ProviderName = "ollama" | "openai" | "gemini" | "anthropic" | "deepseek" | "openrouter"

type GenerateTextOptions = {
  prompt: string
  provider?: ProviderName
  model?: string
  temperature?: number
  jsonMode?: boolean
}

type ProviderConfig = {
  apiKey?: string
  baseUrl: string
  model: string
}

export type AILog = {
  id: string
  timestamp: string
  provider: ProviderName
  model: string
  promptLength: number
  responseLength: number
  estimatedTokens: number
  estimatedCostUsd: number
  status: "success" | "error"
}

const env = (name: string, fallback = "") => process.env[name] || fallback

export class AIGatewayService {
  private readonly logger: Logger
  private static logs: AILog[] = []

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger
  }

  private providerOrder(): ProviderName[] {
    return (env("AI_PROVIDER_ORDER", "ollama,openai,gemini,anthropic,deepseek,openrouter")
      .split(",")
      .map((provider) => provider.trim().toLowerCase())
      .filter(Boolean) as ProviderName[])
  }

  private configFor(provider: ProviderName, model?: string): ProviderConfig {
    const configs: Record<ProviderName, ProviderConfig> = {
      ollama: {
        baseUrl: env("OLLAMA_BASE_URL", "http://localhost:11434"),
        model: model || env("OLLAMA_MODEL", "llama3.2"),
      },
      openai: {
        apiKey: env("OPENAI_API_KEY"),
        baseUrl: env("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        model: model || env("OPENAI_MODEL", "gpt-4o-mini"),
      },
      gemini: {
        apiKey: env("GEMINI_API_KEY"),
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        model: model || env("GEMINI_MODEL", "gemini-2.0-flash"),
      },
      anthropic: {
        apiKey: env("ANTHROPIC_API_KEY"),
        baseUrl: "https://api.anthropic.com/v1",
        model: model || env("ANTHROPIC_MODEL", "claude-3-5-haiku-latest"),
      },
      deepseek: {
        apiKey: env("DEEPSEEK_API_KEY"),
        baseUrl: env("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1"),
        model: model || env("DEEPSEEK_MODEL", "deepseek-chat"),
      },
      openrouter: {
        apiKey: env("OPENROUTER_API_KEY"),
        baseUrl: env("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
        model: model || env("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
      },
    }

    return configs[provider]
  }

  private hasCredentials(provider: ProviderName, config: ProviderConfig) {
    return provider === "ollama" || Boolean(config.apiKey)
  }

  private recordLog(log: Omit<AILog, "id" | "timestamp">) {
    const fullLog: AILog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log,
    }
    AIGatewayService.logs.unshift(fullLog)
    if (AIGatewayService.logs.length > 100) {
      AIGatewayService.logs.pop()
    }
  }

  getLogs(): AILog[] {
    return AIGatewayService.logs
  }

  getUsageMetrics() {
    const totalRequests = AIGatewayService.logs.length
    const totalTokens = AIGatewayService.logs.reduce((sum, l) => sum + l.estimatedTokens, 0)
    const totalCost = AIGatewayService.logs.reduce((sum, l) => sum + l.estimatedCostUsd, 0)
    return { totalRequests, totalTokens, totalCostUsd: Number(totalCost.toFixed(4)) }
  }

  private async generateWithOllama(config: ProviderConfig, options: GenerateTextOptions) {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        prompt: options.prompt,
        stream: false,
        options: { temperature: options.temperature ?? 0.2 },
        format: options.jsonMode ? "json" : undefined,
      }),
    })

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Ollama responded with ${response.status}`
      )
    }

    const data = (await response.json()) as { response?: string }
    return data.response || ""
  }

  private async generateWithOpenAICompatible(
    provider: ProviderName,
    config: ProviderConfig,
    options: GenerateTextOptions
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    }
    if (provider === "openrouter") {
      headers["HTTP-Referer"] = env("OPENROUTER_SITE_URL", "http://localhost:9000")
      headers["X-Title"] = "CommerceMind AI"
    }
    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        temperature: options.temperature ?? 0.2,
        messages: [{ role: "user", content: options.prompt }],
        response_format: options.jsonMode ? { type: "json_object" } : undefined,
      }),
    })
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `${provider} responded with ${response.status}`
      )
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    return data.choices?.[0]?.message?.content || ""
  }

  private async generateWithGemini(config: ProviderConfig, options: GenerateTextOptions) {
    const response = await fetch(
      `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: options.prompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            responseMimeType: options.jsonMode ? "application/json" : undefined,
          },
        }),
      }
    )
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Gemini responded with ${response.status}`
      )
    }
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  }

  private async generateWithAnthropic(config: ProviderConfig, options: GenerateTextOptions) {
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 2048,
        temperature: options.temperature ?? 0.2,
        messages: [{ role: "user", content: options.prompt }],
      }),
    })
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Anthropic responded with ${response.status}`
      )
    }
    const data = (await response.json()) as { content?: Array<{ text?: string }> }
    return data.content?.[0]?.text || ""
  }

  private async generateWithProvider(
    provider: ProviderName,
    config: ProviderConfig,
    options: GenerateTextOptions
  ) {
    if (provider === "ollama") return this.generateWithOllama(config, options)
    if (provider === "gemini") return this.generateWithGemini(config, options)
    if (provider === "anthropic") return this.generateWithAnthropic(config, options)
    return this.generateWithOpenAICompatible(provider, config, options)
  }

  async generateText(options: GenerateTextOptions): Promise<{
    content: string
    provider: ProviderName
    model: string
  }> {
    const providers = options.provider ? [options.provider] : this.providerOrder()
    const failures: string[] = []

    for (const provider of providers) {
      const config = this.configFor(provider, options.model)
      if (!config || !this.hasCredentials(provider, config)) {
        continue
      }

      try {
        const content = await this.generateWithProvider(provider, config, options)
        if (content) {
          const promptLength = options.prompt.length
          const responseLength = content.length
          const estimatedTokens = Math.round((promptLength + responseLength) / 4)
          const estimatedCostUsd = provider === "ollama" ? 0 : Number((estimatedTokens * 0.000002).toFixed(6))
          this.recordLog({
            provider,
            model: config.model,
            promptLength,
            responseLength,
            estimatedTokens,
            estimatedCostUsd,
            status: "success",
          })
          return { content, provider, model: config.model }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown provider error"
        failures.push(`${provider}: ${message}`)
        this.logger.warn(`[CommerceMind AI] Provider fallback: ${provider} failed`)
      }
    }

    this.logger.error(`[CommerceMind AI] No provider returned a response: ${failures.join(" | ")}`)
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "No configured AI provider is available"
    )
  }
}

export default AIGatewayService
