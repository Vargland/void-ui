import type { ReactNode } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Variant ──────────────────────────────────────────────────────────────────

export type TabsVariant = 'line' | 'solid'

// ─── Size ─────────────────────────────────────────────────────────────────────

export type TabsSize = 'sm' | 'md' | 'lg'

// ─── Context ──────────────────────────────────────────────────────────────────

export interface TabsContextValue {
  /** Currently active tab value */
  activeValue: string
  /** Callback to change the active tab */
  setActiveValue: (value: string) => void
  /** Visual style variant */
  variant: TabsVariant
  /** Size variant */
  size: TabsSize
  /** Unique id prefix for aria linking */
  idPrefix: string
}

// ─── Tabs (root) ──────────────────────────────────────────────────────────────

export interface TabsProps extends BaseComponentProps {
  /** Children — should be TabsList and TabsContent elements */
  children: ReactNode
  /** Uncontrolled initial active tab value */
  defaultValue?: string
  /** Controlled active tab value */
  value?: string
  /** Called when the active tab changes (controlled mode) */
  onChange?: (value: string) => void
  /** Visual style of the tab strip */
  variant?: TabsVariant
  /** Size of the tab triggers */
  size?: TabsSize
}

// ─── TabsList ─────────────────────────────────────────────────────────────────

export interface TabsListProps extends BaseComponentProps {
  /** Tab triggers */
  children: ReactNode
  /** Accessible label for the tablist when context is not clear from surrounding content */
  'aria-label'?: string
}

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

export interface TabsTriggerProps extends BaseComponentProps {
  /** Unique value that identifies this tab — must match the corresponding TabsContent value */
  value: string
  /** Tab label content */
  children: ReactNode
  /** Disables the tab trigger */
  disabled?: boolean
}

// ─── TabsContent ──────────────────────────────────────────────────────────────

export interface TabsContentProps extends BaseComponentProps {
  /** Unique value that identifies this panel — must match the corresponding TabsTrigger value */
  value: string
  /** Panel content */
  children: ReactNode
}
