import type { InputHTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Size ─────────────────────────────────────────────────────────────────────

export type CheckboxSize = 'sm' | 'md' | 'lg'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends BaseComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'children'> {
  /** Label displayed next to the checkbox */
  label?: ReactNode
  /** Helper text displayed below the label */
  description?: string
  /** Error message — also sets error visual state */
  error?: string
  /** Size of the checkbox */
  size?: CheckboxSize
  /** Visually indeterminate state */
  indeterminate?: boolean
}
