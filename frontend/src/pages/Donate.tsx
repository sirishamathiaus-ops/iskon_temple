import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, loadRazorpayScript } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { getUpiId, getUpiPayeeName, temple } from '@/content/temple'
import type { DonationCategory, Festival } from '@/types'

const categories: { id: DonationCategory; label: string; blurb: string }[] = [
  {
    id: 'annadanam',
    label: 'Annadanam Donation',
    blurb: 'Sponsor prasadam — including free meals for Srisailam yatrikas and large festival feasts.',
  },
  { id: 'care_cow', label: 'Care for Cows', blurb: 'Support goshala care, feed, and compassionate cow protection.' },
  {
    id: 'temple_construction',
    label: 'Temple Construction Fund',
    blurb: 'Build Sri Jagannath Temple and facilities at Hare Krishna Land, Dornala.',
  },
  { id: 'festival_sponsorship', label: 'Festival Sponsorship', blurb: 'Choose a festival and sponsor abhishekam, flowers, or feast.' },
  { id: 'one_time', label: 'One-time Donation', blurb: 'A single offering toward general temple operations.' },
  { id: 'monthly', label: 'Monthly Donation', blurb: 'Recurring monthly support (processed as monthly category via Razorpay).' },
]

type OrderRes = {
  donation_id: number
  order_id: string
  amount_paise: number
  currency: string
  key_id: string
  category: string
}

export function DonatePage() {
  const location = useLocation() as { state?: { category?: DonationCategory; festivalId?: number } }
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [category, setCategory] = useState<DonationCategory>('annadanam')
  const [festivalId, setFestivalId] = useState<number | ''>('')
  const [amount, setAmount] = useState('501')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    api.get<Festival[]>('/public/festivals-sponsorship/list').then((r) => setFestivals(r.data))
  }, [])

  useEffect(() => {
    const st = location.state
    if (st?.category) setCategory(st.category)
    if (st?.festivalId) setFestivalId(st.festivalId)
  }, [location.state])

  const selected = useMemo(() => categories.find((c) => c.id === category), [category])

  async function pay() {
    setMessage(null)
    setBusy(true)
    try {
      const payload = {
        category,
        amount_rupees: Number(amount),
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone || undefined,
        festival_id: category === 'festival_sponsorship' ? Number(festivalId) || undefined : undefined,
        notes: notes || undefined,
      }
      const { data } = await api.post<OrderRes>('/donations/create-order', payload)
      await loadRazorpayScript()
      if (!window.Razorpay) throw new Error('Razorpay unavailable')

      const rz = new window.Razorpay({
        key: data.key_id,
        order_id: data.order_id,
        currency: data.currency,
        name: temple.shortName,
        description: selected?.label || 'Donation',
        prefill: { name: donorName, email: donorEmail, contact: donorPhone },
        theme: { color: '#e07800' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await api.post('/donations/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            setMessage('Payment successful. Thank you for your seva!')
          } catch {
            setMessage('Payment received but verification failed. Please contact the temple office with your receipt.')
          }
        },
      })
      rz.open()
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e ? (e as { response?: { data?: { detail?: string } } }).response?.data?.detail : null
      setMessage(typeof msg === 'string' ? msg : 'Could not start payment. Check amount and gateway configuration.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Donate — ISKCON Dornala"
        description="Razorpay, UPI, and bank transfer for annadanam, cows, Sri Jagannath temple construction, and festivals."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Seva</p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Generous hearts sustain the altar</h1>
          <p className="mt-4 max-w-2xl text-lotus-100/80">
            Offer online via Razorpay (UPI, cards, netbanking), or use the temple bank / UPI details below. Official
            acknowledgements are issued as per temple policy.
          </p>
        </motion.div>

        <BankAndUpiCard />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={[
                  'w-full rounded-2xl border px-5 py-4 text-left transition',
                  category === c.id
                    ? 'border-gold-400/60 bg-gold-500/10 shadow-gold'
                    : 'border-white/10 bg-white/[0.02] hover:border-gold-500/30',
                ].join(' ')}
              >
                <p className="font-display text-xl text-white">{c.label}</p>
                <p className="mt-1 text-sm text-lotus-200/80">{c.blurb}</p>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-soft">
            <h2 className="font-display text-2xl text-white">Your details</h2>
            {category === 'festival_sponsorship' && (
              <label className="mt-6 block text-sm text-lotus-200/90">
                Festival
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                  value={festivalId}
                  onChange={(e) => setFestivalId(e.target.value ? Number(e.target.value) : '')}
                  required
                >
                  <option value="">Select festival</option>
                  {festivals.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="mt-6 block text-sm text-lotus-200/90">
              Amount (INR)
              <input
                type="number"
                min={1}
                step={1}
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Full name
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                required
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                required
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Phone (optional)
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Note to office (optional)
              <textarea
                className="mt-2 min-h-[80px] w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            {message && <p className="mt-6 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-sm text-gold-100">{message}</p>}

            <button
              type="button"
              disabled={busy || !donorName || !donorEmail}
              onClick={pay}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
            >
              {busy ? 'Please wait…' : 'Proceed to Razorpay'}
            </button>
            <p className="mt-4 text-xs text-lotus-200/60">
              Monthly donations use the same secure checkout; configure Razorpay subscriptions in production if you require
              auto-debit mandates.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function BankAndUpiCard() {
  const upi = getUpiId()
  const payee = getUpiPayeeName()
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 rounded-3xl border border-gold-500/25 bg-gradient-to-br from-forest-800/40 to-white/[0.04] p-6 md:p-8"
    >
      <h2 className="font-display text-2xl text-white">Bank transfer</h2>
      <dl className="mt-4 grid gap-3 text-sm text-lotus-100/90 md:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wider text-gold-300/90">Bank</dt>
          <dd className="mt-1">{temple.bank.bankName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-gold-300/90">Branch</dt>
          <dd className="mt-1">{temple.bank.branch}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-gold-300/90">Account name</dt>
          <dd className="mt-1 font-medium text-white">{temple.bank.accountName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-gold-300/90">Account number</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2 font-mono text-white">
            {temple.bank.accountNumber}
            <button
              type="button"
              onClick={() => copy(temple.bank.accountNumber, 'ac')}
              className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-gold-200 hover:bg-white/10"
            >
              {copied === 'ac' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-gold-300/90">IFSC</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2 font-mono text-white">
            {temple.bank.ifsc}
            <button
              type="button"
              onClick={() => copy(temple.bank.ifsc, 'ifsc')}
              className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-gold-200 hover:bg-white/10"
            >
              {copied === 'ifsc' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-white/10 pt-8">
        <h3 className="font-display text-xl text-white">UPI</h3>
        {upi ? (
          <>
            <p className="mt-2 text-sm text-lotus-100/85">
              Payee: <span className="text-white">{payee}</span>
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-lg text-gold-100">{upi}</p>
            <button
              type="button"
              onClick={() => copy(upi, 'upi')}
              className="mt-3 rounded-full border border-gold-500/40 bg-gold-500/15 px-4 py-2 text-sm font-medium text-gold-100 hover:bg-gold-500/25"
            >
              {copied === 'upi' ? 'Copied to clipboard' : 'Copy UPI ID'}
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-lotus-200/80">
            Set the environment variable <span className="font-mono text-gold-200/90">VITE_UPI_ID</span> when building the
            site (for example in <span className="font-mono">frontend/.env</span>) to your temple UPI address (e.g.{' '}
            <span className="font-mono">iskcon@ybl</span>). Razorpay checkout already supports UPI inside the payment window
            when keys are configured.
          </p>
        )}
      </div>
    </motion.div>
  )
}
