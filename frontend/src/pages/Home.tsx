import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, assetUrl } from '@/lib/api'
import { Seo } from '@/components/Seo'
import type { Festival } from '@/types'

type HomepageData = Record<string, unknown>

export function HomePage() {
  const [home, setHome] = useState<HomepageData>({})
  const [festivals, setFestivals] = useState<Festival[]>([])

  useEffect(() => {
    api.get<HomepageData>('/public/homepage').then((r) => setHome(r.data))
    api.get<Festival[]>('/public/festivals').then((r) => setFestivals(r.data.filter((f) => f.is_featured).slice(0, 4)))
  }, [])

  const hero = (home.hero as Record<string, unknown>) || {}
  const intro = (home.temple_intro as Record<string, unknown>) || {}
  const featured = (home.featured_donations as { items?: { title: string; description: string; href: string }[] }) || {}
  const highlight = (home.darshan_highlight as Record<string, string>) || {}

  return (
    <>
      <Seo
        title="ISKCON Dornala — Home"
        description="Sri Jagannath Temple, Hare Krishna Land — darshan, festivals, annadanam, and seva."
      />
      <section className="relative overflow-hidden">
        {(hero.heroImage as string) && (
          <div className="pointer-events-none absolute inset-0">
            <img src={hero.heroImage as string} alt="" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-b from-lotus-900/80 via-lotus-900/90 to-lotus-900" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gold-shine" />
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 md:px-6 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-300/90">Hare Krishna — Dornala</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-balance text-white md:text-6xl">
              {(hero.title as string) || 'ISKCON Dornala — Sri Jagannath Temple'}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-lotus-100/85 md:text-xl">
              {(hero.subtitle as string) ||
                'A luminous space for kirtan, wisdom, and loving service — open hearts, open doors.'}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={(hero.ctaPrimary as { href?: string })?.href || '/donate'}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-gold-400 hover:to-gold-500"
              >
                {(hero.ctaPrimary as { label?: string })?.label || 'Donate Now'}
              </Link>
              <Link
                to={(hero.ctaSecondary as { href?: string })?.href || '/darshan'}
                className="inline-flex items-center justify-center rounded-full border border-gold-500/40 px-8 py-3 text-sm font-semibold text-gold-100 transition hover:border-gold-400 hover:bg-white/5"
              >
                {(hero.ctaSecondary as { label?: string })?.label || 'Daily Darshan'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl text-white md:text-4xl">
              {(intro.heading as string) || 'Temple introduction'}
            </h2>
            <p className="mt-4 text-lotus-100/80">
              {(intro.body as string) ||
                'We invite families, students, and seekers to experience the culture of bhakti-yoga through kirtan, classes, and prasadam.'}
            </p>
            <Link to="/about" className="mt-6 inline-block text-sm font-semibold text-gold-300 hover:text-gold-200">
              Learn our story →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-soft backdrop-blur"
          >
            <p className="font-display text-xl italic text-gold-100/90">“{highlight.quote}”</p>
            <p className="mt-4 text-sm text-lotus-200/70">— {highlight.attribution}</p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/20 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl text-white">Featured seva</h2>
              <p className="mt-2 text-lotus-200/80">Support sacred offerings that nourish the community.</p>
            </div>
            <Link to="/donate" className="text-sm font-semibold text-gold-300 hover:text-gold-200">
              View all categories →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(featured.items || []).map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-gold-500/20 bg-gradient-to-b from-white/[0.06] to-transparent p-6"
              >
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-lotus-200/80">{item.description}</p>
                <Link to={item.href || '/donate'} className="mt-4 inline-block text-sm font-semibold text-gold-300">
                  Contribute
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-white">Upcoming festivals</h2>
          <Link to="/festivals" className="text-sm font-semibold text-gold-300 hover:text-gold-200">
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
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              {f.image_url && (
                <img src={assetUrl(f.image_url)} alt="" className="h-40 w-full object-cover opacity-90" />
              )}
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-gold-300/90">
                  {f.event_date ? new Date(f.event_date).toLocaleDateString() : 'Date TBA'}
                </p>
                <h3 className="mt-2 font-display text-2xl text-white">{f.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-lotus-200/80">{f.short_description}</p>
                <Link to={`/festivals/${f.slug}`} className="mt-4 inline-block text-sm font-semibold text-gold-300">
                  Details
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-gold-500/25 bg-gradient-to-br from-gold-600/15 via-transparent to-white/[0.04] px-6 py-14 text-center md:px-16">
          <h2 className="font-display text-3xl text-white md:text-4xl">Your offering becomes prasadam, kirtan, and care</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lotus-100/80">
            Every contribution supports Sri Jagannath seva, annadanam for yatrikas, tribal care, children’s programs, and
            the growing temple at Hare Krishna Land.
          </p>
          <Link
            to="/donate"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-forest-900 shadow-soft transition hover:bg-gold-100"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </>
  )
}
