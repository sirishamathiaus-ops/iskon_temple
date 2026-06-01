import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from '@/components/spiritual/SpiritualImage'

const FADE = { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const }

type Props = {
  images: SpiritualImageDef[]
  intervalMs?: number
  className?: string
}

/** Advance sequentially so every slide appears once per cycle (no consecutive repeats). */
function nextSlideIndex(current: number, length: number): number {
  if (length <= 1) return 0
  return (current + 1) % length
}

export function HeroImageSlideshow({ images, intervalMs = 5000, className = '' }: Props) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = images[index]

  const advance = useCallback(() => {
    setIndex((prev) => nextSlideIndex(prev, images.length))
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1 || paused) return
    const t = setInterval(advance, intervalMs)
    return () => clearInterval(t)
  }, [images.length, intervalMs, paused, advance])

  useEffect(() => {
    if (images.length <= 1) return
    const next = images[nextSlideIndex(index, images.length)]
    const img = new Image()
    img.src = next.src
  }, [index, images])

  if (!current) return null

  return (
    <div
      className={`absolute inset-0 ${className}`}
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={FADE}
        >
          <SpiritualImage
            image={current}
            loading="eager"
            className="h-full w-full scale-105 object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/45" aria-hidden />
    </div>
  )
}
