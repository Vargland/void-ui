import { useEffect, useId, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ModalProps } from '../../typings/components/modal'
import { cn } from '../../helpers/classnames'
import styles from './modal.module.scss'

// ─── Focusable selector ───────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ')

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  planet,
  className,
  'data-testid': testId = 'modal',
}: ModalProps) {
  const titleId       = useId()
  const descriptionId = useId()
  const dialogRef     = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  // ─── Focus trap & body scroll lock ────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return

    // Store element that had focus before the modal opened
    previousFocus.current = document.activeElement as HTMLElement

    // Lock body scroll
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus first focusable element inside the dialog
    const frame = requestAnimationFrame(() => {
      if (!dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      const first = focusable[0]
      if (first) {
        first.focus()
      } else {
        dialogRef.current.focus()
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow

      // Restore focus to the element that was active before opening
      if (previousFocus.current && typeof previousFocus.current.focus === 'function') {
        previousFocus.current.focus()
      }
    }
  }, [isOpen])

  // ─── Escape key (document-level listener) ────────────────────────────────

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // ─── Tab trap ────────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
        ).filter(el => !el.closest('[hidden]'))

        if (focusable.length === 0) {
          event.preventDefault()
          return
        }

        const first = focusable[0]!
        const last  = focusable[focusable.length - 1]!

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }
    },
    [],
  )

  // ─── Overlay click ────────────────────────────────────────────────────────

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose()
      }
    },
    [closeOnOverlayClick, onClose],
  )

  // ─── Guard ────────────────────────────────────────────────────────────────

  if (!isOpen) return null

  // ─── Dialog ───────────────────────────────────────────────────────────────

  const dialog = (
    <div
      className={styles.overlay}
      data-testid={`${testId}-overlay`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        data-testid={testId}
        tabIndex={-1}
        className={cn(
          styles.dialog,
          styles[`size-${size}`],
          className,
        )}
      >
        {/* Header */}
        {(title !== undefined) && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close dialog"
              data-testid={`${testId}-close`}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Accessible description (visually hidden) */}
        {description && (
          <span id={descriptionId} style={{ display: 'none' }}>
            {description}
          </span>
        )}

        {/* Body */}
        {children !== undefined && (
          <div className={styles.body} data-testid={`${testId}-body`}>
            {children}
          </div>
        )}

        {/* Footer */}
        {footer !== undefined && (
          <div className={styles.footer} data-testid={`${testId}-footer`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  // ─── Planet wrapper ───────────────────────────────────────────────────────

  const content = planet
    ? <div data-void-planet={planet}>{dialog}</div>
    : dialog

  return createPortal(content, document.body)
}
