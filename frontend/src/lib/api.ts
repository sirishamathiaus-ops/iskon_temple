import axios from 'axios'
import { TEMPLE_ADMIN_TOKEN_KEY } from '@/lib/constants'

const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

export const api = axios.create({
  baseURL: base ? `${base}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && api.defaults.headers.common.Authorization) {
      localStorage.removeItem(TEMPLE_ADMIN_TOKEN_KEY)
      delete api.defaults.headers.common.Authorization
    }
    return Promise.reject(err)
  },
)

export function assetUrl(path: string): string {
  if (path.startsWith('http')) return path
  // Vite `public/` files (e.g. /gallery/*) are served from the frontend origin, not the API host.
  if (path.startsWith('/gallery/') || path.startsWith('/favicon')) return path
  if (path.startsWith('/')) return `${base || ''}${path}`
  return path
}

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(s)
  })
}
