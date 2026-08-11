"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useStorefrontStore } from "@lib/storefront-store"

function ThemeSync() {
  const theme = useStorefrontStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.mode = theme
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return null
}

export default function StorefrontProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      {children}
    </QueryClientProvider>
  )
}
