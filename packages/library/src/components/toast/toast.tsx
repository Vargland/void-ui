import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ToastProps, ToastContainerProps, ToastVariant } from '../../typings/components/toast'
import { cn } from '../../helpers/classnames'
import styles from './toast.module.scss'

// ─── Icons ────────────────────────────────────────────────────────────────────

const VARIANT_ICONS: Record<ToastVariant, string | null> = {
  default: null,
  success: '✓',
  error:   '✗',
  warning: '⚠',
  info:    'ℹ',
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({
  title,
  description,
  variant   = 'default',
  duration  = 5000,
  onClose,
  action,
  planet,
  className,
  'data-testid': testId = 'toast',
}: ToastProps) {
  const [exiting, setExiting] = useState(false)
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null)
  const icon                  = VARIANT_ICONS[variant]

  // ─── Handle dismiss with exit animation ───────────────────────────────────

  function handleDismiss() {
    if (exiting) {
                   return
                 }

    setExiting(true)

    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose?.()
    }, 200)
  }

  // ─── Auto-dismiss timer ───────────────────────────────────────────────────

  useEffect(() => {
    if (duration === 0) {
                          return
                        }

    timerRef.current = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  // ─── Rendered element ─────────────────────────────────────────────────────

  const toast = (
    <div
      data-testid={testId}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        styles.toast,
        styles[`variant-${variant}`],
        exiting && styles.exiting,
        className,
      )}
    >
      {/* Icon */}
      {icon !== null && (
        <span
          className={styles.icon}
          aria-hidden="true"
          data-testid={`${testId}-icon`}
        >
          {icon}
        </span>
      )}

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.title} data-testid={`${testId}-title`}>
          {title}
        </p>

        {description && (
          <p
            className={styles.description}
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        )}

        {/* Action */}
        {action && (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.action}
              onClick={action.onClick}
              data-testid={`${testId}-action`}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        data-testid={`${testId}-close`}
      >
        ×
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className={styles.progress} aria-hidden="true">
          <div
            className={styles.progressBar}
            data-testid={`${testId}-progress`}
            style={{
              animation: `void-toast-progress ${duration}ms linear both`,
            }}
          />
        </div>
      )}
    </div>
  )

  if (planet) {
    return <div data-void-planet={planet}>{toast}</div>
  }

  return toast
}

// ─── ToastContainer ───────────────────────────────────────────────────────────

export function ToastContainer({
  toasts,
  onDismiss,
  position  = 'bottom-right',
  planet,
  className,
  'data-testid': testId = 'toast-container',
}: ToastContainerProps) {
  const container = (
    <div
      data-testid={testId}
      className={cn(
        styles.container,
        styles[`position-${position}`],
        className,
      )}
      aria-label="Notifications"
    >
      {toasts.map(item => (
        <Toast
          key={item.id}
          title={item.title}
          variant={item.variant}
          duration={item.duration}
          onClose={() => onDismiss(item.id)}
          data-testid={`toast-${item.id}`}
          {...(item.description !== undefined && { description: item.description })}
          {...(item.action !== undefined && { action: item.action })}
        />
      ))}
    </div>
  )

  if (typeof document === 'undefined') {
    return null
  }

  const portal = createPortal(container, document.body)

  if (planet) {
    return <div data-void-planet={planet}>{portal}</div>
  }

  return portal
}
