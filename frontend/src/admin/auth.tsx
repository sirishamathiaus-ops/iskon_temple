import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, setAuthToken } from '@/lib/api'
import { TEMPLE_ADMIN_TOKEN_KEY } from '@/lib/constants'

const TOKEN_KEY = TEMPLE_ADMIN_TOKEN_KEY

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  setAuthToken(token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  setAuthToken(null)
}

export function useAdminAuth() {
  const nav = useNavigate()
  const [token, setTok] = useState<string | null>(() => getStoredToken())

  useEffect(() => {
    const t = getStoredToken()
    if (t) setAuthToken(t)
    setTok(t)
  }, [])

  const login = async (username: string, password: string) => {
    const body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)
    const { data } = await api.post<{ access_token: string }>('/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    storeToken(data.access_token)
    setTok(data.access_token)
    nav('/admin', { replace: true })
  }

  const logout = () => {
    clearToken()
    setTok(null)
    nav('/admin/login', { replace: true })
  }

  return { token, login, logout, isAuthed: Boolean(token) }
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const t = getStoredToken()
  useEffect(() => {
    if (t) setAuthToken(t)
  }, [t])
  if (!t) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
