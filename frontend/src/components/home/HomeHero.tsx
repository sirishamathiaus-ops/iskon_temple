import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HOME_HERO_BACKGROUND, HOME_HERO_SLIDES } from '@/content/spiritualMedia'
import { HeroImageSlideshow } from '@/components/home/HeroImageSlideshow'

const TEXT_FADE = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }

/**
 * Two-column hero: full-viewport background with devotional content and image slider.
 */
export function HomeHero() {
  const [slideIndex, setSlideIndex] = useState(0)
  const slide = HOME_HERO_SLIDES[slideIndex] ?? HOME_HERO_SLIDES[0]
  const heroImages = HOME_HERO_SLIDES.map((s) => s.image)

  return (
    <section className="relative min-h-screen w-full border-b border-maroon-900/10">
      <img
        src={HOME_HERO_BACKGROUND}
        alt=""
        aria-hidden
        decoding="async"
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-white/25" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cream-50/35 via-white/15 to-gold-100/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:px-8 md:py-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        {/* Left — devotional content */}
        <div className="relative order-2 flex flex-col justify-center py-2 sm:py-4">
          <div className="relative min-h-[7.5rem] sm:min-h-[8.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={TEXT_FADE}
              >
                <h2 className="hero-text-shadow font-display text-3xl font-bold leading-tight text-maroon-950 sm:text-4xl lg:text-[2.75rem]">
                  {slide.heading}
                </h2>
                <p className="hero-text-shadow mt-4 max-w-md text-base font-medium leading-relaxed text-maroon-900 sm:text-lg">
                  {slide.message}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/donate" className="hero-btn-primary">
              Donate now
            </Link>
            <Link to="/about/iskcon" className="hero-btn-secondary">
              About our temple
            </Link>
            <Link to="/darshan" className="hero-btn-secondary">
              Daily darshan
            </Link>
          </div>
        </div>

        {/* Right — image slider */}
        <div className="order-1 lg:order-2">
          <HeroImageSlideshow
            images={heroImages}
            onIndexChange={setSlideIndex}
            className="mx-auto w-full max-w-lg lg:max-w-none"
          />
        </div>
      </div>
    </section>
  )
}
