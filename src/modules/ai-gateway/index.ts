import { Module } from "@medusajs/framework/utils"
import { AIGatewayService } from "./service"

export const AI_GATEWAY_MODULE = "aiGatewayModuleService"

export default Module(AI_GATEWAY_MODULE, {
  service: AIGatewayService,
})
