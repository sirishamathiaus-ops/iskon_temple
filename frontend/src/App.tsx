import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/Home'
import { AboutPage } from '@/pages/About'
import { DarshanPage } from '@/pages/Darshan'
import { FestivalsPage } from '@/pages/Festivals'
import { FestivalDetailPage } from '@/pages/FestivalDetail'
import { DonatePage } from '@/pages/Donate'
import { PaymentPage } from '@/pages/Payment'
import { PaymentHistoryPage } from '@/pages/PaymentHistory'
import { ContactPage } from '@/pages/Contact'
import { GalleryPage } from '@/pages/Gallery'
import { AdminLoginPage } from '@/admin/AdminLogin'
import { AdminDashboard } from '@/admin/AdminDashboard'
import { RequireAdmin, getStoredToken } from '@/admin/auth'

function AdminLoginGate() {
  const nav = useNavigate()
  useEffect(() => {
    if (getStoredToken()) nav('/admin', { replace: true })
  }, [nav])
  return <AdminLoginPage />
}

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
        <Route path="about" element={<AboutPage />} />
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
