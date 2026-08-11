import { Metadata } from "next"
import CompareClient from "@modules/commerce/components/compare-client"

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare your saved CommerceMind products side by side.",
}

export default function ComparePage() {
  return <CompareClient />
}
