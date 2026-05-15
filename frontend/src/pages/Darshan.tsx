import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Seo } from '@/components/Seo'
import type { DarshanRow } from '@/types'

const labels: Record<string, string> = {
  daily_pooja: 'Daily pooja',
  aarti: 'Aarti schedule',
  special: 'Special darshan',
}

export function DarshanPage() {
  const [rows, setRows] = useState<DarshanRow[]>([])

  useEffect(() => {
    api.get<DarshanRow[]>('/public/darshan').then((r) => setRows(r.data))
  }, [])

  const grouped = rows.reduce<Record<string, DarshanRow[]>>((acc, r) => {
    acc[r.section] = acc[r.section] || []
    acc[r.section].push(r)
    return acc
  }, {})

  return (
    <>
      <Seo title="Daily Darshan" description="Pooja timings, aarti schedule, and special darshan at our temple." />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-maroon-700/80">Darshan</p>
          <h1 className="mt-3 font-display text-4xl text-maroon-900 md:text-5xl">Daily worship & arati</h1>
          <p className="mt-4 max-w-2xl text-maroon-800/85">
            Timings are maintained by the temple office and can be updated from the admin dashboard. Please arrive a few minutes
            early for arati.
          </p>
        </motion.div>

        <div className="mt-14 space-y-14">
          {['daily_pooja', 'aarti', 'special'].map((key) => {
            const list = grouped[key]
            if (!list?.length) return null
            return (
              <section key={key}>
                <h2 className="font-display text-2xl text-maroon-900">{labels[key] || key}</h2>
                <div className="mt-6 divide-y divide-maroon-900/10 rounded-2xl border border-maroon-900/10 bg-white shadow-card">
                  {list.map((r) => (
                    <div key={r.id} className="flex flex-col gap-1 px-6 py-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium text-maroon-900">{r.title}</p>
                        {r.day_note && <p className="text-sm text-saffron-600">{r.day_note}</p>}
                      </div>
                      <p className="font-semibold text-maroon-800">{r.time_label}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
