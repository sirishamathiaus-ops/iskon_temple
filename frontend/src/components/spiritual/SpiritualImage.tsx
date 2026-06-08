import { useCallback, useEffect, useState } from 'react'
import { galleryLocalPath } from '@/content/siteMedia'
import type { SpiritualImageDef } from '@/content/spiritualMedia'

export const IMAGE_FALLBACK_SRC = '/temple-logo.svg'

export type ImageFit = 'cover' | 'contain'

type Props = {
  image: SpiritualImageDef
  alt?: string
  className?: string
  wrapperClassName?: string
  loading?: 'eager' | 'lazy'
  sizes?: string
  /** How the image fills its container — cover crops evenly; contain shows the full image */
  fit?: ImageFit
  onLoad?: () => void
}

function srcChain(image: SpiritualImageDef): string[] {
  const isFounderAsset = image.src.includes('/spiritual/founder/')
  const isHeroAsset = image.src.includes('/spiritual/hero/') || image.src.includes('/spiritual/sacred-abode/')
  const chain = [image.src, image.fallbackSrc]
  if (!isFounderAsset && !isHeroAsset) {
    chain.push(galleryLocalPath(1))
  }
  chain.push(IMAGE_FALLBACK_SRC)
  return chain.filter((s, i, arr): s is string => Boolean(s) && arr.indexOf(s) === i)
}

export function SpiritualImage({
  image,
  alt,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, 50vw',
  fit = 'cover',
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
  const useContain = fit === 'contain' || isLogoFallback

  const wrapperClasses = [
    'relative overflow-hidden',
    useContain ? 'flex h-full w-full items-center justify-center' : 'block h-full w-full',
    wrapperClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const fillContain = useContain && wrapperClassName.includes('inset-0')

  const imgClasses = [
    'transition-opacity duration-500 ease-out',
    useContain
      ? fillContain
        ? 'h-full w-full object-contain object-center'
        : 'max-h-full max-w-full object-contain object-center'
      : 'h-full w-full object-cover object-center',
    loaded ? 'opacity-100' : 'opacity-0',
    isLogoFallback ? 'p-6 opacity-90' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={wrapperClasses}>
      {!loaded && (
        <span
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-200 via-gold-100/40 to-maroon-100/30"
          aria-hidden
        />
      )}
      <img
        key={`${image.id}-${src}`}
        src={src}
        alt={alt ?? image.alt}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={imgClasses}
      />
    </span>
  )
}
