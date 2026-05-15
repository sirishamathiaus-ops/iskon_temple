import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, assetUrl } from '@/lib/api'
import { useAdminAuth } from './auth'
import type { DarshanRow, Festival, GalleryItem } from '@/types'

type Tab = 'donations' | 'festivals' | 'gallery' | 'darshan' | 'homepage' | 'contacts'

type DonationRow = {
  id: number
  category: string
  amount_paise: number
  currency: string
  donor_name: string
  donor_email: string
  donor_phone: string | null
  festival_id: number | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  status: string
  notes: string | null
  created_at: string
}

type ContactRow = {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  is_read: boolean
  created_at: string
}

type HomepageRow = { key: string; value_json: string; updated_at: string }

const homepageKeys = ['hero', 'featured_donations', 'temple_intro', 'darshan_highlight'] as const

export function AdminDashboard() {
  const { logout } = useAdminAuth()
  const [tab, setTab] = useState<Tab>('donations')

  const [donations, setDonations] = useState<DonationRow[]>([])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [darshan, setDarshan] = useState<DarshanRow[]>([])
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [hpKey, setHpKey] = useState<(typeof homepageKeys)[number]>('hero')
  const [hpJson, setHpJson] = useState('{}')
  const [msg, setMsg] = useState<string | null>(null)

  const loadDonations = useCallback(() => api.get<DonationRow[]>('/admin/donations').then((r) => setDonations(r.data)), [])
  const loadFestivals = useCallback(() => api.get<Festival[]>('/admin/festivals').then((r) => setFestivals(r.data)), [])
  const loadGallery = useCallback(() => api.get<GalleryItem[]>('/admin/gallery').then((r) => setGallery(r.data)), [])
  const loadDarshan = useCallback(() => api.get<DarshanRow[]>('/admin/darshan').then((r) => setDarshan(r.data)), [])
  const loadContacts = useCallback(() => api.get<ContactRow[]>('/admin/contacts').then((r) => setContacts(r.data)), [])
  const loadHomepage = useCallback(
    () =>
      api.get<HomepageRow[]>('/admin/homepage').then((r) => {
        const row = r.data.find((x) => x.key === hpKey)
        setHpJson(row?.value_json || '{}')
      }),
    [hpKey],
  )

  useEffect(() => {
    setMsg(null)
    if (tab === 'donations') loadDonations()
    if (tab === 'festivals') loadFestivals()
    if (tab === 'gallery') loadGallery()
    if (tab === 'darshan') loadDarshan()
    if (tab === 'contacts') loadContacts()
  }, [tab, loadDonations, loadFestivals, loadGallery, loadDarshan, loadContacts])

  useEffect(() => {
    if (tab === 'homepage') loadHomepage()
  }, [tab, hpKey, loadHomepage])

  const tabs = useMemo(
    () =>
      [
        { id: 'donations' as const, label: 'Donations' },
        { id: 'festivals' as const, label: 'Festivals' },
        { id: 'gallery' as const, label: 'Gallery' },
        { id: 'darshan' as const, label: 'Darshan' },
        { id: 'homepage' as const, label: 'Homepage' },
        { id: 'contacts' as const, label: 'Contacts' },
      ] as const,
    [],
  )

  return (
    <div className="min-h-screen bg-lotus-900 text-lotus-100">
      <header className="border-b border-white/10 bg-black/30 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-300">Seva desk</p>
            <h1 className="font-display text-2xl text-white">Admin dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
              View public site
            </Link>
            <button type="button" onClick={logout} className="rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-lotus-900">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-8">
        <aside className="flex shrink-0 flex-row flex-wrap gap-2 md:w-48 md:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={[
                'rounded-full px-4 py-2 text-left text-sm',
                tab === t.id ? 'bg-gold-500/20 text-gold-100' : 'text-lotus-200 hover:bg-white/5',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <div className="min-w-0 flex-1">
          {msg && <p className="mb-4 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-100">{msg}</p>}

          {tab === 'donations' && <DonationsPanel rows={donations} onRefresh={loadDonations} />}
          {tab === 'festivals' && <FestivalsPanel rows={festivals} onRefresh={loadFestivals} onNotify={setMsg} />}
          {tab === 'gallery' && <GalleryPanel rows={gallery} onRefresh={loadGallery} onNotify={setMsg} />}
          {tab === 'darshan' && <DarshanPanel rows={darshan} onRefresh={loadDarshan} onNotify={setMsg} />}
          {tab === 'homepage' && (
            <HomepagePanel hpKey={hpKey} setHpKey={setHpKey} hpJson={hpJson} setHpJson={setHpJson} onRefresh={loadHomepage} onNotify={setMsg} />
          )}
          {tab === 'contacts' && <ContactsPanel rows={contacts} onRefresh={loadContacts} />}
        </div>
      </div>
    </div>
  )
}

function DonationsPanel({
  rows,
  onRefresh,
}: {
  rows: DonationRow[]
  onRefresh: () => void
}) {
  async function patchStatus(id: number, status: string) {
    await api.patch(`/admin/donations/${id}`, { status })
    onRefresh()
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase text-lotus-200/80">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Donor</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b border-white/5">
              <td className="px-4 py-3">{d.id}</td>
              <td className="px-4 py-3">{d.category}</td>
              <td className="px-4 py-3">₹{(d.amount_paise / 100).toFixed(2)}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-white">{d.donor_name}</div>
                <div className="text-xs text-lotus-200/70">{d.donor_email}</div>
              </td>
              <td className="px-4 py-3">
                <select
                  className="rounded-lg border border-white/10 bg-lotus-900 px-2 py-1"
                  value={d.status}
                  onChange={(e) => patchStatus(d.id, e.target.value)}
                >
                  {['pending', 'paid', 'failed'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-xs text-lotus-200/70">{new Date(d.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FestivalsPanel({
  rows,
  onRefresh,
  onNotify,
}: {
  rows: Festival[]
  onRefresh: () => void
  onNotify: (s: string | null) => void
}) {
  const empty = {
    name: '',
    slug: '',
    event_date: '',
    short_description: '',
    description: '',
    image_url: '',
    registration_url: '',
    sponsorship_enabled: true,
    is_featured: false,
    sort_order: 0,
  }
  const [form, setForm] = useState(empty)

  async function create(e: FormEvent) {
    e.preventDefault()
    await api.post('/admin/festivals', {
      ...form,
      event_date: form.event_date || null,
      end_date: null,
    })
    onNotify('Festival created')
    setForm(empty)
    onRefresh()
  }

  async function remove(id: number) {
    if (!confirm('Delete festival?')) return
    await api.delete(`/admin/festivals/${id}`)
    onRefresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={create} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-xl text-white">Add festival</h2>
        <input
          required
          placeholder="Name"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="slug-url-safe"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <input
          type="date"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
        />
        <input
          placeholder="Image URL"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <input
          placeholder="Registration URL"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.registration_url}
          onChange={(e) => setForm({ ...form, registration_url: e.target.value })}
        />
        <textarea
          placeholder="Short description"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
        />
        <textarea
          placeholder="Full description"
          className="min-h-[100px] rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.sponsorship_enabled}
            onChange={(e) => setForm({ ...form, sponsorship_enabled: e.target.checked })}
          />
          Sponsorship in donation dropdown
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
          Featured on home
        </label>
        <button type="submit" className="md:col-span-2 rounded-full bg-gold-500 py-2 text-sm font-semibold text-lotus-900">
          Save festival
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-lotus-200/80">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sponsor</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b border-white/5">
                <td className="px-4 py-3">{f.name}</td>
                <td className="px-4 py-3 text-xs">{f.slug}</td>
                <td className="px-4 py-3">{f.sponsorship_enabled ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="text-red-300 hover:underline" onClick={() => remove(f.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GalleryPanel({
  rows,
  onRefresh,
  onNotify,
}: {
  rows: GalleryItem[]
  onRefresh: () => void
  onNotify: (s: string | null) => void
}) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')

  async function addManual(e: FormEvent) {
    e.preventDefault()
    await api.post('/admin/gallery', { url, title: title || null, media_type: 'image' })
    setUrl('')
    setTitle('')
    onNotify('Gallery item added')
    onRefresh()
  }

  async function uploadFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const file = fd.get('file') as File | null
    if (!file || !file.size) return
    const up = new FormData()
    up.append('file', file)
    await api.post('/admin/gallery/upload', up, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { title: uploadTitle || undefined },
    })
    e.currentTarget.reset()
    setUploadTitle('')
    onNotify('Uploaded')
    onRefresh()
  }

  async function del(id: number) {
    if (!confirm('Remove gallery item?')) return
    await api.delete(`/admin/gallery/${id}`)
    onRefresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={uploadFile} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-xl text-white">Upload image</h2>
        <input
          placeholder="Title (optional)"
          className="mt-4 w-full rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 text-sm"
          value={uploadTitle}
          onChange={(e) => setUploadTitle(e.target.value)}
        />
        <input name="file" type="file" accept="image/*" className="mt-4 block text-sm" />
        <button type="submit" className="mt-4 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-lotus-900">
          Upload
        </button>
      </form>
      <form onSubmit={addManual} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-xl text-white">Add by URL (image or hosted video)</h2>
        <input
          required
          placeholder="https://..."
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          placeholder="Title"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="md:col-span-2 rounded-full bg-white py-2 text-sm font-semibold text-lotus-900">
          Add URL
        </button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-2xl border border-white/10">
            <img src={assetUrl(g.url)} alt="" className="h-36 w-full object-cover" />
            <div className="flex items-center justify-between gap-2 p-3 text-xs">
              <span className="truncate">{g.title || g.url}</span>
              <button type="button" className="text-red-300" onClick={() => del(g.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DarshanPanel({
  rows,
  onRefresh,
  onNotify,
}: {
  rows: DarshanRow[]
  onRefresh: () => void
  onNotify: (s: string | null) => void
}) {
  const [form, setForm] = useState({
    section: 'daily_pooja',
    title: '',
    time_label: '',
    day_note: '',
    sort_order: 0,
  })

  async function add(e: FormEvent) {
    e.preventDefault()
    await api.post('/admin/darshan', form)
    setForm({ ...form, title: '', time_label: '', day_note: '' })
    onNotify('Timing added')
    onRefresh()
  }

  async function del(id: number) {
    await api.delete(`/admin/darshan/${id}`)
    onRefresh()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-xl text-white">Add timing</h2>
        <select
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
          value={form.section}
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        >
          <option value="daily_pooja">Daily pooja</option>
          <option value="aarti">Aarti</option>
          <option value="special">Special</option>
        </select>
        <input
          placeholder="Sort order"
          type="number"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
        />
        <input
          required
          placeholder="Title"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          required
          placeholder="Time label e.g. 6:00 AM – 8:00 AM"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.time_label}
          onChange={(e) => setForm({ ...form, time_label: e.target.value })}
        />
        <input
          placeholder="Day note (optional)"
          className="rounded-xl border border-white/10 bg-lotus-900 px-3 py-2 md:col-span-2"
          value={form.day_note}
          onChange={(e) => setForm({ ...form, day_note: e.target.value })}
        />
        <button type="submit" className="md:col-span-2 rounded-full bg-gold-500 py-2 text-sm font-semibold text-lotus-900">
          Add
        </button>
      </form>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
            <div>
              <span className="text-xs uppercase text-gold-300/90">{r.section}</span>
              <div className="font-medium text-white">{r.title}</div>
              <div className="text-lotus-200/80">{r.time_label}</div>
            </div>
            <button type="button" className="text-red-300" onClick={() => del(r.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function HomepagePanel({
  hpKey,
  setHpKey,
  hpJson,
  setHpJson,
  onRefresh,
  onNotify,
}: {
  hpKey: (typeof homepageKeys)[number]
  setHpKey: (k: (typeof homepageKeys)[number]) => void
  hpJson: string
  setHpJson: (s: string) => void
  onRefresh: () => void
  onNotify: (s: string | null) => void
}) {
  async function save(e: FormEvent) {
    e.preventDefault()
    await api.put('/admin/homepage', { key: hpKey, value_json: hpJson })
    onNotify('Homepage block saved')
    onRefresh()
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display text-xl text-white">Homepage JSON blocks</h2>
      <select
        className="w-full rounded-xl border border-white/10 bg-lotus-900 px-3 py-2"
        value={hpKey}
        onChange={(e) => setHpKey(e.target.value as (typeof homepageKeys)[number])}
      >
        {homepageKeys.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <textarea
        className="min-h-[240px] w-full rounded-xl border border-white/10 bg-lotus-900 p-4 font-mono text-xs"
        value={hpJson}
        onChange={(e) => setHpJson(e.target.value)}
      />
      <button type="submit" className="rounded-full bg-gold-500 px-6 py-2 text-sm font-semibold text-lotus-900">
        Save block
      </button>
    </form>
  )
}

function ContactsPanel({ rows, onRefresh }: { rows: ContactRow[]; onRefresh: () => void }) {
  async function mark(id: number) {
    await api.patch(`/admin/contacts/${id}/read`)
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {rows.map((c) => (
        <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-medium text-white">{c.name}</span>
              <span className="text-lotus-200/70"> — {c.email}</span>
            </div>
            {!c.is_read && (
              <button type="button" className="text-gold-300 hover:underline" onClick={() => mark(c.id)}>
                Mark read
              </button>
            )}
          </div>
          {c.phone && <p className="mt-1 text-xs text-lotus-200/70">{c.phone}</p>}
          <p className="mt-3 whitespace-pre-wrap text-lotus-100/85">{c.message}</p>
          <p className="mt-2 text-xs text-lotus-200/50">{new Date(c.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
