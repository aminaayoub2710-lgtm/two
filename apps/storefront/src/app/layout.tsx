import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import StorefrontProviders from "@modules/common/providers/storefront-providers"
import ServiceWorkerRegister from "@modules/common/components/service-worker-register"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "CommerceMind AI",
    template: "%s · CommerceMind AI",
  },
  description:
    "A considered commerce experience with intelligent discovery, fast checkout, and thoughtful service.",
  applicationName: "CommerceMind AI",
  manifest: "/manifest.webmanifest",
  themeColor: "#0a0d12",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <body>
        <StorefrontProviders>
          <ServiceWorkerRegister />
          <main className="relative">{props.children}</main>
        </StorefrontProviders>
      </body>
    </html>
  )
}
