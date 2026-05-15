import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api, assetUrl } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { temple } from '@/content/temple'
import type { GalleryItem } from '@/types'

export function AboutPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])

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
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">About</p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Our sacred journey</h1>
          <p className="mt-6 text-lg text-lotus-100/85">
            {temple.fullName} serves Lord Jagannath, Baladev, and Subhadra at {temple.tagline}. With the mercy of Sri Guru
            and the parampara of Srila Prabhupada, we invite every heart to kirtan, sadhu-sanga, and practical seva.
          </p>
        </motion.div>

        <section className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="font-display text-2xl text-white">Temple & land</h2>
            <p className="mt-4 text-lotus-100/80">
              Hare Krishna Land in Dornala is the blessed site of our growing Sri Jagannath mandir — a place of darshan,
              festivals, and large-scale prasadam distribution. The gallery shows abhishekam, kirtan, annadanam for pilgrims,
              go-seva, and the open grounds where the community gathers in devotion.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="font-display text-2xl text-white">Mission & vision</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-lotus-100/80">
              <li>To spread the holy names and the teachings of Bhagavad-gita and Srimad-Bhagavatam.</li>
              <li>To nourish pilgrims and villagers with prasadam and loving care.</li>
              <li>To raise a new generation in spiritual culture through children’s and congregation programs.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-white">Community programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {temple.programs.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gold-500/20 bg-forest-800/30 p-6">
                <h3 className="font-display text-xl text-gold-100">{p.title}</h3>
                <p className="mt-2 text-sm text-lotus-100/80">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-white">ISKCON values</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: 'Sadhana', d: 'Daily practice — japa, study, and regulated habits that purify intention.' },
              { t: 'Sankirtan', d: 'Congregational chanting as the heart of public outreach and joy.' },
              { t: 'Seva', d: 'Selfless service to the Lord, His devotees, and all living beings.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-gold-500/15 bg-black/25 p-6">
                <h3 className="font-display text-xl text-gold-200">{c.t}</h3>
                <p className="mt-2 text-sm text-lotus-200/80">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-3xl text-white">Gallery</h2>
          <p className="mt-2 text-lotus-100/80">Moments from seva, darshan, annadanam, festivals, and Hare Krishna Land.</p>
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map((g) => (
              <motion.figure
                key={g.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/10"
              >
                {g.media_type === 'video' ? (
                  <video
                    controls
                    className="w-full"
                    src={assetUrl(g.url)}
                    poster={g.thumbnail_url ? assetUrl(g.thumbnail_url) : undefined}
                  />
                ) : (
                  <img src={assetUrl(g.url)} alt={g.title || 'Temple'} className="w-full object-cover" loading="lazy" />
                )}
                <figcaption className="bg-black/50 px-4 py-3 text-sm text-lotus-100/90">
                  {g.title}
                  {g.caption && <span className="block text-xs text-lotus-200/75">{g.caption}</span>}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
