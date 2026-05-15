import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '@/lib/api'
import { Seo } from '@/components/Seo'
import { getUpiId, temple } from '@/content/temple'

const mapSrc =
  'https://www.google.com/maps?q=ISKCON+Dornala+Hare+Krishna+Land+Dornala+Andhra+Pradesh+523331&output=embed'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const upi = getUpiId()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      await api.post('/public/contact', { name, email, phone: phone || undefined, message })
      setStatus('Thank you. Your message has been received.')
      setMessage('')
    } catch {
      setStatus('Could not send right now. Please WhatsApp the temple numbers below.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Contact — ISKCON Dornala"
        description="Sri Jagannath Temple, Hare Krishna Land, Srisailam Road, Dornala — map, WhatsApp, and contact form."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Contact</p>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">Visit Hare Krishna Land</h1>
          <p className="mt-4 max-w-2xl text-lotus-100/85">
            We welcome you for darshan, kirtan, and seva. For directions, use the map below or message us on WhatsApp.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="font-display text-2xl text-white">Temple address</h2>
            <address className="mt-6 not-italic text-lotus-100/85">
              {temple.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <h3 className="mt-8 font-display text-lg text-gold-200">WhatsApp</h3>
            <ul className="mt-3 space-y-2 text-sm text-lotus-100/85">
              {temple.whatsapp.map((w) => (
                <li key={w.href}>
                  <a href={w.href} className="font-medium text-gold-200 hover:text-gold-100" target="_blank" rel="noreferrer">
                    {w.display}
                  </a>
                  <span className="text-lotus-200/70"> — {w.label}</span>
                </li>
              ))}
            </ul>
            {upi && (
              <>
                <h3 className="mt-8 font-display text-lg text-gold-200">UPI (donations)</h3>
                <p className="mt-2 font-mono text-sm text-white">{upi}</p>
                <p className="mt-1 text-xs text-lotus-200/65">Use any UPI app; please mention seva purpose in the note.</p>
              </>
            )}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="ISKCON Dornala map"
                src={mapSrc}
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-xs text-lotus-200/60">
              Pin on the map is approximate; confirm on WhatsApp before travelling.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="font-display text-2xl text-white">Send a message</h2>
            <label className="mt-6 block text-sm text-lotus-200/90">
              Name
              <input
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Email
              <input
                required
                type="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-lotus-200/90">
              Message
              <textarea
                required
                className="mt-2 min-h-[120px] w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            {status && <p className="mt-4 text-sm text-gold-200">{status}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
