import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HERO_SLIDES, IMAGE_SLOTS } from '@/content/siteMedia'
import { GalleryImage } from '@/components/GalleryImage'

type Slide = (typeof HERO_SLIDES)[number]

type Props = {
  slides?: Slide[]
  fallbackTitle?: string
  fallbackSubtitle?: string
}

export function HeroCarousel({ slides = HERO_SLIDES, fallbackTitle, fallbackSubtitle }: Props) {
  const [index, setIndex] = useState(0)
  const slide = slides[index] ?? slides[0]

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [slides.length])

  const title = slide?.title || fallbackTitle || 'ISKCON Dornala'
  const subtitle = slide?.subtitle || fallbackSubtitle || ''

  return (
    <section className="relative overflow-hidden border-b border-maroon-900/10">
      <motion.div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={IMAGE_SLOTS.hero[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GalleryImage
              slot={IMAGE_SLOTS.hero[index]}
              alt=""
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/88 via-maroon-900/72 to-maroon-900/45 md:via-maroon-900/65 md:to-maroon-900/35" />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-maroon-950/50 via-transparent to-maroon-900/20" />

        <motion.div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center px-4 py-16 sm:min-h-[480px] md:min-h-[560px] md:px-6 md:py-20">
          <motion.p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-200/95 sm:text-sm">
            Hare Krishna — Dornala
          </motion.p>
          <AnimatePresence mode="wait">
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }}>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.12] text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-100/95 drop-shadow-md sm:text-lg md:text-xl">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <motion.div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              to={slide.ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 px-7 py-3.5 text-sm font-bold text-maroon-900 shadow-[0_8px_32px_rgba(201,149,44,0.45)] ring-2 ring-gold-200/80 transition hover:brightness-105 sm:px-8"
            >
              {slide.ctaPrimary.label}
            </Link>
            <Link
              to={slide.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-full border-2 border-cream-200/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:px-8"
            >
              {slide.ctaSecondary.label}
            </Link>
          </motion.div>
        </motion.div>

        {slides.length > 1 && (
          <>
            <motion.div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={[
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-8 bg-gold-400' : 'w-2 bg-white/50 hover:bg-white/80',
                  ].join(' ')}
                />
              ))}
            </motion.div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2 text-white backdrop-blur hover:bg-black/40 md:left-6 md:flex"
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2 text-white backdrop-blur hover:bg-black/40 md:right-6 md:flex"
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}
      </motion.div>
    </section>
  )
}
