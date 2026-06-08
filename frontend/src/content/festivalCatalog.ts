/**
 * Festival metadata — merged with API records for detail pages, nav, and fallbacks.
 */

import { galleryLocalPath } from '@/content/siteMedia'
import { FESTIVAL_SPIRITUAL_IMAGES, spiritualPath } from '@/content/spiritualMedia'
import type { Festival } from '@/types'

export type FestivalMeta = {
  slug: string
  name: string
  /** File under /public/spiritual/ — preferred over gallery slot */
  imageFile?: string
  extraImageFiles?: string[]
  gallerySlot: number
  extraGallerySlots?: number[]
  importance: string
  timings: { label: string; time: string }[]
  /** ISO date or null */
  eventDate: string | null
  endDate?: string | null
  shortDescription: string
  description: string
  isFeatured?: boolean
  sponsorshipEnabled?: boolean
  sortOrder: number
  /** Natural pixel size of hero image — frame matches aspect for a clean full-bleed fit */
  heroIntrinsicSize?: { width: number; height: number }
}

export const FESTIVAL_CATALOG: Record<string, FestivalMeta> = {
  'ugadi-2026': {
    slug: 'ugadi-2026',
    name: 'Ugadi',
    imageFile: 'Ugadi.jpeg',
    extraImageFiles: ['kukumkama.jpg'],
    gallerySlot: 17,
    extraGallerySlots: [18, 19],
    eventDate: '2026-03-19',
    shortDescription:
      'Telugu New Year — Panchanga Sravanam, special darshan, neem-jaggery prasadam, and festive kirtan at the temple.',
    description: `Ugadi (Yugadi) marks the beginning of the Hindu lunar New Year in Andhra Pradesh and Telangana. At ISKCON Dornala we observe this sacred day with Panchanga Sravanam (reading of the year's spiritual calendar), Sri Jagannath darshan, kirtan, and distribution of traditional Ugadi prasadam — including the symbolic neem and jaggery mixture reminding us that life holds both bitter and sweet experiences, and that we should offer everything to the Lord.

Join us for morning mangala arati, discourse on fresh beginnings in Krishna consciousness, and a community feast. Families and Srisailam pilgrims are warmly welcome.`,
    importance:
      'Ugadi teaches renewal of spiritual vows, gratitude for the parampara, and harmony with nature’s cycles — aligned with Vaishnava values of humble service and chanting the holy names.',
    timings: [
      { label: 'Mangala arati & darshan', time: '4:30 AM' },
      { label: 'Panchanga Sravanam', time: '8:00 AM' },
      { label: 'Special arati & kirtan', time: '12:00 PM' },
      { label: 'Ugadi prasadam feast', time: '1:00 PM' },
      { label: 'Evening darshan & sandhya arati', time: '6:30 PM' },
    ],
    isFeatured: true,
    sponsorshipEnabled: true,
    sortOrder: 8,
  },
  'janmashtami-2026': {
    slug: 'janmashtami-2026',
    name: 'Sri Krishna Janmashtami',
    imageFile: 'srikrishna.webp',
    heroIntrinsicSize: { width: 640, height: 640 },
    extraImageFiles: ['Radhakrishna1.jpg', 'Radha krishna.jpg'],
    gallerySlot: 12,
    extraGallerySlots: [13],
    eventDate: null,
    shortDescription: 'Grand abhishekam, midnight arati, kirtan, and sanctified feast.',
    description:
      'The most auspicious celebration of the divine appearance of Lord Sri Krishna — abhishekam, children’s dramas, and harinama sankirtan through the night.',
    importance: 'Appearance day of the Supreme Personality of Godhead — the pinnacle of Gaudiya Vaishnava festivals.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Abhishekam', time: '6:30 PM' },
      { label: 'Midnight arati', time: '12:00 AM' },
      { label: 'Maha prasadam', time: 'After midnight' },
    ],
    sponsorshipEnabled: true,
    isFeatured: true,
    sortOrder: 0,
  },
  'balarama-jayanti-2026': {
    slug: 'balarama-jayanti-2026',
    name: 'Balarama Jayanti',
    imageFile: 'balaramjayanthi.jpg',
    extraImageFiles: ['Radhakrishna1.jpg'],
    gallerySlot: 12,
    eventDate: '2026-08-28',
    shortDescription:
      'Appearance of Lord Balarama — abhishekam, special darshan, kirtan, and maha prasadam at the temple.',
    description: `Lord Balarama is the elder brother of Sri Krishna and the original spiritual master (adi-guru). On Balarama Jayanti we honour His divine appearance with abhishekam, flower offerings, kirtan glorifying His strength and mercy, and sanctified prasadam for the community.

Balarama expands all pleasurable pastimes of Krishna and teaches steadfast devotion. Join pilgrims and families at Hare Krishna Land for a joyful day of darshan and sankirtan.`,
    importance:
      'Balarama is the source of spiritual strength — worshipping Him prepares the heart to receive Krishna’s mercy through the parampara.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Abhishekam', time: '10:00 AM' },
      { label: 'Special arati & kirtan', time: '12:00 PM' },
      { label: 'Maha prasadam', time: '1:00 PM' },
      { label: 'Sandhya arati', time: '6:30 PM' },
    ],
    sponsorshipEnabled: true,
    isFeatured: true,
    sortOrder: 2,
  },
  'gaura-purnima-2026': {
    slug: 'gaura-purnima-2026',
    name: 'Gaura Purnima',
    imageFile: 'Gaura Purnima.webp',
    extraImageFiles: ['Radhakrishna images4.jpg'],
    gallerySlot: 13,
    eventDate: null,
    shortDescription: 'Appearance of Sri Caitanya Mahaprabhu — the golden avatar of kirtan.',
    description: 'Full day festival with nagara sankirtan, class on Sri Caitanya-caritamrita, and maha prasadam.',
    importance: 'The mercy incarnation who spread the holy name — foundation of ISKCON’s mission.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Sankirtan procession', time: '5:00 PM' },
      { label: 'Evening feast', time: '7:30 PM' },
    ],
    sponsorshipEnabled: true,
    isFeatured: true,
    sortOrder: 1,
  },
  'radhashtami-2026': {
    slug: 'radhashtami-2026',
    name: 'Radhashtami',
    imageFile: 'Radhakrishnaimages3.jpg',
    heroIntrinsicSize: { width: 769, height: 1000 },
    extraImageFiles: ['Radhakrishna3.webp'],
    gallerySlot: 14,
    eventDate: null,
    shortDescription: 'Divine appearance of Srimati Radharani — flower shower and special darshan.',
    description: 'Special arati, kirtan glorifying Srimati Radharani, and offerings of flowers and bhoga.',
    importance: 'Honours the supreme devotee whose love is the goal of all bhakti.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Flower shower & arati', time: '12:00 PM' },
      { label: 'Evening kirtan', time: '6:00 PM' },
    ],
    sponsorshipEnabled: true,
    isFeatured: true,
    sortOrder: 3,
  },
  'rama-navami-2026': {
    slug: 'rama-navami-2026',
    name: 'Sri Rama Navami',
    imageFile: 'Sriramanavami.jpg',
    gallerySlot: 15,
    eventDate: null,
    shortDescription: 'Appearance of Lord Rama — special darshan, kirtan, and prasadam.',
    description: 'Celebrate the appearance of Maryada Purushottama Sri Rama with readings from Ramayana, arati, and community feast.',
    importance: 'Honours the ideal king and devotee whose life teaches dharma and surrender to the Lord.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Noon arati', time: '12:00 PM' },
      { label: 'Evening kirtan', time: '6:30 PM' },
    ],
    sponsorshipEnabled: true,
    sortOrder: 4,
  },
  'narasimha-chaturdashi-2026': {
    slug: 'narasimha-chaturdashi-2026',
    name: 'Narasimha Chaturdashi',
    imageFile: 'Narsimha.jpg',
    gallerySlot: 16,
    eventDate: null,
    shortDescription: 'Lord Narasimhadeva — protector of His devotees.',
    description: 'Special worship of Lord Narasimhadeva with abhishekam, prayers for protection, and discourse on Prahlada Maharaja.',
    importance: 'The Lord appears to protect pure devotion and destroy obstacles to bhakti.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Abhishekam', time: '10:00 AM' },
      { label: 'Sandhya arati', time: '6:30 PM' },
    ],
    sponsorshipEnabled: true,
    sortOrder: 5,
  },
  'govardhan-puja-2026': {
    slug: 'govardhan-puja-2026',
    name: 'Govardhan Puja',
    imageFile: 'Govardhan Puja.webp',
    gallerySlot: 18,
    eventDate: null,
    shortDescription: 'Annakut offering — celebrating Krishna lifting Govardhan Hill.',
    description: 'A mountain of sanctified food offerings, go-puja, and kirtan glorifying Krishna’s pastime of protecting Vrajavasis.',
    importance: 'Teaches dependence on Krishna rather than worldly rituals alone.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Annakut darshan', time: '12:00 PM' },
      { label: 'Evening arati', time: '6:30 PM' },
    ],
    sponsorshipEnabled: true,
    sortOrder: 6,
  },
  'ekadashi-observance': {
    slug: 'ekadashi-observance',
    name: 'Vaishnava Ekadashi',
    imageFile: 'Vaishnava Ekadashi observance.webp',
    gallerySlot: 19,
    eventDate: null,
    shortDescription: 'Monthly fasting and extra kirtan in honour of Lord Hari.',
    description: 'Observe Ekadashi with fasting (or light prasadam), extra chanting, and association with devotees.',
    importance: 'Purifies the heart and deepens attachment to the holy names.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Ekadashi class', time: '7:00 PM' },
    ],
    sortOrder: 7,
  },
  'temple-special-programs': {
    slug: 'temple-special-programs',
    name: 'Temple special programs',
    imageFile: 'Temple special programs.jpg',
    extraImageFiles: ['image.png', 'kukumkama.jpg'],
    gallerySlot: 20,
    eventDate: null,
    shortDescription: 'Weekly programs, yatras, and community seva at Hare Krishna Land.',
    description: 'Join Sunday feast, children’s programs, book distribution, and annadanam for Srisailam pilgrims.',
    importance: 'Regular association is the foundation of steady Krishna consciousness.',
    timings: [
      { label: 'Sunday feast & kirtan', time: '12:30 PM' },
      { label: 'Contact office for schedule', time: 'Varies' },
    ],
    sortOrder: 9,
  },
}

export const FESTIVAL_NAV_ORDER = [
  'janmashtami-2026',
  'balarama-jayanti-2026',
  'gaura-purnima-2026',
  'radhashtami-2026',
  'rama-navami-2026',
  'narasimha-chaturdashi-2026',
  'govardhan-puja-2026',
  'ekadashi-observance',
  'ugadi-2026',
  'temple-special-programs',
] as const

export function festivalImagePath(meta: FestivalMeta, index = 0): string {
  if (index === 0 && meta.imageFile) return spiritualPath(meta.imageFile)
  const extra = meta.extraImageFiles?.[index - 1]
  if (index > 0 && extra) return spiritualPath(extra)
  const slot = index === 0 ? meta.gallerySlot : meta.extraGallerySlots?.[index - 1] ?? meta.gallerySlot
  return galleryLocalPath(slot)
}

export function metaToFestival(meta: FestivalMeta, api?: Festival | null): Festival {
  return {
    id: api?.id ?? -1,
    name: api?.name ?? meta.name,
    slug: meta.slug,
    event_date: api?.event_date ?? meta.eventDate,
    end_date: api?.end_date ?? meta.endDate ?? null,
    short_description: api?.short_description ?? meta.shortDescription,
    description: api?.description ?? meta.description,
    image_url: api?.image_url ?? festivalImagePath(meta),
    registration_url: api?.registration_url ?? null,
    sponsorship_enabled: api?.sponsorship_enabled ?? meta.sponsorshipEnabled ?? false,
    is_featured: api?.is_featured ?? meta.isFeatured ?? false,
    sort_order: api?.sort_order ?? meta.sortOrder,
    created_at: api?.created_at ?? new Date().toISOString(),
  }
}

export function getFestivalMeta(slug: string): FestivalMeta | undefined {
  return FESTIVAL_CATALOG[slug]
}

export function defaultMetaForFestival(f: Festival): FestivalMeta {
  const slot = 12 + (Math.max(0, f.sort_order) % 8)
  const spiritual = FESTIVAL_SPIRITUAL_IMAGES[f.slug]
  return {
    slug: f.slug,
    name: f.name,
    imageFile: spiritual?.primary,
    extraImageFiles: spiritual?.extras,
    gallerySlot: slot,
    eventDate: f.event_date,
    endDate: f.end_date,
    shortDescription: f.short_description ?? '',
    description: f.description ?? f.short_description ?? '',
    importance: 'A sacred day of darshan, kirtan, and community prasadam at Sri Jagannath Temple.',
    timings: [
      { label: 'Mangala arati', time: '4:30 AM' },
      { label: 'Main festival program', time: 'See temple office' },
      { label: 'Evening arati', time: '6:30 PM' },
    ],
    sortOrder: f.sort_order,
    isFeatured: f.is_featured,
    sponsorshipEnabled: f.sponsorship_enabled,
  }
}
