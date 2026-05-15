import { Link } from 'react-router-dom'
import { temple } from '@/content/temple'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-maroon-900/10 bg-maroon-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-xl text-cream-50">{temple.fullName}</p>
          <p className="mt-3 text-sm text-cream-200/90">
            Sri Jagannath seva at Hare Krishna Land — kirtan, prasadam, annadanam, and care for pilgrims and villages along
            the sacred route to Srisailam.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300/95">Visit</p>
          <p className="mt-3 text-sm text-cream-200/90">
            {temple.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-3 text-sm text-cream-200/90">
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
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300/95">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-cream-200/90">
            <li>
              <Link className="hover:text-gold-200" to="/darshan">
                Darshan timings
              </Link>
            </li>
            <li>
              <Link className="hover:text-gold-200" to="/festivals">
                Festival calendar
              </Link>
            </li>
            <li>
              <Link className="hover:text-gold-200" to="/gallery">
                Gallery
              </Link>
            </li>
            <li>
              <Link className="hover:text-gold-200" to="/donate">
                Donate & bank details
              </Link>
            </li>
            <li>
              <Link className="hover:text-gold-200" to="/contact">
                Contact & map
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-cream-300/70">
        © {new Date().getFullYear()} {temple.shortName}. All glories to Sri Guru and Gauranga.
      </div>
    </footer>
  )
}
