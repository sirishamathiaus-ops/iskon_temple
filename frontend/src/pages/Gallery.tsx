import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { SpiritualGallery } from '@/components/spiritual/SpiritualGallery'
import { SpiritualImage } from '@/components/spiritual/SpiritualImage'
import { Seo } from '@/components/Seo'
import { GALLERY_FEATURED, getTempleGalleryImages } from '@/content/galleryContent'

export function GalleryPage() {
  const galleryImages = useMemo(() => getTempleGalleryImages(true), [])

  return (
    <>
      <Seo title="Gallery — ISKCON Dornala" description="Temple, campus, and darshan photos from Hare Krishna Land, ISKCON Srisailam." />
      <section className="border-b border-maroon-900/10 bg-gradient-to-b from-cream-100 via-cream-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80 sm:text-sm">Gallery</p>
            <h1 className="mt-3 font-display text-3xl text-maroon-900 sm:text-4xl md:text-5xl">Sacred moments & seva</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-maroon-800/85 sm:text-base">
              Temple, campus, and darshan at Hare Krishna Land on the Srisailam pilgrimage route.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        <motion.figure
          className="mt-8 overflow-hidden rounded-3xl border border-gold-400/30 bg-white shadow-[0_20px_60px_-20px_rgba(69,26,41,0.2)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-cream-100 sm:aspect-[21/9]">
            <SpiritualImage
              image={GALLERY_FEATURED.image}
              loading="eager"
              fit="cover"
              wrapperClassName="absolute inset-0 h-full w-full"
              className="object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/75 via-maroon-900/20 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 px-5 py-5 sm:px-8 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-200/90">Featured</p>
              <p className="mt-1 font-display text-xl text-cream-50 sm:text-2xl">{GALLERY_FEATURED.caption}</p>
            </figcaption>
          </div>
        </motion.figure>

        <SpiritualGallery images={galleryImages} uniformGrid showLabels={false} />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            to="/donate"
            className="btn-tap rounded-full bg-maroon-900 px-8 py-3 text-sm font-semibold text-cream-50 shadow-soft"
          >
            Support seva
          </Link>
          <Link
            to="/festivals"
            className="btn-tap rounded-full border border-maroon-900/15 bg-white px-8 py-3 text-sm font-semibold text-maroon-900 shadow-card"
          >
            Festivals
          </Link>
        </div>
      </div>
    </>
  )
}
