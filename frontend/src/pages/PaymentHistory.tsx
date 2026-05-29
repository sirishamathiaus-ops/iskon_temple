import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '@/components/Seo'
import { api } from '@/lib/api'
import { apiErrorMessage, formatPaise } from '@/lib/razorpay'
import type { PaymentRecord } from '@/types/payment'

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-900',
  pending: 'bg-amber-100 text-amber-900',
  failed: 'bg-red-100 text-red-900',
  refunded: 'bg-slate-100 text-slate-800',
}

export function PaymentHistoryPage() {
  const [email, setEmail] = useState('')
  const [rows, setRows] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function loadHistory(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!email.trim() || !email.includes('@')) {
      setError('Enter the email used during payment.')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await api.get<PaymentRecord[]>('/payments/history', {
        params: { email: email.trim().toLowerCase() },
      })
      setRows(data)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load payment history.'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo title="Payment history — ISKCON Dornala" description="Look up Razorpay payments by email." />
      <section className="border-b border-maroon-900/10 bg-gradient-to-b from-cream-100 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
          <h1 className="font-display text-3xl text-maroon-900 md:text-4xl">Payment history</h1>
          <p className="mt-3 text-sm text-maroon-800/85 sm:text-base">
            Enter the email you used at checkout. In production, protect this with login or OTP.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-16 md:px-6">
        <form onSubmit={(ev) => void loadHistory(ev)} className="card-premium mt-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-medium text-maroon-800">
            Email
            <input
              type="email"
              className="input-premium mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <button type="submit" className="btn-primary-gold shrink-0" disabled={loading}>
            {loading ? 'Loading…' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {error}
          </p>
        )}

        {searched && !loading && rows.length === 0 && !error && (
          <p className="mt-8 text-center text-sm text-maroon-700/75">No payments found for this email.</p>
        )}

        {rows.length > 0 && (
          <motion.div
            className="mt-8 overflow-hidden rounded-2xl border border-maroon-900/10 bg-white shadow-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-maroon-900/10 bg-cream-50 text-xs font-semibold uppercase tracking-wider text-maroon-700/80">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-maroon-900/5 last:border-0">
                      <td className="px-4 py-3 text-maroon-900">
                        {new Date(row.created_at).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPaise(row.amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[row.status] ?? 'bg-cream-100'}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-maroon-700/80">
                        {row.razorpay_order_id ?? '—'}
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-maroon-700/80">
                        {row.razorpay_payment_id ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <p className="mt-8 text-center text-sm">
          <Link to="/pay" className="font-medium text-maroon-900 underline-offset-2 hover:underline">
            Make a new payment
          </Link>
        </p>
      </div>
    </>
  )
}
