export type PromptTemplate = {
  id: string
  title: string
  category: "sales" | "inventory" | "customer" | "pricing"
  prompt: string
  description: string
}

export const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: "exec-summary",
    title: "Executive Business Summary",
    category: "sales",
    description: "Generates a high-level executive review of revenue, conversion, and growth trends.",
    prompt: "You are CommerceMind AI Executive Analyst. Analyze the aggregate store sales metrics and return a structured JSON report with observations, risks, and recommendations.",
  },
  {
    id: "dead-stock",
    title: "Dead Stock & Inventory Optimization",
    category: "inventory",
    description: "Identifies slow-moving inventory and suggests markdown or bundling strategies.",
    prompt: "You are CommerceMind AI Inventory Specialist. Analyze inventory turnover and stock levels, then suggest specific liquidation or bundling actions for dead stock.",
  },
  {
    id: "rfm-churn",
    title: "Customer RFM & Churn Analysis",
    category: "customer",
    description: "Evaluates customer segments and predicts churn risk based on purchase frequency.",
    prompt: "You are CommerceMind AI Customer Intelligence Lead. Review RFM segments and historical order intervals to identify high-churn risk customer segments.",
  },
  {
    id: "dynamic-pricing",
    title: "Dynamic Price Elasticity",
    category: "pricing",
    description: "Recommends optimal price adjustments based on demand elasticity and margin targets.",
    prompt: "You are CommerceMind AI Pricing Strategist. Analyze product price points and sales velocity to recommend margin-accretive price adjustments.",
  },
]
