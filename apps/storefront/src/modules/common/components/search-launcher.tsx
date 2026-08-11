"use client"

import { SearchIcon } from "@modules/common/components/icons"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SearchLauncher({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const params = useParams<{ countryCode: string }>()
  const current = useSearchParams().get("q") || ""
  const [query, setQuery] = useState(current)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    router.push(`/${params.countryCode}/search${value ? `?q=${encodeURIComponent(value)}` : ""}`)
  }

  return (
    <form onSubmit={submit} className={compact ? "w-full" : "w-full max-w-md"} role="search">
      <label className="sr-only" htmlFor="storefront-search">Search products</label>
      <div className="relative">
        <SearchIcon size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
        <input
          id="storefront-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the collection"
          className="h-10 w-full rounded-full border border-ui-border-base bg-ui-bg-subtle pl-10 pr-4 text-sm text-ui-fg-base placeholder:text-ui-fg-muted focus:border-ui-fg-base focus:outline-none"
        />
      </div>
    </form>
  )
}
