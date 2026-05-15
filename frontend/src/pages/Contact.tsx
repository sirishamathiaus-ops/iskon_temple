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
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">Contact</p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Visit Hare Krishna Land</h1>
          <p className="mt-4 max-w-2xl text-maroon-800/85">
            We welcome you for darshan, kirtan, and seva. For directions, use the map below or message us on WhatsApp.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-maroon-900/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl text-maroon-900">Temple address</h2>
            <address className="mt-6 not-italic text-maroon-800/90">
              {temple.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <h3 className="mt-8 font-display text-lg text-maroon-900">WhatsApp</h3>
            <ul className="mt-3 space-y-2 text-sm text-maroon-800/90">
              {temple.whatsapp.map((w) => (
                <li key={w.href}>
                  <a href={w.href} className="font-medium text-maroon-900 underline decoration-gold-500/50 hover:text-maroon-800" target="_blank" rel="noreferrer">
                    {w.display}
                  </a>
                  <span className="text-maroon-700/75"> — {w.label}</span>
                </li>
              ))}
            </ul>
            {upi && (
              <>
                <h3 className="mt-8 font-display text-lg text-maroon-900">UPI (donations)</h3>
                <p className="mt-2 font-mono text-sm text-maroon-900">{upi}</p>
                <p className="mt-1 text-xs text-maroon-700/75">Use any UPI app; please mention seva purpose in the note.</p>
              </>
            )}
            <div className="mt-8 overflow-hidden rounded-2xl border border-maroon-900/10">
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
            <p className="mt-3 text-xs text-maroon-700/70">
              Pin on the map is approximate; confirm on WhatsApp before travelling.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-3xl border border-maroon-900/10 bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl text-maroon-900">Send a message</h2>
            <label className="mt-6 block text-sm text-maroon-800/90">
              Name
              <input
                required
                className="mt-2 w-full rounded-xl border border-maroon-900/15 bg-cream-50 px-4 py-3 text-maroon-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-maroon-800/90">
              Email
              <input
                required
                type="email"
                className="mt-2 w-full rounded-xl border border-maroon-900/15 bg-cream-50 px-4 py-3 text-maroon-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-maroon-800/90">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-maroon-900/15 bg-cream-50 px-4 py-3 text-maroon-900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="mt-4 block text-sm text-maroon-800/90">
              Message
              <textarea
                required
                className="mt-2 min-h-[120px] w-full rounded-xl border border-maroon-900/15 bg-cream-50 px-4 py-3 text-maroon-900"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            {status && <p className="mt-4 text-sm text-maroon-800">{status}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-maroon-800 to-maroon-900 py-3 text-sm font-semibold text-cream-50 shadow-soft disabled:opacity-50"
            >
              {busy ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
