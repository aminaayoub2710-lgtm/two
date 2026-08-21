import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavUtilities from "@modules/layout/components/nav-utilities"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import { getServerTranslator } from "@/i18n/server"

export default async function Nav() {
  const [regions, { t }] = await Promise.all([
    listRegions().then((availableRegions: StoreRegion[]) => availableRegions),
    getServerTranslator(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white dark:bg-[#0a0d12] border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus font-medium tracking-[0.08em] hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              CommerceMind AI
            </LocalizedClientLink>
          </div>

          <div className="hidden items-center gap-4 text-xs text-ui-fg-subtle md:flex">
            <LocalizedClientLink href="/store" className="cm-link">
              {t("navigation.shop")}
            </LocalizedClientLink>
            <LocalizedClientLink href="/collections" className="cm-link">
              {t("navigation.collections")}
            </LocalizedClientLink>
            <LocalizedClientLink href="/brands" className="cm-link">
              {t("navigation.brands")}
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-4 h-full flex-1 basis-0 justify-end">
            <LanguageSwitcher />
            <NavUtilities />
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <LocalizedClientLink
                className="cm-link text-xs"
                href="/account"
                data-testid="nav-account-link"
              >
                {t("navigation.account")}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="cm-link flex gap-2 text-xs"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  {t("navigation.cart")} (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
