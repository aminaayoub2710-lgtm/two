import { Metadata } from "next"
import NotificationsClient from "@modules/commerce/components/notifications-client"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()
  return { title: t("account.notifications"), description: t("notifications.description") }
}

export default function NotificationsPage() {
  return <NotificationsClient />
}
