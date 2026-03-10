import type { ComponentSize, ComponentVariant } from '../../helpers/constants'
import type { PlanetName } from '../contexts/planet'

export type { ComponentSize, ComponentVariant }
export type { PlanetName }

/** Shared props for all void-ui components */
export interface BaseComponentProps {
  /** Additional CSS class names */
  className?: string
  /** Test ID for automated testing */
  'data-testid'?: string
  /**
   * Override the planet theme for this component.
   * When set, wraps the component in a [data-void-planet] scope.
   * Falls back to the nearest VoidProvider planet if not provided.
   */
  planet?: PlanetName
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
