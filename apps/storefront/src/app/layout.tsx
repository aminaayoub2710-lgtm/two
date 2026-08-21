import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import StorefrontProviders from "@modules/common/providers/storefront-providers"
import ServiceWorkerRegister from "@modules/common/components/service-worker-register"
import { localeDirections, locales } from "@/i18n/config"
import { getRequestCountryCode, getRequestLocale } from "@/i18n/server"
import { translate } from "@/i18n/messages"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale()
  const countryCode = await getRequestCountryCode()
  const basePath = `/${locale}/${countryCode}`

  return {
    metadataBase: new URL(getBaseURL()),
    title: {
      default: translate(locale, "home.title"),
      template: `%s · CommerceMind AI`,
    },
    description: translate(locale, "home.description"),
    applicationName: "CommerceMind AI",
    manifest: "/manifest.webmanifest",
    themeColor: "#0a0d12",
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    alternates: {
      canonical: basePath,
      languages: {
        ...Object.fromEntries(
          locales.map((supportedLocale) => [
            supportedLocale,
            `/${supportedLocale}/${countryCode}`,
          ])
        ),
        "x-default": `/en/${countryCode}`,
      },
    },
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getRequestLocale()

  return (
    <html
      lang={locale}
      dir={localeDirections[locale]}
      data-mode="light"
      suppressHydrationWarning
    >
      <body>
        <StorefrontProviders>
          <ServiceWorkerRegister />
          <main className="relative">{props.children}</main>
        </StorefrontProviders>
      </body>
    </html>
  )
}
