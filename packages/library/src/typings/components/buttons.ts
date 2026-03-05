import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps, ComponentSize, ComponentVariant } from '../helpers'

// ─── Variant ─────────────────────────────────────────────────────────────────

export type ButtonVariant = Extract<ComponentVariant, 'primary' | 'secondary' | 'ghost' | 'danger'>

// ─── Size ─────────────────────────────────────────────────────────────────────

export type ButtonSize = ComponentSize

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends BaseComponentProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style of the button */
  variant?: ButtonVariant
  /** Size of the button */
  size?: ButtonSize
  /** Content inside the button */
  children: ReactNode
  /** Renders a full-width block button */
  fullWidth?: boolean
  /** Shows a loading spinner and disables interaction */
  loading?: boolean
  /** Icon placed before the label */
  iconBefore?: ReactNode
  /** Icon placed after the label */
  iconAfter?: ReactNode
  /** Renders the button as a different HTML element or component */
  as?: React.ElementType
}
