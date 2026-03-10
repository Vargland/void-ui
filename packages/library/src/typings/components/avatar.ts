import type { HTMLAttributes } from 'react'
import type { BaseComponentProps } from '../helpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape  = 'circle' | 'square'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AvatarProps
  extends BaseComponentProps,
    HTMLAttributes<HTMLSpanElement> {
  /** Image source URL */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** Fallback initials (max 2 chars) */
  initials?: string
  /** Size of the avatar */
  size?: AvatarSize
  /** Shape of the avatar */
  shape?: AvatarShape
  /** Optional presence status indicator */
  status?: AvatarStatus
}
