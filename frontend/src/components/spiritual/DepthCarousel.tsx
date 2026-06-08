import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HOME_DEPTH_SLIDES } from '@/content/spiritualMedia'
import { SpiritualImage } from './SpiritualImage'

type Slide = (typeof HOME_DEPTH_SLIDES)[number]

type Props = {
  slides?: readonly Slide[]
  intervalMs?: number
  fallbackTitle?: string
  fallbackSubtitle?: string
}

export function DepthCarousel({
  slides = HOME_DEPTH_SLIDES,
  intervalMs = 8000,
  fallbackTitle,
  fallbackSubtitle,
}: Props) {
  const [index, setIndex] = useState(0)
  const slide = slides[index] ?? slides[0]
  const title = slide?.title || fallbackTitle || 'ISKCON Dornala'
  const subtitle = slide?.subtitle || fallbackSubtitle || ''

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs)
    return () => clearInterval(t)
  }, [slides.length, intervalMs])

  return (
    <section className="depth-stage relative overflow-hidden border-b border-maroon-900/10">
      <div className="relative min-h-[min(100svh,720px)] sm:min-h-[520px] md:min-h-[600px] lg:min-h-[640px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.image.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'center center' }}
          >
            <SpiritualImage
              image={slide.image}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="h-full w-full scale-105"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/88 via-maroon-900/65 to-maroon-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/55 via-transparent to-maroon-900/20" />
        <div className="spiritual-glow-orb absolute left-[15%] top-[20%] h-48 w-48 rounded-full bg-gold-400/20 blur-3xl md:h-72 md:w-72" />
        <div className="spiritual-glow-orb spiritual-glow-orb-delay absolute right-[10%] bottom-[25%] h-40 w-40 rounded-full bg-saffron-300/15 blur-3xl" />

        <div className="relative mx-auto flex min-h-[min(100svh,720px)] max-w-6xl flex-col justify-center px-4 py-20 sm:min-h-[520px] md:min-h-[600px] md:px-6 lg:min-h-[640px]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-200/95">Hare Krishna — Dornala</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -16, rotateX: -6 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
              className="depth-text-layer"
            >
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.1] text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-100/95 sm:text-lg md:text-xl">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-8 flex flex-wrap gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Link
              to={slide.ctaPrimary.href}
              className="btn-tap inline-flex rounded-full bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 px-7 py-3.5 text-sm font-bold text-maroon-900 shadow-gold ring-2 ring-gold-200/60"
            >
              {slide.ctaPrimary.label}
            </Link>
            <Link
              to={slide.ctaSecondary.href}
              className="btn-tap inline-flex rounded-full border-2 border-cream-200/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20"
            >
              {slide.ctaSecondary.label}
            </Link>
          </motion.div>
        </div>

        {slides.length > 1 && (
          <>
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-8">
              {slides.map((s, i) => (
                <button
                  key={s.image.id}
                  type="button"
                  aria-label={`Slide ${i + 1}: ${s.image.title ?? ''}`}
                  onClick={() => setIndex(i)}
                  className={[
                    'h-2 rounded-full transition-all duration-300',
                    i === index ? 'w-8 bg-gold-400 shadow-[0_0_12px_rgba(232,184,74,0.8)]' : 'w-2 bg-white/45 hover:bg-white/75',
                  ].join(' ')}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-xl text-white backdrop-blur hover:bg-black/45 md:left-6 md:flex"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/25 bg-black/30 p-2.5 text-xl text-white backdrop-blur hover:bg-black/45 md:right-6 md:flex"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  )
}
