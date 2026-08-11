export type CommerceOrder = {
  id: string
  total?: number | null
  created_at?: string | Date | null
  status?: string | null
  currency_code?: string | null
}

export type BusinessIntelligenceMetrics = {
  period: string
  orderCount: number
  revenue: number
  averageOrderValue: number
  fulfilledOrderCount: number
  cancelledOrderCount: number
  currency: string
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>
}

const round = (value: number) => Math.round(value * 100) / 100

export function calculateBusinessIntelligence(
  orders: CommerceOrder[],
  period: string,
  currency = "USD"
): BusinessIntelligenceMetrics {
  const daily = new Map<string, { revenue: number; orders: number }>()
  let revenue = 0
  let fulfilledOrderCount = 0
  let cancelledOrderCount = 0

  for (const order of orders) {
    const amount = Number(order.total || 0)
    const date = new Date(order.created_at || Date.now()).toISOString().slice(0, 10)
    const day = daily.get(date) || { revenue: 0, orders: 0 }
    day.revenue += amount
    day.orders += 1
    daily.set(date, day)
    revenue += amount

    if (order.status === "completed" || order.status === "fulfilled") fulfilledOrderCount += 1
    if (order.status === "canceled" || order.status === "cancelled") cancelledOrderCount += 1
  }

  const orderCount = orders.length
  return {
    period,
    orderCount,
    revenue: round(revenue),
    averageOrderValue: round(orderCount ? revenue / orderCount : 0),
    fulfilledOrderCount,
    cancelledOrderCount,
    currency,
    dailyRevenue: [...daily.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, values]) => ({
        date,
        revenue: round(values.revenue),
        orders: values.orders,
      })),
  }
}
