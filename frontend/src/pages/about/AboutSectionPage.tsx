import { Link, Navigate, useParams } from 'react-router-dom'
import { ABOUT_NAV, ABOUT_PAGES, type AboutSectionId } from '@/content/aboutPages'
import { AboutSectionLayout } from '@/components/about/AboutSectionLayout'

const VALID = new Set(ABOUT_NAV.map((n) => n.id))

export function AboutSectionPage() {
  const { section } = useParams<{ section: string }>()
  if (!section || !VALID.has(section as AboutSectionId)) {
    return <Navigate to="/about/iskcon" replace />
  }
  const page = ABOUT_PAGES[section as AboutSectionId]
  return <AboutSectionLayout key={section} page={page} />
}

export function AboutHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">About us</p>
      <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Learn our sacred journey</h1>
      <p className="mt-4 max-w-2xl text-lg text-maroon-800/90">
        Explore ISKCON, our founder, daily worship timings, and the glory of Srisailam.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT_NAV.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="spiritual-card-hover rounded-2xl border border-maroon-900/10 bg-white p-6 shadow-card"
          >
            <h2 className="font-display text-xl text-maroon-900">{item.label}</h2>
            <p className="mt-2 text-sm text-maroon-700/80">Read more →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
