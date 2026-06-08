import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FestivalCover } from '@/components/festivals/FestivalCover'
import { getFestivalMeta, defaultMetaForFestival } from '@/content/festivalCatalog'
import { formatFestivalDate } from '@/lib/formatDate'
import type { FestivalTiming } from '@/lib/festivals'
import type { Festival } from '@/types'

const TIMING_LABEL: Record<FestivalTiming, string> = {
  upcoming: 'Coming soon',
  current: 'Happening now',
  ongoing: 'Year-round',
  past: 'Completed',
}

const TIMING_CLASS: Record<FestivalTiming, string> = {
  upcoming: 'bg-gold-500 text-maroon-900',
  current: 'bg-maroon-900 text-cream-50',
  ongoing: 'bg-cream-100 text-maroon-800 ring-1 ring-maroon-900/15',
  past: 'bg-maroon-100 text-maroon-800/90',
}

type Props = {
  festival: Festival
  index?: number
  variant?: 'list' | 'grid'
  timing?: FestivalTiming
}

function formatTime(meta: ReturnType<typeof getFestivalMeta>) {
  const first = meta?.timings?.[0]
  if (!first) return null
  return `${first.label}: ${first.time}`
}

function TimingBadge({ timing }: { timing: FestivalTiming }) {
  return (
    <span
      className={[
        'absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        TIMING_CLASS[timing],
      ].join(' ')}
    >
      {TIMING_LABEL[timing]}
    </span>
  )
}

export function FestivalCard({ festival, index = 0, variant = 'list', timing }: Props) {
  const meta = getFestivalMeta(festival.slug) ?? defaultMetaForFestival(festival)
  const timeHint = formatTime(meta)

  if (variant === 'grid') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="spiritual-card-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-maroon-900/10 bg-white shadow-card"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-200">
          <FestivalCover
            festival={festival}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/65 via-transparent to-transparent" />
          {timing ? (
            <TimingBadge timing={timing} />
          ) : (
            festival.is_featured && (
              <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-bold uppercase text-maroon-900">
                Featured
              </span>
            )
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-maroon-700/75">
            {formatFestivalDate(festival.event_date)}
          </p>
          {timeHint && <p className="mt-1 text-xs text-saffron-700">{timeHint}</p>}
          <h2 className="mt-2 font-display text-2xl text-maroon-900">{festival.name}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-maroon-800/85">{festival.short_description}</p>
          <Link
            to={`/festivals/${festival.slug}`}
            className="mt-5 inline-flex items-center text-sm font-semibold text-maroon-800 group-hover:text-maroon-900"
          >
            Festival details →
          </Link>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="spiritual-card-hover group grid gap-0 overflow-hidden rounded-3xl border border-maroon-900/10 bg-white shadow-card md:grid-cols-[minmax(260px,34%)_1fr]"
    >
      <div className="relative min-h-[220px] overflow-hidden bg-cream-200 md:min-h-full">
        <FestivalCover
          festival={festival}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-maroon-900/10 md:bg-gradient-to-t md:from-maroon-950/40" />
        {timing && <TimingBadge timing={timing} />}
      </div>
      <div className="p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-maroon-700/75">
          {formatFestivalDate(festival.event_date)}
        </p>
        {timeHint && <p className="mt-1 text-sm font-medium text-saffron-700">{timeHint}</p>}
        <h2 className="mt-2 font-display text-3xl text-maroon-900">{festival.name}</h2>
        <p className="mt-3 leading-relaxed text-maroon-800/85">{festival.short_description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/festivals/${festival.slug}`}
            className="rounded-full bg-maroon-900 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft hover:bg-maroon-800"
          >
            Festival details
          </Link>
          {festival.sponsorship_enabled && (
            <Link
              to="/donate"
              state={{ category: 'festival_sponsorship', festivalId: festival.id > 0 ? festival.id : undefined }}
              className="rounded-full border border-gold-500/40 bg-gold-100/90 px-5 py-2.5 text-sm font-semibold text-maroon-900"
            >
              Sponsor festival
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  )
}
