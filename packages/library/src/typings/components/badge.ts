import type { HTMLAttributes, ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Variant ─────────────────────────────────────────────────────────────────

export type BadgeVariant = 'solid' | 'subtle' | 'outlined'

// ─── Size ─────────────────────────────────────────────────────────────────────

export type BadgeSize = 'sm' | 'md'

// ─── Tone ────────────────────────────────────────────────────────────────────

export type BadgeTone = 'default' | 'success' | 'warning' | 'error' | 'info'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BadgeProps
  extends BaseComponentProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Content inside the badge */
  children: ReactNode
  /** Visual style of the badge */
  variant?: BadgeVariant
  /** Size of the badge */
  size?: BadgeSize
  /** Semantic color tone */
  tone?: BadgeTone
  /** Shows a small dot instead of content */
  dot?: boolean
}
