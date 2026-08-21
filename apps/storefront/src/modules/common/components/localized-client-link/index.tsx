"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"
import { isAppLocale, localeFromPathname } from "@/i18n/config"

const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: unknown
}) => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const pathname = usePathname() || "/en/dk"
  const pathSegments = pathname.split("/").filter(Boolean)
  const currentLocale = localeFromPathname(pathname)
  const pathCountryCode = isAppLocale(pathSegments[0]) ? pathSegments[1] : pathSegments[0]
  const currentCountryCode = pathCountryCode || countryCode || "dk"
  const normalizedHref = href.startsWith("/") ? href : `/${href}`
  const target = `/${currentLocale}/${currentCountryCode}${normalizedHref === "/" ? "" : normalizedHref}`

  return (
    <Link href={target} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
