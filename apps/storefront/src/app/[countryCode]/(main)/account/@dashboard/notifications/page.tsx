import { Metadata } from "next"
import NotificationsClient from "@modules/commerce/components/notifications-client"

export const metadata: Metadata = { title: "Notifications", description: "Manage your CommerceMind notification preferences." }

export default function NotificationsPage() {
  return <NotificationsClient />
}
