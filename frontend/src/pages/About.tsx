import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import { buildGalleryPhotos } from '@/lib/gallery'
import { GalleryImage } from '@/components/GalleryImage'
import { Seo } from '@/components/Seo'
import { temple } from '@/content/temple'
import type { GalleryItem } from '@/types'

export function AboutPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])

  const preview = useMemo(() => buildGalleryPhotos(gallery).slice(0, 6), [gallery])

  useEffect(() => {
    api.get<GalleryItem[]>('/public/gallery').then((r) => setGallery(r.data))
  }, [])

  return (
    <>
      <Seo
        title="About — ISKCON Dornala"
        description="Sri Jagannath Temple at Hare Krishna Land — mission, community programs, and gallery."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">About</p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Our sacred journey</h1>
          <p className="mt-6 text-lg text-maroon-800/90">
            {temple.fullName} serves Lord Jagannath, Baladev, and Subhadra at {temple.tagline}. With the mercy of Sri Guru and
            the parampara of Srila Prabhupada, we invite every heart to kirtan, sadhu-sanga, and practical seva.
          </p>
        </motion.div>

        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-maroon-900/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl text-maroon-900">Temple & land</h2>
            <p className="mt-4 text-maroon-800/85">
              Hare Krishna Land in Dornala is the blessed site of our growing Sri Jagannath mandir — a place of darshan,
              festivals, and large-scale prasadam distribution. The gallery captures abhishekam, kirtan, annadanam for
              pilgrims, go-seva, and the grounds where the community gathers in devotion.
            </p>
          </div>
          <div className="rounded-3xl border border-maroon-900/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl text-maroon-900">Mission & vision</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-maroon-800/85">
              <li>To spread the holy names and the teachings of Bhagavad-gita and Srimad-Bhagavatam.</li>
              <li>To nourish pilgrims and villagers with prasadam and loving care.</li>
              <li>To raise a new generation in spiritual culture through children’s and congregation programs.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-maroon-900">Community programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {temple.programs.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-white to-cream-50 p-6 shadow-card">
                <h3 className="font-display text-xl text-maroon-900">{p.title}</h3>
                <p className="mt-2 text-sm text-maroon-800/85">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-maroon-900">ISKCON values</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: 'Sadhana', d: 'Daily practice — japa, study, and regulated habits that purify intention.' },
              { t: 'Sankirtan', d: 'Congregational chanting as the heart of public outreach and joy.' },
              { t: 'Seva', d: 'Selfless service to the Lord, His devotees, and all living beings.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-maroon-900/10 bg-white p-6 shadow-card">
                <h3 className="font-display text-xl text-maroon-900">{c.t}</h3>
                <p className="mt-2 text-sm text-maroon-800/85">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-maroon-900">Gallery preview</h2>
              <p className="mt-2 text-maroon-800/85">A few glimpses from seva and darshan — see the full collection on the gallery page.</p>
            </div>
            <Link
              to="/gallery"
              className="rounded-full border border-maroon-900/15 bg-white px-5 py-2 text-sm font-semibold text-maroon-900 shadow-card hover:bg-cream-50"
            >
              Open full gallery →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {preview.map((g, i) => (
              <motion.figure
                key={g.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl border border-maroon-900/10 bg-white shadow-card sm:rounded-3xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <GalleryImage
                    slot={g.slot}
                    alt={g.caption || 'Temple'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <figcaption className="bg-cream-50 px-3 py-2 text-xs font-medium text-maroon-800/90">
                  {g.caption || 'Seva'}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
