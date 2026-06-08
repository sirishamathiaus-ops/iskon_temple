import type { ReactNode } from 'react'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from './SpiritualImage'

type Props = {
  image: SpiritualImageDef
  children: ReactNode
  className?: string
  overlay?: 'light' | 'dark' | 'cream'
}

const overlays = {
  light: 'from-cream-50/92 via-cream-50/88 to-cream-50/95',
  cream: 'from-cream-100/90 via-cream-50/85 to-white/92',
  dark: 'from-maroon-950/88 via-maroon-900/75 to-maroon-950/90',
}

export function SpiritualBackground({ image, children, className = '', overlay = 'cream' }: Props) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <SpiritualImage
          image={image}
          loading="eager"
          className="h-full min-h-full w-full scale-105 blur-[2px] sm:blur-[3px]"
          sizes="100vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${overlays[overlay]}`} />
        <div className="spiritual-glow-orb absolute -left-1/4 top-1/4 h-[50vh] w-[50vh] rounded-full bg-gold-400/20 blur-3xl" />
        <div className="spiritual-glow-orb spiritual-glow-orb-delay absolute -right-1/4 bottom-0 h-[40vh] w-[40vh] rounded-full bg-saffron-400/15 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </section>
  )
}
