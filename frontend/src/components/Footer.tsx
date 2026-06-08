import { Link } from 'react-router-dom'
import { temple } from '@/content/temple'

const ABOUT_LINKS = [
  { to: '/about/iskcon', label: 'About ISKCON' },
  { to: '/about/founder', label: 'Srila Prabhupada' },
  { to: '/about/srisailam', label: 'Srisailam history' },
  { to: '/about/deities-timetable', label: 'Deities timetable' },
] as const

const VISIT_LINKS = [
  { to: '/darshan', label: 'Darshan timings' },
  { to: '/festivals', label: 'Festival calendar' },
  { to: '/gallery', label: 'Temple gallery' },
  { to: '/donate', label: 'Donate & bank details' },
  { to: '/contact', label: 'Contact & map' },
  { to: '/pay', label: 'Online payment' },
] as const

export function Footer() {
  return (
    <footer className="relative z-20 mt-auto border-t border-maroon-900/15 bg-maroon-900 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-xl text-cream-50">{temple.shortName}</p>
            <p className="mt-1 text-sm text-gold-200/90">{temple.fullName}</p>
            <p className="mt-4 text-sm leading-relaxed text-cream-200/90">
              Sri Jagannath seva at Hare Krishna Land — kirtan, prasadam, annadanam, and care for pilgrims on the sacred
              route to Srisailam.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-300/95">About</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-200/90">
              {ABOUT_LINKS.map((item) => (
                <li key={item.to}>
                  <Link className="transition hover:text-gold-200" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-300/95">Visit & seva</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-200/90">
              {VISIT_LINKS.map((item) => (
                <li key={item.to}>
                  <Link className="transition hover:text-gold-200" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-300/95">Contact</p>
            <address className="mt-4 space-y-3 text-sm not-italic text-cream-200/90">
              {temple.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-4 text-sm text-cream-200/90">
              WhatsApp:{' '}
              {temple.whatsapp.map((w, i) => (
                <span key={w.href}>
                  {i > 0 ? ' · ' : ''}
                  <a href={w.href} className="text-gold-200 hover:text-gold-100" target="_blank" rel="noreferrer">
                    {w.display}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-maroon-950/40 py-6 text-center text-xs text-cream-300/75">
        © {new Date().getFullYear()} {temple.shortName}. All glories to Sri Guru and Gauranga.
      </div>
    </footer>
  )
}
