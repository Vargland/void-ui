import type { BadgeProps } from '../../typings/components/badge'
import { cn } from '../../helpers/classnames'
import styles from './badge.module.scss'

export function Badge({
  variant = 'solid',
  size = 'md',
  tone = 'default',
  dot = false,
  planet,
  children,
  className,
  'data-testid': testId = 'badge',
  ...rest
}: BadgeProps) {
  const badge = (
    <span
      data-testid={testId}
      className={cn(
        styles.badge,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        styles[`tone-${tone}`],
        dot && styles.dot,
        className,
      )}
      {...rest}
    >
      {!dot && children}
    </span>
  )

  if (planet) {
    return <span data-void-planet={planet}>{badge}</span>
  }

  return badge
}
