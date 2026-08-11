import { Metadata } from "next"
import SettingsClient from "@modules/commerce/components/settings-client"

export const metadata: Metadata = { title: "Settings", description: "Manage your CommerceMind account experience." }

export default function SettingsPage() {
  return <SettingsClient />
}
