import { AIGatewayService } from "./service"

export class AIAnalystsService {
  private aiGateway: AIGatewayService

  constructor({ aiGateway }: { aiGateway: AIGatewayService }) {
    this.aiGateway = aiGateway
  }

  async analyzeSales(salesData: any): Promise<string> {
    const prompt = `As an expert Sales Analyst for an enterprise e-commerce platform, analyze the following sales data and provide actionable executive insights, revenue growth opportunities, and anomaly detection:
    ${JSON.stringify(salesData, null, 2)}`
    return await this.aiGateway.generateText(prompt)
  }

  async analyzeInventory(inventoryData: any): Promise<string> {
    const prompt = `As an expert Inventory and Supply Chain Analyst, review the following stock data, identify dead stock risks, slow-moving items, and recommend reorder thresholds:
    ${JSON.stringify(inventoryData, null, 2)}`
    return await this.aiGateway.generateText(prompt)
  }

  async analyzeCustomerRFM(customerData: any): Promise<string> {
    const prompt = `As a Customer Intelligence Analyst, perform an RFM (Recency, Frequency, Monetary) segmentation analysis and churn prediction on the following customer data:
    ${JSON.stringify(customerData, null, 2)}`
    return await this.aiGateway.generateText(prompt)
  }
}
