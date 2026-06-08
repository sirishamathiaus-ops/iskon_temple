import {
  FESTIVAL_CATALOG,
  FESTIVAL_NAV_ORDER,
  defaultMetaForFestival,
  metaToFestival,
} from '@/content/festivalCatalog'
import type { Festival } from '@/types'

export type FestivalTiming = 'upcoming' | 'current' | 'past' | 'ongoing'

export function parseFestivalDate(iso: string | null | undefined): Date | null {
  if (!iso) return null
  const [y, m, day] = iso.split('-').map((n) => Number(n))
  if (!y || !m || !day) return null
  return new Date(y, m - 1, day)
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getFestivalTiming(f: Festival, today = startOfDay(new Date())): FestivalTiming {
  const start = parseFestivalDate(f.event_date)
  if (!start) return 'ongoing'

  const end = parseFestivalDate(f.end_date) ?? start

  if (start <= today && today <= end) return 'current'
  if (end < today) return 'past'
  if (start > today) return 'upcoming'
  return 'past'
}

/** Split festivals into coming (upcoming, current, year-round) vs completed. Preserves catalog order within each group. */
export function partitionFestivals(festivals: Festival[]): { coming: Festival[]; done: Festival[] } {
  const coming: Festival[] = []
  const done: Festival[] = []

  for (const f of festivals) {
    if (getFestivalTiming(f) === 'past') done.push(f)
    else coming.push(f)
  }

  done.sort((a, b) => {
    const da = parseFestivalDate(a.event_date)?.getTime() ?? 0
    const db = parseFestivalDate(b.event_date)?.getTime() ?? 0
    return db - da
  })

  return { coming, done }
}

/** Next festival for home CTA — happening now, else nearest upcoming with a date. */
export function pickComingFestival(festivals: Festival[]): Festival | null {
  if (!festivals.length) return null

  const today = startOfDay(new Date())
  const current = festivals.find((f) => getFestivalTiming(f, today) === 'current')
  if (current) return current

  const upcoming = festivals
    .map((f) => ({ f, d: parseFestivalDate(f.event_date) }))
    .filter((x): x is { f: Festival; d: Date } => Boolean(x.d))
    .filter((x) => x.d >= today)
    .sort((a, b) => a.d.getTime() - b.d.getTime())

  return upcoming[0]?.f ?? null
}

export function mergeFestivals(apiList: Festival[] | null | undefined): Festival[] {
  const bySlug = new Map<string, Festival>()
  const list = Array.isArray(apiList) ? apiList : []

  for (const f of list) {
    if (!f?.slug) continue
    const meta = FESTIVAL_CATALOG[f.slug] ?? defaultMetaForFestival(f)
    bySlug.set(f.slug, metaToFestival(meta, f))
  }

  for (const slug of Object.keys(FESTIVAL_CATALOG)) {
    if (!bySlug.has(slug)) {
      bySlug.set(slug, metaToFestival(FESTIVAL_CATALOG[slug]))
    }
  }

  const order = (slug: string) => {
    const i = FESTIVAL_NAV_ORDER.indexOf(slug as (typeof FESTIVAL_NAV_ORDER)[number])
    return i === -1 ? 999 : i
  }

  return Array.from(bySlug.values()).sort((a, b) => order(a.slug) - order(b.slug) || a.sort_order - b.sort_order)
}

export function useFestivalList() {
  return { mergeFestivals }
}
