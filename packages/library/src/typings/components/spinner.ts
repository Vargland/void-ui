import type { HTMLAttributes } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpinnerVariant = 'ring' | 'dots' | 'pulse'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SpinnerProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the spinner */
  variant?: SpinnerVariant
  /** Size of the spinner */
  size?: SpinnerSize
  /** Accessible label (screen-reader only) */
  label?: string
}
