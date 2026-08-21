import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, isAppLocale, normalizeLocale, type AppLocale } from "./i18n/config"

const BACKEND_URL =
  process.env.MEDUSA_INTERNAL_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "dk"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable."
    )
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    const response = await fetch(`${BACKEND_URL}/store/regions`, {
      method: "GET",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
      cache: "force-cache",
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const json = await response.json()
    const { regions } = json

    if (!regions?.length) {
      return new Map<string, HttpTypes.StoreRegion>()
    }

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((country) => {
        regionMapCache.regionMap.set(country.iso_2 ?? "", region)
      })
    })
    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>,
  urlCountryCode?: string
) {
  const cloudflareCountryCode = (
    request as { cf?: { country?: string } }
  ).cf?.country?.toLowerCase()
  const vercelCountryCode = request.headers
    .get("x-vercel-ip-country")
    ?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    return urlCountryCode
  }
  if (cloudflareCountryCode && regionMap.has(cloudflareCountryCode)) {
    return cloudflareCountryCode
  }
  if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
    return vercelCountryCode
  }
  if (regionMap.has(DEFAULT_REGION)) {
    return DEFAULT_REGION
  }
  return regionMap.keys().next().value
}

function withCommerceHeaders(
  request: NextRequest,
  locale: AppLocale,
  countryCode: string
) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-commerce-locale", locale)
  requestHeaders.set("x-commerce-country", countryCode)
  return requestHeaders
}

function setCacheCookie(response: NextResponse, cacheId: string, hasCookie: boolean) {
  if (!hasCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }
  return response
}

function setLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set("_medusa_locale", normalizeLocale(locale), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
  return response
}

/**
 * Handles locale prefixes independently from Medusa country/region routing.
 * Public URLs are `/[locale]/[countryCode]/...`, while the existing App Router
 * remains `/[countryCode]/...` internally. Locale URLs are rewritten to the
 * existing region route so all Medusa data fetching and cart behavior remains
 * unchanged. Legacy `/dk/...` URLs remain valid and use English by default.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()
  const regionMap = await getRegionMap(cacheId)
  const segments = request.nextUrl.pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]?.toLowerCase()
  const hasLocale = isAppLocale(firstSegment)
  const locale: AppLocale = hasLocale ? firstSegment : defaultLocale
  const urlCountryCode = segments[hasLocale ? 1 : 0]?.toLowerCase()
  const countryCode =
    (await getCountryCode(request, regionMap, urlCountryCode)) || DEFAULT_REGION
  const urlHasCountry = !!urlCountryCode && regionMap.has(urlCountryCode)

  if (hasLocale && urlHasCountry) {
    const internalPath = `/${segments.slice(1).join("/")}` || `/${countryCode}`
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = internalPath
    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: withCommerceHeaders(request, locale, countryCode),
      },
    })
    return setLocaleCookie(setCacheCookie(response, cacheId, !!cacheIdCookie), locale)
  }

  if (!hasLocale && urlHasCountry) {
    const response = NextResponse.next({
      request: {
        headers: withCommerceHeaders(request, defaultLocale, countryCode),
      },
    })
    return setLocaleCookie(setCacheCookie(response, cacheId, !!cacheIdCookie), locale)
  }

  const pathAfterLocale = hasLocale
    ? `/${segments.slice(1).join("/")}`
    : request.nextUrl.pathname
  const redirectPath = pathAfterLocale === "/" ? "" : pathAfterLocale
  const queryString = request.nextUrl.search || ""
  const redirectUrl = `${request.nextUrl.origin}/${locale}/${countryCode}${redirectPath}${queryString}`
  const response = NextResponse.redirect(redirectUrl, 307)
  return setLocaleCookie(setCacheCookie(response, cacheId, !!cacheIdCookie), locale)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
