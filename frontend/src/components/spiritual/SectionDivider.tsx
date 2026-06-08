import { ScrollReveal } from './ScrollReveal'

type Props = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionDivider({ title, subtitle, align = 'left' }: Props) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <ScrollReveal className={`max-w-3xl ${alignClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-maroon-700/75">Sacred history</p>
      <h2 className="mt-2 font-display text-3xl text-maroon-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-maroon-800/85 md:text-lg">{subtitle}</p>}
      <div
        className={`mt-6 h-px w-full max-w-md bg-gradient-to-r from-gold-400/80 via-gold-300/40 to-transparent ${align === 'center' ? 'mx-auto' : ''}`}
        aria-hidden
      />
    </ScrollReveal>
  )
}
