import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { GalleryImage } from '@/components/GalleryImage'
import { HomeHero } from '@/components/home/HomeHero'
import { SacredAbodeShowcase } from '@/components/home/SacredAbodeShowcase'
import { ScrollReveal } from '@/components/spiritual'
import {
  DARSHAN_HIGHLIGHT_DEFAULT,
  FEATURED_SEVA,
  IMAGE_SLOTS,
  TEMPLE_INTRO_DEFAULT,
} from '@/content/siteMedia'
import { SACRED_ABODE_IMAGE } from '@/content/spiritualMedia'
import { getFestivalTiming, mergeFestivals, partitionFestivals, pickComingFestival } from '@/lib/festivals'
import { FestivalCard } from '@/components/festivals/FestivalCard'
import type { Festival } from '@/types'

type HomepageData = Record<string, unknown>

function HomePageSkeleton() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gold-200 border-t-gold-500" />
        <p className="mt-4 text-sm font-medium text-maroon-800/80">Loading festivals…</p>
      </div>
    </div>
  )
}

export function HomePage() {
  const [home, setHome] = useState<HomepageData>({})
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [festivalList, setFestivalList] = useState<Festival[]>([])
  const [festivalsLoading, setFestivalsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [homeRes, festRes] = await Promise.allSettled([
          api.get<HomepageData>('/public/homepage'),
          api.get<Festival[]>('/public/festivals'),
        ])

        if (cancelled) return

        if (homeRes.status === 'fulfilled') {
          setHome(homeRes.value.data ?? {})
        }

        const merged = mergeFestivals(
          festRes.status === 'fulfilled' ? festRes.value.data : [],
        )
        setFestivalList(merged)
        setFestivals(partitionFestivals(merged).coming.slice(0, 4))
      } catch (e) {
        console.warn('Home page data load failed:', e)
        const merged = mergeFestivals([])
        setFestivalList(merged)
        setFestivals(partitionFestivals(merged).coming.slice(0, 4))
      } finally {
        if (!cancelled) setFestivalsLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const introRaw = (home.temple_intro as Record<string, string>) || {}
  const intro = {
    heading: introRaw.heading || TEMPLE_INTRO_DEFAULT.heading,
    body: introRaw.body || TEMPLE_INTRO_DEFAULT.body,
    blessing: introRaw.blessing || TEMPLE_INTRO_DEFAULT.blessing,
    blessingAuthor: introRaw.blessingAuthor || TEMPLE_INTRO_DEFAULT.blessingAuthor,
  }
  const highlight = {
    quote: (home.darshan_highlight as Record<string, string>)?.quote || DARSHAN_HIGHLIGHT_DEFAULT.quote,
    attribution: (home.darshan_highlight as Record<string, string>)?.attribution || DARSHAN_HIGHLIGHT_DEFAULT.attribution,
  }
  const apiFeatured = (home.featured_donations as { items?: { title: string; description: string; href: string }[] })
    ?.items

  const sevaCards = useMemo(() => {
    return FEATURED_SEVA.map((def, i) => {
      const fromApi = apiFeatured?.[i]
      return {
        title: fromApi?.title ?? def.title,
        description: fromApi?.description ?? def.description,
        href: fromApi?.href ?? def.href,
        slot: IMAGE_SLOTS.featuredSeva[i],
      }
    })
  }, [apiFeatured])

  const comingFestival = useMemo(() => pickComingFestival(festivalList), [festivalList])

  return (
    <>
      <Seo
        title="ISKCON Dornala — Home"
        description="Sri Jagannath Temple, Hare Krishna Land — darshan, festivals, annadanam, and seva on the sacred Srisailam route."
      />

      <HomeHero />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="rounded-3xl border border-maroon-900/8 bg-cream-50/80 p-6 shadow-card md:p-10 lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <ScrollReveal className="relative order-2 lg:order-1">
                <SacredAbodeShowcase image={SACRED_ABODE_IMAGE} />
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="order-1 lg:order-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80">Sacred abode</p>
                <h2 className="mt-3 font-display text-3xl text-maroon-900 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
                  {intro.heading}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-maroon-800/90 md:text-lg">{intro.body}</p>

                <blockquote className="mt-8 rounded-2xl border border-gold-400/30 bg-white p-6 shadow-inner">
                  <p className="font-display text-lg italic leading-relaxed text-maroon-900/95 md:text-xl">
                    &ldquo;{highlight.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-sm font-medium text-maroon-700/80">— {highlight.attribution}</footer>
                </blockquote>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/about/srisailam"
                    className="btn-tap inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white px-6 py-3 text-sm font-semibold text-maroon-900 shadow-card"
                  >
                    Srisailam & Radha Krishna
                    <span aria-hidden>→</span>
                  </Link>
                  <Link
                    to="/gallery"
                    className="btn-tap inline-flex rounded-full border border-gold-400/40 bg-gold-50 px-6 py-3 text-sm font-semibold text-maroon-900"
                  >
                    Temple gallery
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-maroon-900/8 bg-cream-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl text-maroon-900">Featured seva</h2>
              <p className="mt-2 text-maroon-800/80">Support sacred offerings that nourish the community.</p>
            </div>
            <Link
              to="/donate"
              className="text-sm font-semibold text-maroon-800 underline decoration-gold-500/50 decoration-2 underline-offset-4"
            >
              View all categories →
            </Link>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sevaCards.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <article className="spiritual-card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-400/25 bg-white shadow-card">
                  <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
                    <GalleryImage
                      slot={item.slot}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/40 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl text-maroon-900">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-maroon-800/80">{item.description}</p>
                    <Link
                      to={item.href}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-maroon-800 hover:text-maroon-900"
                    >
                      Contribute →
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ScrollReveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-maroon-900">Coming festivals</h2>
            <Link
              to="/festivals"
              className="shrink-0 text-sm font-semibold text-maroon-800 underline decoration-gold-500/50 decoration-2 underline-offset-4"
            >
              Full calendar
            </Link>
          </ScrollReveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {festivalsLoading ? (
              <div className="md:col-span-2">
                <HomePageSkeleton />
              </div>
            ) : festivals.length > 0 ? (
              festivals.map((f, i) => (
                <FestivalCard key={f.slug} festival={f} index={i} variant="grid" timing={getFestivalTiming(f)} />
              ))
            ) : (
              <p className="text-maroon-800/80 md:col-span-2">
                Festival schedule will appear here.{' '}
                <Link to="/festivals" className="font-semibold underline">
                  View festivals
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 pb-8 pt-4 md:pb-12">
        <ScrollReveal className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="rounded-3xl border border-gold-400/25 bg-gradient-to-br from-white via-cream-50 to-gold-100/60 px-6 py-14 text-center shadow-card md:px-16">
            <h2 className="font-display text-3xl text-maroon-900 md:text-4xl">
              Your offering becomes prasadam, kirtan, and care
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-maroon-800/85">
              Every contribution supports Sri Jagannath seva, annadanam for Srisailam yatrikas, and the growing temple at
              Hare Krishna Land.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/donate"
                className="btn-tap inline-flex rounded-full bg-gradient-to-r from-maroon-800 to-maroon-900 px-8 py-3.5 text-sm font-semibold text-cream-50 shadow-soft"
              >
                Donate seva
              </Link>
              <Link
                to={comingFestival ? `/festivals/${comingFestival.slug}` : '/festivals'}
                className="btn-tap inline-flex rounded-full border border-gold-500/50 bg-gold-50 px-8 py-3.5 text-sm font-semibold text-maroon-900"
              >
                {comingFestival ? comingFestival.name : 'Festivals'}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
