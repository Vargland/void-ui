import { useId } from 'react'
import type { TextFieldProps } from '../../typings/components/textfield'
import { cn } from '../../helpers/classnames'
import styles from './textfield.module.scss'

export function TextField({
  size      = 'md',
  state,
  label,
  hint,
  error,
  prefix,
  suffix,
  fullWidth = false,
  compact   = false,
  disabled,
  planet,
  className,
  id: idProp,
  'data-testid': testId = 'textfield',
  ...rest
}: TextFieldProps) {
  const autoId      = useId()
  const id          = idProp ?? autoId
  const activeState = error ? 'error' : (state ?? 'default')
  const hintText    = error ?? hint

  const element = (
    <div
      data-testid={testId}
      className={cn(
        styles.root,
        styles[`size-${size}`],
        activeState !== 'default' && styles[`state-${activeState}`],
        fullWidth && styles.fullWidth,
        compact   && styles.compact,
        className,
      )}
    >
      {!compact && label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div
        className={cn(
          styles.field,
          disabled && styles.disabled,
          !!prefix && styles.hasPrefix,
          !!suffix && styles.hasSuffix,
        )}
      >
        {prefix && (
          <span className={styles.prefix} aria-hidden="true">
            {prefix}
          </span>
        )}

        <input
          id={id}
          data-testid={`${testId}-native`}
          disabled={disabled}
          className={styles.input}
          aria-invalid={activeState === 'error' || undefined}
          aria-describedby={!compact && hintText ? `${id}-hint` : undefined}
          {...rest}
        />

        {suffix && (
          <span className={styles.suffix} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>

      {!compact && hintText && (
        <span
          id={`${id}-hint`}
          className={styles.hint}
          role={activeState === 'error' ? 'alert' : undefined}
        >
          {hintText}
        </span>
      )}
    </div>
  )

  if (planet) {
    return <div data-void-planet={planet}>{element}</div>
  }

  return element
}
