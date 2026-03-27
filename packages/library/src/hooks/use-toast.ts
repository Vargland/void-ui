import * as React from 'react'
import type {
  ToastItem,
  ToastVariant,
  ToastOptions,
  ToastMethods,
  UseToastReturn,
} from '../typings/components/toast'

// ─── ID generator ─────────────────────────────────────────────────────────────

let _counter = 0

function generateId(): string {
  _counter += 1

  return `toast-${Date.now()}-${_counter}`
}

// ─── Default duration ─────────────────────────────────────────────────────────

const DEFAULT_DURATION = 5000

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  // ─── dismiss ────────────────────────────────────────────────────────────────

  const dismiss = React.useCallback((toastId: string) => {
    setToasts(prev => prev.filter(item => item.id !== toastId))
  }, [])

  // ─── dismissAll ─────────────────────────────────────────────────────────────

  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  // ─── add (core) ─────────────────────────────────────────────────────────────

  const add = React.useCallback((
    title:   string,
    variant: ToastVariant,
    options: ToastOptions = {},
  ): string => {
    const id = generateId()
    const item: ToastItem = {
      id,
      title,
      variant,
      duration: options.duration ?? DEFAULT_DURATION,
      ...(options.description !== undefined && { description: options.description }),
      ...(options.action !== undefined && { action: options.action }),
    }

    setToasts(prev => [...prev, item])

    return id
  }, [])

  // ─── toast callable with shorthand methods ───────────────────────────────

  const toastFn = React.useCallback((
    title:   string,
    options: ToastOptions & { variant?: ToastVariant } = {},
  ): string => {
    const { variant = 'default', ...rest } = options

    return add(title, variant, rest)
  }, [add]) as ToastMethods

  toastFn.success = React.useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'success', options),
    [add],
  )

  toastFn.error = React.useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'error', options),
    [add],
  )

  toastFn.warning = React.useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'warning', options),
    [add],
  )

  toastFn.info = React.useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'info', options),
    [add],
  )

  return {
    toasts,
    toast: toastFn,
    dismiss,
    dismissAll,
  }
}
