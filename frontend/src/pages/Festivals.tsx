import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, assetUrl } from '@/lib/api'
import { Seo } from '@/components/Seo'
import type { Festival } from '@/types'

export function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])

  useEffect(() => {
    api.get<Festival[]>('/public/festivals').then((r) => setFestivals(r.data))
  }, [])

  return (
    <>
      <Seo title="Festivals" description="Upcoming festivals, details, and sponsorship opportunities." />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Festivals</p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Sacred celebrations</h1>
          <p className="mt-4 max-w-2xl text-lotus-100/80">
            Join us for appearance days, processions, and feasts. Register where available or sponsor sevas that make each
            festival radiant.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8">
          {festivals.map((f, i) => (
            <motion.article
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="grid gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-[280px_1fr]"
            >
              <div className="relative min-h-[200px] bg-black/30">
                {f.image_url ? (
                  <img src={assetUrl(f.image_url)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center font-display text-4xl text-gold-500/40">
                    ॐ
                  </div>
                )}
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-wider text-gold-300/90">
                  {f.event_date ? new Date(f.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Date TBA'}
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">{f.name}</h2>
                <p className="mt-3 text-lotus-100/80">{f.short_description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={`/festivals/${f.slug}`}
                    className="rounded-full bg-gold-500/15 px-5 py-2 text-sm font-semibold text-gold-200 ring-1 ring-gold-500/30 hover:bg-gold-500/25"
                  >
                    Festival details
                  </Link>
                  {f.registration_url && (
                    <a
                      href={f.registration_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/5"
                    >
                      Register
                    </a>
                  )}
                  {f.sponsorship_enabled && (
                    <Link
                      to="/donate"
                      state={{ category: 'festival_sponsorship', festivalId: f.id }}
                      className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2 text-sm font-semibold text-lotus-900"
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
