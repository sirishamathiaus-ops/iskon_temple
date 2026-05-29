import type { ReactNode } from 'react'

type Variant = 'success' | 'error' | 'info'

const styles: Record<Variant, string> = {
  success: 'border-emerald-300/50 bg-emerald-50 text-emerald-900',
  error: 'border-red-300/50 bg-red-50 text-red-900',
  info: 'border-gold-400/40 bg-gold-50/80 text-maroon-900',
}

export function PaymentStatusBanner({
  variant,
  title,
  children,
  onClose,
}: {
  variant: Variant
  title: string
  children?: ReactNode
  onClose?: () => void
}) {
  return (
    <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${styles[variant]}`} role="status">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg">{title}</p>
          {children && <div className="mt-2 text-sm leading-relaxed opacity-90">{children}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-tap shrink-0 rounded-full px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}
