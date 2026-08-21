import { Metadata } from "next"
import CompareClient from "@modules/commerce/components/compare-client"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()
  return { title: t("navigation.compare"), description: t("commerce.compareDescription") }
}

export default function ComparePage() {
  return <CompareClient />
}
