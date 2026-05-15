import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, assetUrl } from '@/lib/api'
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
        <p className="text-lotus-200">{err || 'Loading…'}</p>
        <Link to="/festivals" className="mt-6 inline-block text-gold-300">
          ← Back to festivals
        </Link>
      </div>
    )
  }

  return (
    <>
      <Seo title={f.name} description={f.short_description || f.description || undefined} />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        {f.image_url && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-3xl border border-white/10">
            <img src={assetUrl(f.image_url)} alt="" className="max-h-[420px] w-full object-cover" />
          </motion.div>
        )}
        <div className="mt-10 max-w-3xl">
          <p className="text-sm uppercase tracking-wider text-gold-300">
            {f.event_date ? new Date(f.event_date).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Date announced soon'}
          </p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">{f.name}</h1>
          <p className="mt-6 text-lg text-lotus-100/85">{f.description || f.short_description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {f.registration_url && (
              <a
                href={f.registration_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-lotus-900"
              >
                Register
              </a>
            )}
            {f.sponsorship_enabled && (
              <Link
                to="/donate"
                state={{ category: 'festival_sponsorship', festivalId: f.id }}
                className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-2.5 text-sm font-semibold text-lotus-900"
              >
                Festival sponsorship
              </Link>
            )}
            <Link to="/festivals" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white">
              All festivals
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
