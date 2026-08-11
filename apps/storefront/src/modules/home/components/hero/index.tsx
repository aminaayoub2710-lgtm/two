import { Button, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden border-b border-ui-border-base bg-[#0a0d12] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_18%,rgba(87,171,255,0.22),transparent_30%),radial-gradient(circle_at_16%_82%,rgba(151,95,255,0.18),transparent_30%)]" />
      <div className="absolute right-[-10%] top-[-30%] -z-10 h-[620px] w-[620px] rounded-full border border-white/10" />
      <div className="absolute right-[-5%] top-[-20%] -z-10 h-[470px] w-[470px] rounded-full border border-white/10" />

      <div className="content-container grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
            Commerce intelligence, reimagined
          </div>
          <Heading level="h1" className="max-w-xl text-5xl font-medium leading-[0.98] tracking-[-0.05em] text-white sm:text-7xl">
            Shop with more clarity.
          </Heading>
          <p className="mt-7 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
            CommerceMind brings considered products, fast checkout, and intelligent recommendations into one calm, high-performance shopping experience.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store">
              <Button className="border-white bg-white text-[#0a0d12] hover:bg-white/90" size="large">
                Explore the collection
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/collections">
              <Button className="border-white/20 bg-white/5 text-white hover:bg-white/10" size="large" variant="secondary">
                View collections
              </Button>
            </LocalizedClientLink>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-white/10 pt-5">
            <div>
              <p className="text-2xl font-medium tracking-tight">AI</p>
              <p className="mt-1 text-xs text-white/45">intent-aware discovery</p>
            </div>
            <div>
              <p className="text-2xl font-medium tracking-tight">Fast</p>
              <p className="mt-1 text-xs text-white/45">focused browsing</p>
            </div>
            <div>
              <p className="text-2xl font-medium tracking-tight">Care</p>
              <p className="mt-1 text-xs text-white/45">thoughtful service</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -left-5 top-12 hidden w-40 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">For you</p>
            <p className="mt-2 text-sm font-medium">Curated by intent</p>
            <div className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" />
          </div>
          <div className="relative aspect-[0.92] overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#1b2938] via-[#111820] to-[#1a122b] p-5 shadow-2xl shadow-blue-950/40 sm:p-7">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/45">
              <span>Edition 01</span>
              <span>CM / AI</span>
            </div>
            <div className="absolute left-[14%] top-[21%] h-[58%] w-[72%] rounded-[45%] bg-[radial-gradient(ellipse_at_35%_25%,rgba(255,255,255,0.9),transparent_7%),linear-gradient(135deg,#9dd5ff_0%,#4c75ce_42%,#6c3e9e_100%)] shadow-[0_36px_90px_rgba(51,96,190,0.45)] rotate-[-14deg]" />
            <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between sm:bottom-9 sm:left-8 sm:right-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Featured drop</p>
                <p className="mt-2 text-xl font-medium tracking-tight">Signal / Form</p>
              </div>
              <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/70">01 — 24</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-2 w-44 rounded-2xl border border-white/15 bg-[#111820]/85 p-4 shadow-2xl backdrop-blur-xl sm:-right-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">Match score</span>
              <span className="text-xs text-cyan-200">98%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full w-[98%] rounded-full bg-cyan-300" /></div>
            <p className="mt-3 text-xs leading-5 text-white/55">Selected from your taste profile.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
