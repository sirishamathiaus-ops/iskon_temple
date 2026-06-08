import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { mergeFestivals } from '@/lib/festivals'
import type { Festival } from '@/types'

export function useFestivals() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<Festival[]>('/public/festivals')
      .then((r) => setFestivals(mergeFestivals(r.data)))
      .catch(() => setFestivals(mergeFestivals([])))
      .finally(() => setLoading(false))
  }, [])

  return { festivals, loading }
}
