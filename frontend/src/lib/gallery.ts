import {
  GALLERY_CAPTIONS,
  IMAGE_SLOTS,
  galleryLocalPath,
  siteImageGalleryPage,
} from '@/content/siteMedia'
import type { GalleryItem } from '@/types'

export type DisplayGalleryItem = GalleryItem & { displayUrl: string; slot: number }

/** Build gallery page items — only slots 20–28 (never used on home/hero/seva). */
export function buildGalleryPhotos(apiItems: GalleryItem[]): DisplayGalleryItem[] {
  const fromApi = apiItems
    .filter((g) => g.media_type !== 'video')
    .sort((a, b) => a.sort_order - b.sort_order)

  return IMAGE_SLOTS.galleryPage.map((slot, i) => {
    const api = fromApi[i]
    return {
      id: api?.id ?? -slot,
      media_type: 'image' as const,
      url: galleryLocalPath(slot),
      displayUrl: siteImageGalleryPage(i),
      slot,
      title: api?.title ?? null,
      caption: api?.caption ?? api?.title ?? GALLERY_CAPTIONS[slot] ?? `Temple photo ${slot}`,
      sort_order: slot,
      thumbnail_url: null,
      created_at: api?.created_at ?? '',
    }
  })
}

/** @deprecated Use siteImage(slot) from siteMedia — kept for legacy URLs in admin. */
export function resolveGalleryImage(url: string | null | undefined, fallbackSlot = IMAGE_SLOTS.galleryPage[0]): string {
  if (url == null || !String(url).trim()) return galleryLocalPath(fallbackSlot)

  const raw = String(url).trim()
  if (raw.includes('picsum.photos') || raw.includes('placeholder.com') || raw.includes('unsplash.com')) {
    return galleryLocalPath(fallbackSlot)
  }

  const match = raw.match(/gallery\/(\d{1,2})\.png/i)
  if (match) {
    const n = parseInt(match[1], 10)
    if (n >= 1 && n <= 28) return galleryLocalPath(n)
  }

  if (raw.startsWith('/gallery/')) return raw
  return galleryLocalPath(fallbackSlot)
}
