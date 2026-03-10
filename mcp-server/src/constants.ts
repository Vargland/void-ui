export const SERVER_NAME = 'void-ui'
export const SERVER_VERSION = '0.1.0'
export const SERVER_DESCRIPTION = 'void-ui component library — context for Claude and Cursor'

export const COMPONENTS = [
  'button',
  'badge',
  'avatar',
  'typography',
  'divider',
  'spinner',
  'textfield',
  'stack',
] as const

export type ComponentName = (typeof COMPONENTS)[number]
