import type { ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Option ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  /** Option value */
  value: string
  /** Display label */
  label: string
  /** Optional description below the label */
  description?: string
  /** Disabled option */
  disabled?: boolean
}

// ─── Size ─────────────────────────────────────────────────────────────────────

export type SelectSize = 'sm' | 'md' | 'lg'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SelectProps extends BaseComponentProps {
  /** Options list */
  options: SelectOption[]
  /** Controlled value */
  value?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Placeholder when no option is selected */
  placeholder?: string
  /** Field label */
  label?: string
  /** Helper text */
  description?: string
  /** Error message */
  error?: string
  /** Size variant */
  size?: SelectSize
  /** Disabled state */
  disabled?: boolean
  /** Enable search/filter */
  searchable?: boolean
  /** Allow clearing selection */
  clearable?: boolean
  /** Text shown when no options match search */
  emptyMessage?: string
  /** Left icon or element */
  startIcon?: ReactNode
}
