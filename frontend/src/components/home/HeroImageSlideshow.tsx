import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from '@/components/spiritual/SpiritualImage'

const FADE_EASE = [0.4, 0, 0.2, 1] as const
/** Crossfade duration — next slide begins as soon as this transition starts (no idle pause). */
const TRANSITION_MS = 3200

type Props = {
  images: SpiritualImageDef[]
  /** @deprecated Timing is continuous; interval matches crossfade duration. */
  intervalMs?: number
  className?: string
  onIndexChange?: (index: number) => void
}

function nextSlideIndex(current: number, length: number): number {
  if (length <= 1) return 0
  return (current + 1) % length
}

export function HeroImageSlideshow({
  images,
  className = '',
  onIndexChange,
}: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = images[index]

  const advance = useCallback(() => {
    setIndex((prev) => nextSlideIndex(prev, images.length))
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || paused) return
    const t = setInterval(advance, TRANSITION_MS)
    return () => clearInterval(t)
  }, [images.length, paused, advance])

  useEffect(() => {
    onIndexChange?.(index)
  }, [index, onIndexChange])

  useEffect(() => {
    images.forEach((img) => {
      const preload = new Image()
      preload.src = img.src
    })
  }, [images])

  if (!current) return null

  const fadeSeconds = TRANSITION_MS / 1000

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-maroon-900/10 bg-transparent shadow-[0_20px_56px_-24px_rgba(69,26,41,0.22)] md:rounded-3xl ${className}`}
      aria-label="Devotional image slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] w-full max-h-[min(65vh,540px)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fadeSeconds, ease: FADE_EASE }}
          >
            <SpiritualImage
              image={current}
              loading="eager"
              className="h-full w-full object-contain object-center"
              wrapperClassName="flex h-full w-full items-center justify-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
