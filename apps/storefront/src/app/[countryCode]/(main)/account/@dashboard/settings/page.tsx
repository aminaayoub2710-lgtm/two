import { Metadata } from "next"
import SettingsClient from "@modules/commerce/components/settings-client"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()
  return { title: t("account.settings"), description: t("settings.description") }
}

export default function SettingsPage() {
  return <SettingsClient />
}
