import { galleryLocalPath } from '@/content/siteMedia'
import { SPIRITUAL_IMAGES, heroSlidePath, sacredAbodePath } from '@/content/spiritualMedia'
import type { SpiritualImageDef } from '@/content/spiritualMedia'

const GALLERY_ALT = 'Temple photo from Hare Krishna Land, ISKCON Srisailam'

function heroImg(file: string): SpiritualImageDef {
  return {
    id: `gallery-hero-${file.replace(/\..+$/, '')}`,
    src: heroSlidePath(file),
    alt: GALLERY_ALT,
  }
}

function abodeImg(file: string): SpiritualImageDef {
  return {
    id: `gallery-abode-${file.replace(/\.[^.]+$/, '')}`,
    src: sacredAbodePath(file),
    alt: GALLERY_ALT,
  }
}

function slotImg(slot: number): SpiritualImageDef {
  return {
    id: `gallery-slot-${slot}`,
    src: galleryLocalPath(slot),
    alt: GALLERY_ALT,
  }
}

function gallerySpiritual(img: SpiritualImageDef): SpiritualImageDef {
  return { ...img, alt: GALLERY_ALT, title: undefined }
}

/** Featured temple image at top of Gallery page */
export const GALLERY_FEATURED = {
  image: abodeImg('temple-dornala.jpg'),
  caption: 'ISKCON Sri Jagannath Temple at Hare Krishna Land',
}

/** Temple building, campus, deities, and worship — no festival or outreach-only shots */
const TEMPLE_GALLERY_RAW: SpiritualImageDef[] = [
  abodeImg('temple-gopuram.jpg'),
  abodeImg('srisailam-sacred.jpg'),
  abodeImg('mallikarjuna-swamy.jpg'),
  abodeImg('sacred-abode.jpg'),
  slotImg(8),
  slotImg(7),
  slotImg(20),
  slotImg(21),
  slotImg(28),
  heroImg('radha-krishna-01.jpg'),
  heroImg('radha-krishna-03.jpg'),
  heroImg('radha-krishna-05.jpg'),
  heroImg('radha-krishna-06.jpg'),
  gallerySpiritual(SPIRITUAL_IMAGES.radhaKrishna),
  gallerySpiritual(SPIRITUAL_IMAGES.radhaKrishna3),
]

function fileKey(img: SpiritualImageDef): string {
  try {
    const src = decodeURIComponent(img.src).toLowerCase()
    return src.split('/').pop() ?? src
  } catch {
    return img.src.toLowerCase()
  }
}

/** Unique temple photos for the gallery grid (featured image excluded by default) */
export function getTempleGalleryImages(excludeFeatured = true): SpiritualImageDef[] {
  const seen = new Set<string>()

  if (excludeFeatured) {
    seen.add(fileKey(GALLERY_FEATURED.image))
  }

  return TEMPLE_GALLERY_RAW.filter((img) => {
    const key = fileKey(img)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
