/**
 * Safe date formatting for festival/event display.
 * Avoid combining `weekday` with `dateStyle` — that throws RangeError in Intl.
 */

export function formatFestivalDate(
  date: string | null | undefined,
  style: 'long' | 'short' | 'full' = 'long',
): string {
  if (date == null || String(date).trim() === '') {
    return 'Date TBA'
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return 'Date TBA'
  }

  try {
    if (style === 'short') {
      return parsed.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
    if (style === 'full') {
      // dateStyle must not be combined with weekday/month/day options
      return parsed.toLocaleDateString(undefined, { dateStyle: 'full' })
    }
    return parsed.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return parsed.toLocaleDateString()
  }
}

export function formatFestivalDateOrAnnounce(
  date: string | null | undefined,
  style: 'long' | 'full' = 'long',
): string {
  if (date == null || String(date).trim() === '') {
    return 'Date announced soon'
  }
  return formatFestivalDate(date, style)
}
