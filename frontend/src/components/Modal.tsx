import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  wide?: boolean
  showClose?: boolean
  closeOnBackdrop?: boolean
}

export function Modal({ open, onClose, title, children, wide, showClose, closeOnBackdrop = true }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center p-3 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {closeOnBackdrop && (
            <button
              type="button"
              className="absolute inset-0 bg-maroon-950/65 backdrop-blur-md"
              onClick={onClose}
              aria-label="Close"
            />
          )}
          {!closeOnBackdrop && <motion.div className="absolute inset-0 bg-maroon-950/65 backdrop-blur-md" aria-hidden />}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={[
              'relative z-10 max-h-[min(90vh,640px)] w-full overflow-hidden rounded-[1.75rem] border border-gold-400/35 bg-cream-50 shadow-[0_24px_80px_-16px_rgba(69,26,41,0.35)]',
              wide ? 'max-w-lg' : 'max-w-md',
            ].join(' ')}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold-100/80 to-transparent" aria-hidden />
            {(title || showClose) && (
              <div className="relative flex items-center justify-between gap-4 border-b border-maroon-900/8 bg-gradient-to-r from-cream-50 via-gold-50/40 to-cream-50 px-5 py-4 sm:px-6">
                {title ? (
                  <h2 id="modal-title" className="font-display text-xl text-maroon-900 sm:text-2xl">
                    {title}
                  </h2>
                ) : (
                  <span className="sr-only">Dialog</span>
                )}
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-tap shrink-0 rounded-full border border-maroon-900/12 bg-white px-5 py-2 text-sm font-semibold text-maroon-900 shadow-card"
                    aria-label="Close"
                  >
                    Close
                  </button>
                )}
              </div>
            )}
            <div className="relative max-h-[calc(min(90vh,640px)-4.5rem)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
