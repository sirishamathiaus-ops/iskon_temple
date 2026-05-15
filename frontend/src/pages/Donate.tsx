import { motion } from 'framer-motion'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { api, assetUrl } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { Modal } from '@/components/Modal'
import { getUpiId, getUpiPayeeName, temple } from '@/content/temple'
import { UPI_QR_STATIC } from '@/content/siteMedia'
import type { DonationCategory, Festival } from '@/types'

type TempleSettings = { upi_qr_url: string | null }
type PaymentMethod = 'upi' | 'bank'

const SUCCESS_MSG =
  'Thank you for your donation. May Lord Krishna bless you and your family with peace, prosperity, and divine blessings.'

const categories: { id: DonationCategory; label: string; blurb: string }[] = [
  { id: 'annadanam', label: 'Annadanam Donation', blurb: 'Sponsor prasadam for pilgrims and festival feasts.' },
  { id: 'care_cow', label: 'Care for Cows', blurb: 'Support goshala care and compassionate cow protection.' },
  { id: 'temple_construction', label: 'Temple Construction Fund', blurb: 'Build Sri Jagannath Temple at Hare Krishna Land.' },
  { id: 'festival_sponsorship', label: 'Festival Sponsorship', blurb: 'Sponsor abhishekam, flowers, or feast for a festival.' },
  { id: 'one_time', label: 'One-time Donation', blurb: 'A single offering toward general temple operations.' },
  { id: 'monthly', label: 'Monthly Donation', blurb: 'Recurring monthly support — mention “monthly” in your transfer note.' },
]

function maskAccountNumber(value: string): string {
  const digits = value.replace(/\s/g, '')
  if (digits.length <= 4) return '••••'
  return `•••• •••• ${digits.slice(-4)}`
}

function maskIfsc(value: string): string {
  if (value.length <= 4) return '••••'
  return `${value.slice(0, 4)}•••${value.slice(-2)}`
}

export function DonatePage() {
  const location = useLocation() as { state?: { category?: DonationCategory; festivalId?: number } }
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [templeSettings, setTempleSettings] = useState<TempleSettings>({ upi_qr_url: null })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [category, setCategory] = useState<DonationCategory>('annadanam')
  const [festivalId, setFestivalId] = useState<number | ''>('')
  const [amount, setAmount] = useState('501')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showUpiModal, setShowUpiModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    api.get<Festival[]>('/public/festivals-sponsorship/list').then((r) => setFestivals(r.data))
    api.get<TempleSettings>('/public/temple-settings').then((r) => setTempleSettings(r.data))
  }, [])

  useEffect(() => {
    const st = location.state
    if (st?.category) setCategory(st.category)
    if (st?.festivalId) setFestivalId(st.festivalId)
  }, [location.state])

  const selected = useMemo(() => categories.find((c) => c.id === category), [category])
  const qrUrl = templeSettings.upi_qr_url || UPI_QR_STATIC
  const upi = getUpiId()
  const payee = getUpiPayeeName()
  const amountLabel = `₹${Number(amount || 0).toLocaleString('en-IN')}`

  function validateForm(): boolean {
    setError(null)
    if (!donorName.trim()) {
      setError('Please enter your name.')
      return false
    }
    if (category === 'festival_sponsorship' && !festivalId) {
      setError('Please select a festival for sponsorship.')
      return false
    }
    if (Number(amount) < 1) {
      setError('Please enter a valid amount.')
      return false
    }
    return true
  }

  function showBlessing() {
    setShowUpiModal(false)
    setShowBankModal(false)
    setShowSuccess(true)
  }

  function openUpiFlow() {
    if (!validateForm()) return
    setShowUpiModal(true)
  }

  function openBankFlow() {
    if (!validateForm()) return
    setShowBankModal(true)
  }

  function handlePrimaryAction() {
    if (!validateForm()) return
    if (paymentMethod === 'upi') openUpiFlow()
    else openBankFlow()
  }

  return (
    <>
      <Seo title="Donate — ISKCON Dornala" description="Secure UPI and bank transfer seva for ISKCON Dornala Sri Jagannath Temple." />
      <section className="border-b border-maroon-900/10 bg-gradient-to-b from-cream-100 via-cream-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 md:px-6 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon-700/80 sm:text-sm">Seva</p>
          <h1 className="mt-3 font-display text-3xl text-maroon-900 sm:text-4xl md:text-5xl">Offer your seva</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-maroon-800/85 sm:text-base">
            Choose a seva, enter your details, and complete your offering through our secure UPI or official temple bank account.
          </p>
          <motion.div
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900 sm:text-sm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure temple donations — verified official account only
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        {error && !showUpiModal && !showBankModal && (
          <p className="mt-6 rounded-2xl border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-xl text-maroon-900">Select seva</h2>
            <div className="mt-4 space-y-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={[
                    'btn-tap w-full rounded-2xl border px-4 py-4 text-left sm:rounded-3xl sm:px-5',
                    category === c.id
                      ? 'border-gold-500/50 bg-white shadow-gold ring-1 ring-gold-200'
                      : 'card-premium border-maroon-900/10 hover:border-gold-400/40',
                  ].join(' ')}
                >
                  <p className="font-display text-base text-maroon-900 sm:text-lg">{c.label}</p>
                  <p className="mt-1 text-sm text-maroon-800/75">{c.blurb}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div className="space-y-5 sm:space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="card-premium p-5 sm:p-6 md:p-8">
              <h2 className="font-display text-xl text-maroon-900 sm:text-2xl">Your details</h2>
              <p className="mt-1 text-sm text-maroon-700/75">Required before proceeding to payment.</p>

              {category === 'festival_sponsorship' && (
                <label className="mt-5 block text-sm font-medium text-maroon-800">
                  Festival
                  <select className="input-premium" value={festivalId} onChange={(e) => setFestivalId(e.target.value ? Number(e.target.value) : '')}>
                    <option value="">Select festival</option>
                    {festivals.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="mt-5 block text-sm font-medium text-maroon-800">
                Amount (INR)
                <input type="number" min={1} className="input-premium" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <label className="mt-4 block text-sm font-medium text-maroon-800">
                Full name <span className="text-red-600">*</span>
                <input required autoComplete="name" className="input-premium" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
              </label>
              <label className="mt-4 block text-sm font-medium text-maroon-800">
                Email <span className="font-normal text-maroon-600/70">(optional)</span>
                <input type="email" autoComplete="email" className="input-premium" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} />
              </label>
              <label className="mt-4 block text-sm font-medium text-maroon-800">
                Phone <span className="font-normal text-maroon-600/70">(optional)</span>
                <input type="tel" autoComplete="tel" className="input-premium" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
              </label>
              <label className="mt-4 block text-sm font-medium text-maroon-800">
                Note <span className="font-normal text-maroon-600/70">(optional)</span>
                <textarea
                  className="input-premium min-h-[72px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. In memory of…, monthly pledge, festival seva"
                />
              </label>
            </div>

            <div className="card-premium p-5 sm:p-6 md:p-8">
              <h2 className="font-display text-xl text-maroon-900">Payment method</h2>
              <p className="mt-1 text-sm text-maroon-700/75">Select how you would like to offer your seva.</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                <PaymentMethodCard
                  active={paymentMethod === 'upi'}
                  title="UPI"
                  subtitle="Fast & secure — scan QR"
                  badge="Recommended"
                  onSelect={() => setPaymentMethod('upi')}
                />
                <PaymentMethodCard
                  active={paymentMethod === 'bank'}
                  title="Bank transfer"
                  subtitle="NEFT / IMPS / RTGS"
                  onSelect={() => setPaymentMethod('bank')}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-gold-400/25 bg-gradient-to-br from-gold-50/70 to-cream-50 p-4 text-sm text-maroon-800/90">
                {paymentMethod === 'upi' ? (
                  <>
                    <p className="font-medium text-maroon-900">UPI payment</p>
                    <p className="mt-1">Opens a secure popup with the official temple QR code.</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-maroon-900">Bank transfer</p>
                    <p className="mt-1">Opens a secure popup with official temple account details.</p>
                  </>
                )}
              </div>

              <button
                type="button"
                disabled={!donorName.trim()}
                onClick={handlePrimaryAction}
                className="btn-primary-gold mt-6"
              >
                {paymentMethod === 'upi' ? 'Donate via UPI' : 'View bank details'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Modal open={showUpiModal} onClose={showBlessing} title="Donate via UPI" wide showClose closeOnBackdrop={false}>
        <p className="text-sm leading-relaxed text-maroon-800/90">
          Scan this QR code with your UPI app. Suggested amount: <strong className="text-maroon-900">{amountLabel}</strong>
          {selected ? (
            <>
              {' '}
              for <strong className="text-maroon-900">{selected.label}</strong>
            </>
          ) : null}
          .
        </p>
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-gold-400/35 bg-gradient-to-b from-cream-50 to-gold-50/90 p-5 shadow-inner sm:p-6">
          <img
            src={assetUrl(qrUrl)}
            alt="Official temple UPI QR code"
            className="h-52 w-52 max-w-full rounded-2xl border border-maroon-900/10 bg-white object-contain p-3 sm:h-60 sm:w-60"
          />
          {upi && (
            <div className="mt-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-maroon-700/75">Official UPI ID</p>
              <p className="mt-1 font-mono text-sm font-semibold text-maroon-900">{upi}</p>
              <p className="text-xs text-maroon-700/70">Payee: {payee}</p>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={showBankModal} onClose={showBlessing} title="Bank transfer" wide showClose closeOnBackdrop={false}>
        <p className="text-sm leading-relaxed text-maroon-800/90">
          Transfer from your bank&apos;s secure app or branch. Suggested amount:{' '}
          <strong className="text-maroon-900">{amountLabel}</strong>
          {selected ? (
            <>
              {' '}
              for <strong className="text-maroon-900">{selected.label}</strong>
            </>
          ) : null}
          . Include your name in the payment reference.
        </p>
        <BankDetailsPanel className="mt-5" inModal />
      </Modal>

      <Modal open={showSuccess} onClose={() => setShowSuccess(false)} title="Thank you" showClose>
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-200 to-gold-400 text-3xl shadow-gold" aria-hidden>
            🙏
          </div>
          <p className="mt-6 text-base leading-relaxed text-maroon-800/90">{SUCCESS_MSG}</p>
        </div>
      </Modal>
    </>
  )
}

function PaymentMethodCard({
  active,
  title,
  subtitle,
  badge,
  onSelect,
}: {
  active: boolean
  title: string
  subtitle: string
  badge?: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={[
        'btn-tap relative rounded-2xl border px-4 py-4 text-left',
        active
          ? 'border-gold-500/60 bg-gold-50/60 shadow-gold ring-2 ring-gold-300/40'
          : 'border-maroon-900/10 bg-cream-50 hover:border-gold-400/40',
      ].join(' ')}
    >
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-maroon-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream-50">
          {badge}
        </span>
      )}
      <p className="font-display text-lg text-maroon-900">{title}</p>
      <p className="mt-0.5 text-sm text-maroon-700/75">{subtitle}</p>
    </button>
  )
}

function BankDetailsPanel({ className = '', inModal }: { className?: string; inModal?: boolean }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2200)
    } catch {
      setCopied(null)
    }
  }

  const { bank } = temple

  return (
    <div
      className={[
        'rounded-2xl border border-maroon-900/10 bg-white/90 p-5 shadow-inner',
        inModal ? '' : 'bg-cream-50/80',
        className,
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-800 to-maroon-900 text-cream-50 shadow-soft" aria-hidden>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M5 10V19a1 1 0 001 1h12a1 1 0 001-1V10M9 14h6" />
          </svg>
        </div>
        <div>
          <p className="font-display text-base text-maroon-900">Official temple bank account</p>
          <p className="mt-0.5 text-xs text-maroon-700/75">NEFT · IMPS · RTGS — use only this registered account</p>
        </div>
      </div>

      <dl className="mt-5 space-y-4 text-sm">
        <BankRow label="Account name" value={bank.accountName} />
        <BankRow
          label="Account number"
          value={revealed ? bank.accountNumber : maskAccountNumber(bank.accountNumber)}
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="btn-tap rounded-full border border-maroon-900/12 bg-cream-50 px-3 py-1.5 text-xs font-semibold text-maroon-900"
              >
                {revealed ? 'Hide' : 'Reveal'}
              </button>
              {revealed && (
                <button
                  type="button"
                  onClick={() => copy(bank.accountNumber, 'ac')}
                  className="btn-tap rounded-full border border-gold-500/40 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-maroon-900"
                >
                  {copied === 'ac' ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          }
        />
        <BankRow
          label="IFSC code"
          value={revealed ? bank.ifsc : maskIfsc(bank.ifsc)}
          action={
            revealed ? (
              <button
                type="button"
                onClick={() => copy(bank.ifsc, 'ifsc')}
                className="btn-tap rounded-full border border-gold-500/40 bg-gold-50 px-3 py-1.5 text-xs font-semibold text-maroon-900"
              >
                {copied === 'ifsc' ? 'Copied' : 'Copy'}
              </button>
            ) : null
          }
        />
        <BankRow label="Bank" value={bank.bankName} />
        <BankRow label="Branch" value={bank.branch} />
      </dl>
    </div>
  )
}

function BankRow({ label, value, action }: { label: string; value: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-maroon-900/8 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wider text-maroon-700/70">{label}</dt>
        <dd className="mt-1 font-medium text-maroon-900">{value}</dd>
      </div>
      {action}
    </div>
  )
}
