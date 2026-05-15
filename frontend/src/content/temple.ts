/** ISKCON Dornala — Sri Jagannath Temple. Set `VITE_UPI_ID`, `VITE_UPI_QR_URL` in `frontend/.env` for UPI display. */

export const temple = {
  shortName: 'ISKCON Dornala',
  fullName: 'ISKCON Dornala — Sri Jagannath Temple',
  tagline: 'Hare Krishna Land • Srisailam Road',
  addressLines: [
    'ISKCON Dornala, Sri Jagannath Temple',
    'Hare Krishna Land, Srisailam Road',
    'Dornala, Markapuram (Prakasam District)',
    'Andhra Pradesh — 523331',
  ],
  whatsapp: [
    { label: 'Seva desk', href: 'https://wa.me/919133207358', display: '+91 91332 07358' },
    { label: 'Temple', href: 'https://wa.me/918919210189', display: '+91 89192 10189' },
  ],
  bank: {
    bankName: 'Union Bank of India',
    accountName: 'ISKCON DORNALA',
    accountNumber: '309612010001416',
    ifsc: 'UBIN0830968',
    branch: 'Dornala Branch, Prakasam District, Andhra Pradesh',
  },
  programs: [
    { title: 'Tribal care', description: 'Outreach and support for neighbouring tribal communities.' },
    {
      title: 'Srisailam yatrikas — free food',
      description: 'Annadanam and prasadam for pilgrims on the Srisailam route.',
    },
    { title: 'School children’s programs', description: 'Values-based learning and spiritual culture for young minds.' },
    { title: 'Congregation programs', description: 'Kirtan, classes, and festivals for families and seekers.' },
  ],
} as const

export function getUpiId(): string {
  return (import.meta.env.VITE_UPI_ID as string | undefined)?.trim() || ''
}

export function getUpiPayeeName(): string {
  return (import.meta.env.VITE_UPI_PAYEE_NAME as string | undefined)?.trim() || temple.shortName
}

/** Public URL of the temple UPI QR image (PNG/JPG), shown on the donate flow. */
export function getUpiQrUrl(): string {
  return (import.meta.env.VITE_UPI_QR_URL as string | undefined)?.trim() || ''
}
