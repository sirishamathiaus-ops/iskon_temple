import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { FestivalHero } from '@/components/festivals/FestivalHero'
import { Seo } from '@/components/Seo'
import { ScrollReveal, SpiritualImage } from '@/components/spiritual'
import { defaultMetaForFestival, getFestivalMeta, metaToFestival } from '@/content/festivalCatalog'
import { festivalSpiritualGallery } from '@/content/spiritualMedia'
import { formatFestivalDateOrAnnounce } from '@/lib/formatDate'
import type { Festival } from '@/types'

export function FestivalDetailPage() {
  const { slug } = useParams()
  const [apiFestival, setApiFestival] = useState<Festival | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setErr(null)
    api
      .get<Festival>(`/public/festivals/${slug}`)
      .then((r) => setApiFestival(r.data))
      .catch(() => {
        const meta = getFestivalMeta(slug)
        if (meta) setApiFestival(metaToFestival(meta))
        else setErr('Festival not found')
      })
  }, [slug])

  const festival = useMemo(() => {
    if (!slug) return null
    const meta = getFestivalMeta(slug) ?? (apiFestival ? defaultMetaForFestival(apiFestival) : null)
    if (!meta) return apiFestival
    return metaToFestival(meta, apiFestival)
  }, [slug, apiFestival])

  const meta = slug ? getFestivalMeta(slug) ?? (festival ? defaultMetaForFestival(festival) : null) : null

  const spiritualExtras = useMemo(() => {
    if (!slug || !meta?.imageFile) return []
    return festivalSpiritualGallery(slug, festival?.name ?? meta.name).slice(1)
  }, [slug, meta, festival?.name])

  if (err || !festival || !meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-maroon-800/90">{err || 'Loading…'}</p>
        <Link to="/festivals" className="mt-6 inline-block font-semibold text-maroon-900 underline decoration-gold-500/50">
          ← Back to festivals
        </Link>
      </div>
    )
  }

  const dateStr = formatFestivalDateOrAnnounce(festival.event_date, 'full')

  return (
    <>
      <Seo title={festival.name} description={festival.short_description || festival.description || undefined} />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-maroon-900/10 bg-white shadow-card"
        >
          <FestivalHero festival={festival} meta={meta} />
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">{dateStr}</p>
            <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">{festival.name}</h1>
            <p className="mt-4 text-lg font-medium text-saffron-700">{festival.short_description}</p>
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-maroon-800/90">
              {festival.description}
            </p>

            <ScrollReveal className="mt-10">
              <h2 className="font-display text-2xl text-maroon-900">Spiritual importance</h2>
              <p className="mt-4 leading-relaxed text-maroon-800/88">{meta.importance}</p>
            </ScrollReveal>

            {spiritualExtras.length > 0 && (
              <ScrollReveal className="mt-10">
                <h2 className="font-display text-2xl text-maroon-900">Festival glimpses</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {spiritualExtras.map((img) => (
                    <div key={img.id} className="spiritual-card-hover overflow-hidden rounded-2xl border border-maroon-900/10">
                      <SpiritualImage image={img} className="aspect-[4/3] w-full object-cover" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {festival.sponsorship_enabled && festival.id > 0 && (
                <Link
                  to="/donate"
                  state={{ category: 'festival_sponsorship', festivalId: festival.id }}
                  className="rounded-full bg-maroon-900 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft"
                >
                  Sponsor this festival
                </Link>
              )}
              {festival.sponsorship_enabled && festival.id <= 0 && (
                <Link
                  to="/donate"
                  state={{ category: 'festival_sponsorship' }}
                  className="rounded-full bg-maroon-900 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft"
                >
                  Sponsor seva
                </Link>
              )}
              <Link
                to="/festivals"
                className="rounded-full border border-maroon-900/15 bg-white px-6 py-2.5 text-sm font-semibold text-maroon-900 shadow-card"
              >
                All festivals
              </Link>
            </div>
          </div>

          <aside>
            <ScrollReveal>
              <div className="sticky top-24 rounded-3xl border border-gold-400/35 bg-gradient-to-b from-gold-50 to-cream-50 p-6 shadow-card">
                <h2 className="font-display text-xl text-maroon-900">Date & timings</h2>
                <p className="mt-2 text-sm font-medium text-maroon-800">{dateStr}</p>
                <ul className="mt-6 space-y-4">
                  {meta.timings.map((t) => (
                    <li key={t.label} className="border-b border-maroon-900/8 pb-3 last:border-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-maroon-700/75">{t.label}</p>
                      <p className="mt-1 font-display text-lg text-maroon-900">{t.time}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-maroon-700/70">
                  Timings may adjust for tithi or weather — confirm with the temple office before travelling.
                </p>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </div>
    </>
  )
}
