import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import { GalleryImage } from '@/components/GalleryImage'
import { festivalImageSlot } from '@/content/siteMedia'
import { Seo } from '@/components/Seo'
import type { Festival } from '@/types'

export function FestivalDetailPage() {
  const { slug } = useParams()
  const [f, setF] = useState<Festival | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    api
      .get<Festival>(`/public/festivals/${slug}`)
      .then((r) => setF(r.data))
      .catch(() => setErr('Festival not found'))
  }, [slug])

  if (err || !f) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-maroon-800/90">{err || 'Loading…'}</p>
        <Link to="/festivals" className="mt-6 inline-block font-semibold text-maroon-900 underline decoration-gold-500/50">
          ← Back to festivals
        </Link>
      </div>
    )
  }

  return (
    <>
      <Seo title={f.name} description={f.short_description || f.description || undefined} />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-3xl border border-maroon-900/10 bg-white shadow-card">
          <GalleryImage
            slot={festivalImageSlot(f.sort_order)}
            alt={f.name}
            className="max-h-[420px] w-full object-cover"
            loading="eager"
          />
        </motion.div>
        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">
            {f.event_date ? new Date(f.event_date).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Date announced soon'}
          </p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">{f.name}</h1>
          <p className="mt-6 text-lg text-maroon-800/90">{f.description || f.short_description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {f.registration_url && (
              <a
                href={f.registration_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-maroon-900 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft hover:bg-maroon-800"
              >
                Register
              </a>
            )}
            {f.sponsorship_enabled && (
              <Link
                to="/donate"
                state={{ category: 'festival_sponsorship', festivalId: f.id }}
                className="rounded-full border border-gold-500/40 bg-gold-100 px-6 py-2.5 text-sm font-semibold text-maroon-900 hover:bg-gold-50"
              >
                Festival sponsorship
              </Link>
            )}
            <Link
              to="/festivals"
              className="rounded-full border border-maroon-900/15 bg-white px-6 py-2.5 text-sm font-semibold text-maroon-900 shadow-card hover:bg-cream-50"
            >
              All festivals
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
