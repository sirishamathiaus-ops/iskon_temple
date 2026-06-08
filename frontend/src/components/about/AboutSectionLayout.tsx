import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ABOUT_NAV, type AboutPageContent } from '@/content/aboutPages'
import { SpiritualHero } from '@/components/spiritual/SpiritualHero'
import { SpiritualGallery } from '@/components/spiritual/SpiritualGallery'
import { AboutDailyWorship } from '@/components/about/AboutDailyWorship'
import { AboutHighlights } from '@/components/about/AboutHighlights'
import { ScrollReveal, HistoryCard } from '@/components/spiritual'
import { Seo } from '@/components/Seo'
import { getAboutGalleryImages } from '@/content/aboutPages'

type Props = { page: AboutPageContent }

const tabTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }

export function AboutSectionLayout({ page }: Props) {
  const galleryImages = getAboutGalleryImages(page.id)

  return (
    <>
      <Seo title={`${page.title} — ISKCON Dornala`} description={page.subtitle} />

      <AnimatePresence mode="wait">
        <motion.div
          key={`hero-${page.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={tabTransition}
        >
          <SpiritualHero
            image={page.heroImage}
            eyebrow="About us"
            title={page.title}
            subtitle={page.subtitle}
            primaryCta={{ label: 'Offer seva', href: '/donate' }}
            secondaryCta={{ label: 'Contact', href: '/contact' }}
            compact
            portrait={page.id === 'founder'}
            contained={page.heroContained}
            prominentImage={page.heroProminent}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <nav
          className="-mx-4 flex gap-2 overflow-x-auto scroll-smooth px-4 pb-2 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          aria-label="About sections"
        >
          {ABOUT_NAV.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 sm:py-1.5',
                item.id === page.id
                  ? 'bg-maroon-900 text-cream-50 shadow-sm'
                  : 'border border-maroon-900/12 bg-white text-maroon-800 hover:border-gold-400/50',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${page.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={tabTransition}
          >
            {page.story && (
              <ScrollReveal className="mt-10 md:mt-12">
                <div className="rounded-3xl border border-maroon-900/10 bg-white p-6 shadow-card sm:p-10">
                  <h3 className="font-display text-2xl text-maroon-900 md:text-3xl">
                    {page.storyHeading ?? 'Our story'}
                  </h3>
                  {page.story.split('\n\n').map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-4 text-base leading-relaxed text-maroon-800/90 sm:mt-5 md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {page.storySections?.map((section) => (
              <ScrollReveal key={section.title} className="mt-8 sm:mt-10">
                <div className="rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-50/80 to-cream-50 p-6 shadow-card sm:p-10">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-maroon-900 sm:text-2xl">
                    {section.title}
                  </h3>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="mt-4 text-base leading-relaxed text-maroon-800/90 sm:mt-5 md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </ScrollReveal>
            ))}

            {page.id === 'deities-timetable' && page.sections[0] && (
              <AboutDailyWorship heading={page.sections[0].heading} body={page.sections[0].body} />
            )}

            {page.sections.length > 0 && page.id !== 'deities-timetable' && (
              <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2">
                {page.sections.map((s, i) => (
                  <HistoryCard key={s.heading} heading={s.heading} body={s.body} index={i} />
                ))}
              </div>
            )}

            {page.bullets && page.bullets.length > 0 && (
              <AboutHighlights
                title={page.id === 'deities-timetable' ? 'Darshan & arati schedule' : 'Highlights'}
                items={page.bullets}
                variant={page.id === 'deities-timetable' ? 'schedule' : 'list'}
              />
            )}

            {page.sloka && (
              <ScrollReveal className="mt-8 sm:mt-10">
                <blockquote className="rounded-3xl border border-maroon-900/10 bg-gradient-to-br from-maroon-900 to-maroon-800 p-6 text-center text-cream-50 sm:p-10">
                  <p className="font-display text-xl text-gold-200 sm:text-2xl md:text-3xl">{page.sloka.text}</p>
                  <p className="mx-auto mt-4 max-w-lg text-sm text-cream-100/85">{page.sloka.meaning}</p>
                </blockquote>
              </ScrollReveal>
            )}

            {!page.hideGallery && galleryImages.length > 0 && (
              <ScrollReveal className="mt-10 sm:mt-12">
                <h3 className="font-display text-2xl text-maroon-900 md:text-3xl">Sacred glimpses</h3>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={tabTransition}
                  >
                    <SpiritualGallery images={galleryImages} columns={3} />
                  </motion.div>
                </AnimatePresence>
              </ScrollReveal>
            )}

            {page.id === 'deities-timetable' && (
              <ScrollReveal className="mt-8 text-center sm:mt-10">
                <Link
                  to="/darshan"
                  className="btn-tap inline-flex rounded-full bg-maroon-900 px-6 py-3 text-sm font-semibold text-cream-50"
                >
                  Full darshan page →
                </Link>
              </ScrollReveal>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
