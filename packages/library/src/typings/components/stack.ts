import type { HTMLAttributes, ElementType } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type StackAlign     = 'normal' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'
export type StackJustify   = 'normal' | 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'

/**
 * Space scale maps to --void-space-* tokens.
 * Values: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24
 */
export type StackSpacing = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StackProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLElement> {
  /** HTML element to render as */
  as?: ElementType
  /** Flex direction — default: column */
  direction?: StackDirection
  /** Gap between children using --void-space-* tokens */
  gap?: StackSpacing
  /** align-items */
  align?: StackAlign
  /** justify-content */
  justify?: StackJustify
  /** flex-wrap */
  wrap?: boolean
  /** Makes the stack take full width/height of its container */
  full?: boolean
}
