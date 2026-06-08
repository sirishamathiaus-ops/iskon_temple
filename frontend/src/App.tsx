import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/Home'
import { AboutHubPage, AboutSectionPage } from '@/pages/about/AboutSectionPage'
import { DarshanPage } from '@/pages/Darshan'
import { FestivalsPage } from '@/pages/Festivals'
import { FestivalDetailPage } from '@/pages/FestivalDetail'
import { DonatePage } from '@/pages/Donate'
import { PaymentPage } from '@/pages/Payment'
import { PaymentHistoryPage } from '@/pages/PaymentHistory'
import { ContactPage } from '@/pages/Contact'
import { GalleryPage } from '@/pages/Gallery'
import { AdminLoginGate } from '@/admin/AdminLoginGate'
import { AdminDashboard } from '@/admin/AdminDashboard'
import { RequireAdmin } from '@/admin/auth'

/**
 * Routing only — BrowserRouter lives in main.tsx.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginGate />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutHubPage />} />
        <Route path="about/:section" element={<AboutSectionPage />} />
        <Route path="darshan" element={<DarshanPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="festivals" element={<FestivalsPage />} />
        <Route path="festivals/:slug" element={<FestivalDetailPage />} />
        <Route path="donate" element={<DonatePage />} />
        <Route path="pay" element={<PaymentPage />} />
        <Route path="payments/history" element={<PaymentHistoryPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
