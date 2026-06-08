/**
 * Images from `frontend/public/spiritual/` — user-uploaded festival & temple photos.
 */

import { SRISAILAM_HISTORY } from '@/content/spiritualContent'

export type SpiritualImageDef = {
  id: string
  src: string
  fallbackSrc?: string
  alt: string
  title?: string
  caption?: string
  width?: number
  height?: number
}

/** Encode filenames with spaces/special chars for URLs */
export function spiritualPath(filename: string): string {
  return `/spiritual/${filename.split('/').map((part) => encodeURIComponent(part)).join('/')}`
}

/** Optimized hero slideshow assets in `frontend/public/spiritual/hero/` */
export function heroSlidePath(filename: string): string {
  return `/spiritual/hero/${encodeURIComponent(filename)}`
}

/** Full-bleed hero background for the home hero section */
export const HOME_HERO_BACKGROUND = heroSlidePath('hero-background.jpg')

/** Sacred Abode section — separate from hero slider (`/spiritual/sacred-abode/`) */
export function sacredAbodePath(filename: string): string {
  return `/spiritual/sacred-abode/${encodeURIComponent(filename)}`
}

function sacredAbodeAsset(
  file: string,
  alt: string,
  title?: string,
  dimensions?: { width: number; height: number },
): SpiritualImageDef {
  return {
    id: `sacred-abode-${file.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    src: sacredAbodePath(file),
    alt,
    title,
    width: dimensions?.width,
    height: dimensions?.height,
  }
}

/** Featured image for Sacred Abode section — not used in hero slider */
export const SACRED_ABODE_IMAGE = sacredAbodeAsset(
  'sacred-abode.jpg',
  'Sacred pastoral landscape at Hare Krishna Land',
  'Hare Krishna Land',
  { width: 1600, height: 890 },
)

function heroAsset(file: string, alt: string, title?: string): SpiritualImageDef {
  return {
    id: file.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
    src: heroSlidePath(file),
    alt,
    title,
  }
}

/** About ISKCON hero — temple at Hare Krishna Land */
export const ABOUT_ISKCON_HERO_IMAGE = sacredAbodeAsset(
  'temple-dornala.jpg',
  'ISKCON temple at Hare Krishna Land',
  'ISKCON Srisailam',
  { width: 1600, height: 996 },
)

/** Deities timetable hero — Radha Krishna worship */
export const ABOUT_DEITIES_HERO_IMAGE = heroAsset(
  'radha-krishna-03.jpg',
  'Radha Krishna arati and worship',
  'Radha Krishna',
)

/** About Srisailam hero — Mallikarjuna Jyotirlinga */
export const ABOUT_SRISAILAM_HERO_IMAGE = sacredAbodeAsset(
  'mallikarjuna-swamy.jpg',
  'Sri Mallikarjuna Swamy at Srisailam',
  'Mallikarjuna Swamy',
  { width: 1600, height: 890 },
)

/** Founder section images (`/spiritual/founder/`) */
export function founderPath(filename: string): string {
  return `/spiritual/founder/${encodeURIComponent(filename)}`
}

function founderAsset(file: string, alt: string, title?: string): SpiritualImageDef {
  return {
    id: `founder-${file.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    src: founderPath(file),
    alt,
    title,
  }
}

export const ABOUT_FOUNDER_HERO_IMAGE = founderAsset(
  'srila-prabhupada.jpg',
  'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada',
  'Srila Prabhupada',
)

function asset(file: string, alt: string, title?: string, fallback?: string): SpiritualImageDef {
  return {
    id: file.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
    src: spiritualPath(file),
    fallbackSrc: fallback ? spiritualPath(fallback) : undefined,
    alt,
    title,
  }
}

// —— Radha Krishna ——
export const SPIRITUAL_IMAGES = {
  radhaKrishna: asset('Radha krishna.jpg', 'Sri Radha Krishna darshan', 'Radha Krishna', 'Radhakrishna1.jpg'),
  radhaKrishna1: asset('Radhakrishna1.jpg', 'Radha Krishna — divine couple', 'Radha Krishna'),
  radhaKrishna2: asset('Radhakrishna images4.jpg', 'Radha Krishna festival decoration', 'Radha Krishna'),
  radhaKrishna3: asset('Radhakrishnaimages3.jpg', 'Radha Krishna arati', 'Radha Krishna'),
  radhaKrishnaWebp: asset('Radhakrishna3.webp', 'Radha Krishna worship', 'Radha Krishna', 'Radha krishna.jpg'),
  sriKrishna: asset('srikrishna.webp', 'Lord Sri Krishna', 'Sri Krishna'),

  // —— Srisailam & Shiva ——
  srisailam: asset('Srisailam.jpg', 'Srisailam temple landscape', 'Srisailam'),
  srisailamView: asset('Srisialam 1.png', 'Srisailam sacred hills', 'Srisailam', 'Srisailam.jpg'),
  mallikarjuna: asset('MAllikarjuna Swamy.jpeg', 'Mallikarjuna Jyotirlinga', 'Mallikarjuna Swamy'),
  shivaGopuram: asset('Shiva Gopuram.png', 'Srisailam temple gopuram', 'Temple gopuram'),
  shivaGopuram2: asset('Gopuramnandi.png', 'Temple gopuram and Nandi', 'Gopuram'),
  shivaParvati: asset('shivaparvathi.png', 'Lord Shiva and Parvati', 'Shiva Parvati'),
  shivaLingam: asset('shivaayh.png', 'Sacred Shiva lingam', 'Shiva'),
  srisailamWater: asset('Srisailamflow water.png', 'Krishna River at Srisailam', 'Sacred waters'),
  bramarambika: asset('BramarambikaDevi.jpeg', 'Bramarambika Devi', 'Devi'),

  // —— Temple & ISKCON ——
  templeBuilding: asset('image.png', 'ISKCON Dornala temple at Hare Krishna Land', 'Our temple'),
  templePrograms: asset('Temple special programs.jpg', 'Temple community programs', 'Temple programs'),
  kukumkama: asset('kukumkama.jpg', 'Temple festival kumkum archana', 'Festival seva'),

  // —— Festivals (named files) ——
  ugadi: asset('Ugadi.jpeg', 'Ugadi festival celebration', 'Ugadi'),
  gauraPurnima: asset('Gaura Purnima.webp', 'Gaura Purnima kirtan', 'Gaura Purnima'),
  govardhanPuja: asset('Govardhan Puja.webp', 'Govardhan Puja annakut', 'Govardhan Puja'),
  ramaNavami: asset('Sriramanavami.jpg', 'Sri Rama Navami', 'Rama Navami'),
  narasimha: asset('Narsimha.jpg', 'Lord Narasimhadeva', 'Narasimha Chaturdashi'),
  ekadashi: asset('Vaishnava Ekadashi observance.webp', 'Vaishnava Ekadashi', 'Ekadashi'),
  balaramJayanti: asset('balaramjayanthi.jpg', 'Balarama Jayanti', 'Balarama Jayanti'),
  ammavaru: asset('ammavaru.png', 'Temple goddess darshan', 'Ammavaru'),

  /** Aliases used across about pages */
  jagannath: asset('image.png', 'Sri Jagannath Temple darshan', 'Sri Jagannath'),
  srisailamGopuram: asset('Gopuramnandi.png', 'Temple gopuram', 'Gopuram'),
  radhaKrishnaAlt: asset('Radhakrishna1.jpg', 'Radha Krishna darshan', 'Radha Krishna'),
} as const

/** Festival slug → primary image file(s) in /spiritual */
export const FESTIVAL_SPIRITUAL_IMAGES: Record<string, { primary: string; extras?: string[] }> = {
  'ugadi-2026': { primary: 'Ugadi.jpeg', extras: ['kukumkama.jpg'] },
  'janmashtami-2026': { primary: 'srikrishna.webp', extras: ['Radhakrishna1.jpg', 'Radha krishna.jpg'] },
  'balarama-jayanti-2026': { primary: 'balaramjayanthi.jpg', extras: ['Radhakrishna1.jpg'] },
  'gaura-purnima-2026': { primary: 'Gaura Purnima.webp', extras: ['Radhakrishna images4.jpg'] },
  'radhashtami-2026': { primary: 'Radhakrishnaimages3.jpg', extras: ['Radhakrishna3.webp'] },
  'rama-navami-2026': { primary: 'Sriramanavami.jpg', extras: ['Narsimha.jpg'] },
  'narasimha-chaturdashi-2026': { primary: 'Narsimha.jpg' },
  'govardhan-puja-2026': { primary: 'Govardhan Puja.webp' },
  'ekadashi-observance': { primary: 'Vaishnava Ekadashi observance.webp' },
  'temple-special-programs': { primary: 'Temple special programs.jpg', extras: ['image.png'] },
}

export function festivalSpiritualDef(slug: string, name: string): SpiritualImageDef {
  const map = FESTIVAL_SPIRITUAL_IMAGES[slug]
  if (map) return asset(map.primary, `${name} festival`, name)
  return SPIRITUAL_IMAGES.templePrograms
}

export function festivalSpiritualGallery(slug: string, name: string): SpiritualImageDef[] {
  const map = FESTIVAL_SPIRITUAL_IMAGES[slug]
  if (!map) return [SPIRITUAL_IMAGES.templePrograms]
  const files = [map.primary, ...(map.extras ?? [])]
  return files.map((f) => asset(f, `${name} — festival`, name))
}

function aboutGalleryImage(
  base: SpiritualImageDef,
  title: string,
  caption: string,
): SpiritualImageDef {
  return {
    ...base,
    id: `srisailam-about-${base.id}`,
    title,
    caption,
    alt: `${title} — ${base.alt}`,
  }
}

/** Srisailam About tab — each image paired with its history text (replaces section cards) */
export const SRISAILAM_ABOUT_GALLERY: SpiritualImageDef[] = [
  aboutGalleryImage(
    SPIRITUAL_IMAGES.mallikarjuna,
    'Jyotirlinga significance',
    SRISAILAM_HISTORY.sections[0].body,
  ),
  aboutGalleryImage(
    SPIRITUAL_IMAGES.shivaGopuram,
    'Location & spiritual importance',
    SRISAILAM_HISTORY.sections[1].body,
  ),
  aboutGalleryImage(
    SPIRITUAL_IMAGES.srisailamView,
    'Historical background',
    SRISAILAM_HISTORY.sections[2].body,
  ),
  aboutGalleryImage(
    SPIRITUAL_IMAGES.shivaParvati,
    'Shiva & Parvati',
    SRISAILAM_HISTORY.sections[3].body,
  ),
  aboutGalleryImage(
    SPIRITUAL_IMAGES.shivaGopuram2,
    'In Hindu culture',
    SRISAILAM_HISTORY.sections[4].body,
  ),
  aboutGalleryImage(
    SPIRITUAL_IMAGES.shivaLingam,
    'Sacred architecture',
    SRISAILAM_HISTORY.architecture,
  ),
]

/** About section → gallery images (tab-specific; no cross-tab mixing) */
export const ABOUT_STORY_IMAGES: Record<string, SpiritualImageDef[]> = {
  iskcon: [
    SPIRITUAL_IMAGES.templeBuilding,
    SPIRITUAL_IMAGES.templePrograms,
    SPIRITUAL_IMAGES.gauraPurnima,
    SPIRITUAL_IMAGES.kukumkama,
    SPIRITUAL_IMAGES.radhaKrishna,
    SPIRITUAL_IMAGES.radhaKrishna2,
  ],
  'deities-timetable': [
    SPIRITUAL_IMAGES.sriKrishna,
    SPIRITUAL_IMAGES.radhaKrishnaWebp,
    SPIRITUAL_IMAGES.kukumkama,
  ],
  srisailam: SRISAILAM_ABOUT_GALLERY,
}

export const HOME_HERO_BG = SPIRITUAL_IMAGES.templeBuilding
export const HOME_HERO_FEATURE = SPIRITUAL_IMAGES.radhaKrishna
export const HOME_BG_IMAGE = SPIRITUAL_IMAGES.srisailam
export const ABOUT_HERO_IMAGE = SPIRITUAL_IMAGES.mallikarjuna

/** Hero background slideshow — Radha Krishna & Shiva Parvati only (`/spiritual/hero/`) */
export const HOME_HERO_BG_SLIDES: SpiritualImageDef[] = [
  heroAsset('radha-krishna-01.jpg', 'Sri Radha Krishna darshan', 'Radha Krishna'),
  heroAsset('radha-krishna-02.jpg', 'Radha Krishna — divine couple', 'Radha Krishna'),
  heroAsset('radha-krishna-03.jpg', 'Radha Krishna festival decoration', 'Radha Krishna'),
  heroAsset('radha-krishna-04.jpg', 'Radha Krishna arati', 'Radha Krishna'),
  heroAsset('radha-krishna-05.jpg', 'Radha Krishna worship', 'Radha Krishna'),
  heroAsset('radha-krishna-06.jpg', 'Lord Sri Krishna', 'Sri Krishna'),
  heroAsset('radha-krishna-07.jpg', 'Radha Krishna — Radhashtami', 'Radha Krishna'),
  heroAsset('shiva-parvati-01.jpg', 'Lord Shiva and Goddess Parvati', 'Shiva Parvati'),
]

export type HomeHeroSlide = {
  image: SpiritualImageDef
  heading: string
  message: string
}

const RK_MESSAGES = [
  'Experience the divine love of Radha Krishna.',
  'Devotion to Krishna brings peace and happiness.',
  'Let your heart be filled with Krishna consciousness.',
] as const

const SP_MESSAGES = [
  'May Shiva and Parvathi bless your spiritual journey.',
  'Find strength in Shiva and compassion in Parvathi.',
  'Om Namah Shivaya – embrace inner peace.',
] as const

/** Synced hero slides — image, spiritual heading, and devotional message */
export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    image: HOME_HERO_BG_SLIDES[0],
    heading: 'Sri Radha Krishna',
    message: RK_MESSAGES[0],
  },
  {
    image: HOME_HERO_BG_SLIDES[1],
    heading: 'Divine Love of Radha Krishna',
    message: RK_MESSAGES[1],
  },
  {
    image: HOME_HERO_BG_SLIDES[2],
    heading: 'Krishna Consciousness',
    message: RK_MESSAGES[2],
  },
  {
    image: HOME_HERO_BG_SLIDES[3],
    heading: 'Sri Radha Krishna',
    message: RK_MESSAGES[0],
  },
  {
    image: HOME_HERO_BG_SLIDES[4],
    heading: 'Divine Love of Radha Krishna',
    message: RK_MESSAGES[1],
  },
  {
    image: HOME_HERO_BG_SLIDES[5],
    heading: 'Krishna Consciousness',
    message: RK_MESSAGES[2],
  },
  {
    image: HOME_HERO_BG_SLIDES[6],
    heading: 'Sri Radha Krishna',
    message: RK_MESSAGES[0],
  },
  {
    image: HOME_HERO_BG_SLIDES[7],
    heading: 'Shiva & Parvati',
    message: SP_MESSAGES[0],
  },
]

/** @deprecated Use HOME_HERO_BG_SLIDES */
export const HOME_SLIDER_ITEMS = HOME_HERO_BG_SLIDES

export const HOME_HERO_PANELS = [
  {
    id: 'story',
    image: SPIRITUAL_IMAGES.radhaKrishna,
    eyebrow: 'Hare Krishna Land',
    title: 'Explore the history and teachings of Lord Krishna & Guru Parampara',
    description:
      'Welcome to ISKCON Dornala — Sri Jagannath Temple on the sacred Srisailam route. Discover darshan, festivals, annadanam, and the path of bhakti-yoga.',
    cta: { label: 'Our story', href: '/about/iskcon' },
  },
] as const

/** Optional dark carousel (used if DepthCarousel is mounted) */
export const HOME_DEPTH_SLIDES = [
  {
    image: SPIRITUAL_IMAGES.radhaKrishna,
    title: 'Sri Radha Krishna — the heart of our temple',
    subtitle: 'Daily darshan, kirtan, and festivals at Hare Krishna Land on the Srisailam route.',
    ctaPrimary: { label: 'Daily darshan', href: '/darshan' },
    ctaSecondary: { label: 'About us', href: '/about/iskcon' },
  },
  {
    image: SPIRITUAL_IMAGES.srisailam,
    title: 'Gateway to Srisailam — Mallikarjuna & spiritual heritage',
    subtitle: 'Pilgrims are welcome for annadanam, book distribution, and association with devotees.',
    ctaPrimary: { label: 'Srisailam history', href: '/about/srisailam' },
    ctaSecondary: { label: 'Festivals', href: '/festivals' },
  },
  {
    image: SPIRITUAL_IMAGES.ugadi,
    title: 'Celebrate sacred festivals with the community',
    subtitle: 'Ugadi, Janmashtami, Gaura Purnima, Radhashtami, and more — join us in seva and kirtan.',
    ctaPrimary: { label: 'Festival calendar', href: '/festivals' },
    ctaSecondary: { label: 'Donate seva', href: '/donate' },
  },
] as const
