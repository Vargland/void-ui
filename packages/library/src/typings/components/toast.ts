import type { ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Variant ─────────────────────────────────────────────────────────────────

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

// ─── Position ─────────────────────────────────────────────────────────────────

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

// ─── Action ───────────────────────────────────────────────────────────────────

export interface ToastAction {
  /** Label displayed on the action button */
  label: string
  /** Callback fired when the action button is clicked */
  onClick: () => void
}

// ─── ToastItem ────────────────────────────────────────────────────────────────

export interface ToastItem {
  /** Unique identifier for the toast */
  id: string
  /** Title text of the toast */
  title: string
  /** Optional supporting description text */
  description?: string
  /** Semantic variant controlling color and icon */
  variant: ToastVariant
  /** Auto-dismiss duration in ms; 0 means no auto-dismiss */
  duration: number
  /** Optional action button configuration */
  action?: ToastAction
}

// ─── ToastProps ───────────────────────────────────────────────────────────────

export interface ToastProps extends BaseComponentProps {
  /** Title text of the toast */
  title: string
  /** Optional supporting description text */
  description?: string
  /** Semantic variant controlling color and icon */
  variant?: ToastVariant
  /** Auto-dismiss duration in ms; 0 means no auto-dismiss */
  duration?: number
  /** Callback fired when the toast is dismissed */
  onClose?: () => void
  /** Optional action button configuration */
  action?: ToastAction
}

// ─── ToastContainerProps ──────────────────────────────────────────────────────

export interface ToastContainerProps extends BaseComponentProps {
  /** List of toast items to render */
  toasts: ToastItem[]
  /** Callback fired when a specific toast is dismissed */
  onDismiss: (id: string) => void
  /** Position of the toast container on screen */
  position?: ToastPosition
}

// ─── useToast return type ─────────────────────────────────────────────────────

export interface ToastOptions {
  /** Optional supporting description text */
  description?: string
  /** Auto-dismiss duration in ms; 0 means no auto-dismiss (default: 5000) */
  duration?: number
  /** Optional action button configuration */
  action?: ToastAction
}

export interface ToastMethods {
  /** Add a toast and return its id */
  (title: string, options?: ToastOptions & { variant?: ToastVariant }): string
  /** Add a success toast */
  success: (title: string, options?: ToastOptions) => string
  /** Add an error toast */
  error: (title: string, options?: ToastOptions) => string
  /** Add a warning toast */
  warning: (title: string, options?: ToastOptions) => string
  /** Add an info toast */
  info: (title: string, options?: ToastOptions) => string
}

export interface UseToastReturn {
  /** Current list of active toasts */
  toasts: ToastItem[]
  /** Add a toast (also exposes .success/.error/.warning/.info shorthands) */
  toast: ToastMethods
  /** Dismiss a specific toast by id */
  dismiss: (id: string) => void
  /** Dismiss all active toasts */
  dismissAll: () => void
}

// ─── Re-export ReactNode for convenience ─────────────────────────────────────

export type { ReactNode }
