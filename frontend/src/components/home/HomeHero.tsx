import { Link } from 'react-router-dom'
import { HOME_HERO_BG_SLIDES, HOME_HERO_PANELS } from '@/content/spiritualMedia'
import { HeroImageSlideshow } from '@/components/home/HeroImageSlideshow'

type Props = {
  fallbackTitle?: string
  fallbackSubtitle?: string
}

/**
 * First home section: devotional background slideshow (fade) + dark overlay for readable white text.
 */
export function HomeHero({ fallbackTitle, fallbackSubtitle }: Props) {
  const panel = HOME_HERO_PANELS[0]
  const title = fallbackTitle || panel.title
  const description = fallbackSubtitle || panel.description

  return (
    <section className="border-b border-maroon-900/10 bg-cream-50 px-4 py-8 md:px-8 md:py-10 lg:py-12">
      <div className="relative mx-auto min-h-[min(88vh,780px)] max-w-7xl overflow-hidden rounded-3xl border border-maroon-900/10 shadow-[0_24px_64px_-28px_rgba(69,26,41,0.28)] md:min-h-[min(82vh,720px)]">
        <HeroImageSlideshow images={HOME_HERO_BG_SLIDES} intervalMs={5000} />

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/35 via-black/10 to-transparent"
          aria-hidden
        />

        <div className="relative z-[3] grid min-h-[inherit] items-center gap-8 p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-10 lg:p-14">
          <div className="order-2 md:order-1">
            <p className="hero-text-shadow text-sm font-medium tracking-wide text-white/90">
              Since Hare Krishna Land
            </p>
            <h1 className="hero-text-shadow mt-4 font-display text-3xl font-semibold leading-[1.15] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              {title}
            </h1>
            <p className="hero-text-shadow mt-5 max-w-lg text-base leading-relaxed text-white/95 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/donate"
                className="btn-tap inline-flex rounded-full border-2 border-white/90 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition hover:bg-white hover:text-maroon-900"
              >
                Donate now
              </Link>
              <Link
                to="/about/iskcon"
                className="btn-tap inline-flex rounded-full bg-maroon-900 px-7 py-3 text-sm font-semibold text-cream-50 shadow-[0_2px_12px_rgba(0,0,0,0.45)] hover:bg-maroon-800"
              >
                About our temple
              </Link>
              <Link
                to="/darshan"
                className="btn-tap inline-flex rounded-full border border-white/50 bg-white/15 px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm hover:bg-white/25"
              >
                Daily darshan
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/25 pt-8">
              <div>
                <p className="hero-text-shadow font-display text-2xl text-white">12+</p>
                <p className="hero-text-shadow text-xs text-white/85">Sacred festivals yearly</p>
              </div>
              <div>
                <p className="hero-text-shadow font-display text-2xl text-white">Annadanam</p>
                <p className="hero-text-shadow text-xs text-white/85">For Srisailam yatrikas</p>
              </div>
              <div>
                <p className="hero-text-shadow font-display text-2xl text-white">Jagannath</p>
                <p className="hero-text-shadow text-xs text-white/85">Daily darshan & arati</p>
              </div>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="w-full max-w-md rounded-2xl border border-white/25 bg-black/35 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md md:rounded-3xl md:p-8">
              <p className="hero-text-shadow text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                Sri Radha Krishna
              </p>
              <p className="hero-text-shadow mt-3 font-display text-xl leading-snug text-white md:text-2xl">
                The heart of devotion at our temple
              </p>
              <p className="hero-text-shadow mt-4 text-sm leading-relaxed text-white/90">
                Darshan, kirtan, and festivals on the sacred route to Srisailam — Hare Krishna Land, Dornala.
              </p>
              <Link
                to="/festivals"
                className="btn-tap mt-6 inline-flex rounded-full bg-maroon-900 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              >
                View festivals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
