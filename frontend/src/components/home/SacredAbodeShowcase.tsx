import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from '@/components/spiritual/SpiritualImage'

type Props = {
  image: SpiritualImageDef
}

/** Sacred Abode — single static image (no text overlays). */
export function SacredAbodeShowcase({ image }: Props) {
  const aspectRatio = '16 / 9'
  return (
    <div className="depth-stage overflow-hidden rounded-2xl border border-gold-400/30 bg-cream-100 shadow-[0_16px_48px_-20px_rgba(69,26,41,0.22)] md:rounded-3xl">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <SpiritualImage
          image={image}
          loading="lazy"
          className="h-full w-full object-cover object-center"
          wrapperClassName="h-full w-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
