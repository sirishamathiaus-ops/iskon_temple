import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { HeroCarousel } from '@/components/HeroCarousel'
import {
  DARSHAN_HIGHLIGHT_DEFAULT,
  FEATURED_SEVA,
  HOME_GLIMPSE_CAPTIONS,
  IMAGE_SLOTS,
  TEMPLE_INTRO_DEFAULT,
  siteImageTempleIntro,
} from '@/content/siteMedia'
import { GalleryImage } from '@/components/GalleryImage'
import type { Festival } from '@/types'

type HomepageData = Record<string, unknown>

export function HomePage() {
  const [home, setHome] = useState<HomepageData>({})
  const [festivals, setFestivals] = useState<Festival[]>([])
  useEffect(() => {
    api.get<HomepageData>('/public/homepage').then((r) => setHome(r.data))
    api.get<Festival[]>('/public/festivals').then((r) => setFestivals(r.data.filter((f) => f.is_featured).slice(0, 4)))
  }, [])

  const introRaw = (home.temple_intro as Record<string, string>) || {}
  const intro = {
    heading: introRaw.heading || TEMPLE_INTRO_DEFAULT.heading,
    body: introRaw.body || TEMPLE_INTRO_DEFAULT.body,
    image: siteImageTempleIntro(),
    blessing: introRaw.blessing || TEMPLE_INTRO_DEFAULT.blessing,
    blessingAuthor: introRaw.blessingAuthor || TEMPLE_INTRO_DEFAULT.blessingAuthor,
  }
  const highlight = {
    quote: (home.darshan_highlight as Record<string, string>)?.quote || DARSHAN_HIGHLIGHT_DEFAULT.quote,
    attribution: (home.darshan_highlight as Record<string, string>)?.attribution || DARSHAN_HIGHLIGHT_DEFAULT.attribution,
  }
  const apiFeatured = (home.featured_donations as { items?: { title: string; description: string; href: string; image?: string }[] })
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

  const stripImages = useMemo(
    () =>
      IMAGE_SLOTS.homeGlimpses.map((slot, i) => ({
        id: -slot,
        slot,
        caption: HOME_GLIMPSE_CAPTIONS[i % HOME_GLIMPSE_CAPTIONS.length],
      })),
    [],
  )

  return (
    <>
      <Seo
        title="ISKCON Dornala — Home"
        description="Sri Jagannath Temple, Hare Krishna Land — darshan, festivals, annadanam, and seva."
      />
      <HeroCarousel
        fallbackTitle={(home.hero as Record<string, string>)?.title}
        fallbackSubtitle={(home.hero as Record<string, string>)?.subtitle}
      />

      <section className="border-b border-maroon-900/10 bg-white/80 py-14">
        <motion.div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-maroon-900 md:text-3xl">Temple glimpses</h2>
              <p className="mt-1 text-sm text-maroon-800/80">Darshan, seva, and celebrations at Hare Krishna Land</p>
            </div>
            <Link
              to="/gallery"
              className="text-sm font-semibold text-maroon-800 underline decoration-gold-500/50 decoration-2 underline-offset-4"
            >
              Full gallery →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stripImages.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-maroon-900/10 bg-cream-100 shadow-card"
              >
                <GalleryImage
                  slot={g.slot}
                  alt={g.caption}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/55 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-xs font-medium text-cream-50">{g.caption}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <motion.div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <motion.div className="overflow-hidden rounded-3xl border border-gold-400/35 bg-white shadow-[0_24px_64px_-24px_rgba(69,26,41,0.25)]">
              <motion.div className="relative aspect-[4/5] max-h-[520px] w-full sm:aspect-[3/4]">
                <GalleryImage
                  slot={IMAGE_SLOTS.templeIntro}
                  alt="Sri Jagannath at Hare Krishna Land"
                  loading="eager"
                  className="h-full w-full object-cover object-center"
                />
                <motion.div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-maroon-900/15 to-transparent" />
                <motion.div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-200/90">Hare Krishna Land</p>
                  <p className="mt-2 font-display text-lg leading-snug text-cream-50 sm:text-xl">
                    {intro.blessing.startsWith('“') ? intro.blessing : `“${intro.blessing}”`}
                  </p>
                  <p className="mt-3 text-sm text-cream-50/80">— {intro.blessingAuthor}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80">Sacred abode</p>
            <h2 className="mt-3 font-display text-3xl text-maroon-900 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {intro.heading}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-maroon-800/90 md:text-lg">{intro.body}</p>

            <blockquote className="mt-8 rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-50/90 to-cream-50 p-6 shadow-inner">
              <p className="font-display text-lg italic leading-relaxed text-maroon-900/95 md:text-xl">&ldquo;{highlight.quote}&rdquo;</p>
              <footer className="mt-4 text-sm font-medium text-maroon-700/80">— {highlight.attribution}</footer>
            </blockquote>

            <Link
              to="/about"
              className="btn-tap mt-8 inline-flex items-center gap-2 rounded-full border border-maroon-900/15 bg-white px-6 py-3 text-sm font-semibold text-maroon-900 shadow-card"
            >
              Learn our story
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-maroon-900/10 bg-gradient-to-b from-cream-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl text-maroon-900">Featured seva</h2>
              <p className="mt-2 text-maroon-800/80">Support sacred offerings that nourish the community.</p>
            </div>
            <Link to="/donate" className="text-sm font-semibold text-maroon-800 underline decoration-gold-500/50 decoration-2 underline-offset-4">
              View all categories →
            </Link>
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sevaCards.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gold-400/30 bg-white shadow-card transition hover:shadow-gold"
              >
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
                  <Link to={item.href} className="mt-5 inline-flex items-center text-sm font-semibold text-maroon-800 hover:text-maroon-900">
                    Contribute →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-maroon-900">Upcoming festivals</h2>
          <Link to="/festivals" className="text-sm font-semibold text-maroon-800 underline decoration-gold-500/50 decoration-2 underline-offset-4">
            Full calendar
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {festivals.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="overflow-hidden rounded-2xl border border-maroon-900/10 bg-white shadow-card"
            >
              <GalleryImage
                slot={IMAGE_SLOTS.festivals[Math.min(Math.max(0, f.sort_order), IMAGE_SLOTS.festivals.length - 1)]}
                alt={f.name}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <motion.div className="p-6">
                <p className="text-xs uppercase tracking-wider text-maroon-700/80">
                  {f.event_date ? new Date(f.event_date).toLocaleDateString() : 'Date TBA'}
                </p>
                <h3 className="mt-2 font-display text-2xl text-maroon-900">{f.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-maroon-800/80">{f.short_description}</p>
                <Link to={`/festivals/${f.slug}`} className="mt-4 inline-block text-sm font-semibold text-maroon-800">
                  Details →
                </Link>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-gold-400/25 bg-gradient-to-br from-white via-cream-50 to-gold-100/50 px-6 py-14 text-center shadow-card md:px-16">
          <h2 className="font-display text-3xl text-maroon-900 md:text-4xl">Your offering becomes prasadam, kirtan, and care</h2>
          <p className="mx-auto mt-4 max-w-2xl text-maroon-800/85">
            Every contribution supports Sri Jagannath seva, annadanam, tribal care, and the growing temple at Hare Krishna Land.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/donate"
              className="inline-flex rounded-full bg-gradient-to-r from-maroon-800 to-maroon-900 px-8 py-3.5 text-sm font-semibold text-cream-50 shadow-soft"
            >
              Donate via UPI
            </Link>
            <Link
              to="/gallery"
              className="inline-flex rounded-full border border-maroon-900/15 bg-white px-8 py-3.5 text-sm font-semibold text-maroon-900 shadow-card"
            >
              View gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
