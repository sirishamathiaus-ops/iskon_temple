import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Seo } from '@/components/Seo'
import { FestivalCard } from '@/components/festivals/FestivalCard'
import { ScrollReveal } from '@/components/spiritual'
import { getFestivalTiming, partitionFestivals } from '@/lib/festivals'
import { useFestivals } from '@/hooks/useFestivals'
import type { Festival } from '@/types'

function FestivalListSection({
  title,
  description,
  festivals,
  timing,
}: {
  title: string
  description: string
  festivals: Festival[]
  timing?: 'coming' | 'done'
}) {
  if (festivals.length === 0) return null

  return (
    <section className={timing === 'done' ? 'mt-16 border-t border-maroon-900/10 pt-14' : 'mt-14'}>
      <ScrollReveal>
        <h2 className="font-display text-2xl text-maroon-900">{title}</h2>
        <p className="mt-1 text-sm text-maroon-700/85">{description}</p>
      </ScrollReveal>
      <div className="mt-10 space-y-10">
        {festivals.map((f, i) => (
          <FestivalCard
            key={f.slug}
            festival={f}
            index={i}
            variant="list"
            timing={timing === 'done' ? 'past' : getFestivalTiming(f)}
          />
        ))}
      </div>
    </section>
  )
}

export function FestivalsPage() {
  const { festivals, loading } = useFestivals()
  const { coming, done } = useMemo(() => partitionFestivals(festivals), [festivals])

  return (
    <>
      <Seo title="Festivals" description="Ugadi, appearance days, Ekadashi, processions, feasts, and temple celebrations." />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">Festivals</p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Sacred celebrations</h1>
          <p className="mt-4 max-w-2xl text-maroon-800/85">
            Join us for appearance days, Ekadashi, Ugadi, processions, and feasts — in the mood of gratitude and sankirtan.
          </p>
        </motion.div>

        {loading && <p className="mt-14 text-maroon-700/80">Loading festivals…</p>}

        {!loading && festivals.length === 0 && (
          <p className="mt-14 text-maroon-700/80">Festival schedule will be posted soon.</p>
        )}

        {!loading && (
          <>
            <FestivalListSection
              title="Coming festivals"
              description="Upcoming dates, festivals happening now, and year-round observances at the temple."
              festivals={coming}
              timing="coming"
            />
            <FestivalListSection
              title="Completed festivals"
              description="Past celebrations — revisit photos and details from earlier programs."
              festivals={done}
              timing="done"
            />
          </>
        )}
      </div>
    </>
  )
}
