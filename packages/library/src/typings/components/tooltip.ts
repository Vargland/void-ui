import type { ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Placement ───────────────────────────────────────────────────────────────

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TooltipProps extends BaseComponentProps {
  /** Tooltip text or rich content */
  content: ReactNode
  /** The element that triggers the tooltip */
  children: ReactNode
  /** Side of the trigger to display the tooltip */
  placement?: TooltipPlacement
  /** Delay in ms before the tooltip appears */
  delay?: number
  /** Disables the tooltip entirely */
  disabled?: boolean
  /** Maximum width of the tooltip in px */
  maxWidth?: number
}
