import type { ComponentSize, ComponentVariant } from '../../helpers/constants'

export type { ComponentSize, ComponentVariant }

/** Shared props for all void-ui components */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string
  /** Test ID for automated testing */
  'data-testid'?: string
}

/** Size-aware component */
export interface SizeProps {
  size?: ComponentSize
}

/** Variant-aware component */
export interface VariantProps {
  variant?: ComponentVariant
}

/** Disabled state */
export interface DisabledProps {
  disabled?: boolean
}
