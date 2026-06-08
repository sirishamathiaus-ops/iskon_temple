import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from './SpiritualImage'

type Cta = { label: string; href: string }

type Props = {
  image: SpiritualImageDef
  eyebrow?: string
  title: string
  subtitle?: string
  primaryCta?: Cta
  secondaryCta?: Cta
  compact?: boolean
  /** Portrait hero — object-contain so the full photo is visible */
  portrait?: boolean
  /** Fit image inside fixed hero height/width (About ISKCON, etc.) */
  contained?: boolean
  /** Lighter overlay so the background photo reads clearly */
  prominentImage?: boolean
  imagePosition?: string
}

export function SpiritualHero({
  image,
  eyebrow = 'Sacred heritage',
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  compact = false,
  portrait = false,
  contained = false,
  prominentImage = false,
  imagePosition = 'center',
}: Props) {
  const useContain = portrait || contained
  const sectionSize = portrait
    ? 'min-h-[min(52vh,520px)] sm:min-h-[56vh]'
    : contained
      ? 'h-[min(42vh,380px)] min-h-[260px] sm:h-[min(48vh,440px)] sm:min-h-[300px] md:h-[min(52vh,480px)]'
      : prominentImage
        ? 'min-h-[min(50vh,480px)] sm:min-h-[56vh] md:min-h-[60vh]'
        : compact
          ? 'min-h-[42vh] sm:min-h-[48vh]'
          : 'min-h-[55vh] sm:min-h-[62vh] md:min-h-[70vh]'

  const bgClass = portrait ? 'bg-[#4a1638]' : contained ? 'bg-maroon-900' : 'bg-maroon-950'
  const positionClass =
    imagePosition === 'center' ? 'object-center' : `object-${imagePosition.replace(/^object-/, '')}`

  return (
    <section className={`relative overflow-hidden border-b border-maroon-900/10 ${sectionSize}`}>
      <div className={`absolute inset-0 ${bgClass}`} aria-hidden>
        <div className="absolute inset-0 overflow-hidden">
          <SpiritualImage
            key={image.id}
            image={image}
            loading="eager"
            fit={useContain ? 'contain' : 'cover'}
            wrapperClassName="absolute inset-0 h-full w-full"
            className={useContain ? '' : positionClass}
            sizes="100vw"
          />
        </div>
        <div
          className={
            portrait
              ? 'pointer-events-none absolute inset-0 bg-gradient-to-r from-maroon-950/88 via-maroon-900/50 to-transparent'
              : contained
                ? 'pointer-events-none absolute inset-0 bg-gradient-to-r from-maroon-950/80 via-maroon-900/45 to-maroon-900/20'
                : prominentImage
                  ? 'pointer-events-none absolute inset-0 bg-gradient-to-r from-maroon-950/72 via-maroon-900/38 to-maroon-900/15'
                  : 'pointer-events-none absolute inset-0 bg-gradient-to-r from-maroon-950/90 via-maroon-900/70 to-maroon-900/45'
          }
        />
        <div
          className={
            portrait
              ? 'pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/45 via-transparent to-transparent'
              : contained
                ? 'pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/35 via-transparent to-transparent'
                : prominentImage
                  ? 'pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/38 via-transparent to-transparent'
                  : 'pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/60 via-transparent to-maroon-900/25'
          }
        />
        <div className="spiritual-glow-orb pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-300/20 blur-3xl md:h-96 md:w-96" />
      </div>

      <div className={`relative mx-auto flex ${sectionSize} max-w-6xl flex-col justify-center px-4 py-14 sm:py-16 md:px-6 md:py-20`}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/95 sm:text-sm"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-3 max-w-4xl font-display text-2xl font-semibold leading-[1.12] text-white drop-shadow-lg sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-100/95 sm:mt-5 sm:text-lg md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {(primaryCta || secondaryCta) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-3 sm:mt-8"
          >
            {primaryCta && (
              <Link
                to={primaryCta.href}
                className="btn-tap inline-flex rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 text-sm font-bold text-maroon-900 shadow-gold sm:px-7 sm:py-3.5"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.href}
                className="btn-tap inline-flex rounded-full border-2 border-cream-200/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 sm:px-7 sm:py-3.5"
              >
                {secondaryCta.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
