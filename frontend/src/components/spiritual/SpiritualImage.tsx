import { useCallback, useEffect, useState } from 'react'
import { galleryLocalPath } from '@/content/siteMedia'
import type { SpiritualImageDef } from '@/content/spiritualMedia'

export const IMAGE_FALLBACK_SRC = '/temple-logo.svg'

type Props = {
  image: SpiritualImageDef
  alt?: string
  className?: string
  wrapperClassName?: string
  loading?: 'eager' | 'lazy'
  sizes?: string
  onLoad?: () => void
}

function srcChain(image: SpiritualImageDef): string[] {
  return [
    image.src,
    image.fallbackSrc,
    galleryLocalPath(1),
    IMAGE_FALLBACK_SRC,
  ].filter((s, i, arr): s is string => Boolean(s) && arr.indexOf(s) === i)
}

export function SpiritualImage({
  image,
  alt,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, 50vw',
  onLoad,
}: Props) {
  const chain = srcChain(image)
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const src = chain[Math.min(index, chain.length - 1)]

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [image.id, image.src])

  const handleError = useCallback(() => {
    setLoaded(false)
    setIndex((i) => (i < chain.length - 1 ? i + 1 : i))
  }, [chain.length])

  const handleLoad = useCallback(() => {
    setLoaded(true)
    onLoad?.()
  }, [onLoad])

  const isLogoFallback = src === IMAGE_FALLBACK_SRC

  return (
    <span className={`relative block min-h-[1px] overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <span
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-200 via-gold-100/40 to-maroon-100/30"
          aria-hidden
        />
      )}
      <img
        key={src}
        src={src}
        alt={alt ?? image.alt}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={[
          'h-full w-full object-cover object-center transition-opacity duration-500 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          isLogoFallback ? 'object-contain p-8 opacity-90' : '',
          className,
        ].join(' ')}
      />
    </span>
  )
}
