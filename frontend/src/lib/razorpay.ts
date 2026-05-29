/**
 * Razorpay Checkout loader and opener.
 * Secret key never touches the browser — only key_id from backend.
 */

import type { RazorpaySuccessPayload } from '@/types/payment'

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

export interface RazorpayCheckoutOptions {
  key: string
  order_id: string
  amount: number
  currency: string
  name?: string
  description?: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  onSuccess: (payload: RazorpaySuccessPayload) => void | Promise<void>
  onDismiss?: () => void
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: () => void) => void
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayInstance
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

let scriptPromise: Promise<void> | null = null

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Razorpay runs only in the browser'))
  }
  if (window.Razorpay) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay')))
      return
    }
    const script = document.createElement('script')
    script.src = CHECKOUT_SCRIPT
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export async function openRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  await loadRazorpayScript()
  if (!window.Razorpay) {
    throw new Error('Razorpay SDK not available')
  }

  return new Promise((resolve, reject) => {
    try {
      const rzp = new window.Razorpay!({
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        name: options.name ?? 'ISKCON Temple',
        description: options.description ?? 'Payment',
        order_id: options.order_id,
        prefill: options.prefill,
        theme: options.theme ?? { color: '#451a29' },
        handler: (response: RazorpaySuccessPayload) => {
          void Promise.resolve(options.onSuccess(response)).then(() => resolve())
        },
        modal: {
          ondismiss: () => {
            options.onDismiss?.()
            resolve()
          },
        },
      })
      rzp.on('payment.failed', () => {
        options.onDismiss?.()
      })
      rzp.open()
    } catch (e) {
      reject(e)
    }
  })
}

export function formatPaise(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
    if (typeof data === 'string') return data
    if (Array.isArray(data) && data[0]?.msg) return String(data[0].msg)
  }
  if (err instanceof Error) return err.message
  return fallback
}
