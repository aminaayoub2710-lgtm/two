"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SavedProduct = {
  id: string
  handle: string
  title: string
  thumbnail?: string | null
  price?: string
}

type StorefrontState = {
  wishlist: SavedProduct[]
  comparison: SavedProduct[]
  theme: "light" | "dark"
  recommendationsEnabled: boolean
  orderNotificationsEnabled: boolean
  marketingNotificationsEnabled: boolean
  toggleWishlist: (product: SavedProduct) => void
  removeWishlist: (id: string) => void
  toggleComparison: (product: SavedProduct) => void
  clearComparison: () => void
  setTheme: (theme: "light" | "dark") => void
  setRecommendationsEnabled: (enabled: boolean) => void
  setOrderNotificationsEnabled: (enabled: boolean) => void
  setMarketingNotificationsEnabled: (enabled: boolean) => void
}

export const useStorefrontStore = create<StorefrontState>()(
  persist(
    (set) => ({
      wishlist: [],
      comparison: [],
      theme: "light",
      recommendationsEnabled: true,
      orderNotificationsEnabled: true,
      marketingNotificationsEnabled: false,
      toggleWishlist: (product) =>
        set((state) => ({
          wishlist: state.wishlist.some((item) => item.id === product.id)
            ? state.wishlist.filter((item) => item.id !== product.id)
            : [...state.wishlist, product],
        })),
      removeWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        })),
      toggleComparison: (product) =>
        set((state) => {
          const exists = state.comparison.some((item) => item.id === product.id)
          if (exists) {
            return {
              comparison: state.comparison.filter((item) => item.id !== product.id),
            }
          }
          if (state.comparison.length >= 4) {
            return state
          }
          return { comparison: [...state.comparison, product] }
        }),
      clearComparison: () => set({ comparison: [] }),
      setTheme: (theme) => set({ theme }),
      setRecommendationsEnabled: (enabled) =>
        set({ recommendationsEnabled: enabled }),
      setOrderNotificationsEnabled: (enabled: boolean) =>
        set({ orderNotificationsEnabled: enabled }),
      setMarketingNotificationsEnabled: (enabled: boolean) =>
        set({ marketingNotificationsEnabled: enabled }),
    }),
    {
      name: "commercemind-storefront",
      partialize: (state) => ({
        wishlist: state.wishlist,
        comparison: state.comparison,
        theme: state.theme,
        recommendationsEnabled: state.recommendationsEnabled,
        orderNotificationsEnabled: state.orderNotificationsEnabled,
        marketingNotificationsEnabled: state.marketingNotificationsEnabled,
      }),
    }
  )
)
