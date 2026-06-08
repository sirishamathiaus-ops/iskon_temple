import type { ReactNode } from 'react'

/** Plain wrapper — AnimatePresence on route changes was causing blank screens on load. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>
}
