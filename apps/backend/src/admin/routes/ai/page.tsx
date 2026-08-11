import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useState } from "react"

type MetricResponse = {
  status: string
  metrics: {
    period: string
    orderCount: number
    revenue: number
    averageOrderValue: number
    fulfilledOrderCount: number
    cancelledOrderCount: number
    currency: string
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>
  }
}

type InsightResponse = MetricResponse & { insight: string }

const formatNumber = (value: number, currency?: string) =>
  new Intl.NumberFormat(undefined, {
    style: currency ? "currency" : "decimal",
    currency: currency || undefined,
    maximumFractionDigits: 0,
  }).format(value)

const cardClass = "rounded-xl border border-ui-border-base bg-ui-bg-base p-5 shadow-elevation-card-rest"

const BusinessIntelligencePage = () => {
  const [period, setPeriod] = useState("30d")
  const [data, setData] = useState<MetricResponse | null>(null)
  const [insight, setInsight] = useState("")
  const [loading, setLoading] = useState(true)
  const [insightLoading, setInsightLoading] = useState(false)
  const [error, setError] = useState("")

  const loadMetrics = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/admin/ai/business-intelligence?period=${period}`)
      if (!response.ok) throw new Error("Unable to load commerce metrics")
      setData((await response.json()) as MetricResponse)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load metrics")
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    void loadMetrics()
  }, [loadMetrics])

  const runAnalysis = async () => {
    setInsightLoading(true)
    setError("")
    try {
      const response = await fetch(`/admin/ai/business-intelligence?period=${period}`, { method: "POST" })
      if (!response.ok) throw new Error("Unable to generate AI insight")
      const result = (await response.json()) as InsightResponse
      setInsight(result.insight)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate insight")
    } finally {
      setInsightLoading(false)
    }
  }

  const chartMax = useMemo(
    () => Math.max(...(data?.metrics.dailyRevenue.map((item) => item.revenue) || [1]), 1),
    [data]
  )

  return (
    <div className="bg-ui-bg-subtle min-h-full p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Text size="small" className="text-ui-fg-subtle">COMMERCE INTELLIGENCE</Text>
            <Heading level="h1" className="mt-1">AI Business Intelligence</Heading>
            <Text className="mt-2 max-w-2xl text-ui-fg-subtle">
              Decision-ready insights generated from your Medusa commerce data. This workspace never sends personal customer data to the model.
            </Text>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((option) => (
              <Button
                key={option}
                size="small"
                variant={period === option ? "primary" : "secondary"}
                onClick={() => setPeriod(option)}
              >
                {option}
              </Button>
            ))}
            <Button size="small" variant="secondary" onClick={() => void loadMetrics()}>
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-ui-tag-red-border bg-ui-tag-red-bg px-4 py-3 text-ui-tag-red-text">
            {error}. Configure an AI provider or verify the backend connection, then retry.
          </div>
        ) : null}

        {loading ? (
          <Container className="animate-pulse">Loading commerce metrics…</Container>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className={cardClass}>
                <Text size="small" className="text-ui-fg-subtle">Revenue</Text>
                <div className="mt-3 text-3xl font-semibold text-ui-fg-base">{formatNumber(data.metrics.revenue, data.metrics.currency)}</div>
                <Text size="small" className="mt-2 text-ui-fg-subtle">Selected period</Text>
              </div>
              <div className={cardClass}>
                <Text size="small" className="text-ui-fg-subtle">Orders</Text>
                <div className="mt-3 text-3xl font-semibold text-ui-fg-base">{formatNumber(data.metrics.orderCount)}</div>
                <Text size="small" className="mt-2 text-ui-fg-subtle">Completed and active orders</Text>
              </div>
              <div className={cardClass}>
                <Text size="small" className="text-ui-fg-subtle">Average order value</Text>
                <div className="mt-3 text-3xl font-semibold text-ui-fg-base">{formatNumber(data.metrics.averageOrderValue, data.metrics.currency)}</div>
                <Text size="small" className="mt-2 text-ui-fg-subtle">Revenue divided by orders</Text>
              </div>
              <div className={cardClass}>
                <Text size="small" className="text-ui-fg-subtle">Fulfillment rate</Text>
                <div className="mt-3 text-3xl font-semibold text-ui-fg-base">
                  {data.metrics.orderCount ? Math.round((data.metrics.fulfilledOrderCount / data.metrics.orderCount) * 100) : 0}%
                </div>
                <Text size="small" className="mt-2 text-ui-fg-subtle">{data.metrics.cancelledOrderCount} cancelled orders</Text>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
              <Container className="p-0">
                <div className="border-b border-ui-border-base px-6 py-5">
                  <Heading level="h2">Revenue trend</Heading>
                  <Text size="small" className="mt-1 text-ui-fg-subtle">Daily order revenue in {data.metrics.currency}</Text>
                </div>
                <div className="flex h-72 items-end gap-2 overflow-x-auto px-6 py-6">
                  {data.metrics.dailyRevenue.length ? data.metrics.dailyRevenue.map((item) => (
                    <div key={item.date} className="flex min-w-7 flex-1 flex-col items-center gap-2">
                      <div className="flex h-52 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-ui-bg-interactive"
                          style={{ height: `${Math.max((item.revenue / chartMax) * 100, 3)}%` }}
                          title={`${item.date}: ${formatNumber(item.revenue, data.metrics.currency)}`}
                        />
                      </div>
                      <span className="text-[10px] text-ui-fg-subtle">{item.date.slice(5)}</span>
                    </div>
                  )) : (
                    <div className="flex w-full items-center justify-center text-ui-fg-subtle">No orders in this period.</div>
                  )}
                </div>
              </Container>

              <Container className="p-0">
                <div className="flex items-center justify-between border-b border-ui-border-base px-6 py-5">
                  <div>
                    <Heading level="h2">Executive analysis</Heading>
                    <Text size="small" className="mt-1 text-ui-fg-subtle">Commerce-only AI summary</Text>
                  </div>
                  <Button size="small" onClick={() => void runAnalysis()} disabled={insightLoading}>
                    {insightLoading ? "Analyzing…" : "Analyze"}
                  </Button>
                </div>
                <div className="min-h-72 whitespace-pre-wrap px-6 py-5 text-sm leading-6 text-ui-fg-subtle">
                  {insight || "Run an analysis to generate observations, risks, and recommended actions from the selected period."}
                </div>
              </Container>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "AI Business Intelligence",
  rank: 1,
})

export default BusinessIntelligencePage
