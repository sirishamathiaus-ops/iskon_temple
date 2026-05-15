import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { buildGalleryPhotos } from '@/lib/gallery'
import { GalleryImage } from '@/components/GalleryImage'
import { Seo } from '@/components/Seo'
import type { GalleryItem } from '@/types'

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    api
      .get<GalleryItem[]>('/public/gallery')
      .then((r) => {
        setItems(r.data)
        setLoadError(false)
      })
      .catch(() => setLoadError(true))
  }, [])

  const photos = useMemo(() => buildGalleryPhotos(items), [items])

  const featured = photos[0]
  const rest = photos.slice(1)

  return (
    <>
      <Seo title="Gallery — ISKCON Dornala" description="Photos from darshan, festivals, annadanam, and seva at Hare Krishna Land." />
      <section className="border-b border-maroon-900/10 bg-gradient-to-b from-cream-100 via-cream-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80 sm:text-sm">Gallery</p>
            <h1 className="mt-3 font-display text-3xl text-maroon-900 sm:text-4xl md:text-5xl">Sacred moments & seva</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-maroon-800/85 sm:text-base">
              Darshan, kirtan, annadanam, go-seva, festivals, and community programs at Hare Krishna Land — Sri Jagannath
              Temple.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        {loadError && (
          <p className="mt-6 rounded-2xl border border-gold-400/30 bg-gold-50/80 px-4 py-3 text-sm text-maroon-800">
            Showing temple photos from our local collection. Live gallery sync will resume when the server is available.
          </p>
        )}

        {featured && (
          <motion.figure
            className="mt-8 overflow-hidden rounded-3xl border border-gold-400/30 bg-white shadow-[0_20px_60px_-20px_rgba(69,26,41,0.2)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative aspect-[16/9] max-h-[420px] w-full sm:aspect-[21/9]">
              <GalleryImage
                slot={featured.slot}
                alt={featured.caption || 'Sri Jagannath Temple'}
                loading="eager"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/75 via-maroon-900/20 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 px-5 py-5 sm:px-8 sm:py-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/90">Featured</p>
                <p className="mt-1 font-display text-xl text-cream-50 sm:text-2xl">{featured.caption}</p>
              </figcaption>
            </div>
          </motion.figure>
        )}

        <section className="mt-10 sm:mt-12">
          <h2 className="font-display text-2xl text-maroon-900">Temple photos</h2>
          <p className="mt-1 text-sm text-maroon-700/75">{photos.length} glimpses from seva and darshan</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {rest.map((g, i) => (
              <motion.figure
                key={`${g.id}-${g.displayUrl}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ delay: Math.min(i * 0.02, 0.2) }}
                className="group overflow-hidden rounded-2xl border border-maroon-900/10 bg-white shadow-card sm:rounded-3xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
                  <GalleryImage
                    slot={g.slot}
                    alt={g.caption || 'Temple'}
                    loading={i < 8 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/50 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
                </div>
                {g.caption && (
                  <figcaption className="border-t border-maroon-900/8 bg-cream-50 px-3 py-2.5 text-xs font-medium text-maroon-900 sm:text-sm">
                    {g.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            to="/donate"
            className="btn-tap rounded-full bg-maroon-900 px-8 py-3 text-sm font-semibold text-cream-50 shadow-soft"
          >
            Support seva
          </Link>
          <Link
            to="/festivals"
            className="btn-tap rounded-full border border-maroon-900/15 bg-white px-8 py-3 text-sm font-semibold text-maroon-900 shadow-card"
          >
            Festivals
          </Link>
        </div>
        </div>
      </>
    )
  }
