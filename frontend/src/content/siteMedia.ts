/** Static media paths under `frontend/public/` — each slot used once site-wide. */

export const GALLERY_LOCAL_COUNT = 28

/** Unique image slots per section (no overlap across the site). */
export const IMAGE_SLOTS = {
  /** Hero carousel */
  hero: [1, 2, 3, 4],
  /** Featured seva cards */
  featuredSeva: [5, 6, 7],
  /** “Sri Jagannath at Hare Krishna Land” */
  templeIntro: 8,
  /** Home “Temple glimpses” strip */
  homeGlimpses: [9, 10, 11],
  /** Festival cards (by sort_order 0–7 in seed) */
  festivals: [12, 13, 14, 15, 16, 17, 18, 19],
  /** Full gallery page only */
  galleryPage: [20, 21, 22, 23, 24, 25, 26, 27, 28],
} as const

export function galleryLocalPath(n: number): string {
  const slot = Math.min(Math.max(1, Math.floor(n)), GALLERY_LOCAL_COUNT)
  return `/gallery/${String(slot).padStart(2, '0')}.png`
}

export function siteImage(slot: number): string {
  return galleryLocalPath(slot)
}

export function siteImageHero(index: number): string {
  return siteImage(IMAGE_SLOTS.hero[index % IMAGE_SLOTS.hero.length])
}

export function siteImageSeva(index: number): string {
  return siteImage(IMAGE_SLOTS.featuredSeva[index % IMAGE_SLOTS.featuredSeva.length])
}

export function siteImageTempleIntro(): string {
  return siteImage(IMAGE_SLOTS.templeIntro)
}

export function siteImageHomeGlimpse(index: number): string {
  return siteImage(IMAGE_SLOTS.homeGlimpses[index % IMAGE_SLOTS.homeGlimpses.length])
}

export function festivalImageSlot(sortOrder: number): number {
  const idx = Math.min(Math.max(0, sortOrder), IMAGE_SLOTS.festivals.length - 1)
  return IMAGE_SLOTS.festivals[idx]
}

export function siteImageFestival(sortOrder: number): string {
  return siteImage(festivalImageSlot(sortOrder))
}

export function siteImageGalleryPage(index: number): string {
  return siteImage(IMAGE_SLOTS.galleryPage[index % IMAGE_SLOTS.galleryPage.length])
}

export const HERO_SLIDES = [
  {
    image: siteImage(1),
    title: 'ISKCON Dornala — Sri Jagannath Temple',
    subtitle: 'Hare Krishna Land on Srisailam Road — darshan, kirtan, annadanam, and joyful association.',
    ctaPrimary: { label: 'Donate Now', href: '/donate' },
    ctaSecondary: { label: 'Daily Darshan', href: '/darshan' },
  },
  {
    image: siteImage(2),
    title: 'Serve with love at Hare Krishna Land',
    subtitle: 'Join us for festivals, prasadam, and the culture of bhakti-yoga.',
    ctaPrimary: { label: 'Support Seva', href: '/donate' },
    ctaSecondary: { label: 'Festivals', href: '/festivals' },
  },
  {
    image: siteImage(3),
    title: 'Annadanam for pilgrims & villages',
    subtitle: 'Your offering becomes sanctified prasadam and care for those in need.',
    ctaPrimary: { label: 'Donate Annadanam', href: '/donate' },
    ctaSecondary: { label: 'Gallery', href: '/gallery' },
  },
  {
    image: siteImage(4),
    title: 'Sacred festivals & kirtan',
    subtitle: 'Celebrate appearance days with the congregation at our temple.',
    ctaPrimary: { label: 'Festival calendar', href: '/festivals' },
    ctaSecondary: { label: 'Contact us', href: '/contact' },
  },
] as const

export const FEATURED_SEVA = [
  {
    title: 'Annadanam & yatrikas',
    description: 'Free prasadam for Srisailam pilgrims and large-scale festival feasts.',
    href: '/donate',
    image: siteImage(5),
    slot: 5,
  },
  {
    title: 'Care for Cows',
    description: 'Compassionate care, feed, and protection for cows at the goshala.',
    href: '/donate',
    image: siteImage(6),
    slot: 6,
  },
  {
    title: 'Temple Construction Fund',
    description: 'Build Sri Jagannath Temple and facilities at Hare Krishna Land.',
    href: '/donate',
    image: siteImage(7),
    slot: 7,
  },
] as const

export const UPI_QR_STATIC = '/upi-qr.png'

export const GALLERY_CAPTIONS: Record<number, string> = {
  20: 'Evening arati',
  21: 'Morning darshan',
  22: 'Festival feast',
  23: 'Goshala care',
  24: 'Spiritual class',
  25: 'Pilgrim welcome',
  26: 'Community seva',
  27: 'Sacred procession',
  28: 'Temple grounds',
}

export const HOME_GLIMPSE_CAPTIONS = ['Darshan', 'Kirtan', 'Annadanam'] as const

export const TEMPLE_INTRO_DEFAULT = {
  heading: 'Sri Jagannath at Hare Krishna Land',
  body: 'Under the guidance of ISKCON and Srila Prabhupada’s teachings, we serve Lord Jagannath, Baladev, and Subhadra with arati, kirtan, and prasadam — while reaching pilgrims, school children, and families along the sacred route to Srisailam.',
  image: siteImageTempleIntro(),
  slot: IMAGE_SLOTS.templeIntro,
  blessing:
    'In this holy abode of Sri Jagannath, may every step you take draw you closer to Krishna’s lotus feet, and may your heart be filled with the nectar of the holy name.',
  blessingAuthor: 'ISKCON Dornala',
} as const

export const DARSHAN_HIGHLIGHT_DEFAULT = {
  quote: 'Seeing the Deities in the temple, engaged in various transcendental activities, is called darshan.',
  attribution: 'Srila Prabhupada',
} as const

/** Fallback chain if a file is missing (last slots on disk). */
export const IMAGE_FALLBACK_CHAIN = [28, 27, 26, 25] as const
