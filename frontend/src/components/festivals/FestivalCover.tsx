import { getFestivalMeta, defaultMetaForFestival, festivalImagePath } from '@/content/festivalCatalog'
import { festivalSpiritualDef } from '@/content/spiritualMedia'
import { SpiritualImage, type ImageFit } from '@/components/spiritual/SpiritualImage'
import { GalleryImage } from '@/components/GalleryImage'
import type { Festival } from '@/types'

type Props = {
  festival: Festival
  className?: string
  wrapperClassName?: string
  loading?: 'eager' | 'lazy'
  fit?: ImageFit
  sizes?: string
}

export function FestivalCover({
  festival,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  fit = 'cover',
  sizes = '(max-width: 768px) 100vw, 400px',
}: Props) {
  const meta = getFestivalMeta(festival.slug) ?? defaultMetaForFestival(festival)
  const useSpiritual = Boolean(meta.imageFile || festival.image_url?.startsWith('/spiritual'))

  if (useSpiritual) {
    return (
      <SpiritualImage
        image={festivalSpiritualDef(festival.slug, festival.name)}
        alt={festival.name}
        loading={loading}
        fit={fit}
        className={className}
        wrapperClassName={wrapperClassName}
        sizes={sizes}
      />
    )
  }

  const imgClass = wrapperClassName
    ? ['h-full w-full object-cover object-center', className].filter(Boolean).join(' ')
    : className

  if (wrapperClassName) {
    return (
      <span className={wrapperClassName}>
        <GalleryImage slot={meta.gallerySlot} alt={festival.name} className={imgClass} loading={loading} />
      </span>
    )
  }

  return <GalleryImage slot={meta.gallerySlot} alt={festival.name} className={imgClass} loading={loading} />
}

export function festivalCoverSrc(festival: Festival): string {
  const meta = getFestivalMeta(festival.slug)
  if (meta?.imageFile) return festivalSpiritualDef(festival.slug, festival.name).src
  if (festival.image_url?.startsWith('/spiritual')) return festival.image_url
  return festival.image_url ?? festivalImagePath(meta ?? defaultMetaForFestival(festival))
}
