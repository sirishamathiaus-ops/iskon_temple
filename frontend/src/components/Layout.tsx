import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="min-h-screen bg-lotus-radial bg-lotus-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
