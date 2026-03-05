import type { ButtonProps } from '../../typings/components/buttons'
import { cn } from '../../helpers/classnames'
import styles from './button.module.scss'

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  iconBefore,
  iconAfter,
  children,
  className,
  as: Tag = 'button',
  'data-testid': testId = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Tag
      data-testid={testId}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      {...rest}
    >
      {iconBefore && (
        <span className={styles.iconBefore} aria-hidden="true">
          {iconBefore}
        </span>
      )}

      <span className={styles.label}>{children}</span>

      {iconAfter && !loading && (
        <span className={styles.iconAfter} aria-hidden="true">
          {iconAfter}
        </span>
      )}

      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
          </svg>
        </span>
      )}
    </Tag>
  )
}
