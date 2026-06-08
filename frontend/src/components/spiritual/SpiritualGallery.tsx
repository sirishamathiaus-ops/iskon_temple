import type { SpiritualImageDef } from '@/content/spiritualMedia'
import { SpiritualImage } from './SpiritualImage'
import { ScrollReveal } from './ScrollReveal'

type Props = {
  images: SpiritualImageDef[]
  columns?: 2 | 3
  /** Show each photo label once below the image (no hover overlay duplicate) */
  labelsBelow?: boolean
  /** Horizontal scroll row on all screen sizes */
  layout?: 'grid' | 'row'
  /** Per-image captions and hover titles */
  showLabels?: boolean
  /** Use the same grid on mobile (no horizontal scroll carousel) */
  uniformGrid?: boolean
}

function GalleryCard({
  img,
  className = '',
  labelsBelow = false,
  showLabels = true,
  aspectClass = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 85vw, 33vw',
}: {
  img: SpiritualImageDef
  className?: string
  labelsBelow?: boolean
  showLabels?: boolean
  aspectClass?: string
  sizes?: string
}) {
  const label = showLabels ? (img.title ?? img.alt) : ''

  return (
    <figure
      className={[
        'spiritual-card-hover group overflow-hidden rounded-2xl border border-maroon-900/10 bg-white shadow-card sm:rounded-3xl',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'relative w-full overflow-hidden bg-gradient-to-br from-cream-100 to-maroon-50/40',
          aspectClass,
        ].join(' ')}
      >
        <SpiritualImage
          image={img}
          fit="cover"
          wrapperClassName="absolute inset-0 h-full w-full"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes={sizes}
        />
        {!labelsBelow && label && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-maroon-950/85 via-maroon-900/35 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="font-display text-base font-semibold leading-snug text-white sm:text-lg">{label}</p>
          </div>
        )}
      </div>
      {labelsBelow && label && (
        <figcaption className="border-t border-maroon-900/8 bg-cream-50 px-4 py-3 text-center text-sm font-medium text-maroon-900 sm:text-left">
          {label}
        </figcaption>
      )}
    </figure>
  )
}

export function SpiritualGallery({
  images,
  columns = 3,
  labelsBelow = false,
  layout = 'grid',
  showLabels = true,
  uniformGrid = false,
}: Props) {
  if (images.length === 0) return null

  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'
  const gridGap = 'gap-4 sm:gap-5'

  if (layout === 'grid' && uniformGrid) {
    return (
      <div className={`mt-8 grid ${gridCols} ${gridGap} md:mt-10`}>
        {images.map((img, i) => (
          <ScrollReveal key={img.id} delay={i * 0.03}>
            <GalleryCard img={img} labelsBelow={labelsBelow} showLabels={showLabels} sizes="(max-width: 768px) 45vw, 33vw" />
          </ScrollReveal>
        ))}
      </div>
    )
  }

  if (layout === 'row') {
    return (
      <div
        className="about-gallery-carousel -mx-4 mt-8 flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 md:mx-0 md:mt-10 md:px-0"
        role="region"
        aria-label="Temple photo gallery"
      >
        {images.map((img) => (
          <div key={img.id} className="w-[min(72vw,280px)] shrink-0 snap-center snap-always sm:w-[min(42vw,320px)] md:w-[min(28vw,300px)]">
            <GalleryCard
              img={img}
              showLabels={false}
              aspectClass="aspect-[3/4]"
              sizes="(max-width: 768px) 72vw, 300px"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-8 md:mt-10">
      <div
        className="about-gallery-carousel -mx-4 flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 md:hidden"
        role="region"
        aria-label="Image gallery"
      >
        {images.map((img) => (
          <div key={img.id} className="w-[min(88vw,340px)] shrink-0 snap-center snap-always">
            <GalleryCard img={img} labelsBelow={labelsBelow} showLabels={showLabels} />
          </div>
        ))}
      </div>

      <div className={`hidden gap-5 md:grid ${gridCols}`}>
        {images.map((img, i) => (
          <ScrollReveal key={img.id} delay={i * 0.04}>
            <GalleryCard img={img} labelsBelow={labelsBelow} showLabels={showLabels} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
