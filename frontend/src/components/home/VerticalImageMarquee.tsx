import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from '@/components/spiritual/SpiritualImage'

type Props = {
  images: SpiritualImageDef[]
  activeIndex: number
  onSelect?: (index: number) => void
  autoScroll?: boolean
}

export function VerticalImageMarquee({ images, activeIndex, onSelect, autoScroll = true }: Props) {
  const [paused, setPaused] = useState(false)
  const doubled = [...images, ...images]

  useEffect(() => {
    if (!autoScroll || paused || images.length <= 1) return
    const t = setInterval(() => {
      onSelect?.((activeIndex + 1) % images.length)
    }, 5000)
    return () => clearInterval(t)
  }, [activeIndex, autoScroll, images.length, onSelect, paused])

  return (
    <div
      className="relative h-[min(420px,55vh)] w-full max-w-[200px] overflow-hidden rounded-2xl border border-gold-400/35 bg-maroon-950/20 shadow-[0_16px_48px_-12px_rgba(69,26,41,0.45)] sm:max-w-[220px] md:h-[min(480px,62vh)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-maroon-950/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-maroon-950/80 to-transparent" />

      <div
        className={[
          'flex flex-col gap-3 p-3',
          autoScroll && !paused ? 'animate-vertical-marquee' : '',
        ].join(' ')}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {doubled.map((img, i) => {
          const realIndex = i % images.length
          const isActive = realIndex === activeIndex && i < images.length
          return (
            <button
              key={`${img.id}-${i}`}
              type="button"
              onClick={() => onSelect?.(realIndex)}
              className={[
                'spiritual-card-hover relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl border transition-all duration-500',
                isActive
                  ? 'border-gold-400/70 ring-2 ring-gold-300/60 scale-[1.02]'
                  : 'border-white/15 opacity-75 hover:opacity-100',
              ].join(' ')}
            >
              <SpiritualImage image={img} className="h-full w-full" sizes="200px" loading="lazy" />
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1">
        {images.map((img, i) => (
          <span
            key={img.id}
            className={[
              'h-1.5 rounded-full transition-all',
              i === activeIndex ? 'w-4 bg-gold-400' : 'w-1.5 bg-white/40',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

/** Compact active preview for mobile when marquee is hidden */
export function MobileHeroPreview({ image, title }: { image: SpiritualImageDef; title: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={image.id}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-gold-400/40 shadow-card lg:hidden"
      >
        <SpiritualImage image={image} className="h-full w-full" loading="eager" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 to-transparent" />
        <p className="absolute bottom-3 left-3 right-3 font-display text-lg text-cream-50">{title}</p>
      </motion.div>
    </AnimatePresence>
  )
}
