import { ScrollReveal } from './ScrollReveal'

type Item = { era: string; detail: string }

type Props = {
  items: readonly Item[]
  title?: string
}

export function Timeline({ items, title = 'Through the ages' }: Props) {
  return (
    <ScrollReveal className="mt-10">
      <h3 className="font-display text-xl text-maroon-900 md:text-2xl">{title}</h3>
      <ol className="relative mt-8 space-y-0 border-l-2 border-gold-400/40 pl-6 sm:pl-8">
        {items.map((item, i) => (
          <li key={item.era} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[calc(0.75rem+1px)] top-1.5 h-3 w-3 rounded-full border-2 border-gold-400 bg-cream-50 shadow-[0_0_12px_rgba(201,149,44,0.5)] sm:-left-[calc(1rem+1px)]"
              aria-hidden
            />
            <ScrollReveal delay={i * 0.05} y={12}>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{item.era}</p>
              <p className="mt-1 text-sm leading-relaxed text-maroon-800/88 sm:text-base">{item.detail}</p>
            </ScrollReveal>
          </li>
        ))}
      </ol>
    </ScrollReveal>
  )
}
