import { Metadata } from "next"
import WishlistClient from "@modules/commerce/components/wishlist-client"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved CommerceMind products.",
}

export default function WishlistPage() {
  return <WishlistClient />
}
