import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { temple } from '@/content/temple'
import { NavDropdown, MobileNavAccordion } from '@/components/navigation/NavDropdown'
import { ABOUT_DROPDOWN, FESTIVAL_DROPDOWN } from '@/lib/navConfig'

const NAV_HOME = { to: '/', label: 'Home', end: true }
const NAV_GALLERY = { to: '/gallery', label: 'Gallery' }
const NAV_DARSHAN = { to: '/darshan', label: 'Daily Darshan' }
const NAV_CONTACT = { to: '/contact', label: 'Contact' }

function isNavActive(pathname: string, to: string, end?: boolean): boolean {
  if (end) return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function DonateCta({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <Link
      to="/donate"
      onClick={onNavigate}
      className={
        className ||
        'btn-tap relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 px-5 py-2.5 text-sm font-bold tracking-wide text-maroon-900 shadow-[0_4px_24px_rgba(201,149,44,0.5)] ring-2 ring-gold-300/90 ring-offset-2 ring-offset-cream-50 lg:px-7 lg:py-3'
      }
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70" aria-hidden />
      <span className="relative flex items-center gap-1.5">
        <span aria-hidden>🙏</span>
        Donate
      </span>
    </Link>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  function navigateFromDrawer(to: string) {
    closeDrawer()
    window.setTimeout(() => navigate(to), 10)
  }

  const mobileDrawer =
    typeof document !== 'undefined'
      ? createPortal(
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                className="fixed inset-0 z-[200] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  className="absolute inset-0 bg-maroon-950/60 backdrop-blur-md"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                />
                <motion.aside
                  id="mobile-nav-drawer"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute right-0 top-0 flex h-[100dvh] w-[min(100%,21rem)] flex-col overflow-hidden border-l border-gold-400/25 bg-cream-50 shadow-[0_0_60px_rgba(69,26,41,0.2)]"
                >
                  <div className="relative border-b border-maroon-900/10 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-900 px-5 pb-5 pt-6 text-cream-50">
                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-xl">Menu</p>
                        <p className="mt-1 text-xs text-cream-50/75">{temple.shortName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="btn-tap rounded-full border border-cream-50/20 bg-cream-50/10 p-2.5 text-cream-50 backdrop-blur-sm"
                        aria-label="Close menu"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-label="Mobile">
                    <ul className="space-y-2">
                      {([NAV_HOME] as const).map((item, i) => {
                        const active = isNavActive(location.pathname, item.to, item.end)
                        return (
                          <motion.li
                            key={item.to}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.04 * i, duration: 0.25 }}
                          >
                            <button
                              type="button"
                              onClick={() => navigateFromDrawer(item.to)}
                              className={[
                                'btn-tap block w-full rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium shadow-sm',
                                active
                                  ? 'bg-gradient-to-r from-gold-500/90 to-amber-400/90 text-maroon-900 ring-1 ring-gold-300/50'
                                  : 'border border-maroon-900/8 bg-white text-maroon-900 hover:border-gold-400/40',
                              ].join(' ')}
                            >
                              {item.label}
                            </button>
                          </motion.li>
                        )
                      })}

                      <MobileNavAccordion
                        label="About Us"
                        items={ABOUT_DROPDOWN}
                        onNavigate={navigateFromDrawer}
                        defaultOpen={location.pathname.startsWith('/about')}
                      />

                      {([NAV_GALLERY, NAV_DARSHAN] as const).map((item, i) => {
                        const active = isNavActive(location.pathname, item.to, item.end)
                        return (
                          <motion.li
                            key={item.to}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.12 + 0.04 * i, duration: 0.25 }}
                          >
                            <button
                              type="button"
                              onClick={() => navigateFromDrawer(item.to)}
                              className={[
                                'btn-tap block w-full rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium shadow-sm',
                                active
                                  ? 'bg-gradient-to-r from-gold-500/90 to-amber-400/90 text-maroon-900 ring-1 ring-gold-300/50'
                                  : 'border border-maroon-900/8 bg-white text-maroon-900 hover:border-gold-400/40',
                              ].join(' ')}
                            >
                              {item.label}
                            </button>
                          </motion.li>
                        )
                      })}

                      <MobileNavAccordion
                        label="Festivals"
                        items={FESTIVAL_DROPDOWN}
                        onNavigate={navigateFromDrawer}
                        defaultOpen={location.pathname.startsWith('/festivals')}
                      />

                      {([NAV_CONTACT] as const).map((item) => {
                        const active = isNavActive(location.pathname, item.to, item.end)
                        return (
                          <motion.li
                            key={item.to}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.24, duration: 0.25 }}
                          >
                            <button
                              type="button"
                              onClick={() => navigateFromDrawer(item.to)}
                              className={[
                                'btn-tap block w-full rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium shadow-sm',
                                active
                                  ? 'bg-gradient-to-r from-gold-500/90 to-amber-400/90 text-maroon-900 ring-1 ring-gold-300/50'
                                  : 'border border-maroon-900/8 bg-white text-maroon-900 hover:border-gold-400/40',
                              ].join(' ')}
                            >
                              {item.label}
                            </button>
                          </motion.li>
                        )
                      })}
                    </ul>
                    <motion.div className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                      <button
                        type="button"
                        onClick={() => navigateFromDrawer('/donate')}
                        className="btn-tap flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 py-4 text-base font-bold text-maroon-900 shadow-gold"
                      >
                        <span aria-hidden>🙏</span>
                        Support seva
                      </button>
                    </motion.div>
                  </nav>

                  <p className="safe-bottom border-t border-maroon-900/8 bg-cream-100/80 px-5 py-4 text-center text-[11px] leading-relaxed text-maroon-700/70">
                    {temple.fullName}
                  </p>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )
      : null

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-maroon-900/10 bg-cream-50/95 shadow-[0_4px_24px_-8px_rgba(69,26,41,0.15)] backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-[4.25rem] md:px-6">
          <Link to="/" className="btn-tap flex min-w-0 flex-1 items-center gap-2.5 sm:flex-none" onClick={closeDrawer}>
            <img src="/temple-logo.svg" alt="" className="h-10 w-10 shrink-0 drop-shadow-sm md:h-11 md:w-11" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold leading-tight text-maroon-900 sm:text-base md:text-lg">
                {temple.shortName}
              </p>
              <p className="truncate text-[10px] text-maroon-700/75 md:text-xs">{temple.tagline}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            <NavLink
              to={NAV_HOME.to}
              end={NAV_HOME.end}
              className={({ isActive }) =>
                [
                  'btn-tap rounded-full px-3.5 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-maroon-900 text-cream-50 shadow-soft'
                    : 'text-maroon-800/90 hover:bg-white hover:text-maroon-900 hover:shadow-card',
                ].join(' ')
              }
            >
              {NAV_HOME.label}
            </NavLink>

            <NavDropdown label="About Us" items={ABOUT_DROPDOWN} isActive={(p) => p.startsWith('/about')} />

            <NavLink
              to={NAV_GALLERY.to}
              className={({ isActive }) =>
                [
                  'btn-tap rounded-full px-3.5 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-maroon-900 text-cream-50 shadow-soft'
                    : 'text-maroon-800/90 hover:bg-white hover:text-maroon-900 hover:shadow-card',
                ].join(' ')
              }
            >
              {NAV_GALLERY.label}
            </NavLink>

            <NavLink
              to={NAV_DARSHAN.to}
              className={({ isActive }) =>
                [
                  'btn-tap rounded-full px-3.5 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-maroon-900 text-cream-50 shadow-soft'
                    : 'text-maroon-800/90 hover:bg-white hover:text-maroon-900 hover:shadow-card',
                ].join(' ')
              }
            >
              {NAV_DARSHAN.label}
            </NavLink>

            <NavDropdown label="Festivals" items={FESTIVAL_DROPDOWN} isActive={(p) => p.startsWith('/festivals')} />

            <NavLink
              to={NAV_CONTACT.to}
              className={({ isActive }) =>
                [
                  'btn-tap rounded-full px-3.5 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-maroon-900 text-cream-50 shadow-soft'
                    : 'text-maroon-800/90 hover:bg-white hover:text-maroon-900 hover:shadow-card',
                ].join(' ')
              }
            >
              {NAV_CONTACT.label}
            </NavLink>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden sm:block lg:hidden">
              <DonateCta className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 px-4 py-2 text-xs font-bold text-maroon-900 shadow-md ring-2 ring-gold-200/80" />
            </div>
            <div className="hidden lg:block">
              <DonateCta />
            </div>

            <button
              type="button"
              className="btn-tap flex h-11 w-11 items-center justify-center rounded-2xl border border-maroon-900/12 bg-white text-maroon-900 shadow-card lg:hidden"
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
            >
              {drawerOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileDrawer}
    </>
  )
}
