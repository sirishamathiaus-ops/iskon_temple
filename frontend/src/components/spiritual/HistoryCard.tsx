import { ScrollReveal } from './ScrollReveal'

type Props = {
  heading: string
  body: string
  index?: number
}

export function HistoryCard({ heading, body, index = 0 }: Props) {
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <article className="card-premium spiritual-card-hover h-full p-6 sm:p-7">
        <div className="mb-3 h-1 w-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
        <h3 className="font-display text-xl text-maroon-900 sm:text-2xl">{heading}</h3>
        <p className="mt-3 text-sm leading-relaxed text-maroon-800/88 sm:text-base">{body}</p>
      </article>
    </ScrollReveal>
  )
}
