import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { temple } from '@/content/temple'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/darshan', label: 'Daily Darshan' },
  { to: '/festivals', label: 'Festivals' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gradient-to-br from-gold-500/25 to-forest-800/40 shadow-gold"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-display text-lg text-gold-400">ॐ</span>
          </motion.div>
          <div>
            <p className="font-display text-lg font-semibold tracking-wide text-white">{temple.shortName}</p>
            <p className="text-xs text-gold-200/85">{temple.tagline}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-gold-500/20 text-gold-100' : 'text-lotus-100/85 hover:text-white',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/donate"
          className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:from-gold-400 hover:to-gold-500"
        >
          Donate Now
        </Link>
      </div>
      <nav className="flex flex-wrap gap-1 border-t border-white/5 px-4 py-2 md:hidden">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-xs font-medium',
                isActive ? 'bg-gold-500/15 text-gold-200' : 'text-lotus-100/70',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
