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

/** Normalize stored paths (handles missing leading slash). */
function normalizeMediaPath(path: string): string {
  let p = path.trim()
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  if (!p.startsWith('/')) p = `/${p}`
  return p
}

/**
 * Resolve media URLs: absolute URLs, Vite `public/` (`/gallery/...`), and API static files (`/static/...`).
 */
export function assetUrl(path: string | null | undefined): string {
  if (path == null) return ''
  const p = normalizeMediaPath(String(path))
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  // Served by the frontend dev server or static hosting (not the API host).
  if (
    p.startsWith('/gallery/') ||
    p.startsWith('/favicon') ||
    p.startsWith('/upi-qr') ||
    p.startsWith('/temple-logo')
  ) {
    return p
  }
  const galleryFile = p.match(/^\/?gallery\/(\d{1,2})\.png$/i)
  if (galleryFile) {
    return `/gallery/${galleryFile[1].padStart(2, '0')}.png`
  }
  if (p.startsWith('/static/')) {
    if (base) return `${base}${p}`
    return p
  }
  // Paths under / are frontend routes or public assets — do not prefix API host.
  if (p.startsWith('/')) return p
  return p
}

/** Multipart donation submit — lets the browser set the boundary (do not force JSON Content-Type). */
export async function submitOfflineDonation(formData: FormData) {
  return api.post('/donations/offline-submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: [(data, headers) => {
      if (headers && typeof headers === 'object') {
        delete (headers as Record<string, string>)['Content-Type']
      }
      return data
    }],
  })
}

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}
