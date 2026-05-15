import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminAuth } from './auth'

export function AdminLoginPage() {
  const { login } = useAdminAuth()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await login(u, p)
    } catch {
      setErr('Invalid credentials')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-lotus-900 px-4">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-soft"
      >
        <p className="text-xs uppercase tracking-widest text-gold-300">Protected</p>
        <h1 className="mt-2 font-display text-3xl text-white">Temple office login</h1>
        <p className="mt-2 text-sm text-lotus-200/70">This area is not linked from the public site.</p>
        <label className="mt-8 block text-sm text-lotus-200">
          Username
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
            value={u}
            onChange={(e) => setU(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="mt-4 block text-sm text-lotus-200">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-white/10 bg-lotus-900 px-4 py-3 text-white"
            value={p}
            onChange={(e) => setP(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {err && <p className="mt-4 text-sm text-red-300">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 py-3 text-sm font-semibold text-lotus-900 disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className="mt-6 block text-center text-sm text-gold-200/80 hover:text-gold-100">
          ← Back to site
        </Link>
      </motion.form>
    </div>
  )
}
