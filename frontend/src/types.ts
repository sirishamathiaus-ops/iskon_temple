export type Festival = {
  id: number
  name: string
  slug: string
  event_date: string | null
  end_date: string | null
  short_description: string | null
  description: string | null
  image_url: string | null
  registration_url: string | null
  sponsorship_enabled: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}

export type DarshanRow = {
  id: number
  section: string
  title: string
  time_label: string
  day_note: string | null
  sort_order: number
}

export type GalleryItem = {
  id: number
  media_type: string
  url: string
  thumbnail_url: string | null
  title: string | null
  caption: string | null
  sort_order: number
  created_at: string
}

export type DonationCategory =
  | 'annadanam'
  | 'care_cow'
  | 'temple_construction'
  | 'festival_sponsorship'
  | 'one_time'
  | 'monthly'
