import { useMemo, useState } from 'react'
import { IMAGE_FALLBACK_CHAIN, galleryLocalPath } from '@/content/siteMedia'

type GalleryImageProps = {
  /** Allocated gallery slot (1–28). */
  slot: number
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

export function GalleryImage({ slot, alt, className, loading = 'lazy' }: GalleryImageProps) {
  const chain = useMemo(() => {
    const primary = Math.min(Math.max(1, slot), 28)
    const rest = IMAGE_FALLBACK_CHAIN.filter((s) => s !== primary)
    return [primary, ...rest]
  }, [slot])

  const [attempt, setAttempt] = useState(0)
  const currentSlot = chain[Math.min(attempt, chain.length - 1)]
  const src = galleryLocalPath(currentSlot)

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => {
        if (attempt < chain.length - 1) setAttempt((a) => a + 1)
      }}
    />
  )
}
