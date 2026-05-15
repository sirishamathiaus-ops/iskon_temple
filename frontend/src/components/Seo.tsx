import { useEffect } from 'react'

type SeoProps = {
  title: string
  description?: string
}

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    const prev = document.title
    document.title = title.includes('ISKCON') ? title : `${title} | ISKCON Dornala`
    let meta = document.querySelector('meta[name="description"]')
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
    return () => {
      document.title = prev
    }
  }, [title, description])
  return null
}
