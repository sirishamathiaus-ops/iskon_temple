import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLoginPage } from '@/admin/AdminLogin'
import { getStoredToken } from '@/admin/auth'

/** Uses useNavigate — must be rendered as a Route element (inside BrowserRouter). */
export function AdminLoginGate() {
  const nav = useNavigate()
  useEffect(() => {
    if (getStoredToken()) nav('/admin', { replace: true })
  }, [nav])
  return <AdminLoginPage />
}
