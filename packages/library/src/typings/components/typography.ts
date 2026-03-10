import type { HTMLAttributes, ElementType } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Variants ─────────────────────────────────────────────────────────────────

/** Heading levels */
export type TypographyAs =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'label' | 'legend' | 'figcaption'

/** Visual size scale */
export type TypographySize =
  | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

/** Semantic color role */
export type TypographyColor =
  | 'primary' | 'secondary' | 'muted' | 'disabled' | 'inverse' | 'accent'

/** Font weight */
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold'

/** Line height */
export type TypographyLeading = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed'

/** Letter spacing */
export type TypographyTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TypographyProps
  extends BaseComponentProps,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** HTML element or component to render as */
  as?: TypographyAs | ElementType
  /** Font size token */
  size?: TypographySize
  /** Semantic text color */
  color?: TypographyColor
  /** Font weight */
  weight?: TypographyWeight
  /** Line height */
  leading?: TypographyLeading
  /** Letter spacing */
  tracking?: TypographyTracking
  /** Truncate with ellipsis on overflow */
  truncate?: boolean
  /** Uppercase transform */
  uppercase?: boolean
  /** Monospace font family */
  mono?: boolean
}
