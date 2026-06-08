type Variant = 'schedule' | 'list'

type Props = {
  items: string[]
  title?: string
  variant?: Variant
}

function parseItem(text: string): { label?: string; description: string } {
  const festival = /^Festival:\s+(.+)$/i.exec(text)
  if (festival) {
    return { label: 'Festival', description: festival[1].trim() }
  }
  const heritage = /^Heritage:\s+(.+)$/i.exec(text)
  if (heritage) {
    return { label: 'Heritage', description: heritage[1].trim() }
  }
  const dash = ' — '
  const dashIndex = text.indexOf(dash)
  if (dashIndex > 0) {
    return {
      label: text.slice(0, dashIndex).trim(),
      description: text.slice(dashIndex + dash.length).trim(),
    }
  }
  return { description: text }
}

function ScheduleList({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="about-schedule-title">
      <h3 id="about-schedule-title" className="font-display text-xl text-maroon-900 sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-maroon-700">Darshan windows and arati timings for Sri Jagannath, Baladev & Subhadra</p>

      <ul className="mt-5 overflow-hidden rounded-2xl border border-maroon-900/12 bg-cream-50">
        {items.map((item, index) => {
          const { label, description } = parseItem(item)
          return (
            <li
              key={`${index}-${item.slice(0, 24)}`}
              className="flex flex-col gap-2 border-b border-maroon-900/8 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
            >
              <span className="text-base font-semibold text-maroon-900">{label ?? description}</span>
              {label && (
                <time className="shrink-0 text-sm font-medium text-maroon-800 sm:text-right">{description}</time>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function SimpleList({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="mt-8 sm:mt-10" aria-labelledby="about-highlights-title">
      <h3 id="about-highlights-title" className="font-display text-xl text-maroon-900 sm:text-2xl">
        {title}
      </h3>

      <ul className="mt-5 space-y-4">
        {items.map((item, index) => {
          const { label, description } = parseItem(item)
          return (
            <li
              key={`${index}-${item.slice(0, 24)}`}
              className="rounded-2xl border border-maroon-900/10 bg-white px-5 py-4 shadow-sm"
            >
              {label ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold-700">{label}</p>
                  <p className="mt-2 text-base leading-relaxed text-maroon-800">{description}</p>
                </>
              ) : (
                <p className="text-base leading-relaxed text-maroon-800">{description}</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function AboutHighlights({ items, title = 'Highlights', variant = 'list' }: Props) {
  if (items.length === 0) return null

  if (variant === 'schedule') {
    return <ScheduleList items={items} title={title} />
  }

  return <SimpleList items={items} title={title} />
}
