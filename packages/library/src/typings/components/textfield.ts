import type { InputHTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextFieldSize  = 'sm' | 'md' | 'lg'
export type TextFieldState = 'default' | 'error' | 'success' | 'warning'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TextFieldProps
  extends BaseComponentProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  /** Size of the text field */
  size?: TextFieldSize
  /** Validation state */
  state?: TextFieldState
  /** Label shown above the field */
  label?: string
  /** Helper text shown below the field */
  hint?: string
  /** Error message — also sets state to "error" */
  error?: string
  /** Icon or element prepended inside the field */
  prefix?: ReactNode
  /** Icon or element appended inside the field */
  suffix?: ReactNode
  /** Makes the field fill its container width */
  fullWidth?: boolean
  /** Hides label and hint/error text — only the field is rendered */
  compact?: boolean
}
