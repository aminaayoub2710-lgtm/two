import { Metadata } from "next"
import WishlistClient from "@modules/commerce/components/wishlist-client"
import { getServerTranslator } from "@/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerTranslator()
  return { title: t("navigation.wishlist"), description: t("commerce.wishlistDescription") }
}

export default function WishlistPage() {
  return <WishlistClient />
}
