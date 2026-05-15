import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="relative min-h-screen bg-temple-hero text-maroon-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/40 to-transparent" aria-hidden />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
