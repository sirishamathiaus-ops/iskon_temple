import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from './SpiritualImage'

const INTERVAL_MS = 60_000

type Props = {
  items: SpiritualImageDef[]
  intervalMs?: number
  title?: string
  subtitle?: string
}

export function SpiritualAutoSlider({
  items,
  intervalMs = INTERVAL_MS,
  title = 'Sacred glimpses',
  subtitle = 'Radha Krishna & Srisailam — renewing every minute',
}: Props) {
  const [index, setIndex] = useState(0)
  const current = items[index % items.length]

  useEffect(() => {
    if (items.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs)
    return () => clearInterval(t)
  }, [items.length, intervalMs])

  if (!current) return null

  return (
    <section className="border-b border-maroon-900/10 bg-gradient-to-b from-white to-cream-50 py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-maroon-900 md:text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-maroon-800/80">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.title ?? item.alt}`}
                onClick={() => setIndex(i)}
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-gold-500' : 'w-1.5 bg-maroon-900/20 hover:bg-maroon-900/35',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-stretch">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-gold-400/30 bg-cream-100 shadow-[0_20px_50px_-20px_rgba(69,26,41,0.2)] sm:aspect-[2/1]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpiritualImage image={current} className="h-full w-full" sizes="(max-width: 1024px) 100vw, 66vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-maroon-900/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/90">
                    {index + 1} / {items.length}
                  </p>
                  <p className="mt-1 font-display text-xl text-cream-50 sm:text-2xl">
                    {current.title ?? current.alt}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1 lg:gap-3">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                className={[
                  'spiritual-card-hover group relative aspect-square overflow-hidden rounded-2xl border bg-cream-100 shadow-card transition-all duration-300 lg:aspect-[4/3]',
                  i === index
                    ? 'border-gold-500/60 ring-2 ring-gold-300/50'
                    : 'border-maroon-900/10 opacity-85 hover:opacity-100',
                ].join(' ')}
              >
                <SpiritualImage
                  image={item}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                  sizes="120px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/50 to-transparent opacity-80" />
                <span className="absolute bottom-1.5 left-2 right-2 text-left text-[10px] font-medium leading-tight text-cream-50 sm:text-xs">
                  {item.title ?? 'Sacred'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
