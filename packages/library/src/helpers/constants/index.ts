export const VOID_UI_VERSION = '0.1.0'

export const COMPONENT_SIZES = ['sm', 'md', 'lg'] as const
export type ComponentSize = typeof COMPONENT_SIZES[number]

export const COMPONENT_VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const
export type ComponentVariant = typeof COMPONENT_VARIANTS[number]
