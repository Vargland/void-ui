import type { ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Size ─────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'full'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ModalProps extends BaseComponentProps {
  /** Controls whether the modal is visible */
  isOpen: boolean
  /** Callback fired when the modal should close */
  onClose: () => void
  /** Title rendered in the modal header, linked via aria-labelledby */
  title?: ReactNode
  /** Accessible description linked via aria-describedby */
  description?: string
  /** Modal body content */
  children?: ReactNode
  /** Optional footer slot rendered below the body */
  footer?: ReactNode
  /** Controls the max-width of the dialog */
  size?: ModalSize
  /** Whether clicking the overlay closes the modal (default: true) */
  closeOnOverlayClick?: boolean
  /** Whether pressing Escape closes the modal (default: true) */
  closeOnEscape?: boolean
}
