import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { GalleryImage } from '@/components/GalleryImage'
import { Seo } from '@/components/Seo'
import { festivalImageSlot } from '@/content/siteMedia'
import { ekadashiInfo, templeSpecialEvents } from '@/content/festivalsExtra'
import type { Festival } from '@/types'

export function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])

  useEffect(() => {
    api.get<Festival[]>('/public/festivals').then((r) => setFestivals(r.data))
  }, [])

  return (
    <>
      <Seo title="Festivals" description="Appearance days, Ekadashi, processions, feasts, and temple celebrations." />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">Festivals</p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Sacred celebrations</h1>
          <p className="mt-4 max-w-2xl text-maroon-800/85">
            Join us for appearance days, processions, and feasts — in the mood of gratitude and sankirtan. Register where
            available or sponsor sevas that make each festival radiant.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          <section className="rounded-3xl border border-maroon-900/10 bg-white p-6 shadow-card lg:col-span-2">
            <h2 className="font-display text-2xl text-maroon-900">{ekadashiInfo.title}</h2>
            <p className="mt-2 text-sm font-medium text-saffron-600">{ekadashiInfo.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-maroon-800/90">{ekadashiInfo.body}</p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-maroon-800/90">
              {ekadashiInfo.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-maroon-700/75">
              Exact fasting and parana timings follow the lunar calendar — please confirm with the temple office or our
              published calendar before travelling.
            </p>
          </section>
          <section className="rounded-3xl border border-gold-400/35 bg-gradient-to-b from-gold-50 to-cream-50 p-6 shadow-card">
            <h2 className="font-display text-xl text-maroon-900">{templeSpecialEvents.title}</h2>
            <ul className="mt-4 space-y-4">
              {templeSpecialEvents.items.map((ev) => (
                <li key={ev.title} className="rounded-2xl border border-maroon-900/10 bg-white/80 p-4">
                  <p className="font-semibold text-maroon-900">{ev.title}</p>
                  <p className="mt-1 text-sm text-maroon-800/85">{ev.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-16 space-y-10">
          {festivals.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid gap-0 overflow-hidden rounded-3xl border border-maroon-900/10 bg-white shadow-card md:grid-cols-[minmax(260px,32%)_1fr]"
            >
              <div className="relative min-h-[220px] bg-cream-200/60 md:min-h-full">
                <GalleryImage
                  slot={festivalImageSlot(f.sort_order)}
                  alt={f.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-maroon-700/75">
                  {f.event_date ? new Date(f.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date TBA'}
                </p>
                <h2 className="mt-2 font-display text-3xl text-maroon-900">{f.name}</h2>
                <p className="mt-3 text-maroon-800/85">{f.short_description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/festivals/${f.slug}`}
                    className="rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft hover:bg-maroon-800"
                  >
                    Festival details
                  </Link>
                  {f.registration_url && (
                    <a
                      href={f.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-maroon-900/15 bg-cream-50 px-5 py-2.5 text-sm font-semibold text-maroon-900 hover:bg-white"
                    >
                      Register
                    </a>
                  )}
                  {f.sponsorship_enabled && (
                    <Link
                      to="/donate"
                      state={{ category: 'festival_sponsorship', festivalId: f.id }}
                      className="rounded-full border border-gold-500/40 bg-gold-100/90 px-5 py-2.5 text-sm font-semibold text-maroon-900 hover:bg-gold-100"
                    >
                      Sponsor festival
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  )
}
