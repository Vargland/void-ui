import { useState, useCallback } from 'react'
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
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // ─── dismiss ────────────────────────────────────────────────────────────────

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ─── dismissAll ─────────────────────────────────────────────────────────────

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  // ─── add (core) ─────────────────────────────────────────────────────────────

  const add = useCallback((
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

  const toastFn = useCallback((
    title:   string,
    options: ToastOptions & { variant?: ToastVariant } = {},
  ): string => {
    const { variant = 'default', ...rest } = options
    return add(title, variant, rest)
  }, [add]) as ToastMethods

  toastFn.success = useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'success', options),
    [add],
  )

  toastFn.error = useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'error', options),
    [add],
  )

  toastFn.warning = useCallback(
    (title: string, options: ToastOptions = {}) => add(title, 'warning', options),
    [add],
  )

  toastFn.info = useCallback(
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
