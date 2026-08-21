"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { CheckIcon } from "@modules/common/components/icons"
import { useTranslations } from "@/i18n/client"

type ReviewInput = {
  name: string
  rating: number
  body: string
}
type Review = ReviewInput & { id: string }

export default function ProductReviews({ productId }: { productId: string }) {
  const { t } = useTranslations()
  const reviewSchema = z.object({
    name: z.string().trim().min(2, t("products.reviewName")),
    rating: z.coerce.number().int().min(1).max(5),
    body: z.string().trim().min(12, t("products.reviewBody")).max(600, t("common.error")),
  })
  const storageKey = `commercemind-reviews-${productId}`
  const [reviews, setReviews] = useState<Review[]>([])
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewInput>({ defaultValues: { rating: 5 } })

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    if (stored) setReviews(JSON.parse(stored))
  }, [storageKey])

  const onSubmit = (values: ReviewInput) => {
    const parsed = reviewSchema.safeParse(values)
    if (!parsed.success) return
    const next = [{ ...parsed.data, id: `${Date.now()}` }, ...reviews]
    setReviews(next)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
    reset({ name: "", rating: 5, body: "" })
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 2200)
  }

  return (
    <section className="content-container my-16 border-t border-ui-border-base pt-14 md:my-24">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="cm-eyebrow">{t("products.productNotes")}</p>
          <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] text-ui-fg-base">{t("products.reviewsTitle")}</h2>
          <p className="mt-4 text-sm leading-6 text-ui-fg-subtle">{t("products.reviewsDescription")}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="review-name" className="mb-2 block text-xs font-medium text-ui-fg-base">{t("products.reviewName")}</label>
              <input id="review-name" className="h-11 w-full rounded-xl border border-ui-border-base bg-ui-bg-base px-3 text-sm" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="review-rating" className="mb-2 block text-xs font-medium text-ui-fg-base">{t("products.rating")}</label>
              <select id="review-rating" className="h-11 w-full rounded-xl border border-ui-border-base bg-ui-bg-base px-3 text-sm" {...register("rating")}>
                <option value="5">5 — {t("products.exceptional")}</option>
                <option value="4">4 — {t("products.veryGood")}</option>
                <option value="3">3 — {t("products.good")}</option>
                <option value="2">2 — {t("products.needsWork")}</option>
                <option value="1">1 — {t("products.notForMe")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="review-body" className="mb-2 block text-xs font-medium text-ui-fg-base">{t("products.reviewBody")}</label>
              <textarea id="review-body" rows={5} className="w-full resize-none rounded-xl border border-ui-border-base bg-ui-bg-base p-3 text-sm" {...register("body")} />
              {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>}
            </div>
            <button type="submit" className="rounded-full bg-ui-fg-base px-5 py-3 text-sm font-medium text-ui-bg-base transition hover:opacity-80">{t("products.publishReview")}</button>
            <p className="text-sm text-emerald-600" aria-live="polite">{submitted ? <span className="inline-flex items-center gap-2"><CheckIcon size={15} /> {t("products.reviewSaved")}</span> : ""}</p>
          </form>
        </div>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="cm-surface flex min-h-56 items-center justify-center p-8 text-center text-sm leading-6 text-ui-fg-subtle">{t("products.noReviews")}</div>
          ) : reviews.map((review) => (
            <article key={review.id} className="cm-surface p-5">
              <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-medium text-ui-fg-base">{review.name}</h3><span className="text-sm tracking-[0.2em] text-amber-500">{"★".repeat(review.rating)}<span className="text-ui-fg-muted">{"★".repeat(5 - review.rating)}</span></span></div>
              <p className="mt-3 text-sm leading-6 text-ui-fg-subtle">{review.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
