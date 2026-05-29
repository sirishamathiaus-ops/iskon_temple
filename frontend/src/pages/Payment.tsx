import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PaymentStatusBanner } from '@/components/PaymentStatusBanner'
import { Seo } from '@/components/Seo'
import { api } from '@/lib/api'
import { apiErrorMessage, formatPaise, openRazorpayCheckout } from '@/lib/razorpay'
import type { PaymentOrderResponse, RazorpaySuccessPayload } from '@/types/payment'

type UiState = 'idle' | 'loading' | 'checkout' | 'verifying' | 'success' | 'failed'

export function PaymentPage() {
  const [amount, setAmount] = useState('501')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [uiState, setUiState] = useState<UiState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [lastPaymentId, setLastPaymentId] = useState<number | null>(null)

  async function handlePay() {
    setError(null)
    setSuccessMsg(null)

    const amountNum = Number(amount)
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (amountNum < 1) {
      setError('Minimum amount is ₹1.')
      return
    }

    setUiState('loading')
    try {
      const { data: order } = await api.post<PaymentOrderResponse>('/payments/create-order', {
        amount_rupees: amountNum,
        email: email.trim(),
        name: name.trim(),
        description: description.trim() || undefined,
        currency: 'INR',
      })

      setUiState('checkout')
      await openRazorpayCheckout({
        key: order.key_id,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: 'ISKCON Temple — Seva',
        description: order.description ?? 'Temple offering',
        prefill: { name: order.name ?? name, email: order.email },
        onSuccess: (payload) => verifyOnServer(payload, order.payment_id),
        onDismiss: () => {
          if (uiState !== 'success') {
            setUiState('idle')
            setError('Payment was cancelled or closed before completion.')
          }
        },
      })
    } catch (err) {
      setUiState('failed')
      setError(apiErrorMessage(err, 'Could not start payment. Check Razorpay keys in backend .env'))
    }
  }

  async function verifyOnServer(payload: RazorpaySuccessPayload, paymentId: number) {
    setUiState('verifying')
    setError(null)
    try {
      const { data } = await api.post<{ ok: boolean; message: string; payment_id: number }>(
        '/payments/verify',
        {
          razorpay_order_id: payload.razorpay_order_id,
          razorpay_payment_id: payload.razorpay_payment_id,
          razorpay_signature: payload.razorpay_signature,
        },
      )
      setLastPaymentId(data.payment_id ?? paymentId)
      setSuccessMsg(data.message)
      setUiState('success')
    } catch (err) {
      setUiState('failed')
      setError(apiErrorMessage(err, 'Payment verification failed. Contact the temple office if amount was debited.'))
    }
  }

  const busy = uiState === 'loading' || uiState === 'checkout' || uiState === 'verifying'

  return (
    <>
      <Seo
        title="Pay with Razorpay — ISKCON Dornala"
        description="Secure card and UPI payments via Razorpay for temple seva."
      />
      <section className="border-b border-maroon-900/10 bg-gradient-to-b from-cream-100 to-transparent">
        <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80">Secure payment</p>
          <h1 className="mt-3 font-display text-3xl text-maroon-900 md:text-4xl">Razorpay checkout</h1>
          <p className="mt-4 text-sm leading-relaxed text-maroon-800/85 sm:text-base">
            Amount is charged only after you complete the Razorpay popup. Your card/UPI details never touch our
            servers — Razorpay handles PCI-compliant checkout.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6 md:pb-20">
        {uiState === 'success' && successMsg && (
          <div className="mt-8">
            <PaymentStatusBanner variant="success" title="Payment successful" onClose={() => setUiState('idle')}>
              <p>{successMsg}</p>
              {lastPaymentId != null && (
                <p className="mt-2 text-xs opacity-80">
                  Reference: payment #{lastPaymentId}
                </p>
              )}
            </PaymentStatusBanner>
          </div>
        )}

        {error && uiState !== 'success' && (
          <div className="mt-8">
            <PaymentStatusBanner variant="error" title="Payment issue" onClose={() => setError(null)}>
              {error}
            </PaymentStatusBanner>
          </div>
        )}

        <motion.div
          className="card-premium mt-8 p-6 sm:p-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-xl text-maroon-900">Payment details</h2>

          <label className="mt-5 block text-sm font-medium text-maroon-800">
            Amount (INR) <span className="text-red-600">*</span>
            <input
              type="number"
              min={1}
              className="input-premium"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-maroon-800">
            Full name <span className="text-red-600">*</span>
            <input
              required
              className="input-premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-maroon-800">
            Email <span className="text-red-600">*</span>
            <input
              type="email"
              required
              className="input-premium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-maroon-800">
            Note <span className="font-normal text-maroon-600/70">(optional)</span>
            <textarea
              className="input-premium min-h-[72px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={busy}
              placeholder="Purpose of offering"
            />
          </label>

          <p className="mt-4 text-sm text-maroon-700/75">
            You will pay approximately{' '}
            <strong className="text-maroon-900">{formatPaise(Math.round(Number(amount || 0) * 100))}</strong>
          </p>

          <button
            type="button"
            className="btn-primary-gold mt-6 w-full sm:w-auto"
            disabled={busy}
            onClick={() => void handlePay()}
          >
            {uiState === 'loading' && 'Creating order…'}
            {uiState === 'checkout' && 'Complete payment in popup…'}
            {uiState === 'verifying' && 'Verifying payment…'}
            {(uiState === 'idle' || uiState === 'failed' || uiState === 'success') && 'Pay with Razorpay'}
          </button>
        </motion.div>

        <p className="mt-6 text-center text-sm text-maroon-700/75">
          <Link to="/payments/history" className="font-medium text-maroon-900 underline-offset-2 hover:underline">
            View payment history
          </Link>
          {' · '}
          <Link to="/donate" className="font-medium text-maroon-900 underline-offset-2 hover:underline">
            Temple donation page
          </Link>
        </p>
      </div>
    </>
  )
}
