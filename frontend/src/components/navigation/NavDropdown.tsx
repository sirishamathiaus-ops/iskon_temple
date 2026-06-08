import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export type NavDropdownItem = {
  label: string
  to: string
  description?: string
}

type Props = {
  label: string
  items: NavDropdownItem[]
  isActive?: (pathname: string) => boolean
}

export function NavDropdown({ label, items, isActive }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const active = isActive?.(location.pathname) ?? items.some((i) => location.pathname === i.to || location.pathname.startsWith(i.to + '/'))

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={[
          'btn-tap flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium',
          active
            ? 'bg-maroon-900 text-cream-50 shadow-soft'
            : 'text-maroon-800/90 hover:bg-white hover:text-maroon-900 hover:shadow-card',
        ].join(' ')}
      >
        {label}
        <svg
          className={['h-4 w-4 transition-transform', open ? 'rotate-180' : ''].join(' ')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-[60] mt-1 min-w-[240px] overflow-hidden rounded-2xl border border-maroon-900/10 bg-cream-50 py-2 shadow-[0_20px_50px_-12px_rgba(69,26,41,0.25)]"
          >
            {items.map((item) => {
              const itemActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'block px-4 py-2.5 transition-colors',
                    itemActive ? 'bg-gold-50 text-maroon-900' : 'text-maroon-800 hover:bg-white',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs text-maroon-700/70">{item.description}</span>
                  )}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Mobile accordion section inside drawer */
export function MobileNavAccordion({
  label,
  items,
  onNavigate,
  defaultOpen,
}: {
  label: string
  items: NavDropdownItem[]
  onNavigate: (to: string) => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const location = useLocation()

  return (
    <li className="rounded-2xl border border-maroon-900/8 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-tap flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-medium text-maroon-900"
      >
        {label}
        <span className="text-maroon-600">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-maroon-900/8 bg-cream-50/80"
          >
            {items.map((item) => (
              <li key={item.to}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.to)}
                  className={[
                    'btn-tap w-full px-4 py-3 text-left text-sm',
                    location.pathname === item.to ? 'bg-gold-100/80 font-semibold text-maroon-900' : 'text-maroon-800',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
