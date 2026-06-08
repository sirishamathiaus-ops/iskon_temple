import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition } from '@/components/layout/PageTransition'

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-temple-hero text-maroon-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/40 to-transparent" aria-hidden />
      <Navbar />
      <main className="relative flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
