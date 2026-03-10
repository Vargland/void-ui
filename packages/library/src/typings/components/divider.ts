import type { HTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant     = 'solid' | 'dashed' | 'dotted'
export type DividerLabelAlign  = 'start' | 'center' | 'end'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DividerProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLElement> {
  /** Direction of the divider */
  orientation?: DividerOrientation
  /** Line style */
  variant?: DividerVariant
  /** Optional label rendered inside the divider */
  label?: ReactNode
  /** Alignment of the label */
  labelAlign?: DividerLabelAlign
  /** Removes the gap between the two line segments — renders a continuous line */
  flush?: boolean
}
